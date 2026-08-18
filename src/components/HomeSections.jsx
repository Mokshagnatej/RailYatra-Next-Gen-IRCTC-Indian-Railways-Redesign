import React, { useState } from "react";
import {
  Search, Train, ShieldCheck, Clock, Wallet, Ticket, MapPin, ChevronDown,
  Sparkles, PhoneCall, Landmark, BadgeCheck, CreditCard, Users, Hotel,
} from "lucide-react";
import {
  Reveal, CountUp, RouteMapIllustration, StationIllustration, TrackConnector, TrustIllustration,
} from "./Illustrations.jsx";

/* ---------------- quick tools: PNR / live status / fare ---------------- */

const TOOLS = [
  { key: "pnr", label: "PNR Status", icon: Ticket, placeholder: "10-digit PNR number", cta: "Check status" },
  { key: "live", label: "Live Train Status", icon: Train, placeholder: "Train number or name", cta: "Track train" },
  { key: "fare", label: "Fare Enquiry", icon: Wallet, placeholder: "Train number", cta: "Show fare" },
  { key: "seat", label: "Seat Availability", icon: Users, placeholder: "Train number", cta: "Check seats" },
];

const TOOL_RESULT = {
  pnr: { title: "PNR 4517 2280 91", lines: [["Status", "CNF · B2 / 41 / Lower"], ["Train", "12951 Mumbai Rajdhani"], ["Chart", "Prepared · 4h before departure"]] },
  live: { title: "12951 Mumbai Rajdhani", lines: [["Running", "On time"], ["Last seen", "Kota Jn · 22:14"], ["Next halt", "Ratlam Jn · ETA 01:05"]] },
  fare: { title: "NDLS → BCT · General quota", lines: [["Sleeper (SL)", "₹685"], ["AC 3-Tier (3A)", "₹1,985"], ["AC 2-Tier (2A)", "₹2,830"]] },
  seat: { title: "12951 · Tue, 25 Aug", lines: [["1A", "AVAILABLE 12"], ["2A", "AVAILABLE 34"], ["3A", "RAC 6"]] },
};

