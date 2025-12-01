'use client';

import { useState } from 'react';

export default function SubjectFilter({ total = 0 }: { total?: number }) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('latest');
    const [status, setStatus] = useState('all');
    const [teacher, setTeacher] = useState('all');

    return (
        <div className="space-y-3">
            <div>
                <h2 className="font-semibold text-xl">
                    Courses <span className="text-muted-foreground text-base">({total})</span>
                </h2>
            </div>

            <div className="flex md:flex-row flex-col md:items-center gap-4">
                <label className="sr-only">Search</label>
                <div className="flex-1">
                    <div className="relative">
                        <span className="left-4 absolute inset-y-0 flex items-center text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                                />
                            </svg>
                        </span>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search in your courses..."
                            className="bg-card shadow px-12 py-2 border rounded-md w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-full md:w-48">
                        <label className="sr-only">Sort by</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-card shadow px-4 py-2 border rounded-md w-full text-left"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="a-z">A - Z</option>
                        </select>
                    </div>

                    <div className="w-full md:w-48">
                        <label className="sr-only">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-card shadow px-4 py-2 border rounded-md w-full text-left"
                        >
                            <option value="all">All Courses</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <div className="w-full md:w-48">
                        <label className="sr-only">Teacher</label>
                        <select
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                            className="bg-card shadow px-4 py-2 border rounded-md w-full text-left"
                        >
                            <option value="all">All Teachers</option>
                            <option value="teacher1">Teacher 1</option>
                            <option value="teacher2">Teacher 2</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
