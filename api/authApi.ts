import axios from 'axios';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_0;

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

export async function sendCodeVerifyEmailApi(email: string) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/verify/resend?email=${email}`);
    return res.data;
}

export async function verifyEmailApi(email: string, code: string) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/verify?email=${email}&code=${code}`);
    return res.data;
}

export async function forgotPasswordApi(email: string) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/me/password/forgot?email=${email}`);
    return res.data;
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string) {
    const res = await axios.post(`${API_BACKEND_URL}/auth/me/password/reset`, {
        email,
        otp,
        newPassword,
    });
    return res.data;
}
