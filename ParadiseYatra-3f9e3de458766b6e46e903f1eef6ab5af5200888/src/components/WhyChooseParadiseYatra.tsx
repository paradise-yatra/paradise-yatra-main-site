"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Add your Cloudinary links here
const IMAGES = [
    "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767784328/Office_Photo_1_ctv6zq.webp",
    // Placeholder 1 - Replace with your Cloudinary link
    "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767778705/Photo_Testimonial_5_gkvahk.webp",
    // Placeholder 2 - Replace with your Cloudinary link
    "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767849355/Office_Photo_3_yjqnf9.webp",
    // Placeholder 3 - Replace with your Cloudinary link
    "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767778704/Photo_Testimonial_1_tqhr0g.webp",
];

const WhyChooseParadiseYatra = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-white px-4 py-14 text-gray-900 md:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="bg-[#005beb] rounded-lg overflow-hidden flex flex-col md:flex-row relative">
                    {/* Left side - Image Slider */}
                    <div className="w-full md:w-1/2 p-4 md:p-6">
                        <div className="relative rounded-lg overflow-hidden aspect-[4/3] shadow-2xl bg-gray-900">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={IMAGES[currentImageIndex]}
                                        alt={`Travelers enjoying Paradise Yatra experience ${currentImageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={currentImageIndex === 0}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Overlay Badge */}
                            <div className="absolute bottom-4 left-4 bg-[#005beb] px-4 py-1.5 rounded-lg shadow-lg flex items-center gap-2 border border-black/10 z-10">
                                <span className="text-white font-bold text-sm tracking-tight">
                                    @paradiseyatra
                                </span>
                            </div>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                                {IMAGES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                                            ? "bg-white w-4"
                                            : "bg-white/50 hover:bg-white/80"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-8 pb-8 md:pb-0 md:pr-12 md:pl-4 text-center md:text-left relative">
                        {/* Vertical divider line */}
                        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-black/10"></div>

                        <div className="max-w-md mx-auto md:mx-0">
                            <h2 className="text-3xl md:!text-5xl !font-extrabold text-white leading-tight tracking-tighter mb-4">
                                Why Choose Paradise Yatra
                            </h2>
                            <p className="!text-base md:text-lg !text-white/80 !font-medium mb-6">
                                Handpicked experiences, trusted stays, and seamless journeys
                                crafted for unforgettable memories.
                            </p>
                            <Link href="/why-choose-us">
                                <button className="bg-black hover:bg-zinc-800 transition-colors text-white text-base font-bold px-8 py-3 rounded-lg inline-flex items-center justify-center cursor-pointer">
                                    Explore Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseParadiseYatra;
