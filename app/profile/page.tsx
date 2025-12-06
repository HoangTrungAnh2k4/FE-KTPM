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

    useEffect(() => {
        // Seed form from store if available to avoid blank UI while fetching fresh data.
        if (user) {
            setForm((prev) => ({
                fullName: prev.fullName || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || '',
                age: prev.age || '',
                roles: prev.roles.length ? prev.roles : [user.role],
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUserProfileApi();
                setForm({
                    fullName: data.fullName || data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    age: data.age ? String(data.age) : '',
                    roles: data.roles || (data.role ? [data.role] : []),
                });
                setUser({
                    id: String(data.id ?? ''),
                    email: data.email || '',
                    name: data.fullName || data.name || '',
                    role: normalizeRole((data.roles && data.roles[0]) || data.role),
                    avatar: data.avatar || '',
                });
            } catch (err) {
                setError('Không thể tải thông tin tài khoản.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [setUser]);

    const handleChange = (field: keyof ProfileForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);
        try {
            const payload = {
                fullName: form.fullName || undefined,
                phone: form.phone || undefined,
                age: form.age ? Number(form.age) : undefined,
            };

            const data = await updateUserProfileApi(payload);

            setMessage('Cập nhật thành công.');
            setUser({
                id: String(data.id ?? user?.id ?? ''),
                email: data.email || form.email,
                name: data.fullName || data.name || form.fullName,
                role: normalizeRole((data.roles && data.roles[0]) || data.role || primaryRole),
                avatar: data.avatar || user?.avatar || '',
            });
            setOpen(false);
        } catch (err) {
            setError('Cập nhật thất bại. Vui lòng thử lại.');
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
                                    Họ và tên
                                </label>
                                <input
                                    id="fullName"
                                    className="px-3 py-2 border rounded w-full"
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    placeholder="Nhập họ tên"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="bg-gray-100 px-3 py-2 border rounded w-full text-gray-600"
                                    type="email"
                                    value={form.email}
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="phone">
                                    Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    className="px-3 py-2 border rounded w-full"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm" htmlFor="age">
                                    Tuổi
                                </label>
                                <input
                                    id="age"
                                    className="px-3 py-2 border rounded w-full"
                                    type="number"
                                    min="0"
                                    value={form.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    placeholder="Nhập tuổi"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-sm">Vai trò</label>
                                <p className="bg-gray-100 px-3 py-2 border rounded text-gray-700">{primaryRole}</p>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            {message && <p className="text-green-600 text-sm">{message}</p>}

                            <DialogFooter>
                                <button
                                    type="submit"
                                    className="bg-primary disabled:opacity-60 px-4 py-2 rounded w-full font-semibold text-white"
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
                    <span>{form.fullName || form.email}</span>
                </div>
                <div>
                    <span className="font-semibold">Email: </span>
                    <span>{form.email}</span>
                </div>
                <div>
                    <span className="font-semibold">Số điện thoại: </span>
                    <span>{form.phone || 'Chưa cập nhật'}</span>
                </div>
                <div>
                    <span className="font-semibold">Tuổi: </span>
                    <span>{form.age || 'Chưa cập nhật'}</span>
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
