'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function CancellationRefundContent() {
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
        <div className="min-h-screen bg-white font-plus-jakarta-sans pb-6 policy-content">
            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row w-full md:h-[496px] md:overflow-hidden items-center justify-center bg-white md:bg-transparent">
                <div className="md:hidden w-full px-4 pt-6 pb-2 bg-white text-left z-10 flex-shrink-0">
                    <div className="!text-[28px] !font-black text-slate-800 font-plus-jakarta-sans tracking-tight leading-tight">
                        Refund <span className="text-[#000945]">Policy</span>
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative w-full h-[230.4px] md:absolute md:inset-0 md:h-auto flex-shrink-0">
                    <Image
                        src="/Legal/Refund%20Policy/Hero%20Image.jpg"
                        alt="Paradise Yatra Refund Policy"
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
                                    Refund <span className="text-[#000945]">Policy</span>
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
            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-4">
                <div className="relative items-start">
                    <div className="w-full">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Section 1: Booking Confirmation */}
                            <motion.section variants={itemVariants} id="confirmation" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Booking Confirmation</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>A booking shall be considered confirmed only after receipt of the required advance payment.</li>
                                        <li>The balance amount must be cleared before the commencement of travel.</li>
                                        <li>By making any payment, the customer agrees to this Cancellation & Refund Policy.</li>
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Section 2: Cancellation by Customer */}
                            <motion.section variants={itemVariants} id="cancellation" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Cancellation by Customer</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        All cancellation requests must be submitted in writing via official email or registered WhatsApp number of Paradise Yatra.
                                    </p>
                                    <p style={{ color: '#000945', fontWeight: 700 }}>Holiday Packages (Domestic & International)</p>
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li><strong>30 days or more before departure:</strong> 25% of total package cost will be charged as cancellation fee.</li>
                                        <li><strong>15–20 days before departure:</strong> 50% of total package cost will be charged as cancellation fee.</li>
                                        <li><strong>Within 15 days of departure / No Show:</strong> 100% cancellation charges (No Refund).</li>
                                    </ul>
                                    <p className="mt-4 italic" style={{ color: '#000945', fontWeight: 500 }}>
                                        Cancellation charges are calculated on total package cost and not on advance amount.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 3: Flight Tickets */}
                            <motion.section variants={itemVariants} id="flights" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Flight Tickets</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>Flight ticket cancellations are strictly subject to the airline’s cancellation policy.</li>
                                        <li>Paradise Yatra will refund only the amount received from the airline after deducting applicable service charges.</li>
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Section 4: Hotel Bookings */}
                            <motion.section variants={itemVariants} id="hotels" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Hotel Bookings</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>Refund eligibility depends entirely on the respective hotel’s cancellation policy.</li>
                                        <li>Non-refundable hotel bookings are not eligible for any refund.</li>
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Section 5: Visa, Insurance & Processing Charges */}
                            <motion.section variants={itemVariants} id="visa" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Visa, Insurance & Processing Charges</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Visa fees, travel insurance charges, documentation charges, and service fees are strictly non-refundable, even in case of visa rejection or cancellation by the customer.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 6: No Show Policy */}
                            <motion.section variants={itemVariants} id="no-show" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">No Show Policy</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Failure to report on the date of departure will be treated as a No Show and 100% cancellation charges will apply.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 7: Refund Processing Timeline */}
                            <motion.section variants={itemVariants} id="timeline" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Refund Processing Timeline</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>All eligible refunds will be processed within 45 working days from the date of cancellation approval.</li>
                                        <li>Refunds will be issued through the original mode of payment.</li>
                                        <li>Bank charges, payment gateway fees, and supplier deductions (if any) will be applicable.</li>
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Section 8: Cancellation by Paradise Yatra */}
                            <motion.section variants={itemVariants} id="cancellation-paradiseyatra" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Cancellation by Paradise Yatra</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        In case of unavoidable circumstances such as natural calamities, government restrictions, operational issues, strikes, or force majeure events, Paradise Yatra reserves the right to cancel the booking.
                                    </p>
                                    <p style={{ color: '#000945', fontWeight: 700 }}>Customers will be offered:</p>
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>An alternative travel option <span className="font-bold">OR</span></li>
                                        <li>Refund subject to supplier policies</li>
                                    </ul>
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Paradise Yatra shall not be liable for any additional compensation.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Section 9: Amendments / Date Changes */}
                            <motion.section variants={itemVariants} id="amendments" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Amendments / Date Changes</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <ul className="list-disc pl-6 space-y-2" style={{ color: '#000945', fontWeight: 500 }}>
                                        <li>All amendments are subject to availability and supplier approval.</li>
                                        <li>Fare difference and amendment charges will apply.</li>
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Section 10: Force Majeure */}
                            <motion.section variants={itemVariants} id="force-majeure" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Force Majeure</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Paradise Yatra shall not be held responsible for delays or cancellations caused by events beyond control including natural disasters, pandemics, war, weather disruptions, or government orders.
                                    </p>
                                </div>
                            </motion.section>

                            {/* Disclaimer */}
                            <motion.section variants={itemVariants} id="disclaimer" className="scroll-mt-28">
                                <div className="mb-6">
                                    <h2 style={{ fontWeight: 700, color: '#000945' }} className="!text-[24px] md:!text-[36px] tracking-tight">Disclaimer</h2>
                                </div>
                                <div className="space-y-4 leading-relaxed text-[15px]">
                                    <p style={{ color: '#000945', fontWeight: 500 }}>
                                        Paradise Yatra acts solely as a travel service facilitator. All services are provided by third-party suppliers such as airlines, hotels, transport providers, and visa authorities. Refunds and cancellations are ultimately subject to supplier terms and conditions.
                                    </p>
                                </div>
                            </motion.section>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}


