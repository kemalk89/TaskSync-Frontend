import Auth0 from "next-auth/providers/auth0";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Auth0({
      authorization: {
        params: {
          audience: "https://tasksync.api.de/api",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider === "auth0") {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
