const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type Subject = {
  id: number;
  code: string;
  name: string;
  level?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export type Topic = {
  id: number;
  title: string;
  description?: string;
  orderIndex?: number;
};

export type Lecture = {
  id: number;
  title: string;
  duration?: string;
  preview?: boolean;
  videoUrl?: string;
};

export type UserPayload = {
  email: string;
  password: string;
  fullName: string;
  roles?: string[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`,
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      // For admin APIs requiring token, you can add Authorization header via init
      // credentials: "include" // if cookies are needed later
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // @ts-expect-error allow void
  return undefined;
}

// Admin Subjects
export const AdminSubjectsAPI = {
  list: (page = 0, size = 10) => request<{ data: Subject[]; page?: number; size?: number }>(`/api/subject?page=${page}&size=${size}`),
  create: (payload: Omit<Subject, "id">) => request(`/api/admin/subjects`, { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<Subject>) => request(`/api/admin/subjects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request(`/api/admin/subjects/${id}`, { method: "DELETE" }),
  getById: (id: number) => request<{ data: Subject }>(`/api/subject/${id}`),
  // Topics
  addTopic: (subjectId: number, payload: Omit<Topic, "id">) => request(`/api/admin/subjects/${subjectId}/topics`, { method: "POST", body: JSON.stringify(payload) }),
  updateTopic: (topicId: number, payload: Partial<Topic>) => request(`/api/admin/subjects/topics/${topicId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteTopic: (topicId: number) => request(`/api/admin/subjects/topics/${topicId}`, { method: "DELETE" }),
  listTopics: (subjectId: number) => request<{ data: Topic[] }>(`/api/subject/${subjectId}/topics`),
  // Lectures (assuming REST structure; adjust if backend differs)
  listLectures: (topicId: number) => request<{ data: Lecture[] }>(`/api/subject/topics/${topicId}/lectures`),
  addLecture: (topicId: number, payload: Omit<Lecture, "id">) => request(`/api/admin/subjects/topics/${topicId}/lectures`, { method: "POST", body: JSON.stringify(payload) }),
  updateLecture: (lectureId: number, payload: Partial<Lecture>) => request(`/api/admin/subjects/lectures/${lectureId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteLecture: (lectureId: number) => request(`/api/admin/subjects/lectures/${lectureId}`, { method: "DELETE" }),
};

// Admin Users
export const AdminUsersAPI = {
  createUser: (payload: UserPayload, token?: string) => request(`/admin/users`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }),
  toggleStatus: (userId: number, token?: string) => request(`/admin/users/${userId}/status`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }),
};

export const setAuthHeader = (token?: string): HeadersInit => (token ? { Authorization: `Bearer ${token}` } : {});
