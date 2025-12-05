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

    if (isNoLayout) return <>{children}</>;

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return <div className="min-h-screen">{children}</div>;
    }

    // Admin layout with sidebar
    if (user?.role === 'Administrator') {
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
