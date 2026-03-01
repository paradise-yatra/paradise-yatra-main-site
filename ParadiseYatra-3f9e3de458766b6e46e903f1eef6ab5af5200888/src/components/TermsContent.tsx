'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Copyright
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsContent() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-white font-plus-jakarta-sans pb-20 policy-content">
            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
                <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
                    <div className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
                        Terms & <span className="text-[#000945]">Conditions</span>
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
                    <Image
                        src="/Legal/Terms%20And%20Conditions/Hero%20Image.png"
                        alt="Paradise Yatra Terms and Conditions"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Centered Hub (Hidden on mobile) */}
                <div className="hidden md:block max-w-6xl w-full mx-auto px-4 md:px-8 relative z-30">
                    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
                        <Card className="bg-white rounded-[6px] shadow-none border border-slate-100 overflow-hidden w-full md:h-[150px] flex items-center">
                            <CardContent className="p-0 md:p-6 w-full h-full flex flex-col justify-center items-center">
                                {/* Desktop Heading */}
                                <h1 className="hidden md:block !text-xl md:!text-[44px] !font-black text-slate-800 mb-4 text-center font-plus-jakarta-sans tracking-tight leading-tight">
                                    Terms & <span className="text-[#000945]">Conditions</span>
                                </h1>

                                <div className="hidden md:flex flex-nowrap items-center justify-center w-full px-2 md:px-4">
                                    <span className="text-slate-500 font-medium text-[15px] tracking-tight">Last updated: <span className="text-[#000945] font-bold">2nd March 2026</span></span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
                <div className="relative items-start">

                    {/* Content Sections */}
                    <div className="w-full">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Section 1: Introduction */}
                            <motion.section variants={itemVariants} id="introduction" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="text-[24px] md:text-[36px] tracking-tight">Introduction</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        These Terms and Conditions, along with our <Link href="/privacy-policy" className="text-[#000945] underline hover:text-[#155dfc] font-semibold transition-colors duration-200">Privacy Policy</Link> or other terms ("Terms") constitute a binding
                                        agreement by and between <strong style={{ color: '#000945' }}>PARADISE YATRA</strong> ("Website Owner", "we", "us", or "our") and you ("you" or "your") and relate to your use of our website, goods or services (collectively, "Services").
                                    </p>
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        By using our website and availing the Services, you acknowledge that you have read, understood, and accepted these Terms. We reserve the right to modify these Terms at any time without prior notice. It remains your responsibility to periodically review these Terms to stay informed of any updates.
                                    </p>
                                    <p className="italic" style={{ color: '#000945', fontWeight: 500 }}>
                                        The use of this website or availing of our Services is strictly subject to the following terms of use.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 2: Registration */}
                            <motion.section variants={itemVariants} id="registration" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="text-[24px] md:text-[36px] tracking-tight">Registration & Account Use</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        To access and use our premium Services, you may be required to register an account. You agree to provide true, accurate, current, and complete information to us during and after the registration process.
                                    </p>
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        You shall be solely responsible for maintaining the confidentiality of your account credentials and for all acts done through the use of your registered account. Any unauthorized use must be immediately reported to our support team.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 3: Warranties */}
                            <motion.section variants={itemVariants} id="warranties" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="text-[24px] md:text-[36px] tracking-tight">Warranties & Accuracy</h2>
                                </div>
                                <div className="space-y-6 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials offered on this website or through the Services for any specific purpose.
                                    </p>
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law. Your use of our Services and the website is solely at your own risk and discretion.
                                    </p>

                                    <div className="flex flex-col gap-6 mt-6">
                                        <div>
                                            <h2 style={{ color: '#000945', fontWeight: 700 }} className="mb-2 flex items-center gap-2">
                                                Intellectual Property
                                            </h2>
                                            <p className="text-[15px]" style={{ color: '#000945', fontWeight: 500 }}>
                                                The contents of the Website and the Services are proprietary to Us. You do not have authority to claim any intellectual property rights, title, or interest in its contents.
                                            </p>
                                        </div>
                                        <div>
                                            <h2 style={{ color: '#000945', fontWeight: 700 }} className="mb-2 flex items-center gap-2">
                                                Unauthorized Use
                                            </h2>
                                            <p className="text-[15px]" style={{ color: '#000945', fontWeight: 500 }}>
                                                Unauthorized use of the Website or Services may lead to legal action against you as per these Terms or applicable laws.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>



                            {/* Section 4: Legal */}
                            <motion.section variants={itemVariants} id="legal" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="text-[24px] md:text-[36px] tracking-tight">Legal & Jurisdiction</h2>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: '#000945' }} className="mb-2">Force Majeure</h3>
                                        <p className="text-[15px] leading-relaxed" style={{ color: '#000945', fontWeight: 500 }}>
                                            Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation if execution is prevented or delayed by a force majeure event.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: '#000945' }} className="mb-2">Governing Law</h3>
                                        <p className="text-[15px] leading-relaxed" style={{ color: '#000945', fontWeight: 500 }}>
                                            These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed strictly in accordance with the laws of India.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: '#000945' }} className="mb-2">Jurisdiction</h3>
                                        <p className="text-[15px] leading-relaxed" style={{ color: '#000945', fontWeight: 500 }}>
                                            All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts located in DEHRADUN, UTTARAKHAND.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 style={{ fontWeight: 700, color: '#000945' }} className="mb-2 text-[24px] md:text-[36px] tracking-tight">Contact Us</h2>
                                        <p className="text-[15px] leading-relaxed" style={{ color: '#000945', fontWeight: 500 }}>
                                            All concerns or communications relating to these Terms must be communicated to our primary office using the contact information provided on this website.
                                        </p>
                                    </div>
                                </div>
                            </motion.section>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}