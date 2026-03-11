"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Landmark,
  Lock,
  Mail,
  Phone,
  Plane,
  ShieldCheck,
  Square,
} from "lucide-react";

const PAYMENT_LINK = "https://razorpay.me/@paradiseyatra1352";

const bookingTypes = [
  {
    title: "Package Booking",
    description: "Select your travel package first, then continue with payment.",
    href: "/package",
    icon: Plane,
  },
  {
    title: "Fixed Departure",
    description: "Choose your departure date first, then proceed to pay.",
    href: "/fixed-departures",
    icon: Calendar,
  },
];

const bankDetails = [
  { label: "Account Holder", value: "PARADISE YATRA" },
  { label: "Bank Name", value: "HDFC" },
  { label: "Account No.", value: "50200053051934" },
  { label: "IFSC Code", value: "HDFC0000225" },
  { label: "Branch", value: "RAJPUR ROAD, DEHRADUN" },
];

const checklistItems = [
  "Razorpay ID or UTR number",
  "Full name used for the booking",
  "Package or departure name",
  "Travel date and total travellers",
];

const securityNotes = [
  {
    title: "Use verified details only",
    description: "Pay only through the Razorpay link and bank details shown on this page.",
    icon: ShieldCheck,
  },
  {
    title: "Never share card secrets",
    description: "Do not share OTP, card PIN, CVV, or banking passwords with anyone.",
    icon: CreditCard,
  },
  {
    title: "Confirmation follows verification",
    description: "Payment is reviewed by our team before the booking is fully confirmed.",
    icon: Lock,
  },
];

const portalSteps = [
  {
    step: "Step 1:",
    title: "Select Booking Type",
    accent: "bg-white",
  },
  {
    step: "Step 2:",
    title: "Choose Payment Method",
    accent: "bg-white",
  },
  {
    step: "Step 3:",
    title: "Share Details & Confirm",
    accent: "bg-white",
  },
];

