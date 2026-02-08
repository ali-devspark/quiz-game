import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
