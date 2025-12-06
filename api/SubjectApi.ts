import axiosInstance from '@/utils/axiosInstance0';

export async function getAllSubjectApi(page: number, size: number) {
    const res = await axiosInstance.get(`/api/subject?page=${page}&size=${size}`);
    return res.data;
}
