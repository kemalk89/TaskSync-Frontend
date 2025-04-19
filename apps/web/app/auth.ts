import Auth0 from "next-auth/providers/auth0";
import NextAuth, { NextAuthResult } from "next-auth";
import { JWT } from "next-auth/jwt";
import {
  envAudience,
  envClientId,
  envClientSecret,
  envTokenendpoint,
} from "./environment-variables";
import { getAPI } from "@app/api";

/**
 * Implements Refresh Token Rotation following this guide https://authjs.dev/guides/refresh-token-rotation?framework=next-js
 */
const nextAuthResult = NextAuth({
  debug: false,
  providers: [
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
    async jwt({ token, account, profile }) {
      if (account?.provider === "auth0") {
        // First-time login
        if (!account.refresh_token) {
          console.warn(
            "Expected to retrieve a refresh_token from provider 'auth0', but it is missing. Enable Allow Offline Access in the API settings."
          );
        }

        if (profile?.sub) {
          console.debug("Sync external user");
          await getAPI()
            .enableServerMode()
            .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
            .setHeaders({
              Authorization: `Bearer ${account.access_token}`,
            })
            .syncExternalUser(profile.sub);
        } else {
          throw "Login with external Identity Provider successful, but no profile given!";
        }

        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
        };
      } else if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      }

      // Subsequent logins, but the `access_token` has expired, try to refresh it
      console.debug("access_token has expired. Try to refresh it.");
      if (!token.refreshToken) {
        throw new TypeError("Missing refresh_token");
      }

      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      session.error = token.error;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const tokenEndpoint = envTokenendpoint;
    const clientId = envClientId;
    const clientSecret = envClientSecret;
    if (!tokenEndpoint || !clientId || !clientSecret) {
      throw new Error(
        "Missing required environment variables for tokenEndpoint, clientId or clientSecret. Cannot refresh access token."
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

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError";
  }
}

export const auth: NextAuthResult["auth"] = nextAuthResult.auth;
export const { handlers, signIn, signOut } = nextAuthResult;