export default function PaymentPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <Header />

      <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6 md:py-10">
        <section className="rounded-[6px] bg-white py-4 text-center">
          <h1 className="font-unbounded text-[28px] font-extrabold tracking-[-0.03em] text-[#000945] md:text-[34px]">
            Lets get this done
          </h1>
          <p className="mt-1 text-sm font-medium !text-[#000945] md:text-[15px]">
            Simple, verified payment options with clear next steps for confirmation.
          </p>
        </section>

        <section className="mt-6 overflow-hidden rounded-[6px] border border-[#d8dce2] bg-white">
          <div className="grid md:grid-cols-3">
            {portalSteps.map((item, index) => (
              <div
                key={item.title}
                className={`relative px-4 py-4 text-center ${item.accent} ${index < portalSteps.length - 1 ? "border-b border-[#d8dce2] md:border-b-0 md:border-r" : ""}`}
              >
                <p className="text-[13px] font-bold !text-[#000945]">{item.step}</p>
                <p className="mt-1 text-[15px] font-extrabold !text-[#000945]">{item.title}</p>
                {index < portalSteps.length - 1 ? (
                  <div className="absolute right-[-12px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#d7dbe1] bg-white md:flex">
                    <ChevronRight className="h-3.5 w-3.5 text-[#000945]" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[6px] border border-[#d8dce2] bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            {bookingTypes.map((type) => {
              const Icon = type.icon;

              return (
                <Link
                  key={type.title}
                  href={type.href}
                  className="group flex items-center justify-between rounded-[6px] border border-[#d8dce2] bg-white px-4 py-4 transition-colors hover:border-[#000945] hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-[#d8dce2] bg-white text-[#000945]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold !text-[#000945]">{type.title}</p>
                      <p className="mt-0.5 text-[13px] !text-[#000945]">{type.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#000945] transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[6px] border border-[#8eb0dd] bg-white">
            <div className="bg-[#000945] px-5 py-4 text-center text-[25px] font-extrabold tracking-[-0.03em] text-white">
              Instant Gateway (Razorpay)
            </div>

            <div className="p-5">
              <a
                href={PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#000945] px-4 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#111d5f]"
              >
                Pay Securely with Razorpay
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <div className="mt-5">
                <p className="text-[17px] font-extrabold !text-[#000945]">
                  Accepted UPI, Cards, Net Banking, Wallets
                </p>
                <p className="mt-2 text-[13px] leading-6 !text-[#000945]">
                  Razorpay payment link provides a trusted method for cards and net banking, while also supporting UPI
                  apps and secure wallet transactions.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <Image
                  referrerPolicy="origin"
                  src="https://badges.razorpay.com/badge-light.png"
                  alt="Razorpay | Payment Gateway | Neobank"
                  width={113}
                  height={45}
                  className="h-[45px] w-[113px]"
                />
              </div>

              <div className="mt-5">
                <p className="text-center text-[13px] font-bold !text-[#000945]">Unique payment link</p>
                <div className="mt-3 flex items-center rounded-[6px] border border-[#d7dbe1] bg-[#f6f7f8] px-3 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium !text-[#000945]">
                    {PAYMENT_LINK}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#d0d5db] bg-white text-[#4d5662] transition-colors hover:bg-[#eef3fb]"
                    aria-label="Copy payment link"
                  >
                    {copied ? <Check className="h-4 w-4 text-[#2d73c7]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {copied ? <p className="mt-2 text-right text-[12px] font-semibold !text-[#000945]">Payment link copied</p> : null}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[6px] border border-[#d8dce2] bg-white">
            <div className="bg-[#e7edf4] px-5 py-4 text-center text-[25px] font-extrabold tracking-[-0.03em] text-[#000945]">
              Direct Bank Transfer
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[17px] font-extrabold !text-[#000945]">Verified Bank Details</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ee] px-2.5 py-1 text-[12px] font-bold text-[#1f8a49]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>

              <div className="mt-4 rounded-[6px] bg-[#f2f3f5] p-4">
                <div className="space-y-3">
                  {bankDetails.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1 border-b border-[#dde1e6] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start">
                      <span className="w-[110px] shrink-0 text-[13px] font-bold !text-[#000945]">{item.label}</span>
                      <span className="hidden text-[13px] font-bold !text-[#000945] sm:inline">:</span>
                      <span className="text-[13px] font-semibold !text-[#000945]">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-[#dde1e6] pt-4">
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] !text-[#000945]">NEFT / IMPS / RTGS</p>
                  <p className="mt-2 text-[13px] leading-6 !text-[#000945]">
                    Use these verified details for direct transfer. After payment, share your transaction reference so
                    our team can verify and confirm the booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <div className="!bg-white py-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#000945] md:text-[36px]">
                  Post-Payment Checklist
                </h2>
              </div>
              <p className="max-w-[500px] text-[13px] leading-6 !text-[#000945] md:text-right">
                Share these details once payment is done so the team can verify quickly and lock the booking without follow-up delays.
              </p>
            </div>

            <div className="mt-5 grid gap-x-6 gap-y-0 md:grid-cols-2">
              {checklistItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-[#e4e7ed] py-3 last:border-b md:last:border-b-0"
                >
                  <Square className="h-4 w-4 shrink-0 text-[#000945]" />
                  <p className="text-[13px] font-semibold leading-5 !text-[#000945]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[6px] border border-[#f2cf7e] !bg-white p-3 md:p-3.5">
            <div className="flex flex-col gap-1.5">
              <div>
                <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#6b4300] md:text-[30px]">
                  Important Security Notes
                </h2>
              </div>
              <p className="max-w-[560px] text-[12px] leading-5 !text-[#7b5208]">
                Treat this as a final payment safety check. Every point below directly protects the booking and the customer.
              </p>
            </div>

            <div className="mt-2.5 space-y-0">
              {securityNotes.map((note) => {
                const Icon = note.icon;

                return (
                  <div
                    key={note.title}
                    className="flex items-start gap-2 border-b border-[#edd38f] py-2.5 last:border-b-0"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#9a6200]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-extrabold leading-4.5 text-[#6b4300]">{note.title}</p>
                      <p className="mt-0.5 text-[11px] leading-4.5 !text-[#7b5208]">{note.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[10px] border border-[#d8dce2] bg-white px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#1e2126]">Need help after payment?</p>
              <p className="mt-1 text-[13px] text-[#5e6670]">
                Share your payment reference and booking details with our team for verification.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="tel:+918031274154"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#d4d9e0] bg-[#fafbfc] px-4 py-2 text-[13px] font-semibold text-[#21242a] transition-colors hover:bg-[#f2f5fa]"
              >
                <Phone className="h-4 w-4 text-[#2d73c7]" />
                +91 8031274154
              </a>
              <a
                href="mailto:info@paradiseyatra.com"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#d4d9e0] bg-[#fafbfc] px-4 py-2 text-[13px] font-semibold text-[#21242a] transition-colors hover:bg-[#f2f5fa]"
              >
                <Mail className="h-4 w-4 text-[#2d73c7]" />
                info@paradiseyatra.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#2d73c7] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#235fa7]"
              >
                <Landmark className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
