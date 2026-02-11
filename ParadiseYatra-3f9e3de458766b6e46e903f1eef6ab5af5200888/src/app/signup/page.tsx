"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, Sparkles, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { API_CONFIG } from "@/config/api";

const signupBackground = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_CONFIG.getFullUrl('/api/auth/send-otp'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpStep(true);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");

    try {
      const response = await fetch(API_CONFIG.getFullUrl('/api/auth/register'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        router.push("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setOtpLoading(false);
    }
  };

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
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] flex font-plus-jakarta-sans overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Left Decorative Section - Desktop */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={signupBackground}
            alt="Paradise travel destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/80 via-emerald-900/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 w-full max-w-xl px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >


            <h1 className="!text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              Unlock Your <br />
              <span className="text-emerald-400">Paradise</span> Journey.
            </h1>

            <p className="!text-emerald-50/90 !text-xl leading-relaxed mb-10 max-w-lg font-medium">
              Join our community of world travelers and get exclusive access to hand-picked deals and itineraries.
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

      {/* Right Form Side */}
      <div className="w-full lg:w-[45%] flex flex-col items-center min-h-screen relative bg-white pb-12 lg:pb-0">
        {/* Responsive Navigation Bar */}
        <div className="w-full px-6 py-8 hidden lg:flex items-center justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all group"
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
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-2 ">
              <Link href="/" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 flex items-center justify-center p-3 group-hover:bg-emerald-100 transition-all duration-300">
                  <Image src="/favicon.png" alt="Logo" width={48} height={48} className="object-contain block sm:hidden" />
                </div>

              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <h2 className="!text-3xl sm:!text-4xl !font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">Join us to start your adventure</p>
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

            {!showOtpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-white transition-all text-sm text-slate-900 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-3 ml-1 py-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600/20 transition-all"
                  />
                  <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-relaxed cursor-pointer group hover:text-slate-700 transition-colors">
                    I agree to the <Link href="/terms" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">Privacy Policy</Link>
                  </label>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/5 hover:shadow-emerald-600/20 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Verification</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSignup}
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 mb-6 font-bold text-2xl animate-bounce">
                    <Mail className="h-8 w-8" />
                  </div>
                  <h3 className="!text-2xl font-black text-slate-900 mb-2">Check your email</h3>
                  <p className="text-sm font-medium text-slate-500">
                    We've sent a code to <span className="text-slate-900 font-bold">{formData.email}</span>
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block text-center">Enter 6-digit code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full px-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 focus:bg-white transition-all text-4xl text-center tracking-[0.5em] font-black text-slate-900 placeholder:opacity-20"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={otpLoading || otp.length !== 6}
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                  >
                    {otpLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Create Account</span>
                        <CheckCircle2 className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpStep(false)}
                    className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Go back and edit details
                  </button>
                </motion.div>
              </motion.form>
            )}

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or join with</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <div className="flex justify-center w-full">
                <div className="w-full flex justify-center transform-gpu transition-all hover:scale-[1.01]">
                  <GoogleLogin
                    onSuccess={async (credentialResponse: CredentialResponse) => {
                      if (!credentialResponse.credential) return;
                      setLoading(true);
                      try {
                        const response = await fetch(API_CONFIG.getFullUrl('/api/auth/google-login'), {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            idToken: credentialResponse.credential,
                            phone: formData.phone
                          }),
                        });
                        const data = await response.json();
                        if (response.ok) {
                          login(data.token, data.user);
                          router.push("/");
                        } else {
                          setError(data.message || "Google registration failed.");
                        }
                      } catch (err) {
                        setError("Connection error. Please try again.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={() => setError("Google registration failed.")}
                    useOneTap={false}
                    theme="outline"
                    shape="rectangular"
                    text="signup_with"
                    width="100%"
                    logo_alignment="center"
                  />
                </div>
              </div>

              <p className="text-center text-sm font-medium text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                  Login here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-10 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">
          © {new Date().getFullYear()} Paradise Yatra &bull; Privacy &bull; Terms
        </div>
      </div>
    </div>
  );
}
