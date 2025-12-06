import axiosInstance from '@/utils/axiosInstance0';

export async function getUserProfileApi() {
    const res = await axiosInstance.get('/users/me');
    return res.data;
}
