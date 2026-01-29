"use client";

import type React from "react";

import { useState } from "react";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Successfully subscribed!");
        setEmail("");
      } else {
        setMessage("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 px-4 md:px-8 bg-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

      <div className="bg-gradient-to-br from-[#0052CC] to-[#0066FF] relative mx-auto max-w-6xl rounded-lg bg-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-sm border border-white/10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-[#E8F2FF]">
              Stay Updated
            </span>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="max-w-xl !text-[#F0F7FF] text-base md:text-lg leading-relaxed">
              Get travel inspiration, exclusive deals, and the latest updates delivered straight to your inbox.
            </p>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto md:min-w-[400px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-md focus:border-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-white px-6 py-3 font-bold text-[#0052CC] shadow-lg transition-colors hover:bg-[#E8F2FF] disabled:opacity-70"
              >
                {isLoading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-center text-sm font-medium ${message.includes("Successfully") ? "text-green-300" : "text-red-300"
                }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
