import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import {
  envAudience,
  envAuthUsernamePasswordUrl,
  envClientId,
  envClientSecret,
  envLocalAuthApiKey,
  envTokenendpoint,
} from "./environment-variables";
import { getAPI } from "@app/api";
import { headers } from "next/headers";
import {
  defaultLanguage,
  i18n,
  Locale,
  supportedLanguages,
} from "./dictionaries";

export const authConfig = {
  debug: false,
  pages: {
    signIn: "/user/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          // type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          envAuthUsernamePasswordUrl + "login/password",
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": envLocalAuthApiKey ?? "",
            },
          },
        );

        let user = null;
        if (response.ok) {
          user = await response.json();
        } else {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
    // Implements Refresh Token Rotation following this guide https://authjs.dev/guides/refresh-token-rotation?framework=next-js
    Auth0({
      authorization: {
        params: {
          audience: envAudience,
          scope: "openid profile email offline_access", // Add "offline_access" for refresh token rotation
        },
      },
    }),
  ],
  callbacks: {
    /**
     * Shape of token:
     * { name: "users name", email: "users-email", picture: "https://...", sub: "users-id" }
     *
     * Shape of account:
     * {
     *    access_token: "...",                          // only when provider is Auth0
     *    refresh_token: "...",                         // only when provider is Auth0
     *    id_token: "...",                              // only when provider is Auth0
     *    scope: "openid profile email offline_access", // only when provider is Auth0
     *    expires_in: 60,                               // only when provider is Auth0
     *    token_type: "bearer",                         // only when provider is Auth0
     *    expires_at: 1771057488,                       // only when provider is Auth0
     *    type: 'oidc or credentials',
     *    provider: "auth0 or credentials or ...",
     *    providerAccountId: "..."
     * }
     */
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "credentials") {
        // First-time login with credentials
        const lng = await initUsersSelectedLanguage(account.access_token!);
        i18n.currentLanguage = lng;

        return {
          ...token,
          authProvider: "credentials",
          accessToken: (user as Record<string, unknown>).access_token as string,
        };
      } else if (account?.provider === "auth0") {
        // First-time login with Auth0
        if (!account.refresh_token) {
          console.warn(
            "Expected to retrieve a refresh_token from provider 'auth0', but it is missing. Enable Allow Offline Access in the API settings.",
          );
        }

        if (profile?.sub) {
          console.debug("Sync external user");
          try {
            await getAPI()
              .enableServerMode()
              .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
              .setHeaders({
                Authorization: `Bearer ${account.access_token}`,
              })
              .syncExternalUser(profile.sub);
          } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "response" in err) {
              console.error(
                "Sync external user failed. Authentication failed. Status:",
                err?.response,
                "Error:",
                err,
              );
            } else {
              console.error(
                "Sync external user failed. Authentication failed.",
                err,
              );
            }

            throw "Sync external user failed. Authentication failed";
          }

          const lng = await initUsersSelectedLanguage(account.access_token!);
          i18n.currentLanguage = lng;
        } else {
          throw "Login with external Identity Provider successful, but no profile given!";
        }

        return {
          ...token,
          authProvider: "auth0",
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
        };
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Starting from here, we are handling subsequent logins
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Shape of token in case authProvider = credentials:
       * { email, sub, iat, exp, jti, authProvider, accessToken }
       *
       * Shape of token in case authProvider = auth0:
       * { email, sub, iat, exp, jti, authProvider, name, picture, accessToken, expiresAt, refreshToken }
       */
      if (token.authProvider === "auth0") {
        if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
          // the `access_token` is still valid
          return token;
        }

        // Subsequent logins, but the `access_token` has expired, try to refresh it
        console.debug("access_token has expired. Try to refresh it.");
        if (!token.refreshToken) {
          throw new TypeError("Missing refresh_token");
        }

        return await refreshAccessToken(token);
      } else {
        return token;
      }
    },
    session({ session, token }) {
      session.error = token.error;
      session.accessToken = token.accessToken;
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) {
        return true;
      }

      const publicRoutes = [
        "/",
        "/user/login",
        "/user/signup",
        "/user/signup/submit",
        "/user/forgot-password",
      ];
      const callbackUrl = nextUrl.pathname + nextUrl.search;
      if (!isLoggedIn && nextUrl.pathname === "/") {
        return false;
      }

      // User is not authenticated but tries to access non-public route (-> protected route)
      // So we are going to redirect user to login page
      const isPublicRoute = publicRoutes.indexOf(nextUrl.pathname) > -1;
      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(
          new URL(
            `/user/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            nextUrl,
          ),
        );
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

async function refreshAccessToken(token: JWT) {
  try {
    const tokenEndpoint = envTokenendpoint;
    const clientId = envClientId;
    const clientSecret = envClientSecret;
    if (!tokenEndpoint || !clientId || !clientSecret) {
      throw new Error(
        "Missing required environment variables for tokenEndpoint, clientId or clientSecret. Cannot refresh access token.",
      );
    }

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const tokensOrError = await response.json();

    if (!response.ok) throw tokensOrError;

    const newTokens = tokensOrError as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
    };

    return {
      ...token,
      accessToken: newTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
      // Some providers only issue refresh tokens once, so preserve if we did not get a new one
      refreshToken: newTokens.refresh_token
        ? newTokens.refresh_token
        : token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access_token", error);
    // If we fail to refresh the token, return an error so we can handle it on the page
    token.error = "RefreshTokenError";
    return token;
  }
}

/**
 * This method should be called after login to init current users selected language.
 */
async function initUsersSelectedLanguage(accessToken: string): Promise<Locale> {
  const clientLanguage = (await headers()).get("Accept-Language"); // example: "en;q=0.9"
  if (!clientLanguage) {
    return defaultLanguage;
  }

  const language = clientLanguage.substring(0, 2);
  if (!supportedLanguages.includes(language)) {
    return defaultLanguage;
  }

  const currentUsersSelectedLanguage =
    await getCurrentUsersSelectedLanguage(accessToken);

  if (currentUsersSelectedLanguage) {
    return currentUsersSelectedLanguage;
  } else {
    console.log(`Current user has no selected language yet`);
    console.log(`Init current users selected language: ${language}`);

    const result = await getAPI()
      .enableServerMode()
      .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
      .setHeaders({
        Authorization: `Bearer ${accessToken}`,
      })
      .patch.changeCurrentUsersLanguage(language);

    if (result.status === "error") {
      console.warn(
        "Could not init current users language. Status Code: " +
          result.statusCode,
      );

      return defaultLanguage;
    }

    return language as Locale;
  }
}

async function getCurrentUsersSelectedLanguage(
  accessToken: string,
): Promise<Locale | null> {
  const currentUser = await getAPI()
    .enableServerMode()
    .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
    .setHeaders({
      Authorization: `Bearer ${accessToken}`,
    })
    .fetchCurrentUser();

  if (currentUser.status === "error") {
    return null;
  }

  if (currentUser.data && currentUser.data.value.selectedLanguage) {
    return currentUser.data.value.selectedLanguage as Locale;
  }

  return null;
}
