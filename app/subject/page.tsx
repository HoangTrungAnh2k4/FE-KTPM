'use client';

import SubjectFilter from '../../components/SubjectFilter';
import CourseCard from '../../components/CourseCard';
import Link from 'next/link';
import { useEffect } from 'react';
import { getAllSubjectApi } from '@/api/SubjectApi';

const sample = [
    {
        id: 1,
        image: 'https://picsum.photos/seed/1/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        progress: '2% Completed',
    },
    {
        id: 2,
        image: 'https://picsum.photos/seed/2/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        progress: '0% Completed',
    },
    {
        id: 3,
        image: 'https://picsum.photos/seed/3/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        progress: '0% Completed',
    },
    {
        id: 4,
        image: 'https://picsum.photos/seed/4/800/600',
        category: 'Design',
        duration: '3 Month',
        title: 'AWS Certified solutions Architect',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
        progress: '0% Completed',
    },
];

export default function SubjectPage() {
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getAllSubjectApi(1, 10);
                console.log('Fetched subjects:', response);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    return (
        <div className="px-12 py-4">
            <SubjectFilter total={957} />

            <div className="flex justify-between items-center mt-8">
                <p className="font-semibold text-[#333] text-xl">Software</p>
                <Link href="#" className="font-medium text-primary hover:underline">
                    See all
                </Link>
            </div>

            <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-2">
                {sample.map((c) => (
                    <CourseCard
                        key={c.id}
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
