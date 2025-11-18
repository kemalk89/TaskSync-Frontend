import { SignJWT } from "jose";
import { getKeys } from "./../../.well-known/jwks.json/route";
import { log } from "../../log";
import { USERS } from "../../constants";

export async function POST(request: Request) {
  const { privateKey } = await getKeys();

  if (!process.env.AUTH_AUTH0_ID) {
    throw "Environment variable missing: 'AUTH_AUTH0_ID'";
  }

  const { searchParams } = new URL(request.url);
  const grantType = searchParams.get("grant_type");
  const customParameterUserId = searchParams.get("custom_user_id");

  let user: Partial<{ id: string; name: string; email: string }>;
  if (grantType === "client_credentials") {
    log("Requesting token, client_credentials...");

    // quick fix
    user = USERS[0] ?? {};
  } else {
    user = USERS.find((u) => u.id === customParameterUserId) ?? USERS[0] ?? {};
  }

  const jwt = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key-id" })
    .setIssuedAt()
    .setIssuer(process.env.AUTH_AUTH0_ISSUER ?? "")
    .setAudience(process.env.AUTH_AUDIENCE ?? "")
    .setExpirationTime("1h")
    .sign(privateKey);

  const idToken = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key-id" })
    .setIssuedAt()
    .setIssuer(process.env.AUTH_AUTH0_ISSUER ?? "")
    .setAudience(process.env.AUTH_AUTH0_ID ?? "")
    .setExpirationTime("1h")
    .sign(privateKey);

  return Response.json({
    access_token: jwt,
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 3600,
  });
}
