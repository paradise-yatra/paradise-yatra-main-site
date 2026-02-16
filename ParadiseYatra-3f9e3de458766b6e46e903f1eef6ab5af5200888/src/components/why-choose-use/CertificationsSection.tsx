// "use client"

// import { useState, useEffect } from 'react';
// import { X, ZoomIn } from 'lucide-react';

// interface Certification {
//   title: string;
//   regId: string;
//   desc: string;
//   certImage?: string;
// }

// export function CertificationsSection() {
//   const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

//   const certifications: Certification[] = [
//     { 
//       title: 'Uttarakhand Tourism Development Board', 
//       regId: 'UTDB/2024/001', 
//       desc: 'Officially registered with Uttarakhand Tourism Development Board for conducting tours in Uttarakhand.',
//       certImage: 'https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767850583/Uttarakhand_Tourism_Certificate_cpxada.webp'
//     },
//     { 
//       title: 'Ministry of Tourism', 
//       regId: '#12345678', 
//       desc: 'Recognized by the Govt. of India as an approved Inbound Tour Operator.'
//     },
//     { 
//       title: 'IATA Accredited', 
//       regId: '#99-9999', 
//       desc: 'Authorized to issue international airline tickets with global standards.'
//     },
//   ];

//   const openModal = (cert: Certification) => {
//     setSelectedCert(cert);
//     if (typeof document !== 'undefined') {
//       document.body.style.overflow = 'hidden';
//     }
//   };

//   const closeModal = () => {
//     setSelectedCert(null);
//     if (typeof document !== 'undefined') {
//       document.body.style.overflow = 'unset';
//     }
//   };

//   // Handle ESC key press
//   useEffect(() => {
//     const handleEscKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && selectedCert) {
//         closeModal();
//       }
//     };

//     if (typeof window !== 'undefined') {
//       window.addEventListener('keydown', handleEscKey);
//       return () => window.removeEventListener('keydown', handleEscKey);
//     }
//   }, [selectedCert]);

//   return (
//     <>
//       <section className="w-full bg-gray-50 py-12 md:py-16">
//         <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
//           <div className="max-w-[800px] flex flex-col items-center text-center gap-4 md:gap-6">
//             <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
//               <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
//               </svg>
//             </div>
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
//               Your Journey, Officially Secured
//             </h1>
//             <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
//               Paradise Yatra is a fully registered and accredited travel agency. We strictly adhere to all government regulations and international standards to ensure your peace of mind.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="w-full bg-white py-12 md:py-16 border-y border-slate-100">
//         <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
//           <div className="w-full max-w-[1200px]">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
//               {certifications.map((cert, idx) => (
//                 <div 
//                   key={idx} 
//                   onClick={() => cert.certImage && openModal(cert)}
//                   className={`group relative flex flex-col bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 p-5 md:p-6 transition-all duration-500 ease-out hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 hover:scale-[1.02] ${cert.certImage ? 'cursor-pointer' : ''}`}
//                 >
//                   {/* Certificate Image or Emoji */}
//                   <div className="relative h-40 md:h-48 w-full bg-white rounded-lg flex items-start justify-center mb-4 border border-slate-200 shadow-sm overflow-hidden">
//                     {cert.certImage ? (
//                       <>
//                         <img 
//                           src={cert.certImage} 
//                           alt={cert.title}
//                           className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-95"
//                         />
//                         {/* Zoom overlay hint */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
//                           <div className="transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg">
//                             <ZoomIn className="w-6 h-6 text-blue-600" />
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="text-center p-3 mt-8">
//                         <div className="text-4xl md:text-5xl mb-2 transition-transform duration-500 group-hover:scale-110">🏆</div>
//                         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{cert.regId}</div>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex flex-col gap-2 flex-grow">
//                     <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
//                       {cert.title}
//                     </h3>
//                     <p className="text-xs md:text-sm text-slate-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
//                       {cert.desc}
//                     </p>
//                   </div>
                  
//                   {cert.certImage && (
//                     <div className="mt-5 pt-4 border-t border-slate-200">
//                       <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-700 hover:gap-2">
//                         View Full Certificate
//                         <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
//                         </svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Full Screen Modal */}
//       {selectedCert && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-fadeIn"
//           onClick={closeModal}
//         >
//           <button
//             onClick={closeModal}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 z-20"
//             aria-label="Close (ESC)"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:w-6 md:w-8 md:h-8" />
//           </button>

//           <div
//             className="relative w-full max-w-7xl max-h-[95vh] flex flex-col items-center justify-center animate-scaleIn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={selectedCert.certImage}
//               alt={selectedCert.title}
//               className="max-h-[70vh] w-auto max-w-full rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {/* Animations CSS */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { 
//             opacity: 0;
//             backdrop-filter: blur(0px);
//           }
//           to { 
//             opacity: 1;
//             backdrop-filter: blur(8px);
//           }
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.85) translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
//         }

//         .animate-scaleIn {
//           animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// }




// "use client"

// import { useState, useEffect } from 'react';
// import { X, ZoomIn } from 'lucide-react';

