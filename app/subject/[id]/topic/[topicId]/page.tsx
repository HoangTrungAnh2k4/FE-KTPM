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

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = useMemo(() => (params?.id ? Number(params.id) : 0), [params]);
  const topicId = useMemo(() => Number(params?.topicId ?? 0), [params]);

  const [subjectName, setSubjectName] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTopic = useMemo(() => topics.find((t) => t.id === topicId) || topics[0], [topics, topicId]);
  const videoUrl = currentTopic?.description || '';

  const fetchData = async () => {
    if (!subjectId) return;
    setLoading(true);
    setError(null);
    try {
      const subjectRes = await getSubjectByIdApi(subjectId);
      const subjectPayload = subjectRes && typeof subjectRes === 'object' && 'data' in (subjectRes as any)
        ? (subjectRes as any).data
        : subjectRes;
      setSubjectName(subjectPayload?.name || subjectPayload?.data?.name || '');

      const topicsRes = await getSubjectTopicsApi(subjectId);
      const topicsPayload = topicsRes && typeof topicsRes === 'object' && 'data' in (topicsRes as any)
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
      const exists = topics.some((t) => t.id === topicId);
      if (!exists) {
        router.replace(`/subject/${subjectId}/topic/${topics[0].id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  return (
    <div className="px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="border px-3 py-2 rounded-full text-sm flex items-center gap-2" aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-2xl text-[#333]">{subjectName || 'Subject'}</h1>
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Video player */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img src={`https://picsum.photos/seed/${subjectId}/800/600`} alt="cover" className="w-full h-64 object-cover" />
          </div>
          <div className="mt-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
                <div className="flex items-center justify-center text-white h-full">No video URL</div>
              )}
            </div>
            <div className="mt-3">
              <h2 className="font-semibold text-lg text-[#333]">{currentTopic?.title || 'Topic'}</h2>
              {typeof currentTopic?.orderIndex === 'number' && (
                <p className="text-sm text-gray-500">Order #{currentTopic?.orderIndex}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Topics list */}
        <div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm text-[#333] mb-3">Topics</h3>
            <ul className="space-y-2 max-h-[480px] overflow-auto">
              {topics.map((t, idx) => (
                <li key={t.id}>
                  <a
                    href={`/subject/${subjectId}/topic/${t.id}`}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded border ${t.id === currentTopic?.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border text-xs">
                        {String(typeof t.orderIndex === 'number' ? t.orderIndex : idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-[#333] truncate">{t.title}</span>
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
