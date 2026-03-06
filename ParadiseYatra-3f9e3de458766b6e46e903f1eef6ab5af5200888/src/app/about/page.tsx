"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { LazyHeader } from "@/components/lazy-components";
import { ChevronRight, Phone, Mail } from "lucide-react";
import Image from "next/image";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";

const missionStates = [
  {
    label: "Personalized Itineraries",
    subtitle: "Every trip is designed around your pace, interests, and budget.",
    intro:
      "At Paradise Yatra, we do not believe in one-size-fits-all travel. We begin by understanding your travel style, priorities, and budget before designing the journey.",
    detail:
      "From honeymoons and family holidays to group adventures and spiritual tours, each itinerary is crafted to feel truly personal.",
    points: [
      { title: "Built Around You", text: "We design routes around your interests, not generic templates." },
      { title: "Flexible Plans", text: "Duration, pace, and activities are tailored to your comfort." },
      { title: "Curated Stays", text: "Handpicked hotels and transport for smoother travel." },
      { title: "Meaningful Days", text: "Each day is planned to create memorable experiences." },
    ],
  },
  {
    label: "Transparent Planning",
    subtitle: "Clear packages, clear timelines, clear expectations.",
    intro:
      "Holiday planning should feel exciting, not overwhelming. We keep every step clear, structured, and easy to understand from day one.",
    detail:
      "Before you book, you know exactly what is included, what is optional, and how your trip days are organized.",
    points: [
      {
        title: "No Hidden Surprises",
        text: "Clear inclusions and exclusions shared upfront.",
      },
      {
        title: "Day-wise Visibility",
        text: "Practical itineraries so you can visualize the journey before travel.",
      },
      {
        title: "Budget Clarity",
        text: "Recommendations that balance quality experiences with your budget goals.",
      },
      {
        title: "Confident Decisions",
        text: "Straight answers and clear communication at every stage.",
      },
    ],
  },
  {
    label: "Reliable Support",
    subtitle: "Strong assistance before, during, and after your trip.",
    intro:
      "Great journeys depend on dependable support. Our team stays connected from your first inquiry to your safe return home.",
    detail:
      "From booking support to on-ground coordination, we are available when it matters most.",
    points: [
      { title: "Responsive Team", text: "Quick help through calls, chat, and updates." },
      { title: "Local Coordination", text: "Trusted ground teams for smooth day-to-day execution." },
      { title: "Reliable Vendors", text: "Verified hotels, vehicles, and activity partners." },
      { title: "Travel Peace", text: "Confidence that support is always within reach." },
    ],
  },
  {
    label: "Authentic Experiences",
    subtitle: "Travel deeper with culture, food, and local stories.",
    intro:
      "We believe travel is more than ticking places off a list. It is about local life, regional culture, and moments that feel real.",
    detail:
      "Our itineraries blend popular highlights with authentic experiences that connect you to the destination.",
    points: [
      { title: "Local Culture", text: "Experiences rooted in local heritage and traditions." },
      { title: "Regional Flavors", text: "Food recommendations that showcase authentic local cuisine." },
      { title: "Hidden Gems", text: "Less crowded spots beyond the standard tourist route." },
      { title: "Responsible Choices", text: "Travel that respects places, people, and communities." },
    ],
  },
  {
    label: "Built on Trust",
    subtitle: "Long-term traveler relationships are at the heart of our brand.",
    intro:
      "Trust is earned through consistency. At Paradise Yatra, we focus on honest guidance, dependable execution, and genuine care in every interaction.",
    detail:
      "Our strongest growth comes from repeat travelers and referrals who trust how we plan, support, and deliver.",
    points: [
      { title: "Honest Advice", text: "Recommendations made for traveler benefit, not upselling." },
      { title: "Consistent Quality", text: "A dependable service standard across trips and destinations." },
      { title: "Clear Communication", text: "Regular updates before, during, and after travel." },
      { title: "Long-term Relationships", text: "We aim to be your trusted travel partner, trip after trip." },
    ],
  },
];

