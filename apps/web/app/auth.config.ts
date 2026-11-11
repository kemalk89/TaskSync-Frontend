import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import {
  envAudience,
  envAuthUsernamePasswordUrl,
  envClientId,
  envClientSecret,
  envServiceTaskSync,
  envTokenendpoint,
} from "./environment-variables";
import { getAPI } from "@app/api";
import { headers } from "next/headers";
import {
  getDefaultLanguage,
  Locale,
  storeLanguageInCookie,
  getSupportedLanguages,
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
        const response = await fetch(envAuthUsernamePasswordUrl + "login", {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Invalid credentials.");
        }

        const tokens = (await response.json()) as {
          tokenType: string;
          accessToken: string;
          expiresIn: number;
          refreshToken: string;
        };

        const profile = await fetchUserProfile(tokens.accessToken);

        return {
          id: profile?.id,
          name: profile?.username,
          email: profile?.email,
          access_token: tokens.accessToken,
          expires_in: tokens.expiresIn,
          refresh_token: tokens.refreshToken,
        };
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
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "credentials") {
        // First-time login with credentials
        const credentialsUser = user as unknown as CredentialsUser;
        const lng = await initUsersSelectedLanguage(
          credentialsUser.access_token,
        );
        await storeLanguageInCookie(lng);

        return {
          ...token,
          authProvider: "credentials",
          accessToken: credentialsUser.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + credentialsUser.expires_in),
          refreshToken: credentialsUser.refresh_token,
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
          await storeLanguageInCookie(lng);
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

      if (token.authProvider === "auth0") {
        if (isAccessTokenExpired(token)) {
          // Subsequent logins, but the `access_token` has expired, try to refresh it
          console.debug("access_token has expired. Try to refresh it.");
          if (!token.refreshToken) {
            throw new TypeError("Missing refresh_token");
          }

          return await refreshTokensByProviderAuth0(token);
        }

        return token;
      } else if (token.authProvider === "credentials") {
        if (isAccessTokenExpired(token)) {
          // Subsequent logins, but the `access_token` has expired, try to refresh it
          console.debug("access_token has expired. Try to refresh it.");
          if (!token.refreshToken) {
            throw new TypeError("Missing refresh_token");
          }

          return await refreshTokensByProviderCredentials(token);
        }

        return token;
      } else {
        return token;
      }
    },
    session({ session, token }) {
      // for debugging purpose: console.debug(token.accessToken);
      session.error = token.error;
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

/**
 * Refresh tokens by provider "auth0".
 */
async function refreshTokensByProviderAuth0(token: JWT) {
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
 * Refresh tokens by provider "credentials".
 */
async function refreshTokensByProviderCredentials(token: JWT) {
  try {
    const response = await fetch(envAuthUsernamePasswordUrl + "refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const tokensOrError = await response.json();

    if (!response.ok) throw tokensOrError;

    const newTokens = tokensOrError as {
      accessToken: string;
      expiresIn: number;
      refreshToken: string;
    };

    return {
      ...token,
      accessToken: newTokens.accessToken,
      expiresAt: Math.floor(Date.now() / 1000 + newTokens.expiresIn),
      refreshToken: newTokens.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access_token", error);
    token.error = "RefreshTokenError";
    return token;
  }
}

async function fetchUserProfile(
  accessToken: string,
): Promise<{ id: string; username?: string; email?: string } | null> {
  try {
    const response = await fetch(
      `${envServiceTaskSync}/api/user/current-user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as {
      value?: { id: string; username?: string; email?: string };
    };

    return result.value ?? null;
  } catch (error) {
    console.error("Could not fetch user profile", error);
    return null;
  }
}

/**
 * This method should be called after login to init current users selected language.
 */
async function initUsersSelectedLanguage(accessToken: string): Promise<Locale> {
  const currentUsersSelectedLanguage =
    await getCurrentUsersSelectedLanguage(accessToken);
  if (currentUsersSelectedLanguage) {
    return currentUsersSelectedLanguage;
  }

  const clientLanguage = (await headers()).get("Accept-Language"); // example: "en;q=0.9"
  if (!clientLanguage) {
    return await getDefaultLanguage();
  }

  const language = clientLanguage.substring(0, 2);
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages.includes(language as Locale)) {
    return await getDefaultLanguage();
  }

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

    return await getDefaultLanguage();
  }

  return language as Locale;
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

function isAccessTokenExpired(token: JWT) {
  const isValid = token.expiresAt && Date.now() < token.expiresAt * 1000;
  return !isValid;
}

interface CredentialsUser {
  id: string;
  name?: string;
  email?: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
}
