'use client';

// use a plain img tag for the decorative side image to avoid next/image domain config
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useUserStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        // Fake login: set a demo user and redirect.
        setUser({ id: '1', email: `${username}@gmail.com`, name: username, role: username });

        router.push('/');
    };

    return (
        <div className="flex justify-center items-center bg-white px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg border rounded-lg w-full max-w-6xl h-[500px] overflow-hidden">
                <div className="relative bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c62f1b4a5d2f7d4f6d9b2a9d9a1c3b8"
                        alt="students"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center p-10 md:px-16 md:py-12">
                    <div className="mx-auto w-full max-w-md">
                        <p className="mb-12 font-semibold text-neutral-600 text-3xl text-center">Welcome </p>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">User name</label>
                                <div className="mt-2">
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your User name"
                                        aria-label="username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="px-4 py-3 pr-10 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your Password"
                                        aria-label="password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="top-1/2 right-3 absolute text-neutral-600 -translate-y-1/2"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="bg-teal-400 hover:bg-teal-500 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
