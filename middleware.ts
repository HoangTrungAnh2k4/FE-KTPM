import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get user from cookie or session (simplified version)
    const userCookie = request.cookies.get('user-storage');
    
    let user = null;
    if (userCookie) {
        try {
            const parsed = JSON.parse(userCookie.value);
            user = parsed.state?.user;
        } catch (e) {
            // Invalid cookie
        }
    }

    const { pathname } = request.nextUrl;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
        if (!user || user.role !== 'Administrator') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Instructor routes protection
    if (pathname.startsWith('/instructor')) {
        if (!user || (user.role !== 'Instructor' && user.role !== 'Administrator')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/instructor/:path*'],
};
