"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CookieConsent = "accepted" | "rejected" | null;

const CONSENT_STORAGE_KEY = "paradise_cookie_consent";
const GA_MEASUREMENT_ID = "G-99JYJS0FSF";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: string]: unknown;
  }
}

const clearAnalyticsCookies = () => {
  if (typeof document === "undefined") return;

  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const analyticsCookieNames = ["_ga", "_gid", "_gat", "_ga_" ];
  const hostname = window.location.hostname;

  cookies.forEach((cookie) => {
    const [name] = cookie.split("=");
    if (!name) return;

    const isAnalyticsCookie =
      analyticsCookieNames.some((prefix) => name === prefix || name.startsWith(prefix));

    if (!isAnalyticsCookie) return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname};`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${hostname};`;
  });
};

const loadGoogleAnalytics = () => {
  if (typeof window === "undefined") return;

  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}`;
  window[disableKey] = false;

  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
  );

  const initializeGtag = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("consent", "default", { analytics_storage: "granted" });
    window.gtag("config", GA_MEASUREMENT_ID);
  };

  if (existingScript) {
    initializeGtag();
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = initializeGtag;
  document.head.appendChild(script);
};

const rejectAnalytics = () => {
  if (typeof window === "undefined") return;
  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}`;
  window[disableKey] = true;
  clearAnalyticsCookies();
};

export default function CookieConsentManager() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY) as CookieConsent;
    if (storedConsent === "accepted") {
      setConsent("accepted");
      loadGoogleAnalytics();
    } else if (storedConsent === "rejected") {
      setConsent("rejected");
      rejectAnalytics();
    } else {
      setConsent(null);
    }
    setIsReady(true);
  }, []);

  const handleConsent = (value: Exclude<CookieConsent, null>) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
    setConsent(value);

    if (value === "accepted") {
      loadGoogleAnalytics();
      return;
    }

    rejectAnalytics();
  };

  if (!isReady || consent !== null) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[120] md:inset-x-6 md:bottom-6">
      <div className="mx-auto max-w-5xl rounded-[10px] border border-[#dfe1df] bg-white p-4 shadow-[0_10px_35px_rgba(2,8,23,0.12)] md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-[16px] font-bold text-[#000945]">We use cookies</p>
            <p className="text-[13px] leading-relaxed text-[#000945] md:text-[14px]">
              We use essential cookies for core functionality and optional analytics cookies to improve your experience.
              You can accept or reject optional cookies.
              {" "}
              <Link href="/cookie-policy" className="font-semibold underline hover:text-[#155dfc]">
                Read Cookie Policy
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => handleConsent("rejected")}
              className="min-w-[130px] rounded-[6px] border border-[#dfe1df] bg-white px-4 py-2 text-[13px] font-semibold text-[#000945] transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={() => handleConsent("accepted")}
              className="min-w-[130px] rounded-[6px] border border-[#155dfc] bg-[#155dfc] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0f4de0] cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
