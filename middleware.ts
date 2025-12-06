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
                // Tùy backend trả về mà điều chỉnh chỗ này
                const userData = user.data ?? user;
                const role = userData.role as string | undefined;

                // Nếu đang ở /login hoặc /register → redirect về home, kèm cookie user
                if (pathname === '/login' || pathname === '/register') {
                    const res = NextResponse.redirect(new URL('/', req.url));
                    res.cookies.set('user_profile', JSON.stringify(userData), {
                        httpOnly: false,
                        path: '/',
                    });
                    return res;
                }

                // -------- PHÂN QUYỀN THEO ROLE --------
                // Chỉ ADMIN được vào /admin/*
                if (pathname.startsWith('/admin')) {
                    if (role !== 'ADMIN') {
                        // Không đủ quyền → đá về trang chủ (hoặc /403 nếu bạn có)
                        return NextResponse.redirect(new URL('/', req.url));
                    }
                }

                // ADMIN và INSTRUCTOR được vào /instructor/*
                if (pathname.startsWith('/instructor')) {
                    if (role !== 'ADMIN' && role !== 'INSTRUCTOR') {
                        return NextResponse.redirect(new URL('/', req.url));
                    }
                }
                // --------------------------------------

                // Các route khác → cho đi tiếp, kèm cookie user
                const res = NextResponse.next();
                res.cookies.set('user_profile', JSON.stringify(userData), {
                    httpOnly: false,
                    path: '/',
                });
                return res;
            }
        }

        // Không có token hoặc token sai → chặn các route cần auth
        if (
            pathname === '/' ||
            pathname.startsWith('/subject') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/instructor')
        ) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Các route không cần auth (nếu có) thì cho qua
        return NextResponse.next();
    } catch (error) {
        // Lỗi khi gọi API → coi như chưa login
        if (
            pathname === '/' ||
            pathname.startsWith('/subject') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/instructor')
        ) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }
}

// Middleware chỉ chạy trên các route này
export const config = {
    matcher: ['/', '/admin/:path*', '/instructor/:path*', '/subject/:path*'],
};
