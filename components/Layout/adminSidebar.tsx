'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaUsers, FaChalkboardTeacher, FaCog, FaChartBar } from 'react-icons/fa';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/admin', icon: FaHome, label: 'Dashboard' },
        { href: '/admin/subjects', icon: FaBook, label: 'Quản lý môn học' },
        { href: '/admin/users', icon: FaUsers, label: 'Quản lý người dùng' },
        // { href: '/admin/instructors', icon: FaChalkboardTeacher, label: 'Quản lý giảng viên' },
        // { href: '/admin/reports', icon: FaChartBar, label: 'Báo cáo' },
        // { href: '/admin/settings', icon: FaCog, label: 'Cài đặt' },
    ];

    return (
        <aside className="top-0 left-0 fixed bg-[#2C3E50] shadow-lg w-64 h-full text-white">
            <div className="p-6 border-gray-700 border-b">
                <h1 className="font-bold text-2xl">ITS Admin</h1>
                <p className="mt-1 text-gray-400 text-sm">Administration Panel</p>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-[#4ECDC4] text-white font-semibold'
                                            : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                                    }`}
                                >
                                    <Icon className="text-xl" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="bottom-0 absolute p-4 border-gray-700 border-t w-full">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex justify-center items-center bg-[#4ECDC4] rounded-full w-10 h-10 font-bold text-white">
                        A
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Administrator</p>
                        <p className="text-gray-400 text-xs">admin@its.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
