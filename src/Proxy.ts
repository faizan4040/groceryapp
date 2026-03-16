import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/api/auth", "/favicon.ico", "/_next"];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  //  Allow access to edit-role page (for users without a role yet)
  if (pathname === "/edit-role") {
    // If they already have a role, redirect to their dashboard
    if (role) return NextResponse.redirect(new URL(getDashboard(role), req.url));
    return NextResponse.next();
  }

  // If no role is set, force them to complete profile
  if (!role) {
    return NextResponse.redirect(new URL("/edit-role", req.url));
  }
    
  // Role-based protection
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

function getDashboard(role: string) {
  if (role === "admin") return "/admin";
  if (role === "deliveryBoy") return "/delivery";
  return "/user";
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


