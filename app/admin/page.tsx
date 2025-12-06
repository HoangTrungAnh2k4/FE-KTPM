'use client';
import { useUserStore } from '@/store/userStore';
import { FaBook, FaUsers, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
    const { user } = useUserStore();

    const stats = [
        { icon: FaBook, label: 'Tổng số môn học', value: '48', color: 'bg-blue-500' },
        { icon: FaUsers, label: 'Tổng số học viên', value: '1,234', color: 'bg-green-500' },
        { icon: FaChalkboardTeacher, label: 'Tổng số giảng viên', value: '56', color: 'bg-purple-500' },
        { icon: FaChartLine, label: 'Khóa học đang diễn ra', value: '32', color: 'bg-orange-500' },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="font-bold text-3xl text-gray-800">Dashboard</h1>
                <p className="mt-2 text-gray-600">Chào mừng trở lại, {user?.name}!</p>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-600 text-sm">{stat.label}</p>
                                    <p className="mt-2 font-bold text-3xl text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-2xl text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h2 className="mb-4 font-semibold text-gray-800 text-xl">Hoạt động gần đây</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center gap-4 border-gray-200 pb-4 border-b last:border-b-0">
                                <div className="flex-shrink-0 bg-[#4ECDC4] rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                                    {item}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">Hoạt động {item}</p>
                                    <p className="text-gray-500 text-xs">2 giờ trước</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h2 className="mb-4 font-semibold text-gray-800 text-xl">Môn học phổ biến</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'AWS Certified Solutions Architect', students: 234 },
                            { name: 'Introduction to Python', students: 189 },
                            { name: 'Web Development Bootcamp', students: 167 },
                            { name: 'Data Science Fundamentals', students: 145 },
                        ].map((course, index) => (
                            <div key={index} className="flex justify-between items-center border-gray-200 pb-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{course.name}</p>
                                    <p className="text-gray-500 text-xs">{course.students} học viên</p>
                                </div>
                                <div className="bg-green-100 px-3 py-1 rounded-full">
                                    <span className="font-semibold text-green-600 text-xs">Active</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
