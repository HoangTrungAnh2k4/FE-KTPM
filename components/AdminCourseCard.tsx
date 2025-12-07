import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './UI/dropdown-menu';

type Props = {
    id: number;
    image: string;
    category: string;
    duration: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    assign?: string;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onViewDetail: (id: number) => void;
    onAssignInstructor: (id: number) => void;
};

export default function AdminCourseCard({
    id,
    image,
    category,
    duration,
    title,
    description,
    price,
    originalPrice,
    assign,
    onDelete,
    onEdit,
    onViewDetail,
    onAssignInstructor,
}: Props) {
    return (
        <div
            className="relative bg-white shadow-md hover:shadow-lg p-4 rounded-xl transition-shadow cursor-pointer"
            onClick={() => onViewDetail(id)}
        >
            {/* Course Image */}
            <div className="rounded-lg overflow-hidden">
                <Image src={image} alt={title} width={400} height={240} className="w-full h-48 object-cover" />
            </div>

            {/* Course Info */}
            <div className="mt-4">
                <div className="flex justify-between items-center text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
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

                    <div className="flex items-center gap-1">
                        <span>{duration}</span>
                    </div>
                </div>

                <h3 className="mt-3 font-semibold text-[#333] text-lg">{title}</h3>

                <p className="mt-2 text-gray-500 text-xs">
                    <span className="font-medium">Assign:</span> {assign}
                </p>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-baseline gap-1">
                        <p
                            className="mt-2 max-w-40 text-gray-600 text-sm leading-relaxed"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {description}
                        </p>
                    </div>
                    {/* Three dots menu */}
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-600"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-white shadow-lg border rounded-lg w-48"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(id);
                                    }}
                                    className="hover:bg-gray-100 px-4 py-2 rounded cursor-pointer"
                                >
                                    Edit Course
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(id);
                                    }}
                                    className="hover:bg-red-50 px-4 py-2 rounded text-red-600 cursor-pointer"
                                >
                                    Delete Course
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
