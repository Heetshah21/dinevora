import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") || // ⭐ VERY IMPORTANT
    pathname.startsWith("/api/health") || // optional but clean
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  

  const segments = pathname.split("/").filter(Boolean);

  // First segment becomes tenant slug
  const tenantSlug = segments[0];

  if (!tenantSlug) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Attach tenant slug to headers
  response.headers.set("x-tenant-slug", tenantSlug);

  return response;
}
export const config = {
  matcher: [
    "/((?!_next|favicon.ico).*)",
  ],
};
