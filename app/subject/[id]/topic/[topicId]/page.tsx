'use client';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

// Demo data: typically fetched by course/topic id
const demoCourse = {
  title: 'Introduction to Product Design',
  cover: 'https://picsum.photos/seed/555/1200/600',
};

const demoTopics: Array<{ id: number; name: string; lectures: { id: number; title: string; duration: string; videoUrl?: string }[] }> = [
  {
    id: 1,
    name: 'Section 01 - Welcome',
    lectures: [
      { id: 1, title: '01 - Welcome!', duration: '3:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: '02 - What is product design?', duration: '11:05', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: '03 - Product design process overview', duration: '7:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },
];

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = useMemo(() => (params?.id ? String(params.id) : ''), [params]);
  const topicId = useMemo(() => Number(params?.topicId ?? 0), [params]);

  const topic = demoTopics.find((t) => t.id === topicId) ?? demoTopics[0];
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  const currentLecture = topic.lectures[currentLectureIndex];

  return (
    <div className="px-12 py-8">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-2xl text-[#333]">{demoCourse.title}</h1>
        <button onClick={() => router.back()} className="border px-4 py-2 rounded-full text-sm">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Video player */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img src={demoCourse.cover} alt="cover" className="w-full h-64 object-cover" />
          </div>
          <div className="mt-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {currentLecture?.videoUrl ? (
                <iframe
                  src={currentLecture.videoUrl}
                  title={currentLecture.title}
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
              <h2 className="font-semibold text-lg text-[#333]">{currentLecture?.title}</h2>
              <p className="text-sm text-gray-500">{currentLecture?.duration}</p>
            </div>
          </div>
        </div>

        {/* Right: Lectures list */}
        <div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm text-[#333] mb-3">{topic.name}</h3>
            <ul className="space-y-2 max-h-[480px] overflow-auto">
              {topic.lectures.map((l, idx) => (
                <li key={l.id}>
                  <button
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded border ${idx === currentLectureIndex ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setCurrentLectureIndex(idx)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border text-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-[#333] truncate">{l.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{l.duration}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
