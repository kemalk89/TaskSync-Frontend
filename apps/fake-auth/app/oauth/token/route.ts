import { SignJWT } from "jose";
import { getKeys } from "./../../.well-known/jwks.json/route";

export async function POST(_: Request) {
  const { privateKey } = await getKeys();

  const jwt = await new SignJWT({
    sub: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key-id" })
    .setIssuedAt()
    .setIssuer(process.env.AUTH_ISSUER ?? "") 
    .setAudience(process.env.AUTH_AUDIENCE ?? "")
    .setExpirationTime("1h")
    .sign(privateKey);

  return Response.json({
    access_token: jwt,
    token_type: "Bearer",
    expires_in: 3600,
  });
}