// interface Certification {
//   title: string;
//   regId: string;
//   desc: string;
//   certImage?: string;
// }

// export default function CertificationsSection() {
//   const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

//   const certifications: Certification[] = [
//     { 
//       title: 'Uttarakhand Tourism Development Board', 
//       regId: 'UTDB/2024/001', 
//       desc: 'Officially registered with Uttarakhand Tourism Development Board for conducting tours in Uttarakhand.',
//       certImage: 'https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767850583/Uttarakhand_Tourism_Certificate_cpxada.webp'
//     },
//     { 
//       title: 'Ministry of Tourism', 
//       regId: '#12345678', 
//       desc: 'Recognized by the Govt. of India as an approved Inbound Tour Operator.',
//       certImage:"https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767854400/Udhyam_Certificate_3_xkgfjk.webp",
//     },
//     { 
//       title: 'IATA Accredited', 
//       regId: '#99-9999', 
//       desc: 'Authorized to issue international airline tickets with global standards.'
//     },
//   ];

//   const openModal = (cert: Certification) => {
//     setSelectedCert(cert);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeModal = () => {
//     setSelectedCert(null);
//     document.body.style.overflow = 'unset';
//   };

//   // Handle ESC key press
//   useEffect(() => {
//     const handleEscKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && selectedCert) {
//         closeModal();
//       }
//     };

//     window.addEventListener('keydown', handleEscKey);
//     return () => window.removeEventListener('keydown', handleEscKey);
//   }, [selectedCert]);

//   return (
//     <>
//       <section className="w-full bg-gray-50 py-12 md:py-16">
//         <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
//           <div className="max-w-[800px] flex flex-col items-center text-center gap-4 md:gap-6">
//             <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
//               <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
//               </svg>
//             </div>
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
//               Your Journey, Officially Secured
//             </h1>
//             <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
//               Paradise Yatra is a fully registered and accredited travel agency. We strictly adhere to all government regulations and international standards to ensure your peace of mind.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="w-full bg-white py-12 md:py-16 border-y border-slate-100">
//         <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
//           <div className="w-full max-w-[1200px]">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
//               {certifications.map((cert, idx) => (
//                 <div 
//                   key={idx} 
//                   onClick={() => cert.certImage && openModal(cert)}
//                   className={`group relative flex flex-col bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 p-5 md:p-6 transition-all duration-500 ease-out hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 hover:scale-[1.02] ${cert.certImage ? 'cursor-pointer' : ''}`}
//                 >
//                   {/* Certificate Image or Emoji */}
//                   <div className="relative h-40 md:h-48 w-full bg-white rounded-lg flex items-start justify-center mb-4 border border-slate-200 shadow-sm overflow-hidden">
//                     {cert.certImage ? (
//                       <>
//                         <img 
//                           src={cert.certImage} 
//                           alt={cert.title}
//                           className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-95"
//                         />
//                         {/* Zoom overlay hint */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
//                           <div className="transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg">
//                             <ZoomIn className="w-6 h-6 text-blue-600" />
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="text-center p-3 mt-8">
//                         <div className="text-4xl md:text-5xl mb-2 transition-transform duration-500 group-hover:scale-110">🏆</div>
//                         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{cert.regId}</div>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex flex-col gap-2 flex-grow">
//                     <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
//                       {cert.title}
//                     </h3>
//                     <p className="text-xs md:text-sm text-slate-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
//                       {cert.desc}
//                     </p>
//                   </div>
                  
//                   {cert.certImage && (
//                     <div className="mt-5 pt-4 border-t border-slate-200">
//                       <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-700 hover:gap-2">
//                         View Full Certificate
//                         <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
//                         </svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Full Screen Modal */}
//       {selectedCert && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-fadeIn cursor-pointer"
//           onClick={closeModal}
//         >
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               closeModal();
//             }}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 cursor-pointer"
//             aria-label="Close (ESC)"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
//           </button>

//           <div
//             className="relative w-full max-w-7xl max-h-[95vh] flex flex-col items-center justify-center animate-scaleIn cursor-default"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={selectedCert.certImage}
//               alt={selectedCert.title}
//               className="max-h-[70vh] w-auto max-w-full rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 object-contain select-none"
//             />
//           </div>
//         </div>
//       )}

//       {/* Animations CSS */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { 
//             opacity: 0;
//             backdrop-filter: blur(0px);
//           }
//           to { 
//             opacity: 1;
//             backdrop-filter: blur(8px);
//           }
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.85) translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
//         }

//         .animate-scaleIn {
//           animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// }



"use client"

