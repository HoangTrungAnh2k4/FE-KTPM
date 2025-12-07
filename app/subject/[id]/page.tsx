'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSubjectByIdApi, getSubjectTopicsApi } from '@/api/SubjectApi';

type Topic = {
    id: number;
    title: string;
    description?: string; // backend uses description as video URL
    orderIndex?: number;
};

export default function CourseDetail() {
    const params = useParams();
    const router = useRouter();
    const subjectId = useMemo(() => (params?.id ? Number(params.id) : 0), [params]);

    const [subjectName, setSubjectName] = useState('');
    const [level, setLevel] = useState('');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!subjectId) return;
        setLoading(true);
        setError(null);
        try {
            const subjectRes = await getSubjectByIdApi(subjectId);
            const subjectPayload =
                subjectRes && typeof subjectRes === 'object' && 'data' in (subjectRes as any)
                    ? (subjectRes as any).data
                    : subjectRes;
            setSubjectName(subjectPayload?.name || subjectPayload?.data?.name || '');
            setLevel(subjectPayload?.level || subjectPayload?.data?.level || '');

            const topicsRes = await getSubjectTopicsApi(subjectId);
            const topicsPayload =
                topicsRes && typeof topicsRes === 'object' && 'data' in (topicsRes as any)
                    ? (topicsRes as any).data
                    : topicsRes;
            const list: Topic[] = Array.isArray(topicsPayload?.items)
                ? topicsPayload.items
                : Array.isArray(topicsPayload)
                ? topicsPayload
                : [];
            setTopics(list);
        } catch (e: any) {
            setError(e?.message || 'Không thể tải chủ đề của môn học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    return (
        <div className="px-12 py-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.replace(`/subject`)}
                        className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 border rounded-full text-sm cursor-pointer"
                        aria-label="Go back"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline-block"
                        >
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="font-semibold text-[#333] text-2xl">{subjectName || 'Subject'}</h1>
                </div>
            </div>

            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="gap-16 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                <div className="space-y-3 w-full">
                    {topics.map((t, idx) => (
                        <div key={t.id} className="bg-[#f5f5f5] px-6 py-3 rounded-md">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">
                                        {typeof t.orderIndex === 'number' ? t.orderIndex : idx + 1}. {t.title}
                                    </span>
                                </div>
                                <Link
                                    href={`/subject/${subjectId}/topic/${t.id}`}
                                    className="text-primary text-sm hover:underline"
                                >
                                    Xem chủ đề
                                </Link>
                            </div>
                        </div>
                    ))}
                    {topics.length === 0 && !loading && (
                        <div className="p-4 text-muted-foreground text-sm">Không có chủ đề</div>
                    )}
                </div>

                <aside className="hidden lg:block">
                    <div className="top-24 sticky bg-white shadow p-4 border rounded-lg">
                        <div className="bg-[#f5f5f5] mb-4 rounded-md w-full h-44 overflow-hidden">
                            <img
                                src={`https://picsum.photos/seed/${subjectId}/800/600`}
                                alt="subject cover"
                                className="w-full h-44 object-cover"
                            />
                        </div>
                        <h3 className="mb-2 font-semibold text-lg">{subjectName || 'Subject'}</h3>
                        <div className="mb-3 text-muted-foreground text-sm">
                            Mức độ: <span className="font-semibold">{level || '—'}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
