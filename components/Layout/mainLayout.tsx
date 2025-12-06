'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePathname } from 'next/navigation';
import Header from './header';
import AdminSidebar from './adminSidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useUserStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const noLayoutRoutes = ['/login', '/register'];
    const isNoLayout = noLayoutRoutes.includes(pathname);

    useEffect(() => {
        const cookie = document.cookie.split('; ').find((c) => c.startsWith('user_profile='));

        if (!cookie) return;

        try {
            const value = decodeURIComponent(cookie.split('=')[1]);
            const user = JSON.parse(value);
            setUser(user);
        } catch (err) {
            console.error('Failed to parse user_profile cookie', err);
        }
    }, [setUser]);

    if (isNoLayout) return <>{children}</>;
    
    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return <div className="min-h-screen">{children}</div>;
    }

    if (user?.role === 'ADMIN') {
        return (
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1 ml-64 bg-[#f5f5f5]">
                    {children}
                </div>
            </div>
        );
    }

    // Default layout for Student and Instructor
    return (
        <div>
            <Header />
            <div className="px-20 pt-[70px]">{children}</div>
        </div>
    );
}
