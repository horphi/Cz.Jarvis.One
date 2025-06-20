import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { hasAnyRole } from "@/lib/auth/role-utils";

/**
 * Routes that require admin access
 */
const ADMIN_ROUTES = ["/administration", "/admin"];

/**
 * Check if a path requires admin access
 */
function requiresAdminAccess(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires admin access
  if (requiresAdminAccess(pathname)) {
    try {
      const session = await getAuthSession();

      // Check if user is logged in
      if (!session || !session.isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Check if user has admin role
      if (!hasAnyRole(session.userRole, ["admin", "administrator"])) {
        // Redirect to unauthorized page or dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
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
