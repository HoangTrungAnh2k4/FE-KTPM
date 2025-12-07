'use client';

import { useEffect, useMemo, useState } from 'react';

import { getUserProfileApi, updateUserProfileApi } from '@/api/userApi';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI/dialog';
import { useUserStore, User } from '@/store/userStore';

type ProfileForm = {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    roles: string[];
};

const normalizeRole = (role?: string): User['role'] => {
    const val = (role || '').toUpperCase();
    if (val === 'ADMIN' || val === 'INSTRUCTOR') return val as User['role'];
    return 'STUDENT';
};

const ProfilePage: React.FC = () => {
    const { user, setUser } = useUserStore();
    const [form, setForm] = useState<ProfileForm>({ fullName: '', email: '', phone: '', age: '', roles: [] });
    const [loading, setLoading] = useState(!user);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const primaryRole = useMemo(() => normalizeRole(form.roles[0] || user?.role), [form.roles, user?.role]);

    const handleChange = (field: keyof ProfileForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        // Validate required fields
        if (!form.fullName.trim()) {
            setError('Họ và tên không được để trống');
            return;
        }

        if (!form.phone.trim()) {
            setError('Số điện thoại không được để trống');
            return;
        }

        if (!form.age.trim()) {
            setError('Tuổi không được để trống');
            return;
        }

        // Validate phone number format (Vietnamese phone numbers: 10 digits, starts with 0)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(form.phone.trim())) {
            setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có đúng 10 số)');
            return;
        }

        // Validate age
        const ageNum = parseInt(form.age, 10);
        if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
            setError('Tuổi phải là số từ 1 đến 150');
            return;
        }

        setSaving(true);

        try {
            const updateData: { fullName?: string; phone?: string; age?: number } = {};

            if (form.fullName.trim() !== user?.name) {
                updateData.fullName = form.fullName.trim();
            }
            if (form.phone.trim() !== user?.phone) {
                updateData.phone = form.phone.trim();
            }
            if (ageNum !== user?.age) {
                updateData.age = ageNum;
            }

            if (Object.keys(updateData).length === 0) {
                setMessage('Không có thay đổi nào để cập nhật');
                setSaving(false);
                return;
            }

            await updateUserProfileApi(updateData);

            setUser({
                ...user!,
                name: form.fullName.trim(),
                phone: form.phone.trim(),
                age: ageNum,
            });

            setMessage('Cập nhật thông tin thành công!');
            setTimeout(() => {
                setOpen(false);
                setMessage(null);
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto mt-10 p-6 max-w-xl text-gray-600 text-center">
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md mx-auto mt-10 p-6 rounded-lg max-w-xl">
            <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                    <h1 className="font-bold text-2xl">Thông tin tài khoản</h1>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button className="bg-primary hover:opacity-90 px-4 py-2 rounded font-semibold text-white">
                            Cập nhật
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="fullName">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    className="px-3 py-2 border rounded w-full"
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    placeholder="Nhập họ tên"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="phone">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    className="px-3 py-2 border rounded w-full"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="VD: 0912345678"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="age">
                                    Tuổi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="age"
                                    className="px-3 py-2 border rounded w-full"
                                    type="number"
                                    min="1"
                                    max="150"
                                    value={form.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    placeholder="Nhập tuổi"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            {message && <p className="text-green-600 text-sm">{message}</p>}

                            <DialogFooter>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-60 px-4 py-2 rounded w-full font-semibold text-white cursor-pointer"
                                    disabled={saving}
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                <div>
                    <span className="font-semibold">Tên người dùng: </span>
                    <span>{user?.name}</span>
                </div>
                <div>
                    <span className="font-semibold">Email: </span>
                    <span>{user?.email}</span>
                </div>
                <div>
                    <span className="font-semibold">Số điện thoại: </span>
                    <span>{user?.phone || 'Chưa cập nhật'}</span>
                </div>
                <div>
                    <span className="font-semibold">Tuổi: </span>
                    <span>{user?.age || 'Chưa cập nhật'}</span>
                </div>
                <div>
                    <span className="font-semibold">Vai trò: </span>
                    <span>{primaryRole}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
