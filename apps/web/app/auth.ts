import NextAuth, { NextAuthResult } from "next-auth";

import { authConfig } from "./auth.config";

const nextAuthResult = NextAuth(authConfig);

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
