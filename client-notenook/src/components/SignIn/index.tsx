import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ArrowRight, SendHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

interface ApiResponse {
    error?: string;
    token?: string;
    user: {
        id: string;
        [key: string]: any; // Adjust as per user object structure
    };
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
    >
        <span>{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-80">
            <X size={16} />
        </button>
    </motion.div>
);

interface ToastState {
    message: string;
    type: 'error' | 'success';
}

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const navigate = useNavigate();

    const showToast = (message: string, type: 'error' | 'success' = 'error'): void => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const startCountdown = (): void => {
        setCountdown(600);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://notenook.onrender.com/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) throw new Error(data.error);

            setStep(2);
            startCountdown();
            showToast('Verification code sent successfully', 'success');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>('https://notenook.onrender.com/auth/verify-signin', { email, otp });

            const data = response.data;

            if (data.error) throw new Error(data.error);

            showToast('Sign in successful! Redirecting...', 'success');
            localStorage.setItem('token', data.token || '');
            localStorage.setItem('userId', data.user.id);
            navigate("/notes");
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mx-4"
            >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">
                            {step === 1 ? 'Sign in to your account' : 'Enter the verification code'}
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="email-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleEmailSubmit}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                                        />
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleOtpSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-gray-600"
                                    >
                                        We've sent a verification code to
                                        <div className="font-medium text-gray-800 mt-1">{email}</div>
                                    </motion.div>
                                    {countdown > 0 && (
                                        <motion.div
                                            className="text-sm text-gray-500 mt-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            Code expires in {formatTime(countdown)}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                                        }
                                        className="w-full h-12 pl-10 pr-4 text-center tracking-wider rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                        maxLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                                        />
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Verify Code <SendHorizontal className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>

                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Use a different email
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SignIn;