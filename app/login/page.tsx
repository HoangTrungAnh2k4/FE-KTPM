'use client';

// use a plain img tag for the decorative side image to avoid next/image domain config
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginApi, sendCodeVerifyEmailApi, verifyEmailApi, forgotPasswordApi, resetPasswordApi } from '@/api/authApi';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useUserStore();

    // Single login mode for this demo
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Role is inferred from credentials; no manual selection
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [info, setInfo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!username || !password) {
            setError('Please enter all required information.');
            return;
        }

        setLoading(true);
        try {
            const res = await loginApi(username, password);

            if (res.status === 200) {
                localStorage.setItem('access_token', res.data.accessToken);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                document.cookie = `access_token=${res.data.accessToken}; path=/;`;
                document.cookie = `refresh_token=${res.data.refreshToken}; path=/;`;
                router.push('/');
            }
        } catch (err: any) {
            // Check if account is not active
            if (err.response?.data?.status === 2007) {
                setShowVerification(true);
                setError('Account is not activated. Please check your email for verification.');
                // Automatically send verification code
                try {
                    await sendCodeVerifyEmailApi(username);
                } catch (sendErr) {
                    console.error('Error sending verification code:', sendErr);
                }
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!verificationCode) {
            setError('Please enter the verification code.');
            return;
        }

        setVerifyLoading(true);
        setError(null);
        setInfo(null);
        try {
            const res = await verifyEmailApi(username, verificationCode);
            if (res.status === 200) {
                setError(null);
                setShowVerification(false);
                // Automatically login after successful verification
                const loginRes = await loginApi(username, password);
                if (loginRes.status === 200) {
                    localStorage.setItem('access_token', loginRes.data.accessToken);
                    localStorage.setItem('refresh_token', loginRes.data.refreshToken);
                    document.cookie = `access_token=${loginRes.data.accessToken}; path=/;`;
                    document.cookie = `refresh_token=${loginRes.data.refreshToken}; path=/;`;
                    router.push('/');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError(null);
        setInfo(null);
        try {
            await sendCodeVerifyEmailApi(username);
            setInfo('Verification code has been resent. Please check your email.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send code. Please try again.');
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        const targetEmail = forgotEmail || username;
        if (!targetEmail) {
            setError('Please enter your email.');
            return;
        }

        setForgotLoading(true);
        try {
            const res = await forgotPasswordApi(targetEmail);
            // Some backends return message within data; we just show a generic success to avoid coupling
            if (res) {
                setInfo('Password reset instructions have been sent to your email.');
                setShowReset(true);
                setResetEmail(targetEmail);
                setShowForgot(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        const targetEmail = resetEmail || username || forgotEmail;
        if (!targetEmail) {
            setError('Please enter your email.');
            return;
        }
        if (!otp) {
            setError('Please enter the verification code.');
            return;
        }
        if (!newPassword || !confirmPassword) {
            setError('Please enter your new password.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setResetLoading(true);
        try {
            const res = await resetPasswordApi(targetEmail, otp, newPassword);
            if (res) {
                setInfo('Password has been reset successfully. Please log in with your new password.');
                setShowReset(false);
                setShowForgot(false);
                setUsername(targetEmail);
                setPassword('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-white px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg border rounded-lg w-full max-w-6xl overflow-hidden">
                <div className="relative bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c62f1b4a5d2f7d4f6d9b2a9d9a1c3b8"
                        alt="students"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center p-10 md:px-16 md:py-12">
                    <div className="mx-auto w-full max-w-md">
                        <p className="mb-12 font-semibold text-neutral-600 text-3xl text-center">Welcome </p>

                        {showVerification ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleVerifyEmail();
                                }}
                                className="space-y-6 mt-6"
                            >
                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">
                                        Verification Code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter verification code from email"
                                            aria-label="verification code"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {info && <p className="text-green-600 text-sm">{info}</p>}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={verifyLoading}
                                        className="bg-teal-400 hover:bg-teal-500 disabled:opacity-50 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {verifyLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        className="text-teal-500 text-sm hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowVerification(false);
                                            setVerificationCode('');
                                            setError(null);
                                            setInfo(null);
                                        }}
                                        className="text-neutral-500 text-sm hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        ) : showReset ? (
                            <form onSubmit={handleResetPassword} className="space-y-6 mt-6">
                                <div>
                                    <p className="mb-4 text-neutral-600 text-sm text-center">
                                        Enter the verification code and your new password.
                                    </p>
                                    <label className="block font-medium text-neutral-700 text-sm">Email</label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter your email"
                                            aria-label="reset-email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">
                                        Verification Code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter the code from email"
                                            aria-label="otp"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">New Password</label>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter new password"
                                            aria-label="new-password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">
                                        Confirm Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Confirm new password"
                                            aria-label="confirm-password"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {info && <p className="text-green-600 text-sm">{info}</p>}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="bg-teal-400 hover:bg-teal-500 disabled:opacity-50 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm disabled:cursor-not-allowed"
                                    >
                                        {resetLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReset(false);
                                            setShowForgot(true);
                                            setError(null);
                                            setInfo(null);
                                        }}
                                        className="text-neutral-500 text-sm hover:underline"
                                    >
                                        Back to Request Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResetEmail('');
                                            setOtp('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setInfo(null);
                                            setError(null);
                                        }}
                                        className="text-teal-500 text-sm hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        ) : showForgot ? (
                            <form onSubmit={handleForgotPassword} className="space-y-6 mt-6">
                                <div>
                                    <p className="mb-4 text-neutral-600 text-sm text-center">
                                        Enter your email to receive password reset instructions.
                                    </p>
                                    <label className="block font-medium text-neutral-700 text-sm">Email</label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter your email"
                                            aria-label="forgot-email"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {info && <p className="text-green-600 text-sm">{info}</p>}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="bg-teal-400 hover:bg-teal-500 disabled:opacity-50 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Sending...' : 'Send Reset Email'}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgot(false);
                                            setError(null);
                                            setInfo(null);
                                        }}
                                        className="text-neutral-500 text-sm hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowReset(true);
                                                setResetEmail(forgotEmail || username);
                                                setError(null);
                                                setInfo(null);
                                            }}
                                            className="text-neutral-500 text-sm hover:underline"
                                        >
                                            I have a code
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForgotEmail('');
                                                setInfo(null);
                                                setError(null);
                                            }}
                                            className="text-teal-500 text-sm hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">User name</label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="px-4 py-3 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter your User name"
                                            aria-label="username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium text-neutral-700 text-sm">Password</label>
                                    <div className="relative mt-2">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="px-4 py-3 pr-10 border rounded-full outline-none w-full text-sm"
                                            placeholder="Enter your Password"
                                            aria-label="password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            className="top-1/2 right-3 absolute text-neutral-600 -translate-y-1/2"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role selection removed; role inferred from credentials */}

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                        />
                                        <span className="text-neutral-600">Remember me</span>
                                    </label>

                                    <button
                                        type="button"
                                        className="text-neutral-500 hover:underline"
                                        onClick={() => {
                                            setShowForgot(true);
                                            setError(null);
                                            setInfo(null);
                                            setForgotEmail(username);
                                        }}
                                    >
                                        Forgot Password ?
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {info && <p className="text-green-600 text-sm">{info}</p>}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-teal-400 hover:bg-teal-500 disabled:opacity-50 shadow-sm py-3 rounded-full w-full font-medium text-white text-sm disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>

                                <div>
                                    <p className="text-neutral-600 text-sm text-center">
                                        Don't have an account?{' '}
                                        <a href="/register" className="text-teal-500 hover:underline">
                                            Register
                                        </a>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
