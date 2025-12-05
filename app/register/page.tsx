'use client';

// use a plain img tag for the decorative side image to avoid next/image domain config
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerApi } from '@/api/authApi';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        age: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password || !formData.fullName || !formData.phone || !formData.age) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        const ageNumber = parseInt(formData.age);
        if (isNaN(ageNumber) || ageNumber < 1) {
            setError('Tuổi phải là số hợp lệ.');
            return;
        }

        try {
            setLoading(true);
            const response = await registerApi({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
                age: ageNumber,
            });

            if (response.status === 201 || response.status === 200) {
                router.push('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-white px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg border rounded-lg w-full max-w-6xl overflow-hidden">
                <div className="relative bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c62f1b4a5d2f7d4f6d9b2a9d9a1c3b8"
                        alt="students"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center p-10 md:px-16 md:py-12">
                    <div className="mx-auto w-full max-w-md">
                        <p className="mb-4 font-semibold text-neutral-600 text-3xl text-center">Create Account</p>

                        <form onSubmit={handleSubmit} className="space-y-2 mt-6">
                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Full Name</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your full name"
                                        aria-label="fullName"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Email</label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your email"
                                        aria-label="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Phone</label>
                                <div className="mt-2">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your phone number"
                                        aria-label="phone"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Age</label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your age"
                                        aria-label="age"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-neutral-700 text-sm">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="px-4 py-3 pr-10 border rounded-full outline-none w-full text-sm"
                                        placeholder="Enter your password"
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
                                    disabled={loading}
                                    className="bg-teal-400 hover:bg-teal-500 disabled:bg-teal-300 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm"
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
