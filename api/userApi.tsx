import axiosInstance from '@/utils/axiosInstance';

export async function getUserProfileApi() {
    const res = await axiosInstance.get('/users/me');
    return res.data;
}
