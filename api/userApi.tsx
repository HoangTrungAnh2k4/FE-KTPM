import axiosInstance from '@/utils/axiosInstance0';

export async function getUserProfileApi() {
    const res = await axiosInstance.get('/users/me');
    return res.data;
}

export async function getListUsersApi({ page, size }: { page: number; size: number }) {
    const res = await axiosInstance.get(`/admin/users?page=${page}&size=${size}`);
    return res.data;
}

export async function createAdminAccount(data: {
    email: string;
    password: string;
    fullName: string;
    roles: string[];
    phone: string;
    age: number;
}) {
    const res = await axiosInstance.post(`/admin/users`, data);
    return res.data;
}

export async function updateUserStatusApi(userId: number) {
    const res = await axiosInstance.put(`/admin/users/${userId}/status`);
    return res.data;
}

export async function updateUserRolesApi(userId: number, roles: string[]) {
    const res = await axiosInstance.post(`/admin/users/${userId}/roles`, { roles });
    return res.data;
}

export async function deleteUserApi(userId: number) {
    const res = await axiosInstance.delete(`/admin/users/${userId}`);
    return res.data;
}
