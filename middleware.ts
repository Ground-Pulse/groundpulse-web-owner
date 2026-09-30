import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  sub?: string;
  email?: string;
  role?: "OWNER" | "INSPECTOR";
  exp?: number;
}

function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("gp_access_token")?.value;

  const decoded = token ? decodeJwtPayload(token) : null;
  const isTokenValid =
    !!decoded && (!decoded.exp || decoded.exp * 1000 > Date.now());
  const userRole = isTokenValid ? decoded?.role : null;

  const isOwnerRoute = pathname.startsWith("/owner");
  const isInspectorRoute = pathname.startsWith("/inspector");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isRootRoute = pathname === "/";

  // 1. If accessing protected routes without valid token, redirect to /login
  if (isOwnerRoute || isInspectorRoute) {
    if (!isTokenValid || !userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid cookie if any
      if (token && !isTokenValid) {
        response.cookies.delete("gp_access_token");
      }
      return response;
    }

    // Role-based route enforcement
    if (isOwnerRoute && userRole !== "OWNER") {
      // INSPECTOR trying to access /owner/* -> redirect to /inspector/dashboard
      return NextResponse.redirect(new URL("/inspector/dashboard", request.url));
    }

    if (isInspectorRoute && userRole !== "INSPECTOR") {
      // OWNER trying to access /inspector/* -> redirect to /owner/dashboard
      return NextResponse.redirect(new URL("/owner/dashboard", request.url));
    }
  }

  // 2. If already logged in and visiting /login or /register or /, redirect to dashboard
  if ((isAuthRoute || isRootRoute) && isTokenValid && userRole) {
    const targetDashboard =
      userRole === "OWNER" ? "/owner/dashboard" : "/inspector/dashboard";
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // If root / and not logged in, redirect to /login
  if (isRootRoute && !isTokenValid) {
    return NextResponse.redirect(new URL("/login", request.url));
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
