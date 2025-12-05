'use client';
import { useState } from 'react';
import AdminCourseCard from '@/components/AdminCourseCard';
import Link from 'next/link';
// Revert to native selects (removed custom DropdownMenu)
import { useRouter } from 'next/navigation';

const sampleCourses = [
    {
        id: 1,
        image: 'https://picsum.photos/seed/1/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        price: 23.0,
        originalPrice: 33.0,
        assign: 'Lina',
    },
    {
        id: 2,
        image: 'https://picsum.photos/seed/2/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        price: 23.0,
        originalPrice: 33.0,
        assign: 'Alex',
    },
    {
        id: 3,
        image: 'https://picsum.photos/seed/3/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        price: 23.0,
        originalPrice: 33.0,
        assign: 'Kim',
    },
    {
        id: 4,
        image: 'https://picsum.photos/seed/4/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        price: 23.0,
        originalPrice: 11.0,
        assign: 'Sam',
    },
];

export default function AdminSubjectsPage() {
    const [courses, setCourses] = useState(sampleCourses);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | number>(null);
    const router = useRouter();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('Day');
    const [price, setPrice] = useState('23.00');
    const [originalPrice, setOriginalPrice] = useState('33.00');
    const [assign, setAssign] = useState('');

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setTopic('');
        setDuration('Day');
        setPrice('23.00');
        setOriginalPrice('33.00');
        setAssign('');
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
            setCourses(courses.filter((course) => course.id !== id));
        }
    };

    const handleEdit = (id: number) => {
        const course = courses.find((c) => c.id === id);
        if (!course) return;
        setShowEdit(id);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setTopic('');
        setDuration(course.duration);
        setPrice(String(course.price));
        setOriginalPrice(String(course.originalPrice));
        setAssign(course.assign ?? '');
    };

    const handleViewDetail = (id: number) => {
        router.push(`/admin/subjects/${id}`);
    };

    const handleCreate = () => {
        if (!title.trim()) return alert('Vui lòng nhập Title');
        const newCourse = {
            id: Math.max(0, ...courses.map((c) => c.id)) + 1,
            image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`,
            category: category || 'General',
            duration: duration || 'Day',
            title: title,
            description: description || 'No description',
            price: parseFloat(price) || 0,
            originalPrice: parseFloat(originalPrice) || 0,
            assign: assign || '',
        };
        setCourses([newCourse, ...courses]);
        setShowCreate(false);
        resetForm();
    };

    const handleUpdate = () => {
        if (showEdit == null) return;
        setCourses((prev) =>
            prev.map((c) =>
                c.id === showEdit
                    ? {
                          ...c,
                          title,
                          description,
                          category,
                          duration,
                          price: parseFloat(price) || c.price,
                          originalPrice: parseFloat(originalPrice) || c.originalPrice,
                          assign,
                      }
                    : c
            )
        );
        setShowEdit(null);
        resetForm();
    };

    return (
        <div className="px-12 py-8 bg-[#f5f5f5] min-h-screen">
            {/* Section 1 */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-[#333] text-2xl">Marketing Articles</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowCreate(true);
                            }}
                            className="bg-[#4ECDC4] hover:opacity-90 px-4 py-2 rounded-full text-white text-sm"
                        >
                            Create Subject
                        </button>
                        <Link href="#" className="font-medium text-[#4ECDC4] hover:underline text-sm">
                            See all
                        </Link>
                    </div>
                </div>

                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {courses.map((course) => (
                        <AdminCourseCard
                            key={course.id}
                            id={course.id}
                            image={course.image}
                            category={course.category}
                            duration={course.duration}
                            title={course.title}
                            description={course.description}
                            price={course.price}
                            originalPrice={course.originalPrice}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onViewDetail={handleViewDetail}
                            assign={course.assign}
                        />
                    ))}
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-[#333] text-2xl">Marketing Articles</h2>
                    <Link href="#" className="font-medium text-[#4ECDC4] hover:underline text-sm">
                        See all
                    </Link>
                </div>

                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {courses.map((course) => (
                        <AdminCourseCard
                            key={`section2-${course.id}`}
                            id={course.id}
                            image={course.image}
                            category={course.category}
                            duration={course.duration}
                            title={course.title}
                            description={course.description}
                            price={course.price}
                            originalPrice={course.originalPrice}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onViewDetail={handleViewDetail}
                            assign={course.assign}
                        />
                    ))}
                </div>
            </div>

            {/* Create / Edit form */}
            {(showCreate || showEdit !== null) && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl w-[720px]">
                        <h3 className="font-semibold text-xl text-[#333]">
                            {showCreate ? 'Create Subject' : 'Update Subject'}
                        </h3>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="Your course title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Description</label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="Your course description"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700">Course Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    >
                                        <option value="">Select..</option>
                                        <option value="Design">Design</option>
                                        <option value="Software">Software</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Assign</label>
                                    <input
                                        value={assign}
                                        onChange={(e) => setAssign(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="Instructor name or assignee"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Course Topic</label>
                                <input
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="What is primarily taught in your course?"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700">Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    >
                                        <option value="Day">Day</option>
                                        <option value="Week">Week</option>
                                        <option value="Month">Month</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Price</label>
                                    <input
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="23.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Original Price</label>
                                    <input
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="33.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    setShowEdit(null);
                                    resetForm();
                                }}
                                className="border px-4 py-2 rounded-full text-sm"
                            >
                                Cancel
                            </button>
                            {showCreate ? (
                                <button
                                    onClick={handleCreate}
                                    className="bg-[#4ECDC4] px-5 py-2 rounded-full text-white text-sm"
                                >
                                    Create
                                </button>
                            ) : (
                                <button
                                    onClick={handleUpdate}
                                    className="bg-[#4ECDC4] px-5 py-2 rounded-full text-white text-sm"
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
