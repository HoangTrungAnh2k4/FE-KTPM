'use client';
import { useEffect, useMemo, useState } from 'react';
import AdminCourseCard from '@/components/AdminCourseCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    getAllSubjectApi,
    createSubjectApi,
    updateSubjectApi,
    deleteSubjectApi,
} from '@/api/SubjectApi';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/UI/pagination"


type Subject = {
    id: number;
    code: string;
    name: string;
    level: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
};

export default function AdminSubjectsPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete confirmation modal state
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteReason, setDeleteReason] = useState('');

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
            const payload: any = data && typeof data === 'object' && 'data' in (data as any) ? (data as any).data : data;
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
            const te = Number(payload?.totalElements ?? payload?.total_elements ?? items.length);
            setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
            setTotalElements(Number.isFinite(te) ? te : items.length);
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
        setDeleteReason('');
    };

    const confirmDelete = async () => {
        if (deleteId == null) return;
        try {
            await deleteSubjectApi(deleteId);
            setSubjects((prev) => prev.filter((s) => s.id !== deleteId));
            setDeleteId(null);
            setDeleteReason('');
        } catch (e: any) {
            // Show lightweight inline error (no alert)
            setError(e?.message || 'Xóa môn học thất bại');
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
    };

    const handleViewDetail = (id: number) => {
        router.push(`/admin/subjects/${id}`);
    };

    const handleCreate = async () => {
        if (!code.trim() || !name.trim()) return alert('Vui lòng nhập Code và Name');
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
        } catch (e: any) {
            alert(e?.message || 'Tạo môn học thất bại');
        }
    };

    const handleUpdate = async () => {
        if (editId == null) return;
        if (!code.trim() || !name.trim()) return alert('Vui lòng nhập Code và Name');
        try {
            const res = await updateSubjectApi(editId, { code, name, level, description, status: status || undefined });
            const updated: Subject = res?.data || res;
            setSubjects((prev) => prev.map((s) => (s.id === editId ? { ...s, ...updated } : s)));
            setEditId(null);
            resetForm();
        } catch (e: any) {
            alert(e?.message || 'Cập nhật môn học thất bại');
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
            assign: '',
        }));
    }, [subjects]);

    return (
        <div className="px-12 py-8 bg-[#f5f5f5] min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-[#333] text-2xl">Subjects Management</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            resetForm();
                            setEditId(null);
                            setShowCreate(true);
                        }}
                        className="bg-[#4ECDC4] hover:opacity-90 px-4 py-2 rounded-full text-white text-sm"
                    >
                        Create Subject
                    </button>
                   
                </div>
            </div>

            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

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
                    />
                ))}
            </div>

            {(showCreate || editId !== null) && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl w-[720px]">
                        <h3 className="font-semibold text-xl text-[#333]">
                            {showCreate ? 'Create Subject' : 'Update Subject'}
                        </h3>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700">Code</label>
                                <input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="KTPM101"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="Kiến trúc phần mềm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Level</label>
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
                                <label className="block text-sm text-gray-700">Description</label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    placeholder="Mô tả môn học"
                                />
                            </div>
                            {!showCreate && (
                                <div>
                                    <label className="block text-sm text-gray-700">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="mt-2 px-4 py-3 border rounded-lg w-full text-sm"
                                    >
                                        <option value="">(unchanged)</option>
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="ARCHIVED">ARCHIVED</option>
                                    </select>
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
                                className="border px-4 py-2 rounded-full text-sm"
                            >
                                Cancel
                            </button>
                            {showCreate ? (
                                <button onClick={handleCreate} className="bg-[#4ECDC4] px-5 py-2 rounded-full text-white text-sm">
                                    Create
                                </button>
                            ) : (
                                <button onClick={handleUpdate} className="bg-[#4ECDC4] px-5 py-2 rounded-full text-white text-sm">
                                    Update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Delete confirmation modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white shadow-xl p-6 rounded-xl w-[520px]">
                        <h3 className="font-semibold text-xl text-[#333]">Xóa môn học</h3>
                        <p className="mt-2 text-sm text-gray-600">Bạn có chắc chắn muốn xóa môn học này?</p>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setDeleteId(null); setDeleteReason(''); }} className="border px-4 py-2 rounded-full text-sm">Hủy</button>
                            <button onClick={confirmDelete} className="bg-red-500 px-5 py-2 rounded-full text-white text-sm">Xóa</button>
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
                                                {Array.from({ length: totalPages <=5 ? totalPages : 5 }).map((_, i) => (
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