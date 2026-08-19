import React, { useState } from "react";
import {
  Search, Train, ShieldCheck, Clock, Wallet, Ticket, MapPin, ChevronDown, ChevronRight,
  Sparkles, PhoneCall, Landmark, BadgeCheck, CreditCard, Users, Hotel, Loader2
} from "lucide-react";
import {
  Reveal, CountUp, RouteMapIllustration, StationIllustration, TrackConnector, TrustIllustration,
} from "./Illustrations.jsx";

const TOOLS = [
  { key: "pnr", label: "PNR Status", icon: Ticket, placeholder: "Enter 10-digit PNR (e.g. 4517228091)", cta: "Check status", samples: ["4517228091", "8462097315", "6291048821"] },
  { key: "live", label: "Live Train Status", icon: Train, placeholder: "Train number or name (e.g. 12951 or Rajdhani)", cta: "Track train", samples: ["12951 Rajdhani", "22436 Vande Bharat", "12301 Howrah Rajdhani"] },
  { key: "fare", label: "Fare Enquiry", icon: Wallet, placeholder: "Route or train (e.g. NDLS to BCT)", cta: "Show fare", samples: ["NDLS → BCT", "HWH → NDLS", "MAS → SBC"] },
  { key: "seat", label: "Seat Availability", icon: Users, placeholder: "Train number and date (e.g. 12951)", cta: "Check seats", samples: ["12951 Rajdhani", "22436 Vande Bharat", "12002 Shatabdi"] },
];

const TOOL_RESULT = {
  pnr: { title: "PNR 4517 2280 91 · 12951 Mumbai Rajdhani", badge: "CONFIRMED", badgeColor: "var(--green)", lines: [["Passenger 1", "Ananya Rao · Coach B2, Berth 41 (Lower)"],["Status & Quota", "CNF (Confirmed) · General Quota"],["Journey Date", "Tue, 25 Aug 2026 · Dep 16:55 from NDLS"],["Chart Status", "Chart Prepared (4 hrs before departure)"]] },
  live: { title: "12951 Mumbai Rajdhani Express (Live Tracking)", badge: "ON TIME · +0 min", badgeColor: "var(--green)", lines: [["Current Location", "Approaching Kota Jn (KOTA) · Speed: 128 km/h"],["Last Passed", "Sawai Madhopur Jn · Departed 20:42 (On Time)"],["Next Stoppage", "Kota Jn · Scheduled: 22:15 (Platform 1)"],["Destination ETA", "Mumbai Central (BCT) · Tomorrow 08:35 AM"]] },
  fare: { title: "Fare Breakdown: New Delhi (NDLS) → Mumbai Central (BCT)", badge: "Standard Fare", badgeColor: "var(--blue)", lines: [["Sleeper Class (SL)", "₹685 (Base ₹640 + Superfast ₹45)"],["AC 3-Tier (3A)", "₹1,985 (Base ₹1,820 + Resv ₹40 + GST ₹125)"],["AC 2-Tier (2A)", "₹2,830 (Base ₹2,620 + Catering ₹210)"],["AC First Class (1A)", "₹4,750 (All-inclusive coupe/cabin)"]] },
  seat: { title: "Seat Availability: 12951 Rajdhani Express (25 Aug)", badge: "HIGH AVAILABILITY", badgeColor: "var(--green)", lines: [["Executive / 1A", "AVAILABLE - 12 berths"],["AC 2-Tier (2A)", "AVAILABLE - 34 berths (High confirm chance)"],["AC 3-Tier (3A)", "RAC 6 (Guaranteed seating, likely berth)"],["Sleeper (SL)", "GNWL 14 / WL 8 (88% confirmation probability)"]] },
};

