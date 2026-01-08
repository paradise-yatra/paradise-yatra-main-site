"use client";
import { useState } from 'react';
import { Play, Users, Calendar, Award, Star, Briefcase, PartyPopper, X } from 'lucide-react';

interface VideoItem {
  url: string;
  title: string;
  description?: string;
}

export default function CultureSection() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const stats = [
    {
      icon: Users,
      count: "100+",
      label: "Team Members",
      description: "Passionate about travel"
    },
    {
      icon: Calendar,
      count: "12+",
      label: "Annual Events",
      description: "Retreats, parties & workshops"
    },
    {
      icon: Star,
      count: "4.9/5",
      label: "Employee Score",
      description: "Rated on Glassdoor"
    },
    {
      icon: Award,
      count: "Award Winning",
      label: "Best Place to Work 2023",
      description: "Industry recognition"
    }
  ];

  const testimonial = {
    quote: "Our culture is built on collaboration, respect and small celebrations that keep us inspired.",
    author: "Tarun Meharwal",
    role: "Web Developer",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWifetp2EZ1PnhpHx344V8THZhHZzxaYrVCcqXGfhg3G2YAlpoyGw=w144-h144-p-rp-mo-br100"
  };

  const potluckVideo: VideoItem = {
    url: "https://res.cloudinary.com/dwuwpxu0y/video/upload/v1767784042/Office_Video_1_kr5rta.mp4",
    title: "Diwali at Paradise Yatra",
    description: "A festival of lights, colors, sweets, and pure team joy."
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Title Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
            <PartyPopper className="w-4 h-4" />
            <span>Our Culture</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Life at Paradise: <br className="hidden md:block" /> A Culture of Celebration
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Behind every great trip is a team that knows how to celebrate the journey. Explore the moments that bring us closer together.
          </p>
        </div>

        {/* Magazine Layout Grid */}
        <div className="grid grid-cols-12 auto-rows-[280px] gap-6 mb-16">
          {/* Item 1: Large Video Feature (Spans 8 cols, 2 rows) */}
          <div className="group relative col-span-12 md:col-span-8 row-span-2 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1767784328/Office_Photo_1_ctv6zq.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 p-8 w-full z-10 flex flex-col items-start gap-4">
              <div className="space-y-2 max-w-lg">
                <h3 className="text-3xl font-bold text-white leading-tight">
                  Christmas at Paradise Yatra: Joy, Laughter & Togetherness
                </h3>
                <p className="!text-slate-200 text-sm md:text-base hidden md:block">
                We celebrate Christmas the Paradise way — with smiles, surprises, and a lot of festive energy. A day filled with games, decorating, gifts, and unforgettable team moments.
                </p>
              </div>
            </div>
          </div>

          {/* Item 2: Vertical Portrait - NOW WITH VIDEO */}
          <div 
            onClick={() => setSelectedVideo(potluckVideo)}
            className="cursor-pointer group relative col-span-12 md:col-span-4 row-span-2 rounded-2xl overflow-hidden shadow-lg bg-slate-100 hover:shadow-2xl transition-all duration-500"
          >
            <video 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={potluckVideo.url}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-blue-600 text-blue-600 ml-1" />
              </div>
            </div>

            {/* Play hint badge */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-3 h-3 fill-white" />
              Play
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h4 className="text-xl font-bold !text-white mb-1">{potluckVideo.title}</h4>
              <p className="!text-slate-200 text-sm">{potluckVideo.description}</p>
            </div>
          </div>

          {/* Item 3: Quote Block (Spans 4 cols, 1 row) */}
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-white p-8 flex flex-col justify-center border border-slate-100 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-blue-600/5 group-hover:text-blue-600/10 transition-colors">
              <svg className="w-[180px] h-[180px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
            </div>
            <blockquote className="relative z-10">
              <p className="text-xl font-semibold !text-slate-800 italic leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img 
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                    src={testimonial.avatar}
                  />
                </div>
                <div>
                  <cite className="not-italic font-bold text-slate-900 block text-sm">
                    {testimonial.author}
                  </cite>
                  <span className="text-xs text-blue-600 font-medium">{testimonial.role}</span>
                </div>
              </footer>
            </blockquote>
          </div>

          {/* Item 4: Small Video/Image (Spans 4 cols, 1 row) */}
          <div className="group relative col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <div 
              className="absolute inset-0 bg-cover bg-top transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1767784327/Office_Photo_2_kafuyn.webp')" }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </div>

          {/* Item 5: Small Image (Spans 4 cols, 1 row) */}
          <div className="group relative col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dwuwpxu0y/image/upload/v1767849355/Office_Photo_3_yjqnf9.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/20 bg-white/10 p-2 rounded-full transition-all z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo.url}
              className="max-h-[80vh] rounded-2xl shadow-2xl border border-white/10"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}