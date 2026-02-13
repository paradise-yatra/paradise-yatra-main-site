"use client";

import { Search, Mountain, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SkeletonHero } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import SearchSuggestions from "./SearchSuggestions";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const placeholderTexts = [
    "Where do you want to go?",
    "Explore Bali...",
    "Discover Europe...",
    "Visit Himachal Pradesh...",
    "Adventure in Ladakh...",
    "Relax in Goa...",
    "Experience Kerala...",
    "Journey to Kashmir...",
    "Trek to Manali...",
    "Escape to Maldives...",
    "Wander in Switzerland...",
    "Road trip to Spiti Valley..."
  ];

  // Typing animation effect
  useEffect(() => {
    const currentText = placeholderTexts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && typingText === currentText) {
        // Finished typing, pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typingText === "") {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      } else if (isDeleting) {
        // Delete one character
        setTypingText(currentText.substring(0, typingText.length - 1));
      } else {
        // Type one character
        setTypingText(currentText.substring(0, typingText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingText, currentTextIndex, isDeleting, placeholderTexts]);

  const handleSearchSelect = (suggestion: {
    slug: string;
    category?: string;
    type?: string;
  }) => {
    setSearchQuery("");
    setIsSearchOpen(false);

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    if (
      suggestion.category === "destination" ||
      suggestion.type === "destination"
    ) {
      router.push(`/destinations/${suggestion.slug}`);
    } else if (suggestion.category === "holiday-type") {
      router.push(`/holiday-types/${suggestion.slug}`);
    } else if (suggestion.category === "fixed-departure") {
      router.push(`/fixed-departures/${suggestion.slug}`);
    } else {
      router.push(`/package/${suggestion.slug}`);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col font-plus-jakarta-sans">
      {/* Hero background with video or image fallback */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full bg-black object-cover object-center md:object-[center_20%]"
          src="https://res.cloudinary.com/dwuwpxu0y/video/upload/v1769447728/216103_medium_zlmh3v.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/20"></div>
      </div>

      {/* Hero content */}
      <main className="relative z-10 flex flex-col flex-1 items-center justify-end pb-0 text-center min-h-[90dvh] md:min-h-[110vh] pt-100 md:pt-86">
        <div className="mb-auto"></div>
        <h1 className="max-w-4xl !text-2xl !font-unbounded !font-bold leading-tight tracking-tight md:!text-4xl  text-white px-4">
          Because Travel Should Feel Effortless
        </h1>
        <p className="mt-3 max-w-3xl font-medium !text-white/90 text-md md:text-lg px-4">
          Discover amazing destinations and create unforgettable memories.
        </p>
        <div className="mt-6 w-full relative">
          {/* Search bar overlapping hero and panel */}
          <div className="relative z-20 mx-auto max-w-3xl px-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-3 rounded-full bg-white px-6 py-3 text-gray-800 border-4 border-blue-500/90 shadow-[0_0_40px_10px_rgba(59,130,246,0.45)] hover:shadow-[0_0_50px_15px_rgba(59,130,246,0.55)] transition-all duration-300 group"
            >
              <Search className="w-6 h-6 text-[#212B40] group-hover:scale-110 transition-transform duration-300" />
              <div className="flex-1 text-left">
                <span className="!text-sm text-[#212B40] font-semibold opacity-80">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full">
                <span className="text-xs font-bold text-blue-600">Search Destinations</span>
              </div>
            </button>

            <SearchSuggestions
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSelect={handleSearchSelect}
              isOpen={isSearchOpen}
              onClose={handleSearchClose}
              variant="hero"
            />
          </div>

          {/* Integrated hero lower panel */}
          <div
            className="-mt-8 w-full rounded-none border-white px-4 pb-24 pt-20 shadow-2xl border-2 border-dashed border-b-0 backdrop-blur-sm md:px-8 md:pb-32 md:pt-24 sm:rounded-t-[80px] sm:rounded-b-none rounded-t-2xl"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1769064117/1329_qnfgyd.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              boxShadow: '0 -20px 50px 0px rgba(0, 0, 0, 0.65)'
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="text-center !font-bold text-xl md:!text-3xl text-white mb-2">
                Pick your travel style
              </h2>

              <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                {/* Spiritual */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 md:gap-3 px-2 py-4 md:px-6 md:py-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push("/coming-soon")}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-blue-600 p-3 md:p-4">
                    <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <g>
                        <rect x="17" y="43.4583" width="38" height="9.3003" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <rect x="17" y="52.7586" width="38" height="10.6997" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="43.5 38.436 51.124 38.436 51.124 43.458 21.129 43.458 21.129 38.436 28.178 38.436" />
                        <rect x="27" y="24.4079" width="18" height="4.0504" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="25 32.613 25 28.487 47 28.487 47 32.613" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="37.517 32.947 50 32.947 50 37.969 42.63 37.969" />
                        <rect x="29.0923" y="20.3439" width="13.8425" height="4.0504" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="25.311 42.651 36.062 31.899 46.814 42.651" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="29.485 37.969 22.587 37.969 22.587 32.947 34.524 32.947" />
                        <polygon fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="41.5 63.458 30.5 63.458 30.5 56.458 34.125 56.458 41.5 56.458 41.5 63.458" />
                        <polyline fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="34.062 63.458 34.062 56.458 38.062 56.458 38.062 63.458" />
                        <circle cx="36.0625" cy="12.3806" r="5" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <line x1="36.0625" x2="36.0625" y1="17.6693" y2="20.0553" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </g>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg md:text-xl font-bold !text-white tracking-wide relative group-hover:text-blue-200 transition-colors duration-300">
                      Spiritual
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                </div>

                {/* Hill Escapes */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 md:gap-3 px-2 py-4 md:px-6 md:py-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push("/coming-soon")}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-blue-600 p-3 md:p-4">
                    <Mountain className="w-full h-full text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg md:text-xl font-bold !text-white tracking-wide relative group-hover:text-blue-200 transition-colors duration-300 text-center">
                      Hill Escapes
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                </div>

                {/* Seasonal */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 md:gap-3 px-2 py-4 md:px-6 md:py-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push("/coming-soon")}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-blue-600 p-3 md:p-4">
                    <Sparkles className="w-full h-full text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg md:text-xl font-bold !text-white tracking-wide relative group-hover:text-blue-200 transition-colors duration-300">
                      Seasonal
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                </div>

                {/* Adventure */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 md:gap-3 px-2 py-4 md:px-6 md:py-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push("/coming-soon")}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-blue-600 p-3 md:p-4">
                    <img
                      src="https://res.cloudinary.com/dwuwpxu0y/image/upload/v1769084210/Trekking_Icon_c3g7uw.png"
                      alt="Adventure"
                      className="w-full h-full object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg md:text-xl font-bold !text-white tracking-wide relative group-hover:text-blue-200 transition-colors duration-300">
                      Adventure
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;