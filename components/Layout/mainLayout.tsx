'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePathname } from 'next/navigation';
import Header from './header';
import { SidebarProvider, SidebarTrigger } from '../UI/sidebar';
import { AppSidebar } from './app-sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, setUser } = useUserStore();

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

    if (user?.role === 'ADMIN') {
        return (
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        );
    }

    return (
        <div>
            <Header />
            <div className="px-20 pt-[70px]">{children}</div>
        </div>
    );
}
