'use client';

import { useEffect, useState } from 'react';
import {
    Info,
    ShoppingBag,
    AlertTriangle,
    Wallet,
    Clock,
    Mail,
    MessageCircle,
    BookOpen,
    AlertCircle,
    PackageX,
    ShieldAlert,
    History
} from 'lucide-react';

export default function CancellationRefundContent() {
    const [activeSection, setActiveSection] = useState('overview');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            const sections = ['overview', 'cancellation', 'perishable', 'damaged', 'refunds'];

            let currentSection = 'overview';
            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition) {
                    currentSection = section;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${sectionId}`);
        }
    };

    const tocItems = [
        { id: 'overview', label: 'Policy Overview', Icon: Info },
        { id: 'cancellation', label: 'Cancellation Policy', Icon: PackageX },
        { id: 'perishable', label: 'Perishable Items', Icon: ShoppingBag },
        { id: 'damaged', label: 'Damaged & Defective Items', Icon: ShieldAlert },
        { id: 'refunds', label: 'Refund Processing', Icon: Wallet },
    ];

    return (
        <div className="flex flex-col mt-22 min-h-screen bg-[#f6f7f8]">
            {/* Main Content Wrapper */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
                {/* Page Header Section */}
                <div
                    className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-200 pb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="max-w-2xl">
                        <h1 className="!text-4xl md:!text-5xl !font-black text-slate-900 mb-4 transition-all duration-500 hover:text-[#197fe6]">
                            Cancellation &amp; Refund Policy
                        </h1>
                        <p className="!text-slate-500 !text-lg transition-colors duration-300">
                            Our commitment to helping our customers with a liberal cancellation and refund policy for your peace of mind.
                        </p>
                        <div className="flex items-center gap-1.5 !text-slate-500 mt-4 font-bold">
                            <History size={18} />
                            <span>Last Updated: January 8, 2026</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a href="mailto:support@paradiseyatra.com">
                            <button className="flex cursor-pointer items-center justify-center gap-2 h-10 px-5 bg-white border border-slate-200 hover:border-[#197fe6]/50 text-slate-700 rounded-sm text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:text-[#197fe6]">
                                <Mail size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                                <span>Contact Support</span>
                            </button>
                        </a>
                    </div>
                </div>

                {/* Content Layout: Sidebar + Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div
                            className={`sticky top-32 space-y-8 transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            {/* Navigation Card */}
                            <div className="bg-white rounded-sm p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-[#197fe6]/10 p-2 rounded-sm text-[#197fe6] transition-all duration-300 hover:bg-[#197fe6] hover:text-white hover:scale-110">
                                        <BookOpen size={20} />
                                    </div>
                                    <h3 className="!font-bold !text-slate-900 !text-lg">Table of Contents</h3>
                                </div>
                                <nav className="flex flex-col space-y-1">
                                    {tocItems.map((item, index) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-medium transition-all duration-300 text-left transform hover:translate-x-1 ${activeSection === item.id
                                                    ? 'bg-[#197fe6]/10 text-[#197fe6] shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <item.Icon
                                                size={20}
                                                className={`transition-all duration-300 ${activeSection === item.id ? 'text-[#197fe6] scale-110' : 'group-hover:text-[#197fe6]'
                                                    }`}
                                            />
                                            <span className="text-sm">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Mini CTA */}
                            <div className="bg-gradient-to-br from-[#197fe6] to-blue-600 rounded-sm p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-300 hover:scale-105 group">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg mb-2 transition-transform duration-300 group-hover:translate-x-1">Need Help?</h4>
                                    <p className="!text-blue-100 text-sm mb-4 transition-all duration-300">
                                        Our support team is available 24/7 to answer your questions.
                                    </p>
                                    <a
                                        href="https://api.whatsapp.com/send/?phone=918979269388&text&type=phone_number&app_absent=0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <button className="w-full bg-white text-[#197fe6] text-sm font-bold py-2 rounded-sm hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-md">
                                            <MessageCircle size={16} className="transition-transform duration-300 hover:rotate-12" />
                                            Chat Now
                                        </button>
                                    </a>
                                </div>
                                <div className="absolute -bottom-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Text Content */}
                    <div className="lg:col-span-9 flex flex-col gap-8">
                        {/* Section: Policy Overview */}
                        <section
                            id="overview"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-200 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm transition-all duration-300">
                                    01
                                </span>
                                <span className="transition-colors duration-300">Policy Overview</span>
                            </h2>
                            <div className="prose prose-slate max-w-none leading-relaxed">
                                <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                    PARADISE YATRA believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
                                </p>
                            </div>
                        </section>

                        {/* Section: Cancellation Policy */}
                        <section
                            id="cancellation"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-300 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm transition-all">
                                    02
                                </span>
                                <span className="transition-colors duration-300">Cancellation Policy</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                                    </p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 p-5 rounded-sm transition-all duration-300 hover:bg-orange-100 hover:border-orange-200 hover:shadow-md">
                                    <div className="flex gap-3">
                                        <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110" />
                                        <div>
                                            <h4 className="font-bold text-orange-800 text-sm mb-1">Important Note</h4>
                                            <p className="!text-orange-700 text-sm transition-colors duration-300">
                                                Once your order has been communicated to vendors/merchants and shipping has been initiated, cancellation may not be possible. Please request cancellations immediately after placing your order.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Perishable Items */}
                        <section
                            id="perishable"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-400 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm">
                                    03
                                </span>
                                <span className="transition-colors">Perishable Items</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        PARADISE YATRA does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <ShoppingBag size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Quality Assurance
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        While cancellations are not accepted for perishable items, we ensure quality standards. If you receive a product that does not meet quality expectations, you may be eligible for a refund or replacement.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Damaged & Defective Items */}
                        <section
                            id="damaged"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-500 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm">
                                    04
                                </span>
                                <span className="transition-colors">Damaged &amp; Defective Items</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 30+ Days of receipt of the products.
                                    </p>
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 30+ Days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <ShieldAlert size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Reporting Timeline
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        Please report any issues with damaged, defective, or misrepresented products within 30+ Days of receipt. Our Customer Service team will investigate and make an appropriate decision after merchant verification.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <AlertCircle size={20} className="transition-transform duration-300 hover:scale-110" />
                                        Warranty Products
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Refund Processing */}
                        <section
                            id="refunds"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-600 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm">
                                    05
                                </span>
                                <span className="transition-colors">Refund Processing</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        In case of any Refunds approved by the PARADISE YATRA, it'll take 16-30 Days for the refund to be processed to the end customer.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <Wallet size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Refund Timeline
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        Once your refund request is approved by PARADISE YATRA, please allow 16-30 Days for the refund amount to be processed and credited back to your original payment method.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Clock size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Need Assistance?
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        If you have any questions or concerns about cancellations or refunds, please contact our Customer Service team using the contact information provided on this website.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}