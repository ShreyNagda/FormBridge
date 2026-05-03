import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public API routes — no authentication required
const publicApiPaths = ["/api/submit"];

// Auth pages — redirect to dashboard if already signed in
const authPaths = ["/sign-in", "/sign-up"];

// Public pages — accessible without authentication
const publicPages = ["/"];

/**
 * Gets the NextAuth session cookie value.
 * NextAuth v5 uses different cookie names depending on environment.
 */
function getSessionCookie(request: NextRequest): string | undefined {
  return (
    // NextAuth v5 secure cookie (production HTTPS)
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    // NextAuth v5 default cookie
    request.cookies.get("authjs.session-token")?.value ||
    // Legacy fallback
    request.cookies.get("next-auth.session-token")?.value
  );
}

/**
 * Builds the Cookie header string for forwarding session to internal API.
 */
function buildCookieHeader(request: NextRequest): string {
  return request.cookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") || "";
  const isApiRoute = pathname.startsWith("/api/");
  const isSubmitRoute = publicApiPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));
  const isPublicPage = publicPages.some((p) => pathname === p);

  // ─── CORS for Public Submission API ──────────────────────────
  if (isApiRoute && isSubmitRoute) {
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set("Access-Control-Allow-Origin", origin || "*");
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, h-captcha-response",
      );
      response.headers.set("Access-Control-Max-Age", "86400");
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    return response;
  }

  // ─── Allow internal Next.js & static paths ───────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|js|css|txt)$/)
  ) {
    return NextResponse.next();
  }

  // ─── Public pages (landing, etc.) ────────────────────────────
  if (isPublicPage) {
    return NextResponse.next();
  }

  // ─── Auth pages — check cookie, redirect if logged in ────────
  if (isAuthPath) {
    const sessionCookie = getSessionCookie(request);

    if (sessionCookie) {
      try {
        const sessionRes = await fetch(
          `${request.nextUrl.origin}/api/auth/session`,
          {
            headers: { Cookie: buildCookieHeader(request) },
          },
        );
        const session = await sessionRes.json();

        if (session?.user) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // Allow access if session check fails
      }
    }
    return NextResponse.next();
  }

  // ─── Protect all dashboard routes ────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          headers: { Cookie: buildCookieHeader(request) },
        },
      );
      const session = await sessionRes.json();

      if (!session?.user) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }
    } catch {
      // Allow request to proceed — page will handle auth check
    }
  }

  // ─── Protect all other API routes ────────────────────────────
  if (isApiRoute) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required",
        },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|svg|jpg|jpeg|gif|webp)$).*)",
  ],
};
