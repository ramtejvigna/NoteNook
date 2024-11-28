import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Send, KeyRound, FileText, User, Calendar, Mail } from "lucide-react";
import axios from "axios";

interface FormData {
    fullName: string;
    dateOfBirth: string;
    email: string;
}

interface AuthResponse {
    token: string;
    userId: string;
}

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        dateOfBirth: "",
        email: "",
    });
    const [otp, setOtp] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("https://notenook.onrender.com/auth/signup", formData);
            setOtpSent(true);
            setError("");
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        }

        setLoading(false);
    };

    const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post<AuthResponse>("https://notenook.onrender.com/auth/verify-otp", {
                email: formData.email,
                otp,
            });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token || '');
            localStorage.setItem('userId', response.data.userId);
            navigate("/notes");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-2 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="inline-block p-4 bg-white rounded-full shadow-lg">
                        <FileText size={32} className="text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden transform transition-all duration-300">
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                            Welcome to NoteNook
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            {otpSent ? "Enter the verification code" : "Create your account"}
                        </p>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md animate-shake">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {!otpSent ? (
                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-1px] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Send Verification Code</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Verification Code
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-1px] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <KeyRound size={18} />
                                                <span>Verify & Continue</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-gray-600 text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                to="signin"
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
