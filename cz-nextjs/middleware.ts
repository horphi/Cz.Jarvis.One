import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/session";

/**
 * Routes that require authentication (user must be logged in)
 * These routes will redirect to /login if the user is not authenticated
 */
const PROTECTED_ROUTES = ["/administration", "/dashboard"];

/**
 * Check if a path requires authentication
 */
function requiresAuthentication(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication
  if (requiresAuthentication(pathname)) {
    try {
      const session = await getAuthSession();

      // Check if user is logged in
      if (!session || !session.isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Authorization (permission checks) will be handled at the page level
    } catch (error) {
      console.error("Middleware auth check failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
