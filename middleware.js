import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('krishimitra_logged_in')?.value === 'true';

  // If unauthenticated and accessing protected routes (including default opening page /), redirect to /login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/...)
     * - _next static assets & image optimization (/_next/...)
     * - login page (/login)
     * - static assets, manifests, icons (sw.js, manifest.json, .png, etc.)
     */
    '/((?!api|_next/static|_next/image|login|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.json|icon-.*|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
