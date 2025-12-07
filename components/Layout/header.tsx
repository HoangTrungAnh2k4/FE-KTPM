'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useUserStore } from '@/store/userStore';

import { IoSearch, IoMenuOutline } from 'react-icons/io5';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';

import { useRouter, usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../UI/dropdown-menu';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useUserStore();
    const [mounted, setMounted] = useState(false);

    const isActive = (href: string) => {
        if (!pathname) return false;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user_profile=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        window.location.href = '/login';
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    console.log(user);

    return (
        <header className="z-100 fixed flex justify-between items-center bg-primary px-20 py-6 w-full h-[70px] text-white transition-all header">
            <Link href={'/'} className="flex justify-center items-center gap-2 logo">
                <p className="font-bold text-2xl">ITS</p>
            </Link>

            <ul className="hidden sm:flex justify-center items-center gap-3 ml-16">
                <li className={`px-3 py-1 hover:font-bold ${isActive('/') ? 'font-bold underline' : ''}`}>
                    <Link href="/" aria-current={isActive('/') ? 'page' : undefined}>
                        Home
                    </Link>
                </li>
                <li className={`px-3 py-1 hover:font-bold ${isActive('/subject') ? 'font-bold underline' : ''}`}>
                    <Link href="/subject" aria-current={isActive('/subject') ? 'page' : undefined}>
                        Subjects
                    </Link>
                </li>
            </ul>

            <div className="hidden sm:flex justify-center items-center gap-4">
                {mounted && !user && (
                    <Link
                        href={'/login'}
                        className="flex justify-center items-start gap-2 bg-white px-3.5 py-2 rounded-full text-black cursor-pointer cursor-pointer"
                    >
                        <FaUser />
                        <p className="font-semibold text-sm">Thành viên</p>
                    </Link>
                )}

                {mounted && user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Image
                                src="https://www.rophim.me/images/avatars/pack1/14.jpg"
                                alt="Movie App Logo"
                                width={40}
                                height={40}
                                className="border-2 border-white rounded-full cursor-pointer"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="z-[101] bg-white mt-2 mr-6 border-none w-46" align="start">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>

                            <DropdownMenuSeparator className="bg-neutral-500" />
                            <DropdownMenuItem
                                className="hover:bg-background/50 cursor-pointer"
                                onClick={() => {
                                    router.push('/profile');
                                }}
                            >
                                <FaUser /> Tài khoản
                            </DropdownMenuItem>

                            <DropdownMenuItem onSelect={handleLogout} className="hover:bg-background/50 cursor-pointer">
                                <FaSignOutAlt className="" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
};

export default Header;
