'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import AdminCourseCard from '@/components/AdminCourseCard';
import { useRouter } from 'next/navigation';
import {
    getAllSubjectApi,
    createSubjectApi,
    updateSubjectApi,
    deleteSubjectApi,
    assignInstructorApi,
    removeInstructorApi,
} from '@/api/SubjectApi';
import { getListUsersApi } from '@/api/userApi';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/UI/pagination';

type Subject = {
    id: number;
    code: string;
    name: string;
    level: string;
    description?: string;
    status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    instructors?: { instructorId: number; instructorName: string }[];
};

type Instructor = {
    id: number;
    fullName: string;
    email: string;
    roles?: string[];
};

export default function AdminSubjectsPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Notification state
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Delete confirmation modal state
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Instructor selection state (used inside edit modal)
    const [instructorSelectId, setInstructorSelectId] = useState('');
    const [instructorOptions, setInstructorOptions] = useState<Instructor[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(false);

    // Form state mapped to API payload
    const [showCreate, setShowCreate] = useState(false);
    const [editId, setEditId] = useState<null | number>(null);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [level, setLevel] = useState('UNDERGRADUATE');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | ''>('');

    const resetForm = () => {
        setCode('');
        setName('');
        setLevel('UNDERGRADUATE');
        setDescription('');
        setStatus('');
    };

    const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllSubjectApi(page, size);
            // Normalize to handle shape: { status, message, data: { items, ... } }
            console.log('API response data:', data);
            const payload: any =
                data && typeof data === 'object' && 'data' in (data as any) ? (data as any).data : data;
            const items: Subject[] = Array.isArray(payload?.items)
                ? payload.items
                : Array.isArray(payload?.content)
                ? payload.content
                : Array.isArray(payload)
                ? payload
                : [];
            setSubjects(items);
            // Read pagination metadata if available
            const tp = Number(payload?.totalPages ?? payload?.total_pages ?? 1);
            // total elements currently unused in UI
            setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
            console.log('Subjects fetched:', items.length);
            console.log('Fetched subjects:', items);
        } catch (e: any) {
            setError(e?.message || 'Không thể tải danh sách môn học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleDeleteRequest = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId == null) return;
        try {
            await deleteSubjectApi(deleteId);
            setSubjects((prev) => prev.filter((s) => s.id !== deleteId));
            setDeleteId(null);
            setNotification({ type: 'success', message: 'Xóa môn học thành công' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e: any) {
            const statusCode = e?.response?.status;
            let message = 'Xóa môn học thất bại';

            if (statusCode === 404) {
                message = 'Môn học không tồn tại';
            } else if (statusCode === 409) {
                message = 'Không thể xóa, môn học đang được sử dụng';
            } else if (e?.message) {
                message = e.message;
            }

            setNotification({ type: 'error', message });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const handleEdit = (id: number) => {
        const subject = subjects.find((s) => s.id === id);
        if (!subject) return;
        setEditId(id);
        setShowCreate(false);
        setCode(subject.code || '');
        setName(subject.name || '');
        setLevel(subject.level || 'UNDERGRADUATE');
        setDescription(subject.description || '');
        setStatus(subject.status || '');
        // Load instructor options when opening edit
        loadInstructorOptions();
    };

    const handleViewDetail = (id: number) => {
        router.push(`/admin/subjects/${id}`);
    };

    const loadInstructorOptions = async () => {
        setLoadingInstructors(true);
        try {
            const data = await getListUsersApi({ page: 0, size: 1000 });
            const payload: any =
                data && typeof data === 'object' && 'data' in (data as any) ? (data as any).data : data;
            const users: any[] = Array.isArray(payload?.items)
                ? payload.items
                : Array.isArray(payload?.content)
                ? payload.content
                : Array.isArray(payload)
                ? payload
                : [];

            const instructorsList: Instructor[] = users.filter(
                (user: any) => user.roles && Array.isArray(user.roles) && user.roles.includes('INSTRUCTOR'),
            );
            setInstructorOptions(instructorsList);
        } catch (e: any) {
            console.error('Error loading instructors:', e);
            setInstructorOptions([]);
        } finally {
            setLoadingInstructors(false);
        }
    };

    const addInstructorToSubject = async () => {
        if (editId == null || !instructorSelectId.trim()) {
            setNotification({ type: 'error', message: 'Vui lòng chọn giảng viên' });
            return;
        }
        try {
            const selected = instructorOptions.find((i) => i.id === Number(instructorSelectId));
            await assignInstructorApi(editId, { instructorId: Number(instructorSelectId) });
            setSubjects((prev) =>
                prev.map((s) =>
                    s.id === editId
                        ? {
                              ...s,
                              instructors: [
                                  ...(s.instructors || []),
                                  selected
                                      ? { instructorId: selected.id, instructorName: selected.fullName }
                                      : { instructorId: Number(instructorSelectId), instructorName: 'Instructor' },
                              ],
                          }
                        : s,
                ),
            );
            setInstructorSelectId('');
            setNotification({ type: 'success', message: 'Gán giảng viên thành công' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e: any) {
            const statusCode = e?.response?.status;
            let message = 'Gán giảng viên thất bại';

            if (statusCode === 409) {
                message = 'Giảng viên này đã được gán cho môn học rồi';
            } else if (statusCode === 404) {
                message = 'Môn học hoặc giảng viên không tồn tại';
            } else if (statusCode === 400) {
                message = 'Dữ liệu không hợp lệ';
            } else if (e?.message) {
                message = e.message;
            }

            setNotification({ type: 'error', message });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const removeInstructorFromSubject = async (instructorId: number) => {
        if (editId == null) return;
        try {
            await removeInstructorApi(editId, instructorId);
            setSubjects((prev) =>
                prev.map((s) =>
                    s.id === editId
                        ? { ...s, instructors: (s.instructors || []).filter((i) => i.instructorId !== instructorId) }
                        : s,
                ),
            );
            setNotification({ type: 'success', message: 'Xóa giảng viên thành công' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e: any) {
            const statusCode = e?.response?.status;
            let message = 'Xóa giảng viên thất bại';

            if (statusCode === 404) {
                message = 'Môn học hoặc giảng viên không tồn tại';
            } else if (e?.message) {
                message = e.message;
            }
            setNotification({ type: 'error', message });
            setTimeout(() => setNotification(null), 5000);
        }
    };


    const handleCreate = async () => {
        if (!code.trim() || !name.trim()) {
            setNotification({ type: 'error', message: 'Vui lòng nhập Code và Name' });
            return;
        }
        try {
            const res = await createSubjectApi({ code, name, level, description });
            const created: Subject = res?.data || res; // backend may wrap in {data}
            console.log('Created subject:', created);
            if (created?.id) {
                setSubjects((prev) => [created, ...prev]);
            } else {
                // Fallback: refetch list
                fetchSubjects();
            }
            setShowCreate(false);
            resetForm();
            setNotification({ type: 'success', message: 'Tạo môn học thành công' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e: any) {
            const statusCode = e?.response?.status;
            let message = 'Tạo môn học thất bại';

            if (statusCode === 400) {
                message = 'Dữ liệu không hợp lệ';
            } else if (statusCode === 409) {
                message = 'Môn học đã tồn tại';
            } else if (e?.message) {
                message = e.message;
            }

            setNotification({ type: 'error', message });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const handleUpdate = async () => {
        if (editId == null) return;
        if (!code.trim() || !name.trim()) {
            setNotification({ type: 'error', message: 'Vui lòng nhập Code và Name' });
            return;
        }
        try {
            const res = await updateSubjectApi(editId, { code, name, level, description, status: status || undefined });
            const updated: Subject = res?.data || res;
            setSubjects((prev) => prev.map((s) => (s.id === editId ? { ...s, ...updated } : s)));
            setEditId(null);
            resetForm();
            setNotification({ type: 'success', message: 'Cập nhật môn học thành công' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e: any) {
            const statusCode = e?.response?.status;
            let message = 'Cập nhật môn học thất bại';

            if (statusCode === 400) {
                message = 'Dữ liệu không hợp lệ';
            } else if (statusCode === 404) {
                message = 'Môn học không tồn tại';
            } else if (statusCode === 409) {
                message = 'Dữ liệu bị xung đột, vui lòng tải lại';
            } else if (e?.message) {
                message = e.message;
            }

            setNotification({ type: 'error', message });
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const cards = useMemo(() => {
        // Map subject to AdminCourseCard props with placeholders for image/price
        const list = Array.isArray(subjects) ? subjects : [];
        return list.map((s) => ({
            id: s.id,
            image: `https://picsum.photos/seed/${s.id}/800/600`,
            category: s.level,
            duration: s.status || 'ACTIVE',
            title: `${s.code} - ${s.name}`,
            description: s.description || '',
            price: 0,
            originalPrice: 0,
            assign: (s.instructors || []).map((i) => i.instructorName).join(', '),
        }));
    }, [subjects]);

    return (
        <div className="bg-[#f5f5f5] px-12 py-8 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-[#333] text-2xl">Subjects Management</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            resetForm();
                            setEditId(null);
                            setShowCreate(true);
                        }}
                        className="bg-[#35aba3] hover:bg-[#2d8b85] px-4 py-2 rounded-full font-semibold text-white text-sm cursor-pointer"
                    >
                        Create Subject
                    </button>
                </div>
            </div>

            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg animate-pulse ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}

            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((course) => (
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
                        onDelete={handleDeleteRequest}
                        onEdit={handleEdit}
                        onViewDetail={handleViewDetail}
                        assign={course.assign}
                        onAssignInstructor={(id) => {
                            // Open edit modal directly for assignment within edit flow
                            handleEdit(id);
                        }}
                    />
                ))}
            </div>

            {(showCreate || editId !== null) && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 p-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl w-[720px]">
                        <h3 className="font-semibold text-[#333] text-xl">
                            {showCreate ? 'Create Subject' : 'Update Subject'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Left column: basic info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm">Code</label>
                                    <input
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="KTPM101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="Kiến trúc phần mềm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Level</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Elementary">Elementary</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Description</label>
                                    <input
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        placeholder="Mô tả môn học"
                                    />
                                </div>
                            </div>

                            {/* Right column: status + instructors */}
                            {!showCreate && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(
                                                    e.target.value as 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | '',
                                                )
                                            }
                                            className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                        >
                                            <option value="">(unchanged)</option>
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="ARCHIVED">ARCHIVED</option>
                                        </select>
                                    </div>

                                    {/* Assigned Instructors */}
                                    <div>
                                        <label className="block text-gray-700 text-sm">Assigned Instructors</label>
                                        <div className="mt-2 space-y-2">
                                            {(subjects.find((s) => s.id === editId)?.instructors || []).length === 0 ? (
                                                <p className="text-sm text-gray-500">Chưa có giảng viên nào</p>
                                            ) : (
                                                <ul className="divide-y divide-gray-100 border rounded-lg">
                                                    {(subjects.find((s) => s.id === editId)?.instructors || []).map((i) => (
                                                        <li
                                                            key={i.instructorId}
                                                            className="flex items-center justify-between px-4 py-2"
                                                        >
                                                            <span className="text-sm text-gray-700">{i.instructorName}</span>
                                                            <button
                                                                onClick={() => removeInstructorFromSubject(i.instructorId)}
                                                                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-full text-sm"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add Instructor */}
                                    <div>
                                        <label className="block text-gray-700 text-sm">Thêm Giảng Viên</label>
                                        {loadingInstructors ? (
                                            <p className="mt-2 text-gray-500 text-sm">Đang tải danh sách giảng viên...</p>
                                        ) : (
                                            <div className="flex gap-3 mt-2">
                                                <select
                                                    value={instructorSelectId}
                                                    onChange={(e) => setInstructorSelectId(e.target.value)}
                                                    className="px-4 py-3 border rounded-lg w-full text-sm"
                                                >
                                                    <option value="">-- Chọn giảng viên --</option>
                                                    {instructorOptions
                                                        .filter((opt) =>
                                                            !(subjects.find((s) => s.id === editId)?.instructors || []).some(
                                                                (a) => a.instructorId === opt.id,
                                                            ),
                                                        )
                                                        .map((instructor) => (
                                                            <option key={instructor.id} value={instructor.id.toString()}>
                                                                {instructor.fullName} ({instructor.email})
                                                            </option>
                                                        ))}
                                                </select>
                                                <button
                                                    onClick={addInstructorToSubject}
                                                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm"
                                                >
                                                    Thêm
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    setEditId(null);
                                    resetForm();
                                }}
                                className="hover:bg-gray-50 px-4 py-2 border rounded-full text-sm cursor-pointer"
                            >
                                Cancel
                            </button>
                            {showCreate ? (
                                <button
                                    onClick={handleCreate}
                                    className="bg-[#35aba3] hover:bg-[#2d8b85] px-4 py-2 rounded-full font-semibold text-white text-sm cursor-pointer"
                                >
                                    Create
                                </button>
                            ) : (
                                <button
                                    onClick={handleUpdate}
                                    className="bg-[#35aba3] hover:bg-[#2d8b85] px-4 py-2 rounded-full font-semibold text-white text-sm cursor-pointer"
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Delete confirmation modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/30 p-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl w-[520px]">
                        <h3 className="font-semibold text-[#333] text-xl">Xóa môn học</h3>
                        <p className="mt-2 text-gray-600 text-sm">Bạn có chắc chắn muốn xóa môn học này?</p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setDeleteId(null);
                                }}
                                className="px-4 py-2 border rounded-full text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 px-5 py-2 rounded-full text-white text-sm"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center pt-6 w-full">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((p) => Math.max(0, p - 1));
                                }}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages <= 5 ? totalPages : 5 }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={i === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((p) => (p + 1 < totalPages ? p + 1 : p));
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
