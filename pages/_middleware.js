import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  // Token will exist if user is logged in
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true
  // if its a request for next-auth session & provider fetching
  // if the token exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect to login page if the above requirement isn't met
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
};
