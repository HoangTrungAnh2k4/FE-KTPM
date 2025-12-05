import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/UI/accordion';
import { MdSlowMotionVideo } from 'react-icons/md';
import { use } from 'react';

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="py-6">
            <div className="gap-16 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                <Accordion type="multiple" className="space-y-3 w-full" defaultValue={['item-4']}>
                    {[
                        { id: 1, title: 'IIFE, Scope, Closure', count: 9 },
                        { id: 2, title: 'Hoisting, Strict Mode, Data Types', count: 7 },
                        { id: 3, title: 'This, Bind, Call, Apply', count: 5 },
                        { id: 4, title: 'Các bài thực hành cần nhiều', count: 3 },
                        { id: 5, title: 'Vừa giải trí vừa học', count: 3 },
                        { id: 6, title: 'Hoàn thành khóa học', count: 2 },
                    ].map((ch) => (
                        <AccordionItem value={`item-${ch.id}`} key={ch.id}>
                            <AccordionTrigger className="bg-[#f5f5f5] px-6 hover:no-underline cursor-pointer">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">
                                            {ch.id}. {ch.title}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground text-sm">{ch.count} bài học</div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="">
                                {ch.id === 4 ? (
                                    <div className="divide-y">
                                        <div className="flex items-center gap-3 px-6 py-4">
                                            <MdSlowMotionVideo size={22} color="#DC143C" />

                                            <Link
                                                href={`/subject/${id}/lesson/22`}
                                                className="flex-1 text-sm hover:underline"
                                            >
                                                22. Tìm hiểu về thư viện Redux
                                            </Link>
                                            <div className="text-muted-foreground text-sm">35:54</div>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-4">
                                            <MdSlowMotionVideo size={22} color="#DC143C" />
                                            <Link href={`/lesson/${id}/23`} className="flex-1 text-sm hover:underline">
                                                23. Tự code thư viện build UI
                                            </Link>
                                            <div className="text-muted-foreground text-sm">53:54</div>
                                        </div>
                                        <div className="flex items-center gap-3 px-6 py-4">
                                            <MdSlowMotionVideo size={22} color="#DC143C" />
                                            <Link href={`/lesson/${id}/24`} className="flex-1 text-sm hover:underline">
                                                24. Code ứng dụng Todo List
                                            </Link>
                                            <div className="text-muted-foreground text-sm">01:14:01</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-muted-foreground text-sm">{ch.count} bài học</div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <aside className="hidden lg:block">
                    <div className="top-24 sticky bg-white p-4 border rounded-lg">
                        <div className="flex justify-center items-center bg-[#f5f5f5] mb-4 rounded-md w-full h-44 text-muted-foreground text-sm">
                            Ảnh khoá học
                        </div>

                        <h3 className="mb-2 font-semibold text-lg">Tên khóa học mẫu</h3>
                        <div className="mb-3 text-muted-foreground text-sm">
                            Giảng viên: <span className="text-foreground">Nguyễn Văn A</span>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm">
                                <div className="font-medium">29 bài học</div>
                                <div className="text-muted-foreground text-xs">Thời lượng 09:00</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">4.8 ★</div>
                                <div className="text-muted-foreground text-xs">(1.2k học viên)</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-muted-foreground text-sm">Mức độ</div>
                            <div className="font-medium text-foreground">Trung cấp</div>
                        </div>

                        <button className="bg-rose-600 hover:bg-rose-700 mb-2 py-2 rounded-md w-full text-white">
                            Ghi danh ngay
                        </button>
                        <button className="py-2 border border-gray-200 rounded-md w-full text-sm">
                            Thêm vào danh sách
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
