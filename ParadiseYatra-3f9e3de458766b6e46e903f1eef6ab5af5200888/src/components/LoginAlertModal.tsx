"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mail, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { API_CONFIG } from "@/config/api";

interface LoginAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: "pink" | "blue";
}

const LoginAlertModal = ({ isOpen, onClose, theme = "blue" }: LoginAlertModalProps) => {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLoginRedirect = () => {
        router.push("/login");
        onClose();
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            toast.error("Google login failed. No credential received.");
            return;
        }

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
                toast.success("Logged in successfully!");
                onClose();
            } else {
                toast.error(data.message || "Google Login failed.");
            }
        } catch (err) {
            toast.error("Connection error. Please try again.");
            console.error("Google login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const headingText = "Making a list? Log in to add your saves to a trip you can edit or share.";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] p-0 border-0 shadow-3xl bg-white overflow-visible !rounded-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -right-2 -top-2 sm:-right-3 sm:-top-3 p-2 bg-white rounded-lg shadow-lg hover:bg-slate-50 transition-all z-[110] border border-slate-100 group cursor-pointer"
                >
                    <X className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>

                <div className="flex flex-col items-center px-6 sm:px-10 pt-10 pb-10">
                    {/* Logo Section */}
                    <div className="mb-6 relative h-14 w-14 flex items-center justify-center bg-blue-50 rounded-xl border border-blue-100">
                        <Image
                            src="/favicon.png"
                            alt="Paradise Yatra Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                    </div>

                    {/* Text Section */}
                    <h2 className="!text-lg sm:!text-xl !font-black !text-slate-900 text-center leading-[1.4] mb-8 tracking-tight px-2">
                        {headingText}
                    </h2>

                    {/* Buttons Section */}
                    <div className="flex flex-col gap-3 w-full">
                        {/* Google Login Button - Look-alike design */}
                        <div className="relative w-full h-11 group">
                            {/* The "Look-alike" container that matches email button style */}
                            <div className="absolute inset-0 w-full h-full rounded-lg border border-slate-300 bg-white group-hover:bg-slate-50 flex items-center justify-center gap-3 px-6 transition-all group-active:scale-[0.98] pointer-events-none shadow-none">
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                ) : (
                                    <FcGoogle className="h-5 w-5" />
                                )}
                                <span className="text-sm font-bold text-slate-700">
                                    {loading ? "Processing..." : "Continue with Google"}
                                </span>
                            </div>

                            {/* The hidden real Google button - scaled to cover the entire container */}
                            <div className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer flex justify-center items-center">
                                <div className="scale-[5] origin-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Google Login failed")}
                                        useOneTap={false}
                                        theme="outline"
                                        shape="rectangular"
                                        width="320px"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleLoginRedirect}
                            variant="outline"
                            className="w-full h-11 rounded-lg border border-slate-300 !text-slate-700 bg-white hover:bg-slate-50 !font-bold flex items-center justify-center gap-3 px-6 transition-all !text-sm active:scale-[0.98] !shadow-none"
                        >
                            <Mail className="h-5 w-5 text-slate-500" />
                            Continue with email
                        </Button>
                    </div>

                    {/* Footer Text */}
                    <div className="mt-8 text-center max-w-[300px]">
                        <p className="!text-[10px] !text-slate-400 !leading-relaxed !font-bold uppercase tracking-wider">
                            By proceeding, you agree to our <span className="!text-blue-600 underline cursor-pointer hover:!text-blue-700">Terms of Use</span> and confirm you have read our <span className="!text-blue-600 underline cursor-pointer hover:!text-blue-700">Privacy and Cookie Statement</span>.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginAlertModal;
