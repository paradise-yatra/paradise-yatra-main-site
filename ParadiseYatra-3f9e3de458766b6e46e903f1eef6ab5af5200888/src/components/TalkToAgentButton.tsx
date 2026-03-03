"use client";

import { PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/admin"];

export default function TalkToAgentButton() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isHidden) {
    return null;
  }

  return (
    <a
      href="tel:+918979269388"
      aria-label="Talk to agent"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 inline-flex items-center gap-1.5 rounded-full border border-[#dfe1df] bg-white px-3 py-2 text-[#000945] shadow-[0_6px_14px_rgba(0,9,69,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(0,9,69,0.16)] active:translate-y-0"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f6ff]">
        <PhoneCall size={14} />
      </span>
      <span className="text-[12px] font-semibold leading-none">Talk to Agent</span>
    </a>
  );
}
