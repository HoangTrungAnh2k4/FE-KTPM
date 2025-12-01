'use client';

import React, { useState } from 'react';

type Lesson = {
    id: string;
    title: string;
    duration: string;
    previewable: boolean;
    completed?: boolean;
};

type Section = {
    id: string;
    title: string;
    lessons: Lesson[];
};

export default function CourseDetail({ params }: { params: { id: string } }) {
    // Mock data — replace with real fetch if needed
    const [sections] = useState<Section[]>([
        {
            id: 's1',
            title: 'Lessons With Video Content',
            lessons: [
                {
                    id: 'l1',
                    title: 'Lessons with video content',
                    duration: '12:30',
                    previewable: true,
                    completed: true,
                },
                {
                    id: 'l2',
                    title: 'Lessons with video content',
                    duration: '10:05',
                    previewable: true,
                    completed: true,
                },
                {
                    id: 'l3',
                    title: 'Lessons with video content',
                    duration: '2:25',
                    previewable: true,
                    completed: false,
                },
            ],
        },
        {
            id: 's2',
            title: 'Lessons With Video Content',
            lessons: Array.from({ length: 5 }).map((_, i) => ({
                id: `s2l${i}`,
                title: 'Lessons With Video Content',
                duration: '45 Mins',
                previewable: false,
            })),
        },
        {
            id: 's3',
            title: 'Lessons With Video Content',
            lessons: Array.from({ length: 5 }).map((_, i) => ({
                id: `s3l${i}`,
                title: 'Lessons With Video Content',
                duration: '45 Mins',
                previewable: false,
            })),
        },
        {
            id: 's4',
            title: 'Lessons With Video Content',
            lessons: Array.from({ length: 5 }).map((_, i) => ({
                id: `s4l${i}`,
                title: 'Lessons With Video Content',
                duration: '45 Mins',
                previewable: false,
            })),
        },
    ]);

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    function toggleSection(i: number) {
        setOpenIndex((prev) => (prev === i ? null : i));
    }

    return (
        <div className="subject-page" style={{ padding: 16 }}>
            <h1 style={{ marginBottom: 12 }}>Subject: {params.id}</h1>

            <div style={{ display: 'grid', gap: 12 }}>
                {sections.map((section, i) => (
                    <div
                        key={section.id}
                        style={{
                            borderRadius: 8,
                            overflow: 'hidden',
                            boxShadow: '0 2px 0 rgba(0,0,0,0.9)',
                            background: '#fff',
                        }}
                    >
                        <button
                            onClick={() => toggleSection(i)}
                            aria-expanded={openIndex === i}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 20px',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div
                                    style={{
                                        transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform .2s',
                                    }}
                                >
                                    ▾
                                </div>
                                <div style={{ fontWeight: 700 }}>{section.title}</div>
                            </div>

                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: '#666' }}>
                                <div>{section.lessons.length} Lessons</div>
                                <div>45 Mins</div>
                            </div>
                        </button>

                        {openIndex === i && (
                            <div style={{ padding: 16, borderTop: '1px solid #eee' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                                    {section.lessons.map((lesson) => (
                                        <li
                                            key={lesson.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 6,
                                                        background: '#f4f4f6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    📄
                                                </div>
                                                <div>{lesson.title}</div>
                                            </div>

                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                {lesson.previewable && (
                                                    <button
                                                        onClick={() => alert(`Preview ${lesson.title}`)}
                                                        style={{
                                                            background: '#0078d4',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            borderRadius: 8,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Preview
                                                    </button>
                                                )}

                                                <div style={{ color: '#444' }}>{lesson.duration}</div>

                                                <div style={{ width: 18 }}>
                                                    {lesson.completed ? '✔️' : lesson.previewable ? '' : '🔒'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
