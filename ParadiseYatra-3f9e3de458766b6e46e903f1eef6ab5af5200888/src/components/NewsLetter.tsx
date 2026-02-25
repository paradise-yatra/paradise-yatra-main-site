"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setStatus("error");
            setMessage("Please enter your email address to continue.");
            setTimeout(() => setStatus("idle"), 3000);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus("error");
            setMessage("Please enter a valid email address.");
            setTimeout(() => setStatus("idle"), 3000);
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: 'footer-newsletter-form' }),
            });

            if (response.status === 201) {
                // New subscription
                setStatus("success");
                setMessage("Thank you! Your journey begins soon.");
                setEmail("");
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 4000);
            } else if (response.status === 200) {
                // Already subscribed
                setStatus("duplicate");
                setMessage("You're already part of our travel family! 🌍");
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 4000);
            } else {
                setStatus("error");
                setMessage("Subscription failed. Please try again.");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (error) {
            setStatus("error");
            setMessage("An error occurred. Please try again.");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="bg-white px-4 py-8 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Newsletter Card - Thematic Blue #005beb */}
                <div className="bg-black rounded-[6px] overflow-hidden flex flex-col md:flex-row relative shadow-[0_10px_40px_rgba(0,0,0,0.1)] items-stretch">

                    {/* Left Part: Image */}
                    <div className="w-full md:w-[40%] h-[200px] md:h-auto relative shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop"
                            alt="Escape to Paradise"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Darker overlay to blend with blue better */}
                        <div className="absolute inset-0 bg-blue-900/10"></div>
                    </div>

                    {/* Right Part: Content - Switched to white text for blue background */}
                    <div className="w-full md:w-[60%] p-6 md:p-10 flex flex-col justify-center bg-black">

                        <h2 className="text-xl md:text-2xl font-unbounded !font-bold text-white leading-tight mb-3 tracking-tight">
                            Stay Updated
                        </h2>

                        <p className="text-white/80 mb-6 leading-relaxed text-xs md:text-sm max-w-md">
                            Exclusive itineraries and boutique travel offers delivered directly to your inbox every Sunday. <span className="font-semibold text-white">Unsubscribe Anytime.</span>
                        </p>

                        <form onSubmit={handleSubmit} noValidate className="relative max-w-sm">
                            <div className={`relative flex items-center border-b ${status === 'error' ? 'border-red-400' : 'border-white/30 focus-within:border-white'} transition-colors duration-500 pb-1.5`}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    disabled={status === 'loading' || status === 'success'}
                                    style={{ color: 'white', caretColor: 'white', WebkitTextFillColor: 'white' }}
                                    className="w-full bg-transparent placeholder-white/40 focus:outline-none disabled:opacity-50 pr-10 text-sm font-medium"
                                />

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="absolute right-0 text-white hover:text-white/70 transition-all duration-300 p-1 cursor-pointer disabled:cursor-default"
                                    aria-label="Subscribe"
                                >
                                    {(status === 'idle' || status === 'duplicate') && <ArrowRight className="w-4 h-4 stroke-[2]" />}
                                    {status === 'loading' && (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    )}
                                    {status === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
                                    {status === 'error' && <ArrowRight className="w-4 h-4 stroke-[2]" />}
                                </button>
                            </div>

                            <div
                                className={`absolute top-full left-0 mt-2 text-[10px] font-medium transition-all duration-500 ${(status === 'success' || status === 'error' || status === 'duplicate') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
                                    } ${status === 'success' ? 'text-emerald-400' :
                                        status === 'duplicate' ? 'text-amber-400' :
                                            'text-red-400'
                                    }`}
                            >
                                {message}
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
}