export function QuickTools() {
  const [tab, setTab] = useState("pnr");
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(null);
  const [loading, setLoading] = useState(false);
  const active = TOOLS.find((t) => t.key === tab) || TOOLS[0];
  const result = shown ? TOOL_RESULT[shown] : null;

  const handleCheck = (queryValue) => {
    const q = queryValue !== undefined ? queryValue : (value.trim() || active.samples[0]);
    setValue(q);
    setLoading(true);
    setShown(null);
    setTimeout(() => { setLoading(false); setShown(tab); }, 500);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 mt-10">
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: "var(--line)" }}>
        <div className="flex overflow-x-auto border-b bg-gray-50/50" style={{ borderColor: "var(--line)" }}>
          {TOOLS.map((t) => {
            const on = t.key === tab;
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setShown(null); setValue(""); }}
                className="flex items-center gap-2 px-5 h-13 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer"
                style={{ borderColor: on ? "var(--marigold)" : "transparent", color: on ? "var(--blue)" : "var(--steel)", background: on ? "white" : "transparent" }}>
                <Icon size={16} style={{ color: on ? "var(--marigold)" : "var(--steel)" }} /> {t.label}
              </button>
            );
          })}
        </div>
        <div className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-12 rounded-xl border flex items-center gap-2 px-3.5 bg-white transition-all focus-within:ring-2 focus-within:ring-blue-100" style={{ borderColor: "var(--line)" }}>
              <Search size={17} style={{ color: "var(--blue)" }} />
              <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={active.placeholder}
                className="flex-1 outline-none bg-transparent text-[15px]" style={{ color: "var(--ink)" }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()} />
              {value && <button onClick={() => setValue("")} className="text-gray-400 hover:text-gray-600 text-xs px-1">✕</button>}
            </div>
            <button onClick={() => handleCheck()} disabled={loading}
              className="h-12 px-6 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center min-w-[130px] shadow-sm hover:opacity-95 cursor-pointer"
              style={{ background: "var(--blue)", color: "white" }}>
              {loading ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Checking...</span> : active.cta}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs" style={{ color: "var(--steel)" }}>
            <span className="font-medium">Try quick sample:</span>
            {active.samples.map((s) => (
              <button key={s} onClick={() => handleCheck(s)}
                className="px-2.5 py-1 rounded-lg border bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors text-xs font-medium cursor-pointer"
                style={{ borderColor: "var(--line)", color: "var(--blue)" }}>{s}</button>
            ))}
          </div>
          {result && (
            <div className="anim-fade-up mt-5 rounded-xl border p-5 transition-all" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b" style={{ borderColor: "var(--line)" }}>
                <p className="f-mono text-sm font-bold" style={{ color: "var(--blue)" }}>{result.title}</p>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: result.badgeColor }}>{result.badge}</span>
              </div>
              <div className="grid gap-2.5">
                {result.lines.map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-1 border-b border-dashed last:border-none" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <span className="font-medium text-xs sm:text-sm" style={{ color: "var(--steel)" }}>{k}</span>
                    <span className="f-mono font-semibold text-xs sm:text-sm mt-0.5 sm:mt-0" style={{ color: "var(--ink)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: "13169", label: "trains running daily" },
  { value: "7335", label: "stations connected" },
  { value: "1200000", label: "tickets booked a day" },
  { value: "23000000", label: "passengers carried daily" },
];

export function StatsBand() {
  return (
    <section className="mt-16 relative overflow-hidden" style={{ background: "var(--blue-3, #060F1D)" }}>
      <div style={{ position:"absolute", top:"-30%", left:"50%", transform:"translateX(-50%)", width:"60%", height:"200%", background:"radial-gradient(ellipse,rgba(229,169,61,0.07) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.09}>
            <div>
              <p className="f-serif font-bold" style={{ fontSize:"clamp(2rem,3.5vw,3rem)", color:"var(--marigold)", lineHeight:1.1 }}>
                <CountUp value={Number(s.value)} />
              </p>
              <p className="text-xs font-medium mt-2 leading-relaxed" style={{ color: "rgba(199,210,221,0.7)" }}>{s.label}</p>
              <div className="mt-3 h-px w-8" style={{ background:"rgba(229,169,61,0.3)" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const ROUTES = [
  { from: "New Delhi", to: "Mumbai Central", code: "NDLS → BCT", trains: 18, from_fare: 685, dur: "15h 50m", fastest: "Rajdhani" },
  { from: "Howrah", to: "New Delhi", code: "HWH → NDLS", trains: 24, from_fare: 720, dur: "17h 05m", fastest: "Rajdhani" },
  { from: "Chennai Central", to: "Bengaluru", code: "MAS → SBC", trains: 31, from_fare: 245, dur: "4h 30m", fastest: "Shatabdi" },
  { from: "Secunderabad", to: "Pune", code: "SC → PUNE", trains: 12, from_fare: 385, dur: "12h 40m", fastest: "Duronto" },
  { from: "Ahmedabad", to: "Jaipur", code: "ADI → JP", trains: 9, from_fare: 310, dur: "9h 15m", fastest: "Superfast" },
  { from: "Lucknow", to: "Varanasi", code: "LKO → BSB", trains: 21, from_fare: 155, dur: "4h 55m", fastest: "Shatabdi" },
  { from: "Patna", to: "New Delhi", code: "PNBE → NDLS", trains: 16, from_fare: 580, dur: "12h 30m", fastest: "Rajdhani" },
  { from: "New Delhi", to: "Kolkata", code: "NDLS → KOAA", trains: 22, from_fare: 695, dur: "17h 15m", fastest: "Duronto" },
];

export function PopularRoutes({ onSearch }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Popular routes</p>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>Where India is travelling this week</h2>
        </div>
        <div className="hidden md:block w-56 flex-shrink-0"><RouteMapIllustration /></div>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROUTES.map((r, i) => (
          <Reveal key={r.code} delay={i * 0.06}>
            <button onClick={onSearch} className="w-full text-left rounded-2xl border bg-white p-5 transition-all duration-250 hover:-translate-y-1.5 group" style={{ borderColor: "var(--line)", boxShadow:"0 1px 4px rgba(15,42,69,0.06)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 f-mono text-xs font-semibold" style={{ color: "var(--blue)" }}>
                  <Train size={12} style={{ color:"var(--marigold)" }} /> {r.code}
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"var(--marigold)" }} />
              </div>
              <p className="f-body font-semibold text-base mt-2 leading-snug" style={{ color: "var(--ink)" }}>{r.from}<br /><span style={{ color:"var(--steel)", fontWeight:400 }}>→</span> {r.to}</p>
              <div className="mt-3 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div className="h-full w-[28%] rounded-full transition-all duration-500 group-hover:w-full" style={{ background: "linear-gradient(90deg,var(--marigold),var(--green))" }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--steel)" }}>
                <span>{r.trains} trains · {r.dur}</span>
                <span className="f-mono font-bold" style={{ color: "var(--green)" }}>from ₹{r.from_fare}</span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: Ticket, title: "Reserved & Tatkal booking", body: "General, Tatkal, Premium Tatkal, Ladies, Senior Citizen, Divyangjan and Defence quotas. Live seat pressure shown on every date." },
  { icon: Hotel, title: "Retiring rooms & stays", body: "Book station retiring rooms at 900+ stations and IRCTC-partnered hotels alongside your ticket." },
  { icon: Sparkles, title: "e-Catering on the move", body: "Order meals from 500+ FSSAI-approved restaurants, delivered to your coach and seat at en-route stations." },
  { icon: Landmark, title: "Tourism & Bharat Gaurav", body: "60+ curated rail tourism packages covering pilgrimage circuits, beach holidays, heritage trains, and the Maharajas' Express." },
  { icon: CreditCard, title: "Refunds you can follow", body: "TDR filing, refund timeline, and bank settlement stage shown day by day. 98.4% of eligible refunds settled within 5 working days." },
  { icon: PhoneCall, title: "Help that answers", body: "24×7 helpline (139), email support, in-app chat, and a grievance tracker. Average first response under 4 hours." },
];

export function Services() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="grid md:grid-cols-[1fr_0.8fr] gap-6 items-center">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Everything on one platform</p>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>More than a ticket window</h2>
          <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "var(--steel)" }}>Tickets, stays, meals and refunds — handled end to end, from the platform bench to the berth.</p>
        </div>
        <Reveal delay={0.1} className="hidden md:block"><StationIllustration /></Reveal>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.06} style={{ borderColor: "var(--line)" }}
              className="h-full rounded-xl border bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--paper-2)" }}>
                <Icon size={18} style={{ color: "var(--blue)" }} />
              </div>
              <p className="f-body font-semibold text-base" style={{ color: "var(--ink)" }}>{s.title}</p>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{s.body}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Search", body: "Pick stations, date and quota. Seat pressure shows before you commit to a date." },
  { n: "02", title: "Compare", body: "Results sort by departure by default. Filter by train type and class in one tap." },
  { n: "03", title: "Pay", body: "UPI, cards, net banking or wallet — with an explicit outcome for every payment state." },
  { n: "04", title: "Travel", body: "e-Ticket, chart status, live running and refunds all live under My Trips." },
];

export function HowItWorks() {
  return (
    <section className="mt-20 relative overflow-hidden" style={{ background:"var(--paper-2)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <Reveal className="text-center mb-12">
          <p className="f-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--marigold-2)" }}>How it works</p>
          <h2 className="f-serif font-bold text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>Four stops, start to seat</h2>
        </Reveal>
        <div className="mb-8"><TrackConnector /></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
          <div className="hidden md:block absolute top-[2.25rem] left-[12.5%] right-[12.5%] h-px" style={{ background:"linear-gradient(90deg,var(--marigold),var(--green))", opacity:0.3 }} />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}
              className="rounded-2xl border bg-white p-6 relative transition-all duration-300 hover:-translate-y-2 group"
              style={{ borderColor: "var(--line)", boxShadow:"0 1px 4px rgba(15,42,69,0.06)" }}>
              <div className="h-11 w-11 rounded-full flex items-center justify-center mb-4 f-mono text-sm font-bold transition-colors group-hover:scale-110" style={{ background:"var(--blue)", color:"var(--marigold)" }}>{s.n}</div>
              <p className="f-body font-semibold text-base" style={{ color: "var(--ink)" }}>{s.title}</p>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const TRUST = [
  { icon: ShieldCheck, k: "PCI-DSS payments", v: "Tokenised cards, no raw card data stored. UPI, Net Banking, and eWallet options available." },
  { icon: Clock, k: "Sub-second search", v: "Availability cached and refreshed every 30 seconds across 13,000+ trains." },
  { icon: BadgeCheck, k: "Verified refunds", v: "98.4% of eligible refunds settled within 5 working days. Track every step under My Trips." },
];

export function TrustStrip() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="rounded-2xl border p-5 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center" style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}>
        <Reveal className="hidden md:block w-40"><TrustIllustration /></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TRUST.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.k} delay={i * 0.08} className="flex gap-3">
                <div className="h-9 w-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-white" style={{ color: "var(--green)" }}>
                  <Icon size={17} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{t.k}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--steel)" }}>{t.v}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "When does Tatkal booking open?", a: "Tatkal opens at 10:00 AM one day before departure for AC classes and 11:00 AM for non-AC classes. Premium Tatkal opens at the same times with dynamic pricing." },
  { q: "My money was debited but I have no ticket. What now?", a: "The booking sits in a Pending state and is auto-reconciled with the bank. If the ticket is not issued, the full amount is reversed, typically within 3–5 working days." },
  { q: "What does RAC actually mean for my journey?", a: "RAC guarantees you board with a shared side-lower berth. If confirmed berths free up before or after charting, RAC passengers are upgraded in serial order." },
  { q: "Can I change the boarding station after booking?", a: "Yes, boarding point can be changed online up to 24 hours before scheduled departure, once per ticket, provided the new station is on the same route and before your original boarding station." },
  { q: "How is the refund calculated on cancellation?", a: "Cancellation charges depend on class and how far ahead you cancel; between 48 and 12 hours before departure, 25% of the fare is deducted. Closer cancellations carry 50%." },
  { q: "Do children below 5 years need a ticket?", a: "No, children below 5 travel free without a berth. Children aged 5–11 can share a berth with a guardian at no charge, or be booked a separate berth at full adult fare." },
  { q: "How do I order meals on the train?", a: "Use e-Catering during booking or from My Trips. Choose from 500+ FSSAI-approved restaurants at en-route stations. Minimum order time is 2 hours before the delivery station." },
  { q: "What ID proof do I need to carry?", a: "Carry any one government-issued photo ID — Aadhaar, PAN, Voter ID, Passport, or Driving Licence. The name on the ID should match the name on the ticket." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 mt-14 pb-16">
      <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Questions</p>
      <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>The things people actually ask</h2>
      <div className="mt-5 rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
        {FAQS.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className="border-b last:border-b-0" style={{ borderColor: "var(--line)" }}>
              <button onClick={() => setOpen(on ? -1 : i)} className="w-full flex items-center justify-between gap-3 text-left px-4 py-4">
                <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>{f.q}</span>
                <ChevronDown size={16} className="transition-transform flex-shrink-0" style={{ color: "var(--steel)", transform: on ? "rotate(180deg)" : "none" }} />
              </button>
              {on && <p className="px-4 pb-4 -mt-1 text-sm leading-relaxed anim-fade-up" style={{ color: "var(--steel)" }}>{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
