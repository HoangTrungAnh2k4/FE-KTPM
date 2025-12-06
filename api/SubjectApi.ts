import axiosInstance from '@/utils/axiosInstance0';

// Public APIs
export async function getAllSubjectApi(page: number, size: number) {
    const res = await axiosInstance.get(`/api/subject?page=${page}&size=${size}`);
    return res.data;
}

export async function getSubjectByIdApi(id: number) {
    const res = await axiosInstance.get(`/api/subject/${id}`);
    return res.data;
}

export async function getSubjectTopicsApi(id: number) {
    const res = await axiosInstance.get(`/api/subject/${id}/topics`);
    return res.data;
}

// Admin APIs (require Authorization Bearer token via axiosInstance interceptor)
export async function createSubjectApi(payload: {
    code: string;
    name: string;
    level: string; // e.g. UNDERGRADUATE
    description?: string;
}) {
    const res = await axiosInstance.post(`/api/admin/subjects`, payload);
    return res.data;
}

export async function updateSubjectApi(id: number, payload: {
    code: string;
    name: string;
    level: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}) {
    const res = await axiosInstance.put(`/api/admin/subjects/${id}`, payload);
    return res.data;
}

export async function deleteSubjectApi(id: number) {
    const res = await axiosInstance.delete(`/api/admin/subjects/${id}`);
    return res.data;
}

export async function addTopicApi(subjectId: number, payload: {
    title: string;
    description?: string;
    orderIndex?: number;
}) {
    const res = await axiosInstance.post(`/api/admin/subjects/${subjectId}/topics`, payload);
    return res.data;
}

export async function updateTopicApi(topicId: number, payload: {
    title: string;
    description?: string;
    orderIndex?: number;
}) {
    const res = await axiosInstance.put(`/api/admin/subjects/topics/${topicId}`, payload);
    return res.data;
}

export async function deleteTopicApi(topicId: number) {
    const res = await axiosInstance.delete(`/api/admin/subjects/topics/${topicId}`);
    return res.data;
}
