'use client';

import { Search } from 'lucide-react';
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

export default function SubjectsPage() {
    const subjects = [
        { id: '001', name: 'React', instructor: 'John Doe', createdAt: 'January 5, 2025' },
        { id: '002', name: 'React', instructor: 'John Doe', createdAt: 'January 5, 2025' },
        { id: '003', name: 'React', instructor: 'John Doe', createdAt: 'January 5, 2025' },
    ];

    return (
        <div className="p-8 w-full">
            {/* Title + Create Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Subject</h1>
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                    Create Subject
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
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 min-w-[150px]">Subject id</th>
                            <th className="p-3 min-w-[250px]">Subject name</th>
                            <th className="p-3 min-w-[250px]">Instructor</th>
                            <th className="p-3 min-w-[250px]">Create at</th>
                            <th className="p-3 min-w-[150px]">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {subjects.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-3">{item.id}</td>
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.instructor}</td>
                                <td className="p-3">{item.createdAt}</td>
                                <td className="p-3 flex gap-3">
                                    <button className="p-2 rounded-md bg-teal-200 hover:bg-teal-300">
                                        <CiEdit size={20} color='black' />
                                    </button>
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
