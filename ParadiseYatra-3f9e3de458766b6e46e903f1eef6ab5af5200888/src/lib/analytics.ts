"use client";

const CLIENT_ID_KEY = "py_ga_client_id";

const getClientId = (): string | null => {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(CLIENT_ID_KEY, generated);
  return generated;
};

export const trackPageView = (path: string) => {
  if (typeof window === "undefined") return;

  const clientId = getClientId();
  if (!clientId) return;

  const payload = {
    client_id: clientId,
    events: [
      {
        name: "page_view",
        params: {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        },
      },
    ],
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/collect", blob);
    return;
  }

  fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
};
