import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function loginApi(email: string, password: string) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/login`, {
        email,
        password,
    });

    return res.data;
}

export async function registerApi(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    age: number;
}) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/register`, data);

    return res.data;
}
