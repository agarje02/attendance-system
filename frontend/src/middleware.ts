import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup'];

// Auth routes that require authentication
const authRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if the route requires authentication
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;
  
  // If user is authenticated and trying to access public auth pages (login/signup)
  // redirect them to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not authenticated and trying to access protected routes
  // redirect them to login
  if (!isAuthenticated && isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
