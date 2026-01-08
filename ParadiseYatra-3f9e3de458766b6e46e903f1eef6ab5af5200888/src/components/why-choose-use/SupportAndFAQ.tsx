'use client';

import { useState } from 'react';

export default function SupportAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Will the price increase after I book?",
      answer: "No. Once your package is confirmed and payment is received, the price is locked. Seasonal demand or hotel rate hikes won't be pushed onto you later."
    },
    {
      question: "Are the hotel photos and locations genuine?",
      answer: "Yes. We share the exact hotel name, Google Maps location, and real photos/videos before confirmation. If you're not satisfied, the hotel can be changed before booking, not after arrival."
    },
    {
      question: "Who supports us if something goes wrong during the trip?",
      answer: "Paradise Yatra provides direct on-trip support via call and WhatsApp. Any issue—hotel, driver, timing, or service—is handled by our team. You don't have to argue with vendors."
    },
    {
      question: "What happens to my money if the trip gets canceled?",
      answer: "Refunds depend on hotel and transport cancellation policies. We do not make fake promises of 100% refunds. All terms are clearly explained before payment so there are no surprises later."
    },
    {
      question: "What if the driver skips sightseeing or asks for extra money?",
      answer: "All drivers are pre-briefed with your itinerary. Unapproved route changes, extra demands, or misbehavior are not acceptable. If an issue arises, we intervene immediately or arrange a replacement."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      {/* Support Section */}
      <section className="px-4 lg:px-10 py-12 mb-10 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="flex items-center gap-2 animate-pulse">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase shadow-sm">
                Online Now
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl !font-bold text-gray-900 leading-tight">
              Real Humans, <br/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ready to Help.
              </span>
            </h2>
            <p className="text-lg !text-gray-700 leading-relaxed">
              No chatbots, no endless automated menus. When you call Paradise Yatra, you speak to a travel expert who cares about your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => window.open('https://wa.me/918979269388', '_blank')}
                className="group flex cursor-pointer items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-14 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <span>Chat with Support</span>
              </button>
              <button 
                onClick={() => window.location.href = 'tel:+918979396413'}
                className="group flex cursor-pointer items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-blue-600 font-bold h-14 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
              >
                <svg className="w-5 h-5 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                <span>Call Us</span>
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200 mt-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform animate-float-1">
                <img alt="Support Agent" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqoh9uAib1X86E_ZuUfPJ7Rj1XOLJiLgGFmK8I78ur3z1vKw0xakThYrHTpJOHnjWTZSJTdoVcXPuuT7PkW1vSRqpyPZyS9wDDgc1UZg2ZB__uTNEJM_AjPM57SVIn2GKsO-AACF2c3FZEqJffJ0CMdh-9lGoldWX4SwEG1R1Fx5gPOL15XXn-JyezklZwrVtl1dtdUHCtUB7YEHnWo5cY_hjd3GRtTFFhtEiSlNpYAWryYjjk_bHpVG4iXNN0laqVn6fXU-jbk6I"/>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200 mb-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform animate-float-2">
                <img alt="Support Agent" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrOUULUtYgUnvhGbh4YXDRyuvJsQ0TpJwoOIYPMjaZHd7DuB7Eza1CrUtsnbbe4AXhCxf4LKC36NhvDwDLkmxiOMUAiHKf7o0kO2DuKUWqTkTbvIUqDRG12SmWOjwomQNDL6TxgDmAEok8ajMdzSE8Hq41KTnsJWlLqbLy5pQTWY83Ub4mPmqPNvJuToaJMeEPF_8tTs-s6WBolQ7G_mEVozzMt0-pFSXmwmEsI7PgCJSpdAPiUnJuidaKygBlzJZveR-KbAy9W5c"/>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 lg:px-10 py-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h3 className="!text-3xl lg:!text-4xl !font-bold !text-gray-900 mb-3">Frequently Asked Questions</h3>
          <p className="!text-gray-600">Everything you need to know about Paradise Yatra</p>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <button
                className="w-full flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="pr-4">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 flex-shrink-0 transition-all duration-500 ease-in-out ${openFaq === index ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(5px);
          }
        }
        
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(-8px);
          }
        }
        
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}