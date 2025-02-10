import type { NextRequest } from "next/server";
import { auth } from "./app/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session && request.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(newUrl);
  }
}

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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg).*)",
  ],
};
