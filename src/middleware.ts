import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  // get token from user
  const token = req.cookies.get("user-token")?.value;

  // check if user is authenticated
  const verifiedToken =
    token && (await verifyAuth(token).catch((error) => console.log(error)));

  if (req.nextUrl.pathname.startsWith("/login") && !verifiedToken) {
    return;
  }

  const url = req.url;

  if (url.includes("/login") && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
