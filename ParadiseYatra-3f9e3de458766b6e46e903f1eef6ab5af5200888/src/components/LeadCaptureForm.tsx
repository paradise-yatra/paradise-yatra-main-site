"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, AlertCircle, Mail, Phone, User, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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
  budget: string;
  message: string;
  newsletterConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  destination?: string;
  budget?: string;
  message?: string;
  newsletterConsent?: string;
}

export default function LeadCaptureForm({ isOpen, onClose, packageTitle, packagePrice }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    destination: "",
    budget: "",
    message: "",
    newsletterConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Destination validation
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    } else if (formData.destination.trim().length < 2) {
      newErrors.destination = "Destination must be at least 2 characters";
    }

    // Budget validation
    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    } else {
      const budgetValue = parseFloat(formData.budget.replace(/[^\d.]/g, ""));
      if (isNaN(budgetValue) || budgetValue <= 0) {
        newErrors.budget = "Please enter a valid budget amount";
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          packageTitle,
          packagePrice,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          destination: "",
          budget: "",
          message: "",
          newsletterConsent: false,
        });
        // Close form after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 3000);
      } else {
        throw new Error("Failed to submit form");
      }
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md self-center -translate-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl border-0 !bg-white lead-capture-form">
              <CardHeader className="relative pb-1">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex justify-center">
                  <Image src="/headerLogo.png" alt="Logo" width={50} height={50} />
                </div>
                <CardTitle className="text-base font-bold text-gray-900 text-center">
                  Book Your Trip
                </CardTitle>
                {packageTitle && (
                  <p className="text-gray-600 text-center text-sm">
                    {packageTitle}
                    {packagePrice && ` • ${packagePrice}`}
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-6 pb-8">
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      We&apos;ve received your inquiry and will get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : submitStatus === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Please try again or contact us directly.
                    </p>
                    <Button
                      onClick={() => setSubmitStatus("idle")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium bg-white text-gray-700 mb-0.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className={`pl-10 ${errors.fullName ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!text-gray-700`}
                          placeholder="Enter your full name"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`pl-10 ${errors.email ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!bg-white focus:!text-gray-700`}
                          placeholder="Enter your email address"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!bg-white focus:!text-gray-700`}
                          placeholder="Enter your phone number"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Destination *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          value={formData.destination}
                          onChange={(e) => handleInputChange("destination", e.target.value)}
                          className={`pl-10 ${errors.destination ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!bg-white focus:!text-gray-700`}
                          placeholder="Enter your desired destination"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.destination && (
                        <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Budget *
                      </label>
                      <div className="relative">
                        <p className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 !mb-2">₹</p>
                        <Input
                          type="text"
                          value={formData.budget}
                          onChange={(e) => handleInputChange("budget", e.target.value)}
                          className={`pl-10 ${errors.budget ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!bg-white focus:!text-gray-700`}
                          placeholder="Enter your budget (e.g., ₹50,000)"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.budget && (
                        <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Message or Requirements *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className={`pl-10 min-h-[50px] ${errors.message ? "border-red-500" : ""} !bg-white !text-gray-700 focus:!bg-white focus:!text-gray-700`}
                          placeholder="Tell us about your travel requirements, preferred dates, number of travelers, etc."
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    <div className="flex items-start space-x-1.5">
                      <input
                        type="checkbox"
                        id="newsletterConsent"
                        checked={formData.newsletterConsent}
                        onChange={(e) => handleInputChange("newsletterConsent", e.target.checked)}
                        className="mt-0.5 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="newsletterConsent" className="text-xs text-gray-700 leading-tight">
                        I would like to receive newsletters and updates about travel deals and destinations
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 !text-white py-1.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:cursor-pointer disabled:transform-none disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Inquiry"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                      By submitting this form, you agree to our{" "}
                      <a 
                        href="/privacy-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="!text-blue-600 hover:!text-blue-700 underline underline-offset-2"
                      >
                        privacy policy
                      </a>
                      {" "}and{" "}
                      <a 
                        href="/terms-of-service" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="!text-blue-600 hover:!text-blue-700 underline underline-offset-2"
                      >
                        terms of service
                      </a>
                      .
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 