const AboutPage = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [activeMissionIndex, setActiveMissionIndex] = useState(1);
  const activeMission = missionStates[activeMissionIndex];
  const lifeSectionRef = useRef<HTMLElement | null>(null);
  const [playLifeVideos, setPlayLifeVideos] = useState(false);
  const [loadLifeVideos, setLoadLifeVideos] = useState(false);

  const pageVariants = useMemo(
    () => ({
      initial: { opacity: prefersReducedMotion ? 1 : 0 },
      animate: { opacity: 1 },
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "easeInOut" as const,
      } satisfies Transition,
    }),
    [prefersReducedMotion]
  );

  useEffect(() => {
    const section = lifeSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadLifeVideos(true);
        }
        setPlayLifeVideos(entry.isIntersecting);
      },
      { threshold: 0.35, rootMargin: "250px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = lifeSectionRef.current;
    if (!section) return;
    const videos = Array.from(section.querySelectorAll("video[data-life-reel='true']"));
    videos.forEach((video) => {
      if (playLifeVideos) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [playLifeVideos]);

  return (
    <motion.div
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="min-h-screen bg-background overflow-x-hidden w-full"
      role="main"
      aria-label="About Paradise Yatra - Our Story and Mission"
    >
      <LazyHeader />

      <section className="bg-white pt-8 md:pt-10">
        <div className="mx-auto max-w-[1220px] px-4 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-unbounded flex flex-col gap-0 text-[42px] leading-[0.88] font-extrabold tracking-tight text-[#000945] sm:text-[48px] md:text-[72px]"
            >
              <span className="block whitespace-nowrap">Crafted For</span>
              <span className="block whitespace-nowrap">Curious Travelers</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:justify-self-end md:max-w-[440px]"
            >
              <p className="!text-[15px] leading-[1.45] !text-[#000945] md:!text-[17px]">
                Paradise Yatra is a modern travel company that helps explorers discover extraordinary destinations with
                curated itineraries, expert planning, and reliable on-ground support from start to finish.
              </p>
              <button
                type="button"
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-[6px] bg-[#155dfc] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f4de0]"
              >
                Start Planning Your Journey
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 md:mt-10 w-full overflow-hidden"
        >
          <Image
            src="/About/Hero/Untitled design.png"
            alt="Paradise Yatra hero"
            width={1920}
            height={900}
            sizes="100vw"
            className="h-[220px] w-full object-cover object-center sm:h-[280px] md:h-[640px]"
            priority
          />
        </motion.div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-[1220px] px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[190px_1fr] md:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-3 md:pt-1"
            >
              {missionStates.map((state, index) => {
                const isActive = activeMissionIndex === index;
                return (
                  <button
                    key={state.label}
                    type="button"
                    onClick={() => setActiveMissionIndex(index)}
                    className={`w-full cursor-pointer rounded-[6px] px-4 py-2.5 text-left text-[15px] font-semibold leading-none transition-colors md:w-fit md:text-[16px] ${
                      isActive
                        ? "bg-[#155dfc] text-white"
                        : "bg-white text-[#000945]"
                    }`}
                  >
                    {state.label}
                  </button>
                );
              })}
            </motion.div>

            <motion.div
              key={activeMission.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="max-w-[780px] !text-[#000945]"
            >
              <h2 className="about-section-heading tracking-tight text-[#000945]" style={{ fontWeight: 700 }}>
                {activeMission.label}
              </h2>
              <p className="mt-3 text-[18px] !text-[#000945] md:text-[20px]">{activeMission.subtitle}</p>

              <p className="mt-8 text-[15px] leading-7 !text-[#000945]">{activeMission.intro}</p>
              <p className="mt-8 text-[15px] leading-7 !text-[#000945]">{activeMission.detail}</p>

              <div className="mt-8 space-y-5">
                {activeMission.points.map((point) => (
                  <p key={point.title} className="text-[15px] leading-7 !text-[#000945]">
                    <span className="font-bold">{point.title}:</span> {point.text}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={lifeSectionRef} className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1220px] px-4 md:px-8">
          <div className="mb-8 md:mb-10">
            <h2
              className="about-section-heading mt-2 tracking-tight text-[#000945]"
              style={{ fontWeight: 700 }}
            >
              Life At Paradise Yatra
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              <div className="h-[250px] w-full overflow-hidden rounded-[6px] sm:col-span-2 md:h-[360px]">
                <Image
                  src="/About/Life At Paradise Yatra/Image 1.jpeg"
                  alt="Paradise Yatra team collaborating"
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-5 md:hidden sm:col-span-2">
                <div className="aspect-[9/16] w-full overflow-hidden rounded-[6px]">
                  <video
                    data-life-reel="true"
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    preload={loadLifeVideos ? "metadata" : "none"}
                  >
                    {loadLifeVideos ? (
                      <source src="/About/Life At Paradise Yatra/Reel 1.mp4" type="video/mp4" />
                    ) : null}
                  </video>
                </div>

                <div className="aspect-[9/16] w-full overflow-hidden rounded-[6px]">
                  <video
                    data-life-reel="true"
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    preload={loadLifeVideos ? "metadata" : "none"}
                  >
                    {loadLifeVideos ? (
                      <source src="/About/Life At Paradise Yatra/Reel 2.mp4" type="video/mp4" />
                    ) : null}
                  </video>
                </div>
              </div>

              <div className="h-[260px] w-full overflow-hidden rounded-[6px]">
                <Image
                  src="/About/Life At Paradise Yatra/Image 2.jpg"
                  alt="Paradise Yatra field experience"
                  width={700}
                  height={900}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>

              <div className="h-[260px] w-full overflow-hidden rounded-[6px]">
                <Image
                  src="/About/Life At Paradise Yatra/Image 3.jpg"
                  alt="Paradise Yatra travel moments"
                  width={700}
                  height={900}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-5">
              <div className="hidden h-[250px] w-full overflow-hidden rounded-[6px] md:block md:h-[360px]">
                <video
                  data-life-reel="true"
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload={loadLifeVideos ? "metadata" : "none"}
                >
                  {loadLifeVideos ? (
                    <source src="/About/Life At Paradise Yatra/Reel 1.mp4" type="video/mp4" />
                  ) : null}
                </video>
              </div>

              <div className="hidden h-[250px] w-full overflow-hidden rounded-[6px] md:block md:h-[360px]">
                <video
                  data-life-reel="true"
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload={loadLifeVideos ? "metadata" : "none"}
                >
                  {loadLifeVideos ? (
                    <source src="/About/Life At Paradise Yatra/Reel 2.mp4" type="video/mp4" />
                  ) : null}
                </video>
              </div>

              <div className="relative h-[260px] sm:col-span-2 overflow-hidden rounded-[6px] border border-[#1b2f5f] bg-black p-5 md:p-7">
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.95), rgba(56,189,248,0) 65%)",
                  }}
                  animate={{ x: [0, 120, -70, 0], y: [0, 65, -35, 0], scale: [1, 1.35, 0.82, 1], rotate: [0, 12, -8, 0] }}
                  transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 40%, rgba(59,130,246,0.95), rgba(59,130,246,0) 65%)",
                  }}
                  animate={{ x: [0, -95, 45, 0], y: [0, 70, -25, 0], scale: [1, 0.85, 1.25, 1], rotate: [0, -10, 7, 0] }}
                  transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 45% 45%, rgba(21,93,252,0.9), rgba(21,93,252,0) 65%)",
                  }}
                  animate={{ x: [0, -70, 60, 0], y: [0, -55, 30, 0], scale: [1, 1.2, 0.88, 1], rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 blur-2xl"
                  style={{
                    background:
                      "linear-gradient(120deg, rgba(6,182,212,0.22) 0%, rgba(14,165,233,0.3) 30%, rgba(21,93,252,0.26) 56%, rgba(59,130,246,0.28) 78%, rgba(125,211,252,0.24) 100%)",
                    backgroundSize: "220% 220%",
                    backgroundPosition: "0% 50%",
                  }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], x: [-24, 18, -12], y: [0, 10, -8] }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-55 mix-blend-soft-light"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.15%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.95%27/%3E%3C/svg%3E")',
                    backgroundSize: "220px 220px",
                    backgroundPosition: "0 0",
                  }}
                  animate={{ backgroundPosition: ["0 0", "220px 220px", "0 0"] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10 flex h-full items-center">
                  <p className="font-unbounded text-[20px] leading-[1.28] !text-white md:text-[28px]" style={{ color: "#ffffff" }}>
                    Every frame here is a glimpse of the energy, creativity, and teamwork behind Paradise Yatra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-14 md:py-20">
        <div className="relative mx-auto max-w-[1220px] px-4 md:px-8">
          <div className="mb-10 max-w-[760px]">
            <h2 className="about-section-heading mt-2 tracking-tight text-[#000945]" style={{ fontWeight: 700 }}>
              The Vision Behind Paradise Yatra
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-5"
            >
              <div className="relative overflow-hidden rounded-[6px] border border-[#dfe1df] bg-white">
                <div className="relative overflow-hidden">
                  <Image
                    src="/Male Profile (1).png"
                    alt="Dikshant Sharma - Founder, Paradise Yatra"
                    width={680}
                    height={820}
                    className="h-[420px] w-full object-cover object-top md:h-[560px]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-12">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] !text-white" style={{ color: "#ffffff" }}>
                      Founder & CEO
                    </p>
                    <p className="mt-1 text-[30px] font-extrabold tracking-tight !text-white md:text-[38px]" style={{ color: "#ffffff" }}>
                      Dikshant Sharma
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="md:col-span-7"
            >
              <div className="p-0 md:pl-2">
                <p className="text-[17px] leading-8 !text-[#000945] md:text-[19px]" style={{ color: "#000945" }}>
                  Dikshant Sharma built Paradise Yatra with one clear promise: travel should feel personal, seamless,
                  and unforgettable. From early route planning to scaling a trusted travel brand, his leadership combines
                  local insight with world-class service standards.
                </p>

                <div className="relative mt-6 overflow-hidden rounded-[6px] bg-black p-5 md:p-6">
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.95), rgba(56,189,248,0) 65%)",
                    }}
                    animate={{ x: [0, 120, -70, 0], y: [0, 65, -35, 0], scale: [1, 1.35, 0.82, 1], rotate: [0, 12, -8, 0] }}
                    transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, rgba(59,130,246,0.95), rgba(59,130,246,0) 65%)",
                    }}
                    animate={{ x: [0, -95, 45, 0], y: [0, 70, -25, 0], scale: [1, 0.85, 1.25, 1], rotate: [0, -10, 7, 0] }}
                    transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle at 45% 45%, rgba(21,93,252,0.9), rgba(21,93,252,0) 65%)",
                    }}
                    animate={{ x: [0, -70, 60, 0], y: [0, -55, 30, 0], scale: [1, 1.2, 0.88, 1], rotate: [0, 8, -6, 0] }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 blur-2xl"
                    style={{
                      background:
                        "linear-gradient(120deg, rgba(6,182,212,0.22) 0%, rgba(14,165,233,0.3) 30%, rgba(21,93,252,0.26) 56%, rgba(59,130,246,0.28) 78%, rgba(125,211,252,0.24) 100%)",
                      backgroundSize: "220% 220%",
                      backgroundPosition: "0% 50%",
                    }}
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], x: [-24, 18, -12], y: [0, 10, -8] }}
                    transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-55 mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.15%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.95%27/%3E%3C/svg%3E")',
                      backgroundSize: "220px 220px",
                      backgroundPosition: "0 0",
                    }}
                    animate={{ backgroundPosition: ["0 0", "220px 220px", "0 0"] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative z-10">
                    <p className="text-[18px] font-semibold leading-8 !text-white md:text-[20px]" style={{ color: "#ffffff" }}>
                      "Our goal is simple: make every journey meaningful, and every traveler feel taken care of from
                      the first call to the final memory."
                    </p>
                    <p className="mt-3 text-sm font-medium !text-white/90" style={{ color: "rgba(255,255,255,0.9)" }}>
                      Dikshant Sharma, Founder - Paradise Yatra
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="p-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] !text-[#000945]" style={{ color: "#000945" }}>Experience</p>
                    <p className="mt-1 text-[28px] font-extrabold !text-[#000945]" style={{ color: "#000945" }}>10+</p>
                    <p className="text-sm !text-[#000945]" style={{ color: "#000945" }}>Years in Travel</p>
                  </div>
                  <div className="p-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] !text-[#000945]" style={{ color: "#000945" }}>Coverage</p>
                    <p className="mt-1 text-[28px] font-extrabold !text-[#000945]" style={{ color: "#000945" }}>25+</p>
                    <p className="text-sm !text-[#000945]" style={{ color: "#000945" }}>Destinations</p>
                  </div>
                  <div className="p-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] !text-[#000945]" style={{ color: "#000945" }}>Trust</p>
                    <p className="mt-1 text-[28px] font-extrabold !text-[#000945]" style={{ color: "#000945" }}>1000+</p>
                    <p className="text-sm !text-[#000945]" style={{ color: "#000945" }}>Happy Travelers</p>
                  </div>
                </div>

                <div className="mt-7">
                  <a
                    href="mailto:dikshant@paradiseyatra.com"
                    className="inline-flex items-center gap-2 rounded-[6px] border border-[#dfe1df] bg-white px-6 py-2.5 text-sm font-semibold !text-[#000945] transition-colors hover:bg-[#ecf3ff]"
                    style={{ color: "#000945" }}
                  >
                    Connect with the Founder
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1220px] px-4 md:px-8">
          <div className="mb-9 md:mb-12">
            <h2 className="about-section-heading mt-2 tracking-tight text-[#000945]" style={{ fontWeight: 700 }}>
              Meet Us At
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="md:col-span-4"
            >
              <div className="space-y-4">
                <div className="rounded-[6px] border border-[#dfe1df] bg-white p-5 md:p-6">
                  <h3 className="text-[30px] !font-[600] tracking-tight text-[#000945]" style={{ fontWeight: 600 }}>Our Office</h3>
                  <p className="mt-2 text-[15px] leading-7 !text-[#000945]" style={{ color: "#000945" }}>
                    108, Tagore Villa, Chakrata Road, Dehradun, Uttarakhand - 248001
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <a
                      href="tel:+918979396413"
                      className="inline-flex items-center gap-2 text-[#000945] transition-colors hover:text-[#155dfc]"
                    >
                      <Phone className="h-4 w-4 text-[#155dfc]" />
                      <span className="text-sm font-semibold">+91 8979396413</span>
                    </a>
                    <br />
                    <a
                      href="mailto:info@paradiseyatra.com"
                      className="inline-flex items-center gap-2 text-[#000945] transition-colors hover:text-[#155dfc]"
                    >
                      <Mail className="h-4 w-4 text-[#155dfc]" />
                      <span className="text-sm font-semibold">info@paradiseyatra.com</span>
                    </a>
                  </div>
                </div>

                <div className="rounded-[6px] border border-[#dfe1df] bg-white p-5 md:p-6">
                  <h4 className="text-[30px] !font-[600] tracking-tight text-[#000945]" style={{ fontWeight: 600 }}>
                    Business Hours
                  </h4>
                  <p className="mt-3 text-[15px] leading-7 !text-[#000945]" style={{ color: "#000945" }}>
                    Mon - Sat: 10:00 AM - 6:30 PM
                  </p>
                  <p className="text-[15px] leading-7 !text-[#000945]" style={{ color: "#000945" }}>
                    Sun: Closed
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="md:col-span-8"
            >
              <div className="h-full overflow-hidden rounded-[6px] border border-[#dfe1df] bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1388.6582464962262!2d78.03477118988253!3d30.327473883386677!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092a19318db8c3%3A0xd8c55020cab7d0c4!2sParadise%20Yatra!5e0!3m2!1sen!2sin!4v1772634410746!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  title="Paradise Yatra Office Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <PerformanceMonitor showInProduction={false} />
    </motion.div>
  );
});

AboutPage.displayName = "AboutPage";

export default AboutPage;
