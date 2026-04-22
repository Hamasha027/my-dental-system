import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('sessionId')?.value

  // If user is logged in (has sessionId cookie)
  if (sessionCookie) {
    // Redirect /login to /dashboard
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } else {
    // If user is not logged in, redirect /dashboard to /login
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}
