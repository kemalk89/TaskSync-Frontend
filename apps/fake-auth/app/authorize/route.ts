export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const redirectUri = params.get("redirect_uri");

  const decodedRedirectUri = decodeURIComponent(redirectUri!);

  const authorizationCode = "fake_auth_code";

  // Build redirect URL with authorization code
  const redirectUrl = new URL(decodedRedirectUri);
  redirectUrl.searchParams.set("code", authorizationCode);

  // Redirect back to the client application
  return Response.redirect(redirectUrl.toString(), 302);
}
