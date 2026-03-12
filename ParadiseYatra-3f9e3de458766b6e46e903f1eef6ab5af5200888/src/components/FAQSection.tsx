"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <div className="mb-3 md:mb-4">
            <button
                onClick={onClick}
                className={`w-full text-left p-4 md:p-5 rounded-[6px] flex items-center justify-between transition-all border border-[#dfe1df] cursor-pointer ${isOpen ? "bg-white" : "bg-white hover:bg-slate-50/50"
                    }`}
            >
                <span className={`font-bold transition-colors text-[15px] md:text-base pr-4 ${isOpen ? "text-[#155dfc]" : "text-[#000945]"
                    }`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${isOpen ? "border-[#155dfc] text-[#155dfc] rotate-180" : "border-slate-200 text-slate-500"
                    }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 py-4 text-slate-600 text-[14px] md:text-[15px] leading-relaxed font-medium border-x border-b border-[#dfe1df] rounded-b-[6px] -mt-2 bg-white">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface FAQSectionProps {
    destination?: string;
    tourType?: string;
    faqs?: { question: string; answer: string }[];
}

const defaultFaqs = [
    {
        question: "How long can I stay?",
        answer: "We offer flexible tour durations ranging from 2-day weekend getaways to 15-day comprehensive expeditions. You can customize your stay based on your preferences and travel goals."
    },
    {
        question: "Can I book from this site?",
        answer: "Yes, you can browse all our curated packages and initiate a booking directly through our secure platform. Our travel experts will then reach out to finalize the details and booking formalities."
    },
    {
        question: "Are the prices the same?",
        answer: "We guarantee the best market rates. The prices shown are transparent with no hidden charges, though seasonal variations and dynamic pricing may apply based on your confirmed travel dates."
    },
    {
        question: "What's included?",
        answer: "Most packages include handpicked hotel stays, private cab transfers, daily breakfast, and dedicated 24/7 local expert support throughout your journey to ensure a hassle-free experience."
    },
    {
        question: "Need to cancel?",
        answer: "We offer a flexible cancellation policy. Cancellations made 30 days prior to travel are eligible for a full refund (minus processing fees). Please check specific package terms for details."
    }
];

export default function FAQSection({ destination, tourType, faqs: faqsOverride }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [faqs, setFaqs] = useState(defaultFaqs);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (faqsOverride && faqsOverride.length > 0) {
            setFaqs(faqsOverride);
            setOpenIndex(null);
            setLoaded(true);
            return;
        }

        if (destination && tourType) {
            fetchDestinationFAQs();
        } else {
            setFaqs(defaultFaqs);
            setOpenIndex(null);
            setLoaded(true);
        }
    }, [destination, tourType, faqsOverride]);

    const fetchDestinationFAQs = async () => {
        try {
            // URL params usually have dashes (e.g., andaman-and-nicobar).
            // The database stores them with spaces as they come from the 'state' field in packages.
            const normalizedDestination = destination!.replace(/-/g, ' ');

            const response = await fetch(
                `/api/destination-faqs?destination=${encodeURIComponent(normalizedDestination)}&tourType=${tourType}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.destinationFaq && data.destinationFaq.isActive && data.destinationFaq.faqs?.length > 0) {
                    const sortedFaqs = data.destinationFaq.faqs
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((f: any) => ({ question: f.question, answer: f.answer }));
                    setFaqs(sortedFaqs);
                } else {
                    // Fallback to default if no specific FAQs exist for this destination
                    setFaqs(defaultFaqs);
                }
            } else {
                setFaqs(defaultFaqs);
            }
        } catch (err) {
            console.error('Error fetching destination FAQs:', err);
            setFaqs(defaultFaqs);
        } finally {
            setLoaded(true);
        }
    };

    return (
        <section className="bg-white py-12 md:py-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                {/* Left Column: FAQ Content */}
                <div className="w-full lg:w-1/2">
                    <h2 className="!text-[24px] md:!text-[36px] !font-bold text-[#000945] !leading-[1.1] mb-8 tracking-tight">
                        Got Questions? We Have<br />Got Answers
                    </h2>

                    <div className="max-w-xl">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="hidden lg:block w-full lg:w-1/2 relative h-[539.2px] rounded-[6px] overflow-hidden">
                    <Image
                        src="/Destination Pages/Faq/Image.webp"
                        alt="Paradise Yatra Travel"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-transparent" />
                </div>
            </div>
        </section>
    );
}
