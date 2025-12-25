import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

interface Props {
    onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: Props) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (mode === "login") {
                const res = await API.post("/auth/login", { email, password });
                localStorage.setItem("token", res.data.token);

                toast.success("Logged in successfully");
            } else {
                const res = await API.post("/auth/signup", {
                    name,
                    email,
                    password
                });
                localStorage.setItem("token", res.data.token);

                toast.success("Account created successfully");
            }

            onAuthSuccess();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Authentication failed"
            );

            // ❌ DO NOT reset inputs
            // setEmail("");
            // setPassword("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-out">

                <div className="flex flex-col items-center gap-4 mb-8">
                    {/* Logo + App Name (INLINE) */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Finance AI logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Finance AI
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-sm text-center max-w-sm">
                        Smart expense tracking with AI-powered insights
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex mb-8 bg-gray-100 dark:bg-slate-700/50 rounded-lg p-1">
                    <button
                        onClick={() => setMode("login")}
                        className={`cursor-pointer flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ease-out ${mode === "login"
                            ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`cursor-pointer flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ease-out ${mode === "signup"
                            ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    {mode === "signup" && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700
                                text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700
                            text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out"
                            placeholder="name@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700
                            text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 ease-out mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            mode === "login" ? "Sign In" : "Create Account"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}