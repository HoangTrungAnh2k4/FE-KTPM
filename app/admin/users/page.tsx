'use client';

import { Search } from 'lucide-react';
import { MdDeleteOutline } from "react-icons/md";

export default function UsersPage() {
    const users = [
        { id: '001', username: 'John Doe', status: 'active', role: 'Student' },
        { id: '002', username: 'John Doe', status: 'inactive', role: 'Instructor' },
        { id: '003', username: 'John Doe', status: 'active', role: 'Instructor' },
    ];

    return (
        <div className="p-8 w-full">
            {/* Title + Create Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">User</h1>
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                    Create User
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    className="w-full border rounded-md pl-10 pr-4 py-2"
                    placeholder="Search"
                />
            </div>

            {/* Table */}
            <div className="border rounded-md overflow-hidden bg-white">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 min-w-[150px]">User id</th>
                            <th className="p-3 min-w-[250px]">Username</th>
                            <th className="p-3 min-w-[250px]">Status</th>
                            <th className="p-3 min-w-[250px]">Role</th>
                            <th className="p-3 min-w-[150px]">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3">{user.username}</td>

                                {/* Status */}
                                <td className="p-3">
                                    {user.status === 'active' ? (
                                        <span className="px-3 py-1 rounded-md bg-green-500 text-white text-sm">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-md bg-red-500 text-white text-sm">
                                            InActive
                                        </span>
                                    )}
                                </td>

                                {/* Role dropdown */}
                                <td className="p-3">
                                    <select
                                        defaultValue={user.role}
                                        className="border rounded-md px-3 py-1"
                                    >
                                        <option>Student</option>
                                        <option>Instructor</option>
                                        <option>Admin</option>
                                    </select>
                                </td>
                                <td className="p-3 flex gap-3">
                                    <button className="p-2 rounded-md bg-red-200 hover:bg-red-300">
                                        <MdDeleteOutline size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
