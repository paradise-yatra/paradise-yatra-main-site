import Link from "next/link";
import Header from "@/components/Header";
import { CreditCard, ArrowRight, Plane, Calendar, ShieldCheck, Receipt, CircleAlert } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-700" />
            </div>
            <h1 className="!text-2xl md:!text-3xl !font-black text-slate-900">Payment</h1>
          </div>
          <p className="!text-slate-600 !font-medium mb-8">
            Select a travel product first, then continue to secure checkout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/package"
              className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Plane className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="!font-bold !text-slate-900">Pay For Package</p>
                  <p className="!text-xs !text-slate-600">Choose a package and complete payment</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>

            <Link
              href="/fixed-departures"
              className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="!font-bold !text-slate-900">Pay For Fixed Departure</p>
                  <p className="!text-xs !text-slate-600">Select batch date then continue to payment</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-50 border-b border-slate-200 px-4 py-3">
              <h2 className="!text-lg !font-black text-blue-900">Pay Us At</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50 w-1/2">ACCOUNT HOLDER NAME</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">PARADISE YATRA</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50">ACCOUNT NUMBER</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">50200053051934</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50">IFSC CODE</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">HDFC0000225</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50">BRANCH</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">RAJPUR ROAD, DEHRADUN</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 bg-slate-50">BANK NAME</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">HDFC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="!text-base !font-black text-slate-900 mb-3">Payment via Razorpay:</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://razorpay.me/@paradiseyatra1352"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-bold transition"
              >
                Pay with Razorpay
              </a>
              <a
                href="https://razorpay.me/@paradiseyatra1352"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-700 underline break-all"
              >
                https://razorpay.me/@paradiseyatra1352
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <h2 className="!text-base !font-black text-slate-900 mb-3 inline-flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-700" />
                After Payment, Share These Details
              </h2>
              <ul className="space-y-2 text-sm text-slate-700 font-medium list-disc pl-5">
                <li>Razorpay Payment ID / UTR number</li>
                <li>Your full name and registered phone number</li>
                <li>Package name and travel date</li>
                <li>Number of travellers</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500 font-semibold">
                This helps us verify your payment quickly and lock your booking.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <h2 className="!text-base !font-black text-slate-900 mb-3 inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Important Notes
              </h2>
              <ul className="space-y-2 text-sm text-slate-700 font-medium list-disc pl-5">
                <li>Always pay only to verified links/account shown on this page.</li>
                <li>Do not share OTP, card PIN, or CVV with anyone.</li>
                <li>Booking confirmation is sent only after payment verification.</li>
                <li>In case of delay, keep your payment reference ready.</li>
              </ul>
            </section>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 md:p-5">
            <h2 className="!text-base !font-black text-amber-900 mb-2 inline-flex items-center gap-2">
              <CircleAlert className="h-4 w-4" />
              Verification & Confirmation
            </h2>
            <p className="text-sm text-amber-900/90 font-semibold">
              Payment success at gateway does not mean instant booking. Our team verifies transaction details
              and then confirms your booking/receipt.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-bold transition"
              >
                Contact Support
              </Link>
              <a
                href="mailto:info@paradiseyatra.com"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-sm font-bold transition"
              >
                info@paradiseyatra.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
