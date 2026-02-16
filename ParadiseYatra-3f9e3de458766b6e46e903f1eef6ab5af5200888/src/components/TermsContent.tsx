'use client';

import { useEffect, useState } from 'react';
import {
    Info,
    User,
    ShieldCheck,
    CreditCard,
    Gavel,
    BookOpen,
    MessageCircle,
    Clock,
    Mail,
    Copyright,
    AlertTriangle,
    Wallet,
    Ban,
    Link,
    AlertCircle,
    MapPin,
    Phone,
    History
} from 'lucide-react';

export default function TermsContent() {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            const sections = ['introduction', 'registration', 'warranties', 'payments', 'legal'];

            let currentSection = 'introduction';
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
        { id: 'introduction', label: 'Introduction', Icon: Info },
        { id: 'registration', label: 'Registration & Account', Icon: User },
        { id: 'warranties', label: 'Warranties & Accuracy', Icon: ShieldCheck },
        { id: 'payments', label: 'Payments & Refunds', Icon: CreditCard },
        { id: 'legal', label: 'Legal & Jurisdiction', Icon: Gavel },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
            {/* Main Content Wrapper */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
                {/* Page Header Section */}
                <div
                    className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-200 pb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                >
                    <div className="max-w-2xl">
                        <h1 className="!text-4xl md:!text-5xl !font-black text-slate-900 mb-4 transition-all duration-500 hover:text-[#197fe6]">
                            Terms &amp; Conditions
                        </h1>
                        <p className="!text-slate-500 !text-lg transition-colors duration-300">
                            Transparent policies for your peace of mind. Please read these terms carefully before booking your adventure.
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative ">
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
                                {/* Abstract decoration */}
                                <div className="absolute -bottom-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Text Content */}
                    <div className="lg:col-span-9 flex flex-col gap-8">
                        {/* Section: Introduction */}
                        <section
                            id="introduction"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-200 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm transition-all duration-300">
                                    01
                                </span>
                                <span className="transition-colors duration-300">Introduction</span>
                            </h2>
                            <div className="prose prose-slate max-w-none leading-relaxed">
                                <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                    These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding
                                    agreement by and between PARADISE YATRA, ("Website Owner" or "we" or "us" or "our") and you ("you" or
                                    "your") and relate to your use of our website, goods (as applicable) or services (as applicable)
                                    (collectively, "Services").
                                </p>
                                <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                    By using our website and availing the Services, you agree that you have read and accepted these Terms
                                    (including the Privacy Policy). We reserve the right to modify these Terms at any time and without
                                    assigning any reason. It is your responsibility to periodically review these Terms to stay informed of
                                    updates.
                                </p>
                                <p className="transition-colors duration-300 !text-slate-700">
                                    The use of this website or availing of our Services is subject to the following terms of use:
                                </p>
                            </div>
                        </section>

                        {/* Section: Registration & Account */}
                        <section
                            id="registration"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-300 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm transition-all">
                                    02
                                </span>
                                <span className="transition-colors duration-300">Registration &amp; Account Use</span>
                            </h2>
                            <div className="text-slate-600 leading-relaxed space-y-4">
                                <p className="transition-colors duration-300 !text-slate-700">
                                    To access and use the Services, you agree to provide true, accurate and complete information to us
                                    during and after registration, and you shall be responsible for all acts done through the use of your
                                    registered account.
                                </p>
                            </div>
                        </section>

                        {/* Section: Warranties & Accuracy */}
                        <section
                            id="warranties"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-400 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm">
                                    03
                                </span>
                                <span className="transition-colors">Warranties &amp; Accuracy</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness,
                                        performance, completeness or suitability of the information and materials offered on this website or
                                        through the Services, for any specific purpose. You acknowledge that such information and materials
                                        may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or
                                        errors to the fullest extent permitted by law.
                                    </p>
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        Your use of our Services and the website is solely at your own risk and discretion. You are required
                                        to independently assess and ensure that the Services meet your requirements.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <Copyright size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Intellectual Property
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        The contents of the Website and the Services are proprietary to Us and you will not have any
                                        authority to claim any intellectual property rights, title, or interest in its contents.
                                    </p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 p-5 rounded-sm transition-all duration-300 hover:bg-orange-100 hover:border-orange-200 hover:shadow-md">
                                    <div className="flex gap-3">
                                        <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110" />
                                        <div>
                                            <h4 className="font-bold text-orange-800 text-sm mb-1">Unauthorized Use</h4>
                                            <p className="!text-orange-700 text-sm transition-colors duration-300">
                                                You acknowledge that unauthorized use of the Website or the Services may lead to action against
                                                you as per these Terms or applicable laws.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Payments & Refunds */}
                        <section
                            id="payments"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-500 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm ">
                                    04
                                </span>
                                <span className="transition-colors">Payments &amp; Refunds</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="text-slate-600 leading-relaxed">
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">You agree to pay us the charges associated with availing the Services.</p>
                                    <p className="mb-4 transition-colors duration-300 !text-slate-700">
                                        You understand that upon initiating a transaction for availing the Services you are entering into a
                                        legally binding and enforceable contract with the us for the Services.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <Wallet size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Refund Policy
                                    </h4>
                                    <p className="!text-sm !text-slate-700 transition-colors duration-300">
                                        You shall be entitled to claim a refund of the payment made by you in case we are not able to
                                        provide the Service. The timelines for such return and refund will be according to the specific
                                        Service you have availed or within the time period provided in our policies (as applicable). In case
                                        you do not raise a refund claim within the stipulated time, than this would make you ineligible for
                                        a refund.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Ban size={20} className="transition-transform duration-300 hover:scale-110" />
                                        Unlawful Use
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        You agree not to use the website and/ or Services for any purpose that is unlawful, illegal or
                                        forbidden by these Terms, or Indian or local laws that might apply to you.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Link size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Third Party Links
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        You agree and acknowledge that website and the Services may contain links to other third party
                                        websites. On accessing these links, you will be governed by the terms of use, privacy policy and
                                        such other policies of such third party websites.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Legal & Jurisdiction */}
                        <section
                            id="legal"
                            className={`bg-white p-8 rounded-sm shadow-sm border border-slate-200 scroll-mt-24 transition-all duration-700 ease-out delay-600 hover:shadow-lg hover:border-slate-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group">
                                <span className="flex items-center justify-center size-8 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm">
                                    05
                                </span>
                                <span className="transition-colors">Legal &amp; Jurisdiction</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <AlertCircle size={20} className="transition-transform duration-300 hover:scale-110" />
                                        Force Majeure
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure
                                        to perform an obligation under these Terms if performance is prevented or delayed by a force majeure
                                        event.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <Gavel size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Governing Law
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and
                                        construed in accordance with the laws of India.
                                    </p>
                                </div>
                                <div className="bg-[#197fe6]/5 border-l-4 border-[#197fe6] p-5 rounded-sm transition-all duration-300 hover:bg-[#197fe6]/10 hover:border-[#197fe6] hover:translate-x-1 hover:shadow-md">
                                    <h4 className="text-[#197fe6] font-bold mb-2 flex items-center gap-2">
                                        <MapPin size={20} className="transition-transform duration-300 hover:scale-110" />
                                        Jurisdiction
                                    </h4>
                                    <p className="text-sm !text-slate-700 transition-colors duration-300">
                                        All disputes arising out of or in connection with these Terms shall be subject to the exclusive
                                        jurisdiction of the courts in DEHRADUN, UTTARAKHAND.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Phone size={20} className="transition-transform duration-300 hover:rotate-12" />
                                        Contact Information
                                    </h4>
                                    <p className="text-sm !text-slate-600 transition-colors duration-300">
                                        All concerns or communications relating to these Terms must be communicated to us using the contact
                                        information provided on this website.
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