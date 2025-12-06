'use client';
import { useEffect, useMemo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu';
import { type ListUser, type UserRole } from '@/lib/adminUsers';
import { getListUsersApi, createAdminAccount } from '@/api/userApi';
import { DataTable } from './data-table';
import { columns } from './columns';

export default function AdminUsersPage() {
    const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
    const [showCreate, setShowCreate] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        roles: ['STUDENT'] as UserRole[],
    });

    const [listUser, setListUser] = useState<ListUser[]>([]);
    const [historyPage, setHistoryPage] = useState<number>(1);
    const [historyTotalPages, setHistoryTotalPages] = useState<number>(1);
    const [historyTotalItems, setHistoryTotalItems] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const pageSize = 10;

    const reload = () => {
        fetchedUsers(0);
    };

    useEffect(() => {
        reload();
    }, [roleFilter]);

    const onCreate = async () => {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all required fields (Full Name, Email, Password)');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await createAdminAccount({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                roles: formData.roles,
                phone: formData.phone.trim() || '',
                age: formData.age ? parseInt(formData.age) : 0,
            });

            // Success
            setSuccessMessage('User created successfully!');
            setShowCreate(false);
            resetForm();
            reload();

            // Auto hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create user';
            setError(errorMsg);
            console.error('Create user error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            password: '',
            phone: '',
            age: '',
            roles: ['STUDENT'],
        });
    };

    const handleFormChange = (field: keyof typeof formData, value: string | UserRole[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const fetchedUsers = async (page: number) => {
        const data = await getListUsersApi({ page, size: 10 });
        console.log(data.data.content);
        setListUser(data.data.content);
    };

    useEffect(() => {
        fetchedUsers(0);
    }, []);

    return (
        <div className="bg-[#f5f5f5] px-12 py-8 min-h-screen">
            {/* Success Toast */}
            {successMessage && (
                <div className="top-4 right-4 z-50 fixed slide-in-from-top-2 animate-in duration-300">
                    <div className="flex items-center gap-3 bg-green-50 shadow-lg p-4 border border-green-200 rounded-lg min-w-[300px]">
                        <div className="bg-green-500 p-1 rounded-full">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-green-800 text-sm">{successMessage}</p>
                        </div>
                        <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="font-semibold text-[#333] text-2xl">User Management</h1>
                <div className="flex items-center gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter((e.target.value || '') as UserRole | '')}
                        className="px-3 py-2 border rounded-md text-sm"
                    >
                        <option value="">All roles</option>
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                    </select>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-[#35aba3] hover:bg-[#2d8b85] px-4 py-2 rounded-full text-white text-sm cursor-pointer"
                    >
                        Create user
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <DataTable
                    columns={columns}
                    data={listUser}
                    currentPage={historyPage}
                    totalPages={historyTotalPages}
                    onPageChange={(p: number) => fetchedUsers(p)}
                />
            </div>

            {showCreate && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 p-4">
                    <div className="bg-white shadow-xl p-6 py-8 rounded-xl w-[640px] max-w-full">
                        {error && (
                            <div className="bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 px-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Full Name *</label>
                                <input
                                    value={formData.fullName}
                                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                                    placeholder="Enter full name"
                                    disabled={isLoading}
                                    className="disabled:bg-gray-100 mt-2 px-4 py-2 border rounded-md focus:outline-none w-full text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Email *</label>
                                <input
                                    value={formData.email}
                                    onChange={(e) => handleFormChange('email', e.target.value)}
                                    type="email"
                                    placeholder="Enter email"
                                    disabled={isLoading}
                                    className="disabled:bg-gray-100 mt-2 px-4 py-2 border rounded-md focus:outline-none w-full text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Password *</label>
                                <input
                                    value={formData.password}
                                    onChange={(e) => handleFormChange('password', e.target.value)}
                                    type="password"
                                    placeholder="Enter password"
                                    disabled={isLoading}
                                    className="disabled:bg-gray-100 mt-2 px-4 py-2 border rounded-md focus:outline-none w-full text-sm"
                                />
                            </div>
                            <div className="gap-4 grid grid-cols-2">
                                <div>
                                    <label className="block font-medium text-gray-700 text-sm">Phone</label>
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => handleFormChange('phone', e.target.value)}
                                        type="tel"
                                        placeholder="Enter phone number"
                                        disabled={isLoading}
                                        className="disabled:bg-gray-100 mt-2 px-4 py-2 border rounded-md focus:outline-none w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 text-sm">Age</label>
                                    <input
                                        value={formData.age}
                                        onChange={(e) => handleFormChange('age', e.target.value)}
                                        type="number"
                                        placeholder="Enter age"
                                        min="0"
                                        max="100"
                                        disabled={isLoading}
                                        className="disabled:bg-gray-100 mt-2 px-4 py-2 border rounded-md focus:outline-none w-full text-sm"
                                    />
                                </div>
                            </div>
                            <div className="w-fit">
                                <label className="block mb-2 font-medium text-gray-700 text-sm">Role *</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            disabled={isLoading}
                                            className="flex justify-between items-center gap-2 hover:bg-gray-50 disabled:bg-gray-100 py-2 pr-2 pl-3 border rounded-md w-full text-sm text-left"
                                        >
                                            {formData.roles[0] || 'Select role'}
                                            <IoIosArrowDown size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="bg-white shadow-lg border rounded-lg w-full"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => handleFormChange('roles', ['STUDENT'])}
                                            className="hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
                                        >
                                            Student
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleFormChange('roles', ['INSTRUCTOR'])}
                                            className="hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
                                        >
                                            Instructor
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleFormChange('roles', ['ADMIN'])}
                                            className="hover:bg-gray-100 px-4 py-2 text-sm cursor-pointer"
                                        >
                                            Admin
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    resetForm();
                                    setError(null);
                                }}
                                disabled={isLoading}
                                className="hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border rounded-full text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onCreate}
                                disabled={isLoading}
                                className="bg-[#4ECDC4] hover:bg-[#3bb8af] disabled:opacity-50 px-5 py-2 rounded-full text-white text-sm disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
