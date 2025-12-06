'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '../UI/sidebar';
import { NavUser } from '../UI/nav-user';
import { useUserStore } from '@/store/userStore';

// Menu items.
const items = [
    {
        title: 'Manage Subjects',
        url: '/admin/subjects',
    },
    {
        title: 'Manage Users',
        url: '/admin/users',
    },
];

const data = {
    user: {
        name: 'Nguyen Van A',
        email: 'testuser1@gmail.com',
        avatar: 'https://www.rophim.li/images/avatars/pack1/14.jpg',
    },
};

export function AppSidebar() {
    const pathname = usePathname();

    const { user } = useUserStore();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup className="pt-12">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + '/');

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="py-5 pl-4 font-semibold text-base"
                                        >
                                            <Link href={item.url}>
                                                {/* <item.icon /> */}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>{<NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
