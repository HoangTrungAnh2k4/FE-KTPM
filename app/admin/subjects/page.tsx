'use client';
import { useEffect, useState } from 'react';
import AdminCourseCard from '@/components/AdminCourseCard';
import Link from 'next/link';
// Revert to native selects (removed custom DropdownMenu)
import { useRouter } from 'next/navigation';
import SubjectFilter from '@/components/SubjectFilter';
import { AdminSubjectsAPI, type Subject } from '@/lib/api';

// Map backend Subject to UI card fields
const toCard = (s: Subject) => ({
  id: s.id,
  image: `https://picsum.photos/seed/${s.id}/800/600`,
  category: s.level || 'General',
  duration: '—',
  title: `${s.code} - ${s.name}`,
  description: s.description || '',
  price: 0,
  originalPrice: 0,
  assign: '',
});

export default function AdminSubjectsPage() {
    const [courses, setCourses] = useState<Array<ReturnType<typeof toCard>>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(12);
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

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const res = await AdminSubjectsAPI.list(page, size);
            const items = (res?.data || []).map(toCard);
            setCourses(items);
            setError(null);
        } catch (e: any) {
            setError(e?.message || 'Không tải được danh sách môn học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) return;
        try {
            await AdminSubjectsAPI.remove(id);
            await loadSubjects();
        } catch (e: any) {
            alert(e?.message || 'Xóa môn học thất bại');
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

    const handleCreate = async () => {
        if (!title.trim()) return alert('Vui lòng nhập Title');
        try {
            // Map form fields to backend Subject
            await AdminSubjectsAPI.create({
                code: title.slice(0, 10).replace(/\s+/g, '').toUpperCase() || 'SUBJ',
                name: title,
                level: category || 'UNDERGRADUATE',
                description: description || '',
                status: 'ACTIVE',
            } as any);
            setShowCreate(false);
            resetForm();
            await loadSubjects();
        } catch (e: any) {
            alert(e?.message || 'Tạo môn học thất bại');
        }
    };

    const handleUpdate = async () => {
        if (showEdit == null) return;
        try {
            await AdminSubjectsAPI.update(showEdit, {
                name: title,
                level: category,
                description,
            });
            setShowEdit(null);
            resetForm();
            await loadSubjects();
        } catch (e: any) {
            alert(e?.message || 'Cập nhật môn học thất bại');
        }
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
                    </div>
                </div>

                <SubjectFilter total={courses.length} />

                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                    {loading ? (
                        <div className="col-span-full text-sm text-gray-500">Đang tải...</div>
                    ) : error ? (
                        <div className="col-span-full text-sm text-red-600">{error}</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full text-sm text-gray-500">Không có môn học</div>
                    ) : (
                        courses.map((course) => (
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
                        ))
                    )}
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
                    {loading ? (
                        <div className="col-span-full text-sm text-gray-500">Đang tải...</div>
                    ) : error ? (
                        <div className="col-span-full text-sm text-red-600">{error}</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full text-sm text-gray-500">Không có môn học</div>
                    ) : (
                        courses.map((course) => (
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
                        ))
                    )}
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