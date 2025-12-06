'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AdminSubjectsAPI, type Topic, type Lecture } from '@/lib/api';

type UILecture = { id: number; title: string; duration: string; preview?: boolean; videoUrl?: string };
type UITopic = { id: number; name: string; lectures: UILecture[] };

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = useMemo(() => (params?.id ? String(params.id) : ''), [params]);

  const [topics, setTopics] = useState<UITopic[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);

  // Form state
  const [topicName, setTopicName] = useState('');
  const [lectures, setLectures] = useState<Array<UILecture>>([
    { id: 1, title: '', duration: '', preview: false, videoUrl: '' },
  ]);

  const loadTopics = async () => {
    if (!courseId) return;
    try {
      const res = await AdminSubjectsAPI.listTopics(Number(courseId));
      const items = (res?.data || []).map((t: Topic) => ({ id: t.id, name: t.title || t['name'] || 'Topic', lectures: [] }));
      setTopics(items);
    } catch (e) {
      // ignore for now
    }
  };
  const loadLecturesForTopic = async (topicId: number) => {
    try {
      const res = await AdminSubjectsAPI.listLectures(topicId);
      const lectures = (res?.data || []).map((l: Lecture) => ({ id: l.id, title: l.title, duration: l.duration || '', preview: !!l.preview, videoUrl: l.videoUrl || '' }));
      setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, lectures } : t)));
    } catch (e) {
      // silently ignore if endpoint not available
    }
  };

  useEffect(() => {
    loadTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const resetForm = () => {
    setTopicName('');
    setLectures([{ id: 1, title: '', duration: '', preview: false }]);
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
    setTopicName(t.name);
    setLectures(t.lectures.map((l) => ({ ...l })));
    setShowCreate(true);
  };

  const addLectureRow = () => {
    setLectures((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map((l) => l.id)) + 1, title: '', duration: '', preview: false, videoUrl: '' },
    ]);
  };

  const removeLectureRow = (id: number) => {
    setLectures((prev) => prev.filter((l) => l.id !== id));
  };

  const addLectureForTopic = async (topicId: number) => {
    const title = prompt('Lecture title');
    if (!title) return;
    try {
      await AdminSubjectsAPI.addLecture(topicId, { title, duration: '00:00', preview: false, videoUrl: '' });
      await loadLecturesForTopic(topicId);
    } catch (e: any) {
      alert(e?.message || 'Add lecture failed');
    }
  };

  const deleteLectureForTopic = async (topicId: number, lectureId: number) => {
    if (!confirm('Delete this lecture?')) return;
    try {
      await AdminSubjectsAPI.deleteLecture(lectureId);
      await loadLecturesForTopic(topicId);
    } catch (e: any) {
      alert(e?.message || 'Delete lecture failed');
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!topicName.trim()) return alert('Please enter topic name');

    try {
      if (editingTopicId == null) {
        await AdminSubjectsAPI.addTopic(Number(courseId), { title: topicName.trim(), description: '', orderIndex: topics.length + 1 });
      } else {
        await AdminSubjectsAPI.updateTopic(editingTopicId, { title: topicName.trim(), description: '' });
        // Sync lectures changes to backend (create/update/delete by diff)
        // Simple approach: upsert current rows (with title) and ignore delete if no endpoint provided
        const current = lectures.filter((l) => l.title.trim());
        for (const l of current) {
          if (!l.id || l.id < 0) {
            await AdminSubjectsAPI.addLecture(editingTopicId, { title: l.title, duration: l.duration, preview: l.preview, videoUrl: l.videoUrl });
          } else {
            await AdminSubjectsAPI.updateLecture(l.id, { title: l.title, duration: l.duration, preview: l.preview, videoUrl: l.videoUrl });
          }
        }
      }
      await loadTopics();
    } catch (e: any) {
      alert(e?.message || 'Save topic failed');
      return;
    }

    setShowCreate(false);
    setEditingTopicId(null);
    resetForm();
  };

  const deleteTopic = async (id: number) => {
    if (!confirm('Xóa topic này?')) return;
    try {
      await AdminSubjectsAPI.deleteTopic(id);
      await loadTopics();
    } catch (e: any) {
      alert(e?.message || 'Delete topic failed');
    }
  };

  return (
    <div className="px-12 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-2xl text-[#333]">Course #{courseId} - Topics</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="border px-4 py-2 rounded-full text-sm">Back</button>
          <button onClick={openCreate} className="bg-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm">Create topic</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Topics list */}
        <div className="lg:col-span-2 space-y-3">
          {topics.map((t) => (
            <details key={t.id} className="bg-white shadow-sm rounded-md" onToggle={(e) => { const open = (e.target as HTMLDetailsElement).open; if (open) loadLecturesForTopic(t.id); }}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.name}</span>
                  <span className="text-xs text-gray-500">{t.lectures.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.preventDefault(); openEdit(t.id); }} className="text-xs border px-2 py-1 rounded">Edit</button>
                  <button onClick={(e) => { e.preventDefault(); deleteTopic(t.id); }} className="text-xs border px-2 py-1 rounded">Delete</button>
                </div>
              </summary>
              <div className="px-6 pb-2">
                <button onClick={() => addLectureForTopic(t.id)} className="text-xs border px-2 py-1 rounded">+ Add lecture</button>
              </div>
              <ul className="px-6 pb-4 space-y-2">
                {t.lectures.map((l) => (
                  <li key={l.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{l.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">{l.duration}</span>
                      <button onClick={() => deleteLectureForTopic(t.id, l.id)} className="text-xs border px-2 py-1 rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* Right: Course info panel (placeholder like design) */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img src="https://picsum.photos/seed/999/640/360" alt="course" className="w-full h-40 object-cover" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">This Course included</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Money Back Guarantee</li>
              <li>Access on all devices</li>
              <li>Certificate of completion</li>
              <li>24 Modules</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Training 5 or more people</h3>
            <p className="text-sm text-gray-600">Group plans with team analytics and centralized billing.</p>
          </div>
        </div>
      </div>

      {/* Create/Update Topic Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-[760px] max-w-full p-6">
            <h3 className="text-xl font-semibold text-[#333] mb-4">{editingTopicId == null ? 'Create topic' : 'Update topic'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Section name</label>
                <input
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-sm"
                  placeholder="Section name"
                />
              </div>

              <div className="border rounded-md">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-sm font-medium">Lectures</span>
                  <button onClick={addLectureRow} className="text-sm border px-3 py-1 rounded">+ Add lecture</button>
                </div>

                <div className="p-3 space-y-2">
                  {lectures.map((l) => (
                    <div key={l.id} className="grid grid-cols-12 items-center gap-2">
                      <input
                        value={l.title}
                        onChange={(e) => setLectures((prev) => prev.map((x) => x.id === l.id ? { ...x, title: e.target.value } : x))}
                        className="col-span-7 border rounded-md px-3 py-2 text-sm"
                        placeholder="Lecture name"
                      />
                      <input
                        value={l.duration}
                        onChange={(e) => setLectures((prev) => prev.map((x) => x.id === l.id ? { ...x, duration: e.target.value } : x))}
                        className="col-span-3 border rounded-md px-3 py-2 text-sm"
                        placeholder="Duration 10:00"
                      />
                      <input
                        value={l.videoUrl ?? ''}
                        onChange={(e) => setLectures((prev) => prev.map((x) => x.id === l.id ? { ...x, videoUrl: e.target.value } : x))}
                        className="col-span-4 border rounded-md px-3 py-2 text-sm"
                        placeholder="Video URL (e.g. https://...)"
                      />
                      <button onClick={() => removeLectureRow(l.id)} className="col-span-2 border px-3 py-2 rounded text-sm">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowCreate(false); setEditingTopicId(null); resetForm(); }} className="border px-4 py-2 rounded-full text-sm">Cancel</button>
              <button onClick={handleCreateOrUpdate} className="bg-[#4ECDC4] text-white px-5 py-2 rounded-full text-sm">{editingTopicId == null ? 'Create' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
