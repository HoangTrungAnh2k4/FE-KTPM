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

    if (isNoLayout) return <>{children}</>;

    // Tạm thời
    useEffect(() => {
        if (!user) {
            setUser({ id: '1', email: 'testuser1@gmail.com', name: 'test', role: 'admin' });
        }
    }, [user, setUser]);

    if (user?.role === 'admin') {
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
