import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';

interface Params {
    params: { id: string; lessonId: string };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string; lessonID: string }> }) {
    const { id: subjectId, lessonID } = await params;

    const lessons = [
        { id: '22', title: 'Tìm hiểu về thư viện Redux', duration: '35:54' },
        { id: '23', title: 'Tự code thư viện build UI', duration: '53:54' },
        { id: '24', title: 'Code ứng dụng Todo List', duration: '01:14:01' },
    ];

    const current = lessons.find((l) => l.id === lessonID) || lessons[0];

    // sample public video for demo; replace with real video URL from data
    const sampleSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

    return (
        <div className="py-6">
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-[1fr_360px]">
                <main>
                    <VideoPlayer src={sampleSrc} title={current.title} />

                    <div className="mt-6">
                        <h2 className="mb-2 font-medium text-md">Mô tả bài học</h2>
                        <p className="text-muted-foreground text-sm">Nội dung bài học chi tiết sẽ hiển thị ở đây.</p>
                    </div>
                </main>

                <aside className="hidden lg:block">
                    <div className="top-24 sticky bg-white shadow p-4 border rounded-lg">
                        <h3 className="mb-3 font-semibold">Danh sách bài</h3>
                        <div className="divide-y">
                            {lessons.map((l) => (
                                <Link
                                    key={l.id}
                                    href={`/subject/${subjectId}/lesson/${l.id}`}
                                    className={`flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded ${
                                        l.id === current.id ? 'bg-gray-100 font-medium' : ''
                                    }`}
                                >
                                    <div className="text-sm">
                                        {l.id}. {l.title}
                                    </div>
                                    <div className="text-muted-foreground text-xs">{l.duration}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
