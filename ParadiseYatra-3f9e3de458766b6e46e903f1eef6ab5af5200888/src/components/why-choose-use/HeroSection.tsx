import { BadgeCheck, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-18 pb-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl !font-black !leading-[1.05] tracking-tight text-slate-900 mb-4">
            Travel Stories from the Paradise Yatra Community
          </h1>
          <p className="text-lg !text-slate-600 leading-relaxed">
            Real stories from <span className="font-semibold text-blue-600">100+ happy customers</span> who trusted us with their dream vacations. Don't just take our word for it see their memories.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
            <BadgeCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Verified Reviews</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Google Rating 4.4/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
