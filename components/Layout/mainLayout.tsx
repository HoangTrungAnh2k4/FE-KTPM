'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePathname, useRouter } from 'next/navigation';
import Header from './header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useUserStore();

    if (user?.role === 'admin') {
        return (
            <div className="flex">
                {/* <Sidebar /> */}
                <div className="pt-[70px]">{children}</div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="pt-[70px]">{children}</div>
        </div>
    );
}
