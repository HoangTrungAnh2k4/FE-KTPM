import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;
   const { pathname } = req.nextUrl;


    try {
        if (token) {
            const response = await fetch(`${API_BACKEND_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const user = await response.json();

                // Nếu đang ở /login hoặc /register → redirect về home, kèm cookie user
                if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
                    const res = NextResponse.redirect(new URL('/', req.url));
                    res.cookies.set('user_profile', JSON.stringify(user.data), {
                        httpOnly: false, // cho client đọc được
                        path: '/',
                    });
                    return res;
                }
              
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

                // Các route khác → cho đi tiếp, kèm cookie user
                const res = NextResponse.next();
                res.cookies.set('user_profile', JSON.stringify(user), {
                    httpOnly: false,
                    path: '/',
                });
                return res;
            }
        }

        // Không có token hoặc token sai → chặn các route cần auth
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/subject')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Lỗi khi gọi API → coi như chưa login
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/subject')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }
}

export const config = {
  matcher: ['/admin/:path*', '/instructor/:path*','/subject/:path*',],
};
