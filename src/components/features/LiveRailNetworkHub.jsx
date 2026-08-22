import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Zap, Mountain, ShieldCheck, ArrowRight, Clock, MapPin, Sparkles, Utensils, CheckCircle2, ChevronRight } from 'lucide-react';

const getAssetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

const SPOTLIGHT_TRAINS = [
  {
    id: 'vande-bharat',
    category: 'Vande Bharat Fleet',
    title: 'Vande Bharat 22436 · New Delhi ⇄ Varanasi',
    tagline: 'Semi-High Speed 160 km/h · 180° Rotating Seats · Zero-Spill Ride',
    speed: '160 km/h',
    onTimeRate: '99.4%',
    departure: '06:00 AM (NDLS)',
    arrival: '02:00 PM (BSB)',
    duration: '8h 00m',
    image: getAssetUrl('trains/vande_bharat.jpg'),
    fallbackImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
    accent: '#F0A63A',
    perks: ['Executive AC Chair Car', 'Infotainment & Wi-Fi', 'Complimentary Gourmet Meals']
  },
  {
    id: 'vistadome',
    category: 'Scenic VistaDome',
    title: 'Mumbai ⇄ Goa VistaDome Express',
    tagline: 'Western Ghats Waterfalls · Glass Ceiling Coaches · Panoramic View Lounge',
    speed: '110 km/h',
    onTimeRate: '98.1%',
    departure: '05:25 AM (CSMT)',
    arrival: '02:40 PM (MAO)',
    duration: '9h 15m',
    image: getAssetUrl('trains/vistadome.jpg'),
    fallbackImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084&auto=format&fit=crop',
    accent: '#3FAE71',
    perks: ['360° Glass Roof Views', 'Observation Deck', 'Scenic Tunnel Passes']
  },
  {
    id: 'rajdhani',
    category: 'Superfast Legends',
    title: 'Mumbai Rajdhani 12952 · Mumbai ⇄ New Delhi',
    tagline: 'The King of Indian Railways · Overnight Luxury · Premium Dining',
    speed: '130 km/h',
    onTimeRate: '99.1%',
    departure: '05:00 PM (MMCT)',
    arrival: '08:35 AM (NDLS)',
    duration: '15h 35m',
    image: getAssetUrl('trains/rajdhani.jpg'),
    fallbackImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    accent: '#60B8F4',
    perks: ['1st AC & 2nd AC Sleepers', 'Pantry On-Board Included', 'Priority Track Clearance']
  }
];

const SMART_PERKS = [
  {
    icon: Zap,
    title: 'Tatkal Master Quota',
    desc: 'Auto-fill passenger details in 0.8s before 10 AM / 11 AM slots open to beat the rush.',
    badge: '94% Success Rate'
  },
  {
    icon: Sparkles,
    title: 'AI Waitlist Predictor',
    desc: 'Deep ML prediction on WL1 to WL50 confirmation chances based on 10-year charting data.',
    badge: '96.8% Accuracy'
  },
  {
    icon: ShieldCheck,
    title: 'Instant Refund Shield',
    desc: 'Zero-deduction cancellation option. Money credited back directly to UPI in 15 minutes.',
    badge: '100% Guaranteed'
  },
  {
    icon: Utensils,
    title: 'FSSAI Seat Delivery',
    desc: 'Hot meals from Haldiram’s, Dominos & Bikanervala delivered right to your berth.',
    badge: '500+ Stations'
  }
];

