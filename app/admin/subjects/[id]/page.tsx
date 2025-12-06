'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  getSubjectByIdApi,
  getSubjectTopicsApi,
  addTopicApi,
  updateTopicApi,
  deleteTopicApi,
} from '@/api/SubjectApi';

type Topic = {
  id: number;
  title: string;
  description?: string;
  orderIndex?: number;
};

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = useMemo(() => (params?.id ? Number(params.id) : 0), [params]);

  const [subjectName, setSubjectName] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Delete confirmation modal state
  const [deleteTopicId, setDeleteTopicId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | ''>('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setOrderIndex('');
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
    setEditingTopicId(null);
  };

  const openEdit = (id: number) => {
    const t = topics.find((x) => x.id === id);
    if (!t) return;
    setEditingTopicId(id);
    setTitle(t.title || '');
    setDescription(t.description || '');
    setOrderIndex(typeof t.orderIndex === 'number' ? t.orderIndex : '');
    setShowCreate(true);
  };

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
      setError(e?.message || 'Không thể tải dữ liệu môn học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const handleCreateOrUpdate = async () => {
    if (!title.trim()) return alert('Vui lòng nhập tiêu đề chủ đề');
    try {
      if (editingTopicId == null) {
        const res = await addTopicApi(subjectId, {
          title: title.trim(),
          description: description.trim() || undefined,
          orderIndex: typeof orderIndex === 'number' ? orderIndex : undefined,
        });
        const created: Topic = res?.data || res;
        if (created?.id) setTopics((prev) => [created, ...prev]); else fetchData();
      } else {
        const res = await updateTopicApi(editingTopicId, {
          title: title.trim(),
          description: description.trim() || undefined,
          orderIndex: typeof orderIndex === 'number' ? orderIndex : undefined,
        });
        const updated: Topic = res?.data || res;
        setTopics((prev) => prev.map((t) => (t.id === editingTopicId ? { ...t, ...updated } : t)));
      }
      setShowCreate(false);
      setEditingTopicId(null);
      resetForm();
    } catch (e: any) {
      alert(e?.message || 'Lưu chủ đề thất bại');
    }
  };

  const requestDeleteTopic = (id: number) => {
    setDeleteTopicId(id);
    setDeleteReason('');
  };

  const confirmDeleteTopic = async () => {
    if (deleteTopicId == null) return;
    try {
      await deleteTopicApi(deleteTopicId);
      setTopics((prev) => prev.filter((t) => t.id !== deleteTopicId));
      setDeleteTopicId(null);
      setDeleteReason('');
    } catch (e: any) {
      setError(e?.message || 'Xóa chủ đề thất bại');
    }
  };

  return (
    <div className="px-12 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="border px-3 py-2 rounded-full text-sm flex items-center gap-2" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-2xl text-[#333]">{ subjectName ? subjectName : ''}</h1>
        </div>
          
          <button onClick={openCreate} className="bg-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm">Create topic</button>
        
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Topics list */}
        <div className="lg:col-span-2 space-y-3">
          {topics.map((t) => (
            <details key={t.id} className="bg-white shadow-sm rounded-md">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.title}</span>
                  {typeof t.orderIndex === 'number' && (
                    <span className="text-xs text-gray-500">Order #{t.orderIndex}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.preventDefault(); openEdit(t.id); }} className="text-xs border px-2 py-1 rounded-full">Edit</button>
                  <button onClick={(e) => { e.preventDefault(); requestDeleteTopic(t.id); }} className="text-xs border px-2 py-1 rounded-full text-red-600">Delete</button>
                </div>
              </summary>
              {t.description && (
                <div className="px-6 pb-4 text-sm text-gray-700">
                  {t.description}
                </div>
              )}
            </details>
          ))}
        </div>

        {/* Right: Info panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img src={`https://picsum.photos/seed/${subjectId}/640/360`} alt="subject" className="w-full h-40 object-cover" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Subject info</h3>
            <p className="text-sm text-gray-600">Use the left panel to manage topics for this subject.</p>
          </div>
        </div>
      </div>

      {/* Create/Update Topic Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-[560px] max-w-full p-6">
            <h3 className="text-xl font-semibold text-[#333] mb-4">{editingTopicId == null ? 'Create topic' : 'Update topic'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-sm"
                  placeholder="Microservices"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-sm"
                  placeholder="Kiến trúc Microservices"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Order Index</label>
                <input
                  value={orderIndex}
                  onChange={(e) => {
                    const v = e.target.value;
                    const num = Number(v);
                    setOrderIndex(!v ? '' : Number.isFinite(num) ? num : '');
                  }}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-sm"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowCreate(false); setEditingTopicId(null); resetForm(); }} className="border px-4 py-2 rounded-full text-sm">Cancel</button>
              <button onClick={handleCreateOrUpdate} className="bg-[#4ECDC4] text-white px-5 py-2 rounded-full text-sm">{editingTopicId == null ? 'Create' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Topic confirmation modal */}
      {deleteTopicId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-[520px] max-w-full p-6">
            <h3 className="text-xl font-semibold text-[#333] mb-2">Xóa chủ đề</h3>
            <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa chủ đề này?</p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setDeleteTopicId(null); setDeleteReason(''); }} className="border px-4 py-2 rounded-full text-sm">Hủy</button>
              <button onClick={confirmDeleteTopic} className="bg-red-500 text-white px-5 py-2 rounded-full text-sm">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
