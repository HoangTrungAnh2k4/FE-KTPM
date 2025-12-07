'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getSubjectTopicsApi, getSubjectByIdApi } from '@/api/SubjectApi';

type Topic = {
    id: number;
    title: string;
    description?: string; // backend uses description to store video URL
    orderIndex?: number;
};

// Convert YouTube URLs to embeddable format
function getEmbedYouTubeUrl(url: string): string {
    if (!url) return '';

    // Handle youtu.be short URLs
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
    }

    // Handle regular youtube.com URLs
    const longMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (longMatch) {
        return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1`;
    }

    // If already an embed URL, add autoplay if not present
    if (url.includes('youtube.com/embed/')) {
        return url.includes('autoplay=') ? url : url + (url.includes('?') ? '&autoplay=1' : '?autoplay=1');
    }

    // Return original URL if no pattern matched
    return url;
}
export default function TopicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = useMemo(() => (params?.id ? Number(params.id) : 0), [params]);
    const topicIdParam = useMemo(() => params?.topicId, [params]);

    const [subjectName, setSubjectName] = useState('');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentTopic = useMemo(() => {
        // topicIdParam is a numeric topic ID
        const numericId = Number(topicIdParam ?? 0);
        return topics.find((t) => t.id === numericId) || topics[0];
    }, [topics, topicIdParam]);

    const videoUrl = useMemo(() => {
        const rawUrl = currentTopic?.description || '';
        return getEmbedYouTubeUrl(rawUrl);
    }, [currentTopic]);

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
            setError(e?.message || 'Không thể tải chủ đề');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    // When topics load, if topicId is invalid or missing, navigate to the first topic
    useEffect(() => {
        if (topics.length > 0) {
            const numericId = Number(topicIdParam ?? 0);
            const exists = numericId > 0 && topics.some((t) => t.id === numericId);

            if (!exists) {
                router.replace(`/subject/${subjectId}/topic/${topics[0].id}`);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topics]);

    return (
        <div className="px-12 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.replace(`/subject/${subjectId}`)}
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

            <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
                {/* Left: Video player */}
                <div className="lg:col-span-2">
                    <div className="mt-4">
                        <div className="bg-black rounded-lg aspect-video overflow-hidden">
                            {videoUrl ? (
                                <iframe
                                    src={videoUrl}
                                    title={currentTopic?.title || 'Topic Video'}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex justify-center items-center h-full text-white">No video URL</div>
                            )}
                        </div>
                        <div className="mt-3">
                            <h2 className="font-semibold text-[#333] text-lg">{currentTopic?.title || 'Topic'}</h2>
                            {typeof currentTopic?.orderIndex === 'number' && (
                                <p className="text-gray-500 text-sm">Order #{currentTopic?.orderIndex}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Topics list */}
                <div>
                    <div className="bg-white shadow p-4 rounded-xl">
                        <h3 className="mb-3 font-semibold text-[#333] text-sm">Topics</h3>
                        <ul className="space-y-2 max-h-[480px] overflow-auto">
                            {topics.map((t, idx) => (
                                <li key={t.id}>
                                    <a
                                        href={`/subject/${subjectId}/topic/${t.id}`}
                                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded border ${
                                            t.id === currentTopic?.id
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex justify-center items-center border rounded-full w-5 h-5 text-xs">
                                                {String(
                                                    typeof t.orderIndex === 'number' ? t.orderIndex : idx + 1,
                                                ).padStart(2, '0')}
                                            </span>
                                            <span className="text-[#333] text-sm truncate">{t.title}</span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
