import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;

async function verifyToken(token: string) {
  if (!JWT_SECRET_KEY) {
    console.error('JWT_SECRET environment variable is not set.');
    return false;
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.warn('Token verification failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('auth_token');
  const token = tokenCookie?.value;

  // Allow access to static files and auth API routes without token check
  // if (
  //   pathname.startsWith('/_next') ||
  //   pathname.startsWith('/api/auth') || // Allows both /api/auth/login and /api/auth/signup
  //   pathname.endsWith('.png') ||
  //   pathname.endsWith('.jpg') ||
  //   pathname.endsWith('.jpeg') ||
  //   pathname.endsWith('.gif') ||
  //   pathname.endsWith('.svg') ||
  //   pathname.endsWith('.ico')
  // ) {
  //   return NextResponse.next();
  // }
  
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';
/*
  if (token) {
    const isValidToken = await verifyToken(token);
    if (isValidToken) {
      // If logged in and trying to access login or signup page, redirect to home
      if (isLoginPage || isSignupPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // Allow access to other pages
      return NextResponse.next();
    } else {
      // Invalid token, clear it
      const response = (isLoginPage || isSignupPage)
        ? NextResponse.next() // Allow staying on login/signup page if token is invalid
        : NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  } else {
    // No token
    // Allow access to login and signup pages if no token
    if (isLoginPage || isSignupPage) {
      return NextResponse.next();
    }
    // Redirect to login for any other protected page
    return NextResponse.redirect(new URL('/login', request.url));
  }
*/
return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Match all paths to apply token check, then specifically allow some paths inside the middleware.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
