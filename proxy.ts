import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const sessionId = req.cookies.get("sessionId")?.value;

    const isLoggedIn = !!sessionId;
    const isLoginPage = req.nextUrl.pathname === "/login";

    if (!isLoggedIn && !isLoginPage) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Run middleware on application pages,
         * but not Next.js internals or static files.
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};