export function QuickTools() {
  const [tab, setTab] = useState("pnr");
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(null);
  const active = TOOLS.find((t) => t.key === tab);
  const result = shown ? TOOL_RESULT[shown] : null;

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 mt-10">
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex overflow-x-auto border-b" style={{ borderColor: "var(--line)" }}>
          {TOOLS.map((t) => {
            const on = t.key === tab;
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setShown(null); }}
                className="flex items-center gap-2 px-4 h-12 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                style={{ borderColor: on ? "var(--marigold)" : "transparent", color: on ? "var(--blue)" : "var(--steel)" }}>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
        <div className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-12 rounded-xl border flex items-center gap-2 px-3" style={{ borderColor: "var(--line)" }}>
              <Search size={16} style={{ color: "var(--blue)" }} />
              <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={active.placeholder}
                className="flex-1 outline-none bg-transparent text-[15px]" style={{ color: "var(--ink)" }} />
            </div>
            <button onClick={() => setShown(tab)}
              className="h-12 px-5 rounded-xl font-semibold text-sm transition-transform active:scale-[0.98]"
              style={{ background: "var(--blue)", color: "white" }}>
              {active.cta}
            </button>
          </div>
          {result && (
            <div className="anim-fade-up mt-4 rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
              <p className="f-mono text-xs font-semibold mb-3" style={{ color: "var(--blue)" }}>{result.title}</p>
              <div className="grid gap-2">
                {result.lines.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--steel)" }}>{k}</span>
                    <span className="f-mono font-semibold" style={{ color: "var(--ink)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] mt-3" style={{ color: "var(--steel)" }}>Sample data — this is a design concept, not a live enquiry service.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- stats band ---------------- */

const STATS = [
  { value: "13,169", label: "trains running daily" },
  { value: "7,335", label: "stations connected" },
  { value: "1.2 M", label: "tickets booked a day" },
  { value: "23 M", label: "passengers carried daily" },
];

export function StatsBand() {
  return (
    <section className="mt-12" style={{ background: "var(--blue)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <p className="f-display text-2xl md:text-3xl font-semibold" style={{ color: "var(--marigold)" }}>
              {(() => {
                const m = String(s.value).match(/^([^\d]*)([\d,]+)(.*)$/);
                if (!m) return s.value;
                return <CountUp value={Number(m[2].replace(/,/g, ""))} prefix={m[1]} suffix={m[3]} />;
              })()}
            </p>
            <p className="text-xs mt-1" style={{ color: "#C7D2DD" }}>{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- popular routes ---------------- */

const ROUTES = [
  { from: "New Delhi", to: "Mumbai Central", code: "NDLS → BCT", trains: 18, from_fare: 685, dur: "15h 50m" },
  { from: "Howrah", to: "New Delhi", code: "HWH → NDLS", trains: 24, from_fare: 720, dur: "17h 05m" },
  { from: "Chennai Central", to: "Bengaluru", code: "MAS → SBC", trains: 31, from_fare: 245, dur: "4h 30m" },
  { from: "Secunderabad", to: "Pune", code: "SC → PUNE", trains: 12, from_fare: 385, dur: "12h 40m" },
  { from: "Ahmedabad", to: "Jaipur", code: "ADI → JP", trains: 9, from_fare: 310, dur: "9h 15m" },
  { from: "Lucknow", to: "Varanasi", code: "LKO → BSB", trains: 21, from_fare: 155, dur: "4h 55m" },
];

export function PopularRoutes({ onSearch }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Popular routes</p>
          <h2 className="f-display text-2xl font-semibold mt-1" style={{ color: "var(--ink)" }}>Where India is travelling this week</h2>
        </div>
        <div className="hidden md:block w-56 flex-shrink-0"><RouteMapIllustration /></div>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROUTES.map((r, i) => (
          <Reveal key={r.code} delay={i * 0.06}>
          <button onClick={onSearch}
            className="w-full text-left rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group"
            style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-2 f-mono text-xs font-semibold" style={{ color: "var(--blue)" }}>
              <MapPin size={13} /> {r.code}
            </div>
            <p className="f-display text-base font-semibold mt-2" style={{ color: "var(--ink)" }}>{r.from} → {r.to}</p>
            <div className="mt-3 h-[3px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
              <div className="h-full w-1/3 rounded-full transition-all duration-500 group-hover:w-full" style={{ background: "var(--marigold)" }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--steel)" }}>
              <span>{r.trains} trains · {r.dur}</span>
              <span className="f-mono font-semibold" style={{ color: "var(--green)" }}>from ₹{r.from_fare}</span>
            </div>
          </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- services grid ---------------- */

const SERVICES = [
  { icon: Ticket, title: "Reserved & Tatkal booking", body: "General, Tatkal, Premium Tatkal, Ladies and Senior Citizen quotas with live seat pressure on every date." },
  { icon: Hotel, title: "Retiring rooms & stays", body: "Book station retiring rooms and IRCTC-partnered hotels alongside your ticket, on the same PNR." },
  { icon: Sparkles, title: "e-Catering on the move", body: "Order meals from FSSAI-approved kitchens delivered to your seat at 500+ stations en route." },
  { icon: Landmark, title: "Tourism & Bharat Gaurav", body: "Curated rail packages, Buddhist circuit and Maharajas' Express journeys in one booking flow." },
  { icon: CreditCard, title: "Refunds you can follow", body: "TDR filing, refund timeline and bank settlement stage shown day by day — never a black box." },
  { icon: PhoneCall, title: "Help that answers", body: "139 helpline, in-app chat and a grievance tracker with a ticket number and an SLA clock." },
];

export function Services() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <div className="grid md:grid-cols-[1fr_0.8fr] gap-6 items-center">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Everything on one platform</p>
          <h2 className="f-display text-2xl font-semibold mt-1" style={{ color: "var(--ink)" }}>More than a ticket window</h2>
          <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: "var(--steel)" }}>
            Tickets, stays, meals and refunds — handled end to end, from the platform bench to the berth.
          </p>
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
              <p className="f-display font-semibold text-[15px]" style={{ color: "var(--ink)" }}>{s.title}</p>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{s.body}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- how it works ---------------- */

const STEPS = [
  { n: "01", title: "Search", body: "Pick stations, date and quota. Seat pressure shows before you commit to a date." },
  { n: "02", title: "Compare", body: "Results sort by departure by default. Filter by train type and class in one tap." },
  { n: "03", title: "Pay", body: "UPI, cards, net banking or wallet — with an explicit outcome for every payment state." },
  { n: "04", title: "Travel", body: "e-Ticket, chart status, live running and refunds all live under My Trips." },
];

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-14">
      <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>How it works</p>
      <h2 className="f-display text-2xl font-semibold mt-1" style={{ color: "var(--ink)" }}>Four stops, start to seat</h2>
      <div className="mt-4"><TrackConnector /></div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1} style={{ borderColor: "var(--line)" }}
            className="rounded-xl border bg-white p-5 relative transition-transform duration-200 hover:-translate-y-1">
            <span className="f-mono text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "var(--blue)", color: "var(--marigold)" }}>{s.n}</span>
            <p className="f-display font-semibold text-base mt-3" style={{ color: "var(--ink)" }}>{s.title}</p>
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--steel)" }}>{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- trust strip ---------------- */

const TRUST = [
  { icon: ShieldCheck, k: "PCI-DSS payments", v: "Tokenised cards, no raw card data stored." },
  { icon: Clock, k: "Sub-second search", v: "Availability cached and refreshed every 30 seconds." },
  { icon: BadgeCheck, k: "Verified refunds", v: "98.4% of eligible refunds settled within 5 working days." },
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

/* ---------------- FAQ ---------------- */

const FAQS = [
  { q: "When does Tatkal booking open?", a: "Tatkal opens at 10:00 AM one day before departure for AC classes and 11:00 AM for non-AC classes, counted from the train's origin station." },
  { q: "My money was debited but I have no ticket. What now?", a: "The booking sits in a Pending state and is auto-reconciled with the bank. If the ticket is not issued, the full amount is reversed to the source account, typically within 3–5 working days, and the status is visible under My Trips." },
  { q: "What does RAC actually mean for my journey?", a: "RAC guarantees you board with a shared side-lower berth. If confirmed berths free up before or after charting, RAC passengers are upgraded in serial order." },
  { q: "Can I change the boarding station after booking?", a: "Yes, boarding point can be changed online up to 24 hours before scheduled departure, once per ticket, provided the new station is on the same route." },
  { q: "How is the refund calculated on cancellation?", a: "Cancellation charges depend on class and how far ahead you cancel; between 48 and 12 hours before departure, 25% of the fare is deducted, and the refund timeline is shown step by step." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 mt-14 pb-16">
      <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Questions</p>
      <h2 className="f-display text-2xl font-semibold mt-1" style={{ color: "var(--ink)" }}>The things people actually ask</h2>
      <div className="mt-5 rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
        {FAQS.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className="border-b last:border-b-0" style={{ borderColor: "var(--line)" }}>
              <button onClick={() => setOpen(on ? -1 : i)} className="w-full flex items-center justify-between gap-3 text-left px-4 py-4">
                <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>{f.q}</span>
                <ChevronDown size={16} className="transition-transform flex-shrink-0"
                  style={{ color: "var(--steel)", transform: on ? "rotate(180deg)" : "none" }} />
              </button>
              {on && (
                <p className="px-4 pb-4 -mt-1 text-sm leading-relaxed anim-fade-up" style={{ color: "var(--steel)" }}>{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
