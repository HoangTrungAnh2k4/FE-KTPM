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
                const userData = user.data ?? user;

                // ⚡ Convert role: ["ADMIN"] -> "ADMIN"
                const rawRole = userData.roles;
                const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

                // Nếu đang ở /login hoặc /register → redirect về home + set cookie
                // if (pathname === '/login' || pathname === '/register') {
                //     const res = NextResponse.redirect(new URL('/', req.url));
                //     res.cookies.set(
                //         'user_profile',
                //         JSON.stringify({
                //             id: userData.id,
                //             email: userData.email,
                //             name: userData.fullName,
                //             avatar: 'https://www.rophim.li/images/avatars/pack1/14.jpg',
                //             role,
                //         }),
                //         {
                //             httpOnly: false,
                //             path: '/',
                //         },
                //     );
                //     return res;
                // }

                // -------- PHÂN QUYỀN THEO ROLE --------

                // /admin → chỉ ADMIN
                if (pathname.startsWith('/admin')) {
                    if (role !== 'ADMIN') {
                        return NextResponse.redirect(new URL('/', req.url));
                    }
                }

                // /instructor → ADMIN hoặc INSTRUCTOR
                if (pathname.startsWith('/instructor')) {
                    if (role !== 'ADMIN' && role !== 'INSTRUCTOR') {
                        return NextResponse.redirect(new URL('/', req.url));
                    }
                }

                // --------------------------------------

                // Cho đi tiếp + set cookie user_profile
                const res = NextResponse.next();
                res.cookies.set(
                    'user_profile',
                    JSON.stringify({
                        id: userData.id,
                        email: userData.email,
                        name: userData.fullName,
                        avatar: 'https://www.rophim.li/images/avatars/pack1/14.jpg',
                        role,
                        phone: userData.phone,
                        age: userData.age,
                    }),
                    {
                        httpOnly: false,
                        path: '/',
                    },
                );
                return res;
            }
        }

        // Không có token → chặn các route cần auth
        if (
            pathname === '/' ||
            pathname.startsWith('/subject') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/instructor')
        ) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Lỗi API → coi như chưa login
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

export const config = {
    matcher: ['/', '/admin/:path*', '/instructor/:path*', '/subject/:path*', '/profile/:path*'],
};
