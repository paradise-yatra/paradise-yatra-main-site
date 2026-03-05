"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LeadCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle?: string;
  packagePrice?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  travelDate?: Date;
  message: string;
  newsletterConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  destination?: string;
  travelDate?: string;
  message?: string;
  newsletterConsent?: string;
}

const inputClass =
  "w-full rounded-[6px] border border-slate-300 bg-white py-3 pl-11 pr-3 text-sm text-[#000945] outline-none transition focus:border-[#000945] focus:ring-0 placeholder:text-slate-400";

const textAreaClass =
  "w-full min-h-[72px] rounded-[6px] border border-slate-300 bg-white py-3 pl-11 pr-3 text-sm text-[#000945] outline-none transition focus:border-[#000945] focus:ring-0 placeholder:text-slate-400 resize-none";

function FieldError({ message }: { message?: string }) {
  return (
    <div className="relative z-20 mt-1 h-[16px] overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-[11px] font-medium leading-none !text-red-500"
            style={{ color: "#ef4444" }}
          >
            {message}
          </motion.p>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            className="text-[11px]"
          >
            &nbsp;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LeadCaptureForm({
  isOpen,
  onClose,
  packageTitle,
  packagePrice,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: undefined,
    message: "",
    newsletterConsent: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const fullName = formData.fullName.trim();
    if (!fullName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (fullName.length < 3) {
      newErrors.fullName = "Full name should be at least 3 characters.";
    } else if (!/^[a-zA-Z.\s]+$/.test(fullName)) {
      newErrors.fullName = "Name can contain only letters, spaces, and dots.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address (example: name@email.com).";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is mandatory so we can reach you.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      newErrors.phone = "Please enter a valid mobile number (10 to 13 digits).";
    }

    if (formData.destination.trim() && formData.destination.trim().length < 2) {
      newErrors.destination = "Destination name looks too short.";
    }

    if (formData.message.trim() && formData.message.trim().length < 10) {
      newErrors.message = "Please add at least 10 characters in requirements.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const travelDateText = formData.travelDate
      ? format(formData.travelDate, "MMM dd, yyyy")
      : "Not specified";
    const enhancedMessage = `Travel Date: ${travelDateText}\n\n${formData.message}`;

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message: enhancedMessage,
          travelDate: formData.travelDate?.toISOString(),
          packageTitle,
          packagePrice,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        destination: "",
        travelDate: undefined,
        message: "",
        newsletterConsent: true,
      });

      setTimeout(() => {
        setSubmitStatus("idle");
        onClose();
      }, 2200);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[6px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 cursor-pointer rounded-full bg-white/90 p-2 text-slate-700 transition hover:bg-white"
              aria-label="Close lead capture form"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[calc(100vh-2.5rem)] grid-cols-1 overflow-y-auto lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative hidden min-h-[180px] lg:block lg:min-h-[520px]">
                <Link
                  href="https://paradiseyatra.com/package/royal-egypt-nile-heritage-journey"
                  className="block h-full w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/Home/Pop Up Form/Image.jpg"
                    alt="Travel planning"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                    <div className="space-y-4">
                      <h2
                        className="max-w-md leading-tight text-white line-clamp-2"
                        style={{ fontSize: "25px", fontWeight: 800 }}
                      >
                        Relax in Egypt with Nile sunsets, timeless beauty, and calm escapes.
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="bg-white p-5 sm:p-8">
                {submitStatus === "success" ? (
                  <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                    <CheckCircle className="mb-4 h-14 w-14 text-green-500" />
                    <h4 className="mb-2 text-2xl font-bold text-[#000945]">You are all set.</h4>
                    <p className="max-w-sm text-sm text-slate-600">
                      Thank you for sharing your details. Our travel expert will call
                      you shortly with a personalized plan.
                    </p>
                  </div>
                ) : submitStatus === "error" ? (
                  <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                    <AlertCircle className="mb-4 h-14 w-14 text-red-500" />
                    <h4 className="mb-2 text-2xl font-bold text-[#000945]">Submission Failed</h4>
                    <p className="max-w-sm text-sm text-slate-600">
                      Something went wrong. Please try again.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="mt-4 rounded-xl bg-[#155dfc] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f4bce]"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <>
                    <h2
                      className="leading-tight"
                      style={{ fontSize: "30px", fontWeight: 700, color: "#000945" }}
                    >
                      Plan My Trip
                    </h2>
                    <p className="mt-2 text-sm text-[#000945]">
                      Fill details and get a custom itinerary.
                    </p>

                    {(packageTitle || packagePrice) && (
                      <div className="mt-4 rounded-xl border border-[#155dfc]/20 bg-[#155dfc]/5 px-3 py-2 text-sm text-[#000945]">
                        <span className="font-semibold">{packageTitle || "Selected Package"}</span>
                        {packagePrice && (
                          <span className="ml-2 text-[#155dfc]">{packagePrice}</span>
                        )}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-3 space-y-1.5">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative">
                          <label className="mb-1 block text-xs font-semibold text-[#000945]">
                            Full name
                          </label>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000945]" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              className={`${inputClass} ${errors.fullName ? "border-red-500" : ""}`}
                              placeholder="Your name"
                              disabled={isSubmitting}
                            />
                          </div>
                          <FieldError message={errors.fullName} />
                        </div>

                        <div className="relative">
                          <label className="mb-1 block text-xs font-semibold text-[#000945]">
                            Phone
                          </label>
                          <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000945]" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`}
                              placeholder="Phone number"
                              disabled={isSubmitting}
                            />
                          </div>
                          <FieldError message={errors.phone} />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="mb-1 block text-xs font-semibold text-[#000945]">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000945]" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                          />
                        </div>
                        <FieldError message={errors.email} />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative">
                          <label className="mb-1 block text-xs font-semibold text-[#000945]">
                            Destination
                          </label>
                          <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#000945]" />
                            <input
                              type="text"
                              value={formData.destination}
                              onChange={(e) => handleInputChange("destination", e.target.value)}
                              className={`${inputClass} ${errors.destination ? "border-red-500" : ""}`}
                              placeholder="Where do you want to go?"
                              disabled={isSubmitting}
                            />
                          </div>
                          <FieldError message={errors.destination} />
                        </div>

                        <div className="relative">
                          <label className="mb-1 block text-xs font-semibold text-[#000945]">
                            Travel Date
                          </label>
                          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="w-full rounded-[6px] border !border-[#dfe1df] bg-white px-3 py-3 text-left text-sm text-[#000945] outline-none transition focus:!border-[#dfe1df] active:!border-[#dfe1df] hover:!border-[#dfe1df] focus:ring-0 flex items-center gap-2 cursor-pointer"
                                style={{ borderColor: "#dfe1df", borderWidth: "1px" }}
                              >
                                <Calendar className="h-4 w-4 text-[#000945]" />
                                <span className={formData.travelDate ? "text-[#000945]" : "text-slate-400"}>
                                  {formData.travelDate
                                    ? format(formData.travelDate, "MMM dd, yyyy")
                                    : "Pick a date"}
                                </span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="z-[9999] w-auto p-0 !rounded-[6px] !border-[#dfe1df]" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={formData.travelDate}
                                classNames={{ day_button: "cursor-pointer" }}
                                onSelect={(d) => {
                                  handleInputChange("travelDate", d || undefined);
                                  setTimeout(() => setCalendarOpen(false), 150);
                                }}
                                disabled={{ before: new Date() }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FieldError message={errors.travelDate} />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="mb-1 block text-xs font-semibold text-[#000945]">
                          Travel requirements
                        </label>
                        <div className="relative">
                          <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#000945]" />
                          <textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            className={`${textAreaClass} ${errors.message ? "border-red-500" : ""}`}
                            placeholder="Dates, number of travelers, preferences, etc."
                            disabled={isSubmitting}
                          />
                        </div>
                        <FieldError message={errors.message} />
                      </div>

                      <p className="mt-0.5 text-center text-[11px] font-medium leading-4 text-slate-500">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="font-semibold text-[#155dfc] underline underline-offset-2 hover:text-[#0f4bce]"
                        >
                          Terms of Use
                        </Link>{" "}
                        and confirm you have read our{" "}
                        <Link
                          href="/privacy-policy"
                          className="font-semibold text-[#155dfc] underline underline-offset-2 hover:text-[#0f4bce]"
                        >
                          Privacy and Cookie Statement
                        </Link>
                        .
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#155dfc] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f4bce] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting
                          </>
                        ) : (
                          "Get Custom Plan"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
