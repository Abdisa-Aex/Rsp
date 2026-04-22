import { NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/messages",
  "/notifications",
  "/transactions",
  "/share",
  "/return",
  "/rate",
  "/favorites",
  "/billing",
  "/wishlist",
];

// Admin-only routes
const adminRoutes = ["/admin"];

// Auth routes (redirect to dashboard if already logged in)
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check both cookies AND headers for token
  let token = request.cookies.get("token")?.value;

  // Also check Authorization header (for API calls from client)
  const authHeader = request.headers.get("authorization");
  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  const isLoggedIn = !!token;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Redirect to login if protected route and not logged in
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role for admin routes (from cookie)
  if (isAdminRoute && isLoggedIn) {
    const userRole = request.cookies.get("userRole")?.value;
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect to dashboard if logged in and trying to access auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"],
};
