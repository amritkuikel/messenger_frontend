import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/auth/login" || path === "/auth/signup";
  const token = request.cookies.get("token");

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if(path=="/") {
    return NextResponse.redirect(new URL("/chat", request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/", "/auth/signup","/chat","/chat/:id*"],
};
