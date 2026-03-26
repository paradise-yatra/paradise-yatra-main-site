"use client";

import { useEffect, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialVideoCard = memo(({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only try to play if we actually enter the viewport
            videoElement.play().catch(() => {
              // Ignore DOMException for play() requests interrupted by pause()
            });
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.1 } // Trigger when at least 10% of the video is visible
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className="w-full h-auto object-cover"
    />
  );
});

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100 || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * value;
      setProgress(value);
    }
  };

  return (
    <div
      className="relative max-h-[85vh] flex items-center justify-center overflow-hidden rounded-lg shadow-2xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="max-h-[85vh] w-auto max-w-full object-contain"
      />

      {/* Dark gradient overlay for bottom controls */}
      <div
        className={`absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Play/Pause Center Giant Button (Visible only when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 rounded-full p-5 backdrop-blur-sm border border-white/10 transition-transform scale-100">
            <svg className="w-12 h-12 text-white ml-2 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Custom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2 transition-all duration-300 ease-out ${isHovering ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 w-full px-4 mb-2">
          {/* Play/Pause Button */}
          <button onClick={togglePlay} className="text-white hover:text-[#1aa18e] transition transform hover:scale-110">
            {isPlaying ? (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          {/* Progress Bar */}
          <div className="flex-1 group/bar relative flex items-center h-8 cursor-pointer group hover:h-8">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
            />
            {/* Visual Bar Background */}
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden transition-all duration-300 group-hover/bar:h-2">
              {/* Visual Progress */}
              <div className="h-full bg-[#1aa18e] transition-all" style={{ width: `${progress}%` }} />
            </div>
            {/* Playhead thumb */}
            <div
              className="absolute h-4 w-4 bg-white rounded-full shadow-md transition-transform scale-0 group-hover/bar:scale-100 pointer-events-none"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>

          {/* Mute/Unmute Button */}
          <button onClick={toggleMute} className="text-white hover:text-[#1aa18e] transition transform hover:scale-110">
            {isMuted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ type: string; src: string } | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTransition, setHeroTransition] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const heroItems = [
    { text: "1000 Happy Travelers", color: "#10b981" }, // Vibrant Green
    { text: "45 Destinations", color: "#ef4444" },        // Vibrant Red
    { text: "150 Trips Completed", color: "#f59e0b" }     // Vibrant Orange
  ];
  // Clone first item at end for seamless loop
  const heroDisplay = [...heroItems, heroItems[0]];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMedia(null);
      }
    };

    if (selectedMedia) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedMedia]);


  useEffect(() => {
    if (!mounted) return;
    const interval = window.setInterval(() => {
      setHeroIndex((prev) => {
        const next = prev + 1;
        if (next > heroItems.length) {
          // Should not happen, but safety
          return 1;
        }
        return next;
      });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [mounted, heroItems.length]);

  // When we reach the cloned item (index === heroItems.length),
  // wait for the transition to finish, then instantly reset to 0
  useEffect(() => {
    if (heroIndex === heroItems.length) {
      const timer = window.setTimeout(() => {
        setHeroTransition(false);
        setHeroIndex(0);
        // Re-enable transition after the instant reset
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setHeroTransition(true);
          });
        });
      }, 540); // slightly longer than transition duration (520ms)
      return () => window.clearTimeout(timer);
    }
  }, [heroIndex, heroItems.length]);

  // 82 Real testimonial assets (64 Images + 18 Videos)
  const OPT = "f_auto,q_auto:eco,w_400,dpr_auto";
  const V_OPT = "q_auto:eco,f_auto,w_400";
  const allCards = [
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_25_uxj3li.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_55_qibijw.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508039/Image_Testimonial_13_cuimxf.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508076/Video_Testimonial_18_vtmkd1.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_41_dw1let.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508064/Image_Testimonial_6_muovpc.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT},c_fill,ar_9:16/v1774508074/Video_Testimonial_1_ducwll.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_19_yzl92p.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_36_xgta9u.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508074/Video_Testimonial_15_ey8nyr.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_63_zksw9a.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508042/Image_Testimonial_33_rlunla.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508073/Video_Testimonial_14_duxanb.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_10_aqf4wg.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_16_qiglmd.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508072/Video_Testimonial_17_nize4l.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508059/Image_Testimonial_2_g4fzr5.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_44_sxnxeb.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508071/Video_Testimonial_5_kuestu.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_29_gj5ozh.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_51_l4wh6p.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508068/Video_Testimonial_13_s1be2m.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508039/Image_Testimonial_21_a3nwuo.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_60_snkhsz.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508067/Video_Testimonial_12_nxsmh6.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_8_slcqkx.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508048/Image_Testimonial_45_z632df.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508067/Video_Testimonial_4_f4fhia.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_22_qypr6c.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_56_entswt.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508067/Video_Testimonial_7_vvh8bz.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508064/Image_Testimonial_7_lr46a2.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_35_m2u21b.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508066/Video_Testimonial_11_xf3ceo.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_24_lrsbam.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508039/Image_Testimonial_14_mvk3oc.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508066/Video_Testimonial_9_fcqxnz.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_42_hkugce.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_54_uwg0de.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_18_vsczjb.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_64_lic91c.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508065/Video_Testimonial_3_h0uzap.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508059/Image_Testimonial_3_rijbpi.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_40_ip7gzk.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508065/Video_Testimonial_6_glwdrz.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_17_crgbhq.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508042/Image_Testimonial_37_dlzfka.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508059/Video_Testimonial_16_bmoa6w.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508051/Image_Testimonial_49_ugoweq.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508039/Image_Testimonial_20_ffne79.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508058/Video_Testimonial_10_eesoa5.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_34_fvhvzi.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_61_f5eufh.jpg` },
    { type: "video", src: `https://res.cloudinary.com/dop1mi4lg/video/upload/${V_OPT}/v1774508058/Video_Testimonial_2_cpos4n.mp4` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508060/Image_Testimonial_5_bbbbhs.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_52_tathvr.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_26_p5s74k.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508048/Image_Testimonial_47_lcunwr.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508039/Image_Testimonial_11_ftmp9b.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508058/Image_Testimonial_1_wxk1ip.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_28_aj2nbn.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_43_atokx6.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_53_oqi04f.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_12_rceih6.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508042/Image_Testimonial_32_l5f2eb.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_62_mmxb2n.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508059/Image_Testimonial_4_hmqvnz.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_23_cya2qq.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508051/Image_Testimonial_48_czvxee.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_27_ppduff.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_30_zhi6bi.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_50_bu2zhj.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508038/Image_Testimonial_9_ct488c.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508049/Image_Testimonial_46_d1j0jt.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508042/Image_Testimonial_38_ml01eq.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508057/Image_Testimonial_57_lirpy9.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508041/Image_Testimonial_31_ighrr6.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508040/Image_Testimonial_15_bqcgyr.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508053/Image_Testimonial_59_l61agw.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508047/Image_Testimonial_39_atkpxk.jpg` },
    { type: "image", src: `https://res.cloudinary.com/dop1mi4lg/image/upload/${OPT}/v1774508052/Image_Testimonial_58_nhy2i1.jpg` },
  ];
  const [maxHeight, setMaxHeight] = useState(850);
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    if (mounted && containerRef.current) {
      setTotalHeight(containerRef.current.scrollHeight);
    }
  }, [mounted, allCards.length]); // Check height on mount

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Dynamic Background Decorative Flowers */}
      {Array.from({ length: Math.ceil((totalHeight || 2000) / (mounted && window.innerWidth < 640 ? 1000 : 700)) + 1 }).map((_, i) => {
        const isLeft = i % 2 !== 0;
        const isMobile = mounted && window.innerWidth < 640;
        const currentSpacing = isMobile ? 1000 : 700;

        // First flower is special (top-right, extra large)
        if (i === 0) {
          return (
            <div
              key="flower-0"
              className="absolute top-4 right-0 z-0 h-72 w-72 sm:h-96 sm:w-96 lg:h-[600px] lg:w-[600px]"
              style={{ opacity: 0.4, transform: 'translate(25%, -25%)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="h-full w-full"
              >
                <img
                  src="/Why%20Choose%20Us/BG%20Flower.webp"
                  alt="Decorative Background Flower"
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </div>
          );
        }

        // Subsequent flowers (alternating sides, slightly smaller)
        return (
          <div
            key={`flower-${i}`}
            className="absolute z-0 h-64 w-64 lg:h-[450px] lg:w-[450px]"
            style={{
              top: `${i * currentSpacing + (isMobile ? 300 : 200)}px`,
              left: isLeft ? 0 : 'auto',
              right: isLeft ? 'auto' : 0,
              opacity: isMobile ? 0.35 : 0.25,
              transform: isLeft ? 'translateX(-25%)' : 'translateX(25%)'
            }}
          >
            <motion.div
              animate={{ rotate: isLeft ? -360 : 360 }}
              transition={{ duration: 50 + i * 5, repeat: Infinity, ease: "linear" }}
              className="h-full w-full"
            >
              <img
                src="/Why%20Choose%20Us/BG%20Flower.webp"
                alt="Decorative Background Flower"
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        );
      })}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:pt-36 lg:px-8">
        <div className="flex flex-col items-center gap-12 text-center">
          <h1 className="w-full max-w-full text-center font-unbounded text-[#000945] !text-[24px] leading-[1.2] tracking-[-0.03em] sm:!text-[34px] md:!text-[44px] lg:!text-[56px] xl:!text-[64px] font-extrabold flex flex-col items-center justify-center gap-y-1 sm:flex-row sm:gap-y-0 sm:gap-x-4">
            <span className="flex-shrink-0">More Than</span>
            <span className="hero-rotator w-max text-center">
              <span
                suppressHydrationWarning
                className={`hero-rotator-inner${heroTransition ? '' : ' no-transition'}`}
                style={{ transform: `translateY(${heroIndex * -(1.1)}em)` }}
              >
                {heroDisplay.map((item, i) => (
                  <span
                    key={`${item.text}-${i}`}
                    className="hero-rotator-item"
                    style={{ color: item.color }}
                  >
                    {item.text}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="relative w-full">
            <motion.div
              animate={{ maxHeight: maxHeight }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
            >
              <div ref={containerRef} className="columns-2 gap-4 sm:columns-3 lg:columns-5">
                {allCards.map((card, index) => (
                  <div
                    key={`${card.type}-${index}`}
                    className="mb-4 break-inside-avoid cursor-pointer group"
                    onClick={() => setSelectedMedia({ type: card.type, src: card.src })}
                  >
                    {card.type === "video" ? (
                      <div className="relative w-full overflow-hidden rounded-[6px] bg-[#e7dfd6]">
                        <TestimonialVideoCard src={card.src} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
                          <svg className="w-10 h-10 text-white shadow-xl" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-[6px] bg-[#e7dfd6]">
                        <img
                          src={card.src}
                          alt="Happy travelers"
                          className="w-full h-auto object-cover block"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Fading view more CTA */}
              {maxHeight < (totalHeight || 5000) && (
                <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center pt-32 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
                  <button
                    onClick={() => setMaxHeight(prev => prev + 1000)}
                    className="pointer-events-auto cursor-pointer rounded-full border border-gray-300 bg-gray-100 px-6 py-2.5 text-xs font-bold text-gray-600 transition-all duration-300 hover:border-gray-400 hover:bg-gray-200"
                  >
                    View More
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox / Media Viewer */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
              onClick={() => setSelectedMedia(null)}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-50 p-2 cursor-pointer text-white/70 hover:text-white transition-colors bg-black/50 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-h-full max-w-5xl rounded-lg overflow-hidden flex items-center justify-center bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMedia.type === "video" ? (
                  <CustomVideoPlayer src={selectedMedia.src.replace("w_400", "w_1200")} />
                ) : (
                  <img
                    src={selectedMedia.src.replace("w_400", "w_1200")}
                    alt="Full view testimonial"
                    className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
