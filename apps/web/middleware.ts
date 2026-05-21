import { auth } from "./app/auth";

export default auth;

export const config = {
  /*
   * Apply middleware for all request paths, except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   * - any svg files
   */
  matcher: [
    "/((?!api|_next/static|_next/image|images/|images|favicon.ico|sitemap.xml|robots.txt|.*\\.svg).*)",
  ],
};
