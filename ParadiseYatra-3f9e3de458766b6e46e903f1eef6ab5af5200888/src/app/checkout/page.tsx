"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckoutPackage {
  _id: string;
  slug: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  priceType?: "per_person" | "per_couple";
  image?: string;
  checkoutType?: "package" | "fixed-departure";
  departureDate?: string;
}

interface PaymentResultModalState {
  open: boolean;
  status: "success" | "failed";
  title: string;
  message: string;
  orderId?: string | null;
  paymentId?: string | null;
  internalOrderId?: string | null;
  receiptNumber?: string | null;
  amount?: string | null;
}

const formatPrice = (amount: number) => `₹${(amount || 0).toLocaleString("en-IN")}`;
const getTodayDateInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const checkoutType: "package" | "fixed-departure" =
    searchParams.get("type") === "fixed-departure" ? "fixed-departure" : "package";
  const selectedDepartureDateParam = searchParams.get("departureDate") || "";
  const { user } = useAuth();

  const [pkg, setPkg] = useState<CheckoutPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [paymentMeta, setPaymentMeta] = useState<{
    internalOrderId?: string | null;
    receiptNumber?: string | null;
    paymentId?: string | null;
    travelDate?: string | null;
    travellers?: number | null;
    unitLabel?: string | null;
  } | null>(null);
  const [paymentResultModal, setPaymentResultModal] = useState<PaymentResultModalState>({
    open: false,
    status: "success",
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: "",
    travellers: 1,
    note: "",
  });
  const todayDateInputValue = useMemo(() => getTodayDateInputValue(), []);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!slug) {
        setError("Missing package slug. Please go back and try again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (checkoutType === "fixed-departure") {
          const response = await fetch(`/api/fixed-departures/slug/${slug}`, { cache: "no-store" });
          if (!response.ok) {
            throw new Error("Fixed departure not found");
          }

          const data = await response.json();
          const targetDate = selectedDepartureDateParam;
          let selectedBatchPrice = Number(data?.price || 0);

          if (targetDate && Array.isArray(data?.departures)) {
            const matched = data.departures.find((d: { date?: string; status?: string; price?: number }) => {
              if (!d?.date) return false;
              const parsed = new Date(d.date);
              if (Number.isNaN(parsed.getTime())) return false;
              const dateOnly = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
              return dateOnly === targetDate && d.status !== "soldout";
            });
            if (matched && Number(matched.price) > 0) {
              selectedBatchPrice = Number(matched.price);
            }
          }

          const defaultTravelDate = targetDate || (() => {
            const parsed = new Date(data?.departureDate);
            if (Number.isNaN(parsed.getTime())) return "";
            return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
          })();

          setForm((prev) => ({
            ...prev,
            travelDate: prev.travelDate || defaultTravelDate,
          }));

          setPkg({
            _id: data?._id || slug,
            slug: data?.slug || slug,
            title: data?.title || "Fixed Departure",
            destination: data?.destination || data?.location || "Destination",
            duration: data?.duration || "N/A",
            price: selectedBatchPrice,
            priceType: "per_person",
            image: Array.isArray(data?.images) ? data?.images?.[0] : data?.image,
            checkoutType: "fixed-departure",
            departureDate: defaultTravelDate,
          });
        } else {
          let response = await fetch(`/api/all-packages/${slug}`, { cache: "no-store" });
          if (!response.ok) {
            response = await fetch(`/api/packages/slug/${slug}`, { cache: "no-store" });
          }

          if (!response.ok) {
            throw new Error("Package not found");
          }

          const raw = await response.json();
          const data = raw?.package || raw?.destination || raw?.data || raw;

          setPkg({
            _id: data?._id || slug,
            slug: data?.slug || slug,
            title: data?.title || data?.name || "Travel Package",
            destination: data?.destination || data?.location || "Destination",
            duration: data?.duration || "N/A",
            price: Number(data?.price || 0),
            priceType: data?.priceType || "per_person",
            image: Array.isArray(data?.images) ? data?.images?.[0] : data?.image,
            checkoutType: "package",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [slug, checkoutType, selectedDepartureDateParam]);

  const unitLabel = pkg?.priceType === "per_couple" ? "Per Couple" : "Per Person";

  const payableAmount = useMemo(() => {
    if (!pkg) return 0;
    if (pkg.priceType === "per_couple") {
      const couples = Math.max(1, Math.ceil((form.travellers || 1) / 2));
      return couples * pkg.price;
    }
    return (form.travellers || 1) * pkg.price;
  }, [pkg, form.travellers]);
  const chargeUnits =
    pkg?.priceType === "per_couple"
      ? Math.max(1, Math.ceil((form.travellers || 1) / 2))
      : Math.max(1, form.travellers || 1);
  const chargeUnitLabel = pkg?.priceType === "per_couple" ? "Couples" : "Travellers";

  const persistFailedStatus = async (params: {
    purchaseId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    failureReason?: string;
    failureCode?: string;
    failureSource?: string;
    failureStep?: string;
  }) => {
    try {
      await fetch("/api/payments/razorpay/mark-failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
    } catch (statusErr) {
      console.error("Failed status persist error:", statusErr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (form.travelDate && form.travelDate < todayDateInputValue) {
        throw new Error("Travel date cannot be in the past.");
      }

      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) {
        throw new Error("Unable to load Razorpay SDK. Please check your internet and try again.");
      }

      const orderResponse = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutType,
          selectedDepartureDate: form.travelDate || selectedDepartureDateParam || pkg.departureDate || "",
          amount: Math.round(payableAmount * 100),
          currency: "INR",
          receipt: `pkg_${pkg.slug}_${Date.now()}`.slice(0, 40),
          userId: user?.id || "",
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          packageId: pkg._id,
          packageSlug: pkg.slug,
          packageTitle: pkg.title,
          destination: pkg.destination,
          travelDate: form.travelDate || "",
          travellers: Number(form.travellers || 1),
          unitPrice: pkg.price,
          unitLabel,
          customerNote: form.note || "",
          notes: {
            packageId: pkg._id,
            packageSlug: pkg.slug,
            travellers: String(form.travellers),
            travelDate: form.travelDate || "Flexible",
          },
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData?.orderId) {
        throw new Error(orderData?.message || "Failed to create payment order");
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Paradise Yatra",
        description: `${pkg.title} (${unitLabel})`,
        order_id: orderData.orderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          package: pkg.title,
          packageSlug: pkg.slug,
          travellers: String(form.travellers),
          travelDate: form.travelDate || "Flexible",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...paymentResponse,
                purchaseId: orderData?.purchaseId,
                customer: {
                  fullName: form.fullName,
                  email: form.email,
                  phone: form.phone,
                },
                packageInfo: {
                  title: pkg.title,
                  slug: pkg.slug,
                  destination: pkg.destination,
                  travelDate: form.travelDate || pkg.departureDate || "Flexible",
                  travellers: Number(form.travellers || 1),
                  unitLabel,
                  unitPrice: pkg.price,
                  amount: payableAmount,
                },
              }),
            });
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData?.verified) {
              throw new Error(verifyData?.message || "Payment verification failed");
            }

            setPaymentMeta({
              internalOrderId: verifyData?.internalOrderId || orderData?.internalOrderId || null,
              receiptNumber: verifyData?.receiptNumber || orderData?.receiptNumber || null,
              paymentId: paymentResponse.razorpay_payment_id,
              travelDate: verifyData?.travelDate || form.travelDate || "Flexible",
              travellers: verifyData?.travellers || Number(form.travellers || 1),
              unitLabel: verifyData?.unitLabel || unitLabel || "Per Person",
            });
            setSuccess("Payment successful. Receipt has been sent to your email.");
            setError("");
            setPaymentResultModal({
              open: true,
              status: "success",
              title: "Payment Successful",
              message: "Your booking payment is confirmed. Receipt details are ready below.",
              orderId: paymentResponse.razorpay_order_id,
              paymentId: paymentResponse.razorpay_payment_id,
              internalOrderId: verifyData?.internalOrderId || orderData?.internalOrderId || null,
              receiptNumber: verifyData?.receiptNumber || orderData?.receiptNumber || null,
              amount: formatPrice(payableAmount),
            });
          } catch (verifyErr) {
            await persistFailedStatus({
              purchaseId: orderData?.purchaseId,
              razorpayOrderId: paymentResponse?.razorpay_order_id || orderData?.orderId,
              razorpayPaymentId: paymentResponse?.razorpay_payment_id,
              failureReason: verifyErr instanceof Error ? verifyErr.message : "Payment verification failed",
              failureCode: "verification_failed",
              failureSource: "server_verify",
            });
            const verifyErrorMessage =
              verifyErr instanceof Error ? verifyErr.message : "Payment verification failed";
            setError(verifyErrorMessage);
            setPaymentResultModal({
              open: true,
              status: "failed",
              title: "Payment Verification Failed",
              message: verifyErrorMessage,
              orderId: paymentResponse?.razorpay_order_id || orderData?.orderId,
              paymentId: paymentResponse?.razorpay_payment_id || "",
              internalOrderId: orderData?.internalOrderId || null,
              receiptNumber: orderData?.receiptNumber || null,
              amount: formatPrice(payableAmount),
            });
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", async (failure: any) => {
        await persistFailedStatus({
          purchaseId: orderData?.purchaseId,
          razorpayOrderId:
            failure?.error?.metadata?.order_id ||
            failure?.error?.metadata?.razorpay_order_id ||
            orderData?.orderId,
          razorpayPaymentId:
            failure?.error?.metadata?.payment_id ||
            failure?.error?.metadata?.razorpay_payment_id ||
            "",
          failureReason: failure?.error?.description || failure?.error?.reason || "Payment failed",
          failureCode: failure?.error?.code || "",
          failureSource: failure?.error?.source || "",
          failureStep: failure?.error?.step || "",
        });

        const reason =
          failure?.error?.description ||
          failure?.error?.reason ||
          "Payment failed. Please try again.";
        setError(reason);
        setPaymentResultModal({
          open: true,
          status: "failed",
          title: "Payment Failed",
          message: reason,
          orderId:
            failure?.error?.metadata?.order_id ||
            failure?.error?.metadata?.razorpay_order_id ||
            orderData?.orderId,
          paymentId:
            failure?.error?.metadata?.payment_id ||
            failure?.error?.metadata?.razorpay_payment_id ||
            "",
          internalOrderId: orderData?.internalOrderId || null,
          receiptNumber: orderData?.receiptNumber || null,
          amount: formatPrice(payableAmount),
        });
      });
      paymentObject.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      setPaymentResultModal({
        open: true,
        status: "failed",
        title: "Unable To Start Payment",
        message: errorMessage,
        amount: formatPrice(payableAmount),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <button
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-24 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : pkg ? (
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
              <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 md:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
                  <div>
                    <h2 className="!text-2xl !font-bold text-slate-900">Traveller Details</h2>
                    <p className="!text-sm !text-slate-500 mt-1">Complete your details to continue payment.</p>
                  </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        required
                        value={form.fullName}
                        onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
                        placeholder="name@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
                        placeholder="+91 xxxxx xxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Date</label>
                      <input
                        type="date"
                        value={form.travelDate}
                        min={todayDateInputValue}
                        onChange={(e) => setForm((prev) => ({ ...prev, travelDate: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-slate-700">Travellers</label>
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              travellers: Math.max(1, Number(prev.travellers || 1) - 1),
                            }))
                          }
                          className="h-10 w-10 inline-flex items-center justify-center text-slate-600 hover:text-blue-600 transition"
                          aria-label="Decrease travellers"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={form.travellers}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              travellers: Math.max(1, Number(e.target.value || 1)),
                            }))
                          }
                          className="h-10 w-14 border-x border-slate-200 text-center font-bold text-slate-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              travellers: Math.max(1, Number(prev.travellers || 1) + 1),
                            }))
                          }
                          className="h-10 w-10 inline-flex items-center justify-center text-slate-600 hover:text-blue-600 transition"
                          aria-label="Increase travellers"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Billing units: {chargeUnits} {chargeUnitLabel}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Special Notes (optional)</label>
                    <textarea
                      rows={4}
                      value={form.note}
                      onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
                      placeholder="Any preference, pickup request, meal choice..."
                    />
                  </div>

                  {success && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-700 text-sm font-semibold space-y-1">
                      <p className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {success}
                      </p>
                      {paymentMeta?.internalOrderId && <p>Order ID: {paymentMeta.internalOrderId}</p>}
                      {paymentMeta?.receiptNumber && <p>Receipt No: {paymentMeta.receiptNumber}</p>}
                      {paymentMeta?.paymentId && <p>Payment ID: {paymentMeta.paymentId}</p>}
                      {paymentMeta?.travelDate && <p>Travel Date: {paymentMeta.travelDate}</p>}
                      {paymentMeta?.travellers && <p>Travellers: {paymentMeta.travellers}</p>}
                      {paymentMeta?.unitLabel && <p>Pricing Basis: {paymentMeta.unitLabel}</p>}
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto rounded-xl !font-bold px-8 h-11 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/25"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      Pay Now
                    </Button>
                    <p className="text-xs text-slate-500 font-medium">
                      You will receive receipt on your email instantly.
                    </p>
                  </div>
                </form>
              </section>

              <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-24">
                <h2 className="!text-lg !font-bold text-slate-900">Booking Summary</h2>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.title} className="h-36 w-full object-cover" />
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-r from-blue-100 to-slate-100" />
                  )}
                  <div className="p-3">
                    <p className="!font-semibold !text-slate-900 leading-snug">{pkg.title}</p>
                    <p className="!text-xs !text-slate-500 mt-1 inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {pkg.destination}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="!text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Duration
                    </span>
                    <span className="!font-semibold !text-slate-800">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="!text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Travellers
                    </span>
                    <span className="!font-semibold !text-slate-800">{form.travellers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="!text-slate-600">{unitLabel}</span>
                    <span className="!font-semibold !text-slate-800">{formatPrice(pkg.price)}</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="!text-slate-900 !font-bold">Estimated Total</span>
                    <span className="!text-xl !font-black !text-blue-600">{formatPrice(payableAmount)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700 font-semibold flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                  Secure test payment powered by Razorpay (Test Mode).
                </div>

                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 256-bit encrypted payment flow
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Instant booking confirmation after success
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Receipt copy sent to your email
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700 text-sm font-semibold">
            {error || "Unable to load checkout package details."}
          </div>
        )}

        <Dialog
          open={paymentResultModal.open}
          onOpenChange={(open) =>
            setPaymentResultModal((prev) => ({
              ...prev,
              open,
            }))
          }
        >
          <DialogContent className="sm:max-w-[520px] rounded-2xl p-0 overflow-hidden border border-slate-200">
            <div
              className={`p-6 ${paymentResultModal.status === "success"
                  ? "bg-gradient-to-r from-emerald-50 to-blue-50"
                  : "bg-gradient-to-r from-red-50 to-orange-50"
                }`}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 !text-xl !text-slate-900">
                  {paymentResultModal.status === "success" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  {paymentResultModal.title}
                </DialogTitle>
              </DialogHeader>
              <p className="mt-2 text-sm font-medium !text-slate-700">{paymentResultModal.message}</p>
            </div>

            <div className="p-6 space-y-3 text-sm">
              {paymentResultModal.internalOrderId && (
                <p className="flex justify-between gap-3">
                  <span className="text-slate-500 font-semibold">Order ID</span>
                  <span className="text-slate-900 font-bold text-right">{paymentResultModal.internalOrderId}</span>
                </p>
              )}
              {paymentResultModal.receiptNumber && (
                <p className="flex justify-between gap-3">
                  <span className="text-slate-500 font-semibold">Receipt No</span>
                  <span className="text-slate-900 font-bold text-right">{paymentResultModal.receiptNumber}</span>
                </p>
              )}
              {paymentResultModal.orderId && (
                <p className="flex justify-between gap-3">
                  <span className="text-slate-500 font-semibold">Razorpay Order ID</span>
                  <span className="text-slate-900 font-semibold text-right break-all">{paymentResultModal.orderId}</span>
                </p>
              )}
              {paymentResultModal.paymentId && (
                <p className="flex justify-between gap-3">
                  <span className="text-slate-500 font-semibold">Razorpay Payment ID</span>
                  <span className="text-slate-900 font-semibold text-right break-all">{paymentResultModal.paymentId}</span>
                </p>
              )}
              {paymentResultModal.amount && (
                <p className="flex justify-between gap-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Amount</span>
                  <span className="text-blue-700 font-black">{paymentResultModal.amount}</span>
                </p>
              )}
            </div>

            <div className="px-6 pb-6 flex flex-wrap gap-2 text-slate-700">
              <Button
                type="button"
                onClick={() => setPaymentResultModal((prev) => ({ ...prev, open: false }))}
                className="rounded-xl bg-slate-900 hover:bg-slate-800"
              >
                {paymentResultModal.status === "success" ? "Continue" : "Try Again"}
              </Button>
              {paymentResultModal.status === "success" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/package")}
                  className="rounded-xl"
                >
                  Explore More Packages
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
            <div className="flex items-center justify-center py-24 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
          </main>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
