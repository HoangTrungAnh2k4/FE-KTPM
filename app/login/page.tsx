'use client';

// use a plain img tag for the decorative side image to avoid next/image domain config
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useUserStore();

    const [mode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
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
        setUser({ id: '1', email: `${username}@example.com`, name: username, role: 'user' });

        // Optionally persist to localStorage when remember checked
        if (remember) {
            try {
                localStorage.setItem('demo_user', JSON.stringify({ id: '1', name: username }));
            } catch {}
        }

        router.push('/');
    };

    return (
        <div className="flex justify-center items-center bg-white px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg w-full max-w-6xl overflow-hidden">
                <div className="relative bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c62f1b4a5d2f7d4f6d9b2a9d9a1c3b8"
                        alt="students"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center p-10 md:px-16 md:py-12">
                    <div className="mx-auto w-full max-w-md">
                        <p className="text-neutral-600 text-sm text-center">Welcome to lorem..!</p>

                        <div className="flex justify-center items-center mt-6">
                            <div className="bg-teal-200 p-1.5 rounded-full">
                                <div className="bg-teal-400 px-6 py-2 rounded-full text-white">Login</div>
                            </div>
                            <div className="ml-4 pt-2 text-neutral-400 text-sm">Register</div>
                        </div>

                        <p className="mt-6 text-neutral-500 text-sm">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">User name</label>
                                <div className="mt-2">
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="px-4 py-3 border border-teal-200 rounded-full outline-none focus:ring-2 focus:ring-teal-200 w-full text-sm"
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
                                        className="px-4 py-3 pr-10 border border-teal-200 rounded-full outline-none focus:ring-2 focus:ring-teal-200 w-full text-sm"
                                        placeholder="Enter your Password"
                                        aria-label="password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="top-1/2 right-3 absolute text-neutral-600 -translate-y-1/2"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />
                                    <span className="text-neutral-600">Remember me</span>
                                </label>

                                <button type="button" className="text-neutral-500 hover:underline">
                                    Forgot Password ?
                                </button>
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
