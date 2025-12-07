import Image from 'next/image';
import Link from 'next/link';

type Props = {
    id: number;
    image: string;
    category: string;
    duration: string;
    title: string;
    description: string;
    progress?: string;
};

export default function CourseCard({ id, image, category, duration, title, description, progress }: Props) {
    return (
        <div className="bg-card shadow-xl p-4 rounded-2xl">
            <div className="bg-white rounded-xl overflow-hidden">
                <Image src={image} alt={title} width={600} height={260} className="w-full h-36 object-cover" />
            </div>

            <div className="mt-4 px-2">
                <div className="flex justify-between items-center text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <span>{category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>{duration}</span>
                    </div>
                </div>

                <h3 className="mt-3 font-semibold text-foreground text-xl">{title}</h3>

                <p className="mt-3 text-muted-foreground text-sm">{description}</p>

                <div className="flex justify-center items-center mt-6">
                    <Link
                        href={`/subject/${id}`}
                        className="bg-primary hover:bg-[#35aba3] px-4 py-2 rounded-full w-full font-medium text-white text-sm text-center"
                    >
                        Watch Lecture
                    </Link>
                </div>
            </div>
        </div>
    );
}
