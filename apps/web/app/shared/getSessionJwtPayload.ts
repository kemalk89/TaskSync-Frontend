import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export async function getSessionJwtPayload() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Cannot decrypt Session JWT because environment variable AUTH_SECRET is not defined",
    );
  }

  const payload = await getToken({
    req: { headers: await headers() },
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  return payload;
}
