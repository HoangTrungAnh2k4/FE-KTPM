'use client';
import { useUserStore } from '@/store/userStore';

export default function InstructorDashboard() {
    const { user } = useUserStore();

    return (
        <div className="px-12 py-8">
            <h1 className="font-bold text-3xl text-gray-800">Instructor Dashboard</h1>
            <p className="mt-4 text-gray-600">Chào mừng, {user?.name}! Đây là trang dành cho giảng viên.</p>
            
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mt-8">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 text-lg">Môn học của tôi</h3>
                    <p className="mt-2 font-bold text-4xl text-[#4ECDC4]">12</p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 text-lg">Học viên</h3>
                    <p className="mt-2 font-bold text-4xl text-[#4ECDC4]">345</p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 text-lg">Bài giảng</h3>
                    <p className="mt-2 font-bold text-4xl text-[#4ECDC4]">87</p>
                </div>
            </div>
        </div>
    );
}
