'use client';

import SubjectFilter from '../../components/SubjectFilter';
import CourseCard from '../../components/CourseCard';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getAllSubjectApi } from '@/api/SubjectApi';

type Subject = {
    id: number;
    code: string;
    name: string;
    level: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
};

export default function SubjectPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllSubjectApi(page, size);
            const payload: any = data && typeof data === 'object' && 'data' in (data as any) ? (data as any).data : data;
            const items: Subject[] = Array.isArray(payload?.items)
                ? payload.items
                : Array.isArray(payload?.content)
                ? payload.content
                : Array.isArray(payload)
                ? payload
                : [];
            setSubjects(items);
            const tp = Number(payload?.totalPages ?? payload?.total_pages ?? 1);
            const te = Number(payload?.totalElements ?? payload?.total_elements ?? items.length);
            setTotalPages(Number.isFinite(tp) && tp > 0 ? tp : 1);
            setTotalElements(Number.isFinite(te) ? te : items.length);
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

    const cards = useMemo(() => {
        const list = Array.isArray(subjects) ? subjects : [];
        return list.map((s) => ({
            id: s.id,
            image: `https://picsum.photos/seed/${s.id}/800/600`,
            category: s.level,
            duration: s.status || 'ACTIVE',
            title: `${s.code} - ${s.name}`,
            description: s.description || '',
            progress: '',
        }));
    }, [subjects]);

    return (
        <div className="px-8 py-4">
            <SubjectFilter total={totalElements} />

            <div className="flex justify-between items-center mt-8">
                <p className="font-semibold text-[#333] text-xl">Subjects</p>
                <Link href="#" className="font-medium text-primary hover:underline">
                    See all
                </Link>
            </div>

            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-2">
                {cards.map((c) => (
                    <CourseCard
                        key={c.id}
                        id={c.id}
                        image={c.image}
                        category={c.category}
                        duration={c.duration}
                        title={c.title}
                        description={c.description}
                        progress={c.progress}
                    />
                ))}
            </div>
        </div>
    );
}
