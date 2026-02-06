"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { API_CONFIG } from "@/config/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 } as const
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                router.push("/");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row font-plus-jakarta-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Left Decorative Section - Desktop */}
            <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden bg-blue-950">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                        alt="Paradise travel destination"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 via-blue-900/40 to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="relative z-10 w-full max-w-xl px-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >

                        <h1 className="!text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
                            Your Journey to <br />
                            <span className="text-blue-400">Paradise</span> Starts Here.
                        </h1>

                        <p className="!text-blue-50/90 !text-xl leading-relaxed mb-10 max-w-lg font-medium">
                            Join thousands of travelers who have found their perfect escape through Paradise Yatra.
                        </p>

                    </motion.div>
                </div>

                <div className="absolute top-12 left-12">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-xl shadow-2xl flex items-center justify-center p-2">
                            <Image src="/favicon.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">Paradise Yatra</span>
                    </div>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-[45%] flex flex-col items-center min-h-screen relative bg-white pb-12 lg:pb-0">
                {/* Responsive Navigation Bar */}
                <div className="w-full px-6 py-8 hidden lg:flex items-center justify-end">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group "
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Website</span>
                    </Link>
                </div>

                <div className="w-full max-w-md px-6 my-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="flex flex-col items-center mb-2">
                            <Link href="/" className="flex flex-col items-center gap-3 group">
                                <div className="h-16 w-16 flex items-center justify-center group-hover:bg-blue-100 transition-all duration-300 block sm:hidden">
                                    <Image src="/favicon.png" alt="Logo" width={48} height={48} className="object-contain " />
                                </div>

                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center">
                            <h2 className="!text-3xl sm:!text-4xl !font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                            <p className="text-sm sm:text-base text-slate-500 font-medium">Please enter your details to sign in</p>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3"
                            >
                                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-[10px] font-bold">!</span>
                                </div>
                                <div className="text-sm font-medium text-red-800">{error}</div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Password</label>
                                    <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20 transition-all"
                                    />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                                </label>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/5 hover:shadow-blue-600/20 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In to Account</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span>
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center w-full">
                                <div className="w-full flex justify-center transform-gpu transition-all hover:scale-[1.01]">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse: CredentialResponse) => {
                                            if (!credentialResponse.credential) return;
                                            setLoading(true);
                                            try {
                                                const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.AUTH.GOOGLE_LOGIN), {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ idToken: credentialResponse.credential }),
                                                });
                                                const data = await response.json();
                                                if (response.ok) {
                                                    login(data.token, data.user);
                                                    router.push("/");
                                                } else {
                                                    setError(data.message || "Google Login failed.");
                                                }
                                            } catch (err) {
                                                setError("Connection error. Please try again.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        onError={() => setError("Google Login failed.")}
                                        useOneTap={false}
                                        theme="outline"
                                        shape="rectangular"
                                        text="signin_with"
                                        width="100%"
                                        logo_alignment="center"
                                    />
                                </div>
                            </div>

                            <p className="text-center text-sm font-medium text-slate-500 pb-4">
                                New to Paradise Yatra?{" "}
                                <Link href="/signup" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Copy */}
                <div className="mt-auto py-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">
                    &copy; {new Date().getFullYear()} Paradise Yatra &bull; Privacy &bull; Terms
                </div>
            </div>
        </div>
    );
}