export default function LiveRailNetworkHub({ onSelectRoute }) {
  const [selectedTrain, setSelectedTrain] = useState(0);
  const activeTrain = SPOTLIGHT_TRAINS[selectedTrain];

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />
            <p className="f-mono text-xs tracking-widest uppercase font-bold text-[var(--marigold)]">
              Indian Railways Flagship Showcase
            </p>
          </div>
          <h2 className="f-serif font-bold text-3xl md:text-4xl text-[var(--blue)]">
            Explore India’s Finest Corridors
          </h2>
          <p className="text-sm md:text-base text-[var(--steel)] mt-1 max-w-xl">
            From semi-high speed Vande Bharat expresses to glass-domed mountain routes, travel in next-generation comfort.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-[var(--paper-2)] border border-[var(--line)] shadow-inner">
          {SPOTLIGHT_TRAINS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrain(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                selectedTrain === idx
                  ? 'bg-[var(--navy)] text-white shadow-lg ring-1 ring-white/20'
                  : 'text-[var(--steel)] hover:text-[var(--navy)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {idx === 0 && <Zap size={14} className={selectedTrain === idx ? 'text-amber-400' : 'text-amber-500'} />}
              {idx === 1 && <Mountain size={14} className={selectedTrain === idx ? 'text-emerald-400' : 'text-emerald-500'} />}
              {idx === 2 && <Train size={14} className={selectedTrain === idx ? 'text-blue-400' : 'text-blue-500'} />}
              {t.category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Spotlight Card */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] bg-[var(--surface)] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Area with Image */}
          <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden group">
            <motion.img
              key={activeTrain.id}
              initial={{ scale: 1.08, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              src={activeTrain.image}
              onError={(e) => { e.currentTarget.src = activeTrain.fallbackImage; }}
              alt={activeTrain.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Vignette & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/80 via-transparent to-transparent hidden lg:block" />

            {/* Floating Live Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                Live Status: On-Time ({activeTrain.onTimeRate})
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono flex items-center gap-1 shadow-lg">
                <Zap size={12} className="text-[var(--marigold)]" /> Top Speed {activeTrain.speed}
              </span>
            </div>

            {/* Bottom Overlay Info on Image */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <span className="f-mono text-xs uppercase tracking-widest text-[var(--marigold)] font-bold">
                {activeTrain.category}
              </span>
              <h3 className="f-serif text-2xl md:text-3xl font-bold mt-1 leading-tight text-white drop-shadow-md">
                {activeTrain.title}
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1 max-w-lg drop-shadow">
                {activeTrain.tagline}
              </p>
            </div>
          </div>

          {/* Right Schedule & Perks Details */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-[var(--surface)]">
            <div>
              {/* Journey Timing Box */}
              <div className="p-4 rounded-2xl bg-[var(--paper-2)] border border-[var(--line)] mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--steel)] uppercase tracking-wider mb-2">
                  <span>Departure</span>
                  <span className="flex items-center gap-1 text-[var(--ink)] font-mono">
                    <Clock size={12} /> {activeTrain.duration}
                  </span>
                  <span>Arrival</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg md:text-xl font-bold font-mono text-[var(--ink)]">{activeTrain.departure.split(' ')[0]}</p>
                    <p className="text-xs text-[var(--steel)]">{activeTrain.departure.split('(')[1]?.replace(')', '') || 'Origin'}</p>
                  </div>
                  {/* Dotted Flight/Train Line */}
                  <div className="flex-1 mx-4 flex items-center justify-center relative">
                    <div className="w-full h-0.5 border-t border-dashed border-[var(--steel)] opacity-40" />
                    <Train size={16} className="absolute text-[var(--marigold)]" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold font-mono text-[var(--ink)]">{activeTrain.arrival.split(' ')[0]}</p>
                    <p className="text-xs text-[var(--steel)]">{activeTrain.arrival.split('(')[1]?.replace(')', '') || 'Destination'}</p>
                  </div>
                </div>
              </div>

              {/* Perks Checklist */}
              <h4 className="f-mono text-xs uppercase tracking-wider font-bold text-[var(--steel)] mb-3">
                Experience Inclusions
              </h4>
              <div className="space-y-2.5 mb-6">
                {activeTrain.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-[var(--ink)]">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[var(--green)] shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div>
              <button
                onClick={() => onSelectRoute && onSelectRoute(activeTrain.title)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[var(--premium-blue)] text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg group"
              >
                <span>Check Available Seats on this Route</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-[11px] text-center text-[var(--steel)] mt-2">
                IRCTC Authorized Booking · 100% Safe Payments · Instant PNR Generation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Smart Feature Highlights Below Spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {SMART_PERKS.map((perk, i) => {
          const Icon = perk.icon;
          return (
            <div
              key={perk.title}
              className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--paper-2)] flex items-center justify-center text-[var(--marigold-2)]">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-[var(--paper-2)] text-[var(--blue)] border border-[var(--line)]">
                    {perk.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--ink)] mb-1">{perk.title}</h4>
                <p className="text-xs text-[var(--steel)] leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
