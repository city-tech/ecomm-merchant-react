import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Handle Chrome's Private Network Access preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Private-Network": "true",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Private-Network", "true");
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export const config = {
  matcher: "/(.*)",
};