import { useState, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface Certification {
  title: string;
  regId: string;
  desc: string;
  certImage?: string | string[];
}

export default function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const certifications: Certification[] = [
    { 
      title: 'Uttarakhand Tourism Development Board', 
      regId: 'UTDB/2024/001', 
      desc: 'Officially registered under the Uttarakhand Tourism Development Board as a certified Travel Agent and Domestic Tour Operator. Authorized to operate tours within Uttarakhand with government verification.',
      certImage: 'https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767850583/Uttarakhand_Tourism_Certificate_cpxada.webp'
    },
    { 
      title: 'Udyam Registration Certificate', 
      regId: '#12345678', 
      desc: 'Registered under the Ministry of Micro, Small & Medium Enterprises (MSME), Government of India. Certified as a Service Provider operating in the travel and tourism sector.',
      certImage: [
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767854400/Udhyam_Certificate_1_ivc8rs.webp",
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767854401/Udhyam_Certificate_2_oypw9m.webp",
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767854400/Udhyam_Certificate_3_xkgfjk.webp",
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767854402/Udhyam_Certificate_4_cejwib.webp"
      ]
    },
    { 
      title: 'GST Certificate', 
      regId: '#99-9999', 
      desc: 'Registered under the Goods & Services Tax Act (GST) as a verified business entity. Authorized to conduct commercial operations and issue valid tax invoices for travel services.',
       certImage: [
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767857409/GST_Certificate_1_eurpc2.webp",
        "https://res.cloudinary.com/dwuwpxu0y/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1200/v1767857408/GST_Certificate_2_fpt1wq.webp",

      ]
    },
  ];

  const openModal = (cert: Certification) => {
    setSelectedCert(cert);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedCert(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const getImages = (certImage?: string | string[]): string[] => {
    if (!certImage) return [];
    return Array.isArray(certImage) ? certImage : [certImage];
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCert) {
      const images = getImages(selectedCert.certImage);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCert) {
      const images = getImages(selectedCert.certImage);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCert) {
        closeModal();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (selectedCert) {
        if (e.key === 'ArrowRight') nextImage(e as any);
        if (e.key === 'ArrowLeft') prevImage(e as any);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    window.addEventListener('keydown', handleArrowKeys);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [selectedCert, currentImageIndex]);

  return (
    <>
    <div className="flex justify-center pt-8">
    <div className="flex gap-6 items-center">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Verified</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Business</span>
            </div>
        </div>

        <div className="h-10 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z"/>
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Secure</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Booking</span>
            </div>
        </div>
    </div>
</div>
      <section className="w-full bg-gray-50 py-12 md:py-16">
        
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
          <div className="max-w-[800px] flex flex-col items-center text-center gap-4 md:gap-6">
          
            <h1 className="text-3xl md:text-4xl lg:text-5xl !font-black !leading-[1.05] tracking-tight text-slate-900">
              Your Journey, Officially Secured
            </h1>
            <p className="text-base md:text-lg !text-slate-600 max-w-2xl leading-relaxed">
              Paradise Yatra is a fully registered and accredited travel agency. We strictly adhere to all government regulations and international standards to ensure your peace of mind.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 md:py-16 border-y border-slate-100">
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex justify-center">
          <div className="w-full max-w-[1200px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {certifications.map((cert, idx) => {
                const images = getImages(cert.certImage);
                const hasImages = images.length > 0;
                const isMultiple = images.length > 1;

                return (
                  <div 
                    key={idx} 
                    onClick={() => hasImages && openModal(cert)}
                    className={`group relative flex flex-col bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200 p-5 md:p-6 transition-all duration-500 ease-out hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 hover:scale-[1.02] ${hasImages ? 'cursor-pointer' : ''}`}
                  >
                    {/* Certificate Image or Emoji */}
                    <div className="relative h-40 md:h-48 w-full bg-white rounded-lg flex items-start justify-center mb-4 border border-slate-200 shadow-sm overflow-hidden">
                      {hasImages ? (
                        <>
                          <img 
                            src={images[0]} 
                            alt={cert.title}
                            className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-95"
                          />
                          {/* Zoom overlay hint */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                            <div className="transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg">
                              <ZoomIn className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 mt-8">
                          <div className="text-4xl md:text-5xl mb-2 transition-transform duration-500 group-hover:scale-110">🏆</div>
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{cert.regId}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-grow">
                      <h3 className="text-base md:text-lg !font-bold text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
                        {cert.title}
                      </h3>
                      <p className="text-xs md:text-sm !text-slate-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                        {cert.desc}
                      </p>
                    </div>
                    
                    {hasImages && (
                      <div className="mt-5 pt-4 border-t border-slate-200">
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-700 hover:gap-2">
                         View Full Certificate
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-fadeIn cursor-pointer"
          onClick={closeModal}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 cursor-pointer"
            aria-label="Close (ESC)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>

          <div
            className="relative w-full max-w-7xl max-h-[95vh] flex flex-col items-center justify-center animate-scaleIn cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const images = getImages(selectedCert.certImage);
              const isMultiple = images.length > 1;

              return (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${selectedCert.title} - Image ${currentImageIndex + 1}`}
                    className="max-h-[70vh] w-auto max-w-full rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 object-contain select-none"
                  />
                  
                  {isMultiple && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {currentImageIndex + 1} / {images.length}
                      </div>

                      {/* Thumbnail Navigation */}
                      <div className="mt-4 flex gap-2 overflow-x-auto max-w-full px-4">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(idx);
                            }}
                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              idx === currentImageIndex
                                ? 'border-blue-500 scale-110 shadow-lg'
                                : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
}