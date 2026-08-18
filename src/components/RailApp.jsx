import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeftRight, Search, SlidersHorizontal, ChevronDown, ChevronRight,
  Check, Clock, Users, CreditCard, ShieldCheck, AlertTriangle, Loader2,
  Download, Share2, Home, Ticket, Compass, LifeBuoy, User, X, Train,
  MapPin, CalendarDays, Phone, Mail, HelpCircle, FileText, ChevronUp,
  BadgeCheck, Wallet, Languages, Bell, LogOut, Hotel, Sparkles, PhoneCall,
  MessageSquareText, PackageSearch, Landmark, ScanLine
} from "lucide-react";
import ConfirmationScreen, { buildBooking } from "./ConfirmationScreen.jsx";
import {
  QuickTools, StatsBand, PopularRoutes, Services, HowItWorks, TrustStrip, FAQ,
} from "./HomeSections.jsx";
import stationList from "../stationList.json";

/* ---------------------------------------------------------------
   TOKENS
   Colour  : Signal Blue #0F2A45 (brand/primary), Marigold #E2A63B
             (Tatkal/CTA — festival-ticket accent), Track Green #1F7A4C
             (available), Caution Amber #C9861F (RAC), Alert Red #C23B32
             (waitlisted/error), Paper #F6F3EC (background), Ink #1C1B19
   Type    : Space Grotesk (display, restrained use) / IBM Plex Sans
             (UI + body — the typeface of record on Indian gov. digital
             services) / IBM Plex Mono (tabular data: times, fares, PNR)
   Motif   : the "track line" — a horizontal rail with station-node
             dividers, reused as section divider and as the booking
             stepper — plus a ticket-stub punch-hole edge on cards,
             since the product's whole job is getting someone from one
             station to another and handing them a paper-trail of that.
------------------------------------------------------------------*/

const FONT_IMPORT = `
:root{
  --ink:#1B1A18; --paper:#F7F4EC; --paper-2:#EFEADC;
  --blue:#0F2A45; --blue-2:#1B4470; --blue-3:#091C31;
  --marigold:#E5A93D; --marigold-2:#C08321;
  --green:#1F7A4C; --green-bg:#E9F4EE;
  --amber:#C9861F; --amber-bg:#FCF2E1;
  --red:#C23B32; --red-bg:#FBEBE9;
  --steel:#6D7681; --line:#E2DCCD;
  --shadow-lg: 0 28px 56px -24px rgba(9,28,49,0.34), 0 4px 14px -6px rgba(9,28,49,0.12);
  --shadow-sm: 0 1px 2px rgba(9,28,49,0.04), 0 6px 16px -10px rgba(9,28,49,0.18);
  --shadow-hover: 0 18px 34px -18px rgba(9,28,49,0.30);
}
html{ scroll-behavior:smooth; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
::selection{ background: rgba(229,169,61,0.35); }
.f-display{ letter-spacing:-0.015em; }
button, a, input, select{ outline-color: var(--marigold); }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible{
  outline:2px solid var(--marigold); outline-offset:2px; border-radius:10px;
}
input, select, button{ transition: border-color .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease, transform .18s ease; }
input:focus, select:focus{ border-color: var(--blue) !important; box-shadow: 0 0 0 3px rgba(15,42,69,0.08); }
.paper-texture{ position:relative; }
::-webkit-scrollbar{ height:8px; width:8px; }
::-webkit-scrollbar-thumb{ background: #CFC7B4; border-radius:8px; }
::-webkit-scrollbar-track{ background: transparent; }
.f-display{font-family:'Space Grotesk',sans-serif;}
.f-body{font-family:'IBM Plex Sans',sans-serif;}
.f-mono{font-family:'IBM Plex Mono',monospace;}
.paper-texture{
  background-image: radial-gradient(circle, rgba(15,42,69,0.05) 1px, transparent 1px);
  background-size: 14px 14px;
}
.ticket-notch{ position: relative; }
.ticket-notch::before, .ticket-notch::after{
  content:''; position:absolute; top:50%; width:16px; height:16px; border-radius:9999px;
  background: var(--paper); transform: translateY(-50%);
}
.ticket-notch::before{ left:-8px; }
.ticket-notch::after{ right:-8px; }

@keyframes train-cross{
  0%{ transform: translateX(-10%); }
  100%{ transform: translateX(110%); }
}
@keyframes train-down{
  0%{ transform: translateY(-10vh); }
  100%{ transform: translateY(110vh); }
}
@keyframes train-chug{
  0%,100%{ transform: translateY(0) rotate(0deg); }
  50%{ transform: translateY(-2px) rotate(-1deg); }
}
@keyframes float-cloud{
  0%{ transform: translateX(0); }
  100%{ transform: translateX(-40px); }
}
@keyframes signal-blink{
  0%,100%{ opacity: 1; }
  50%{ opacity: 0.35; }
}
@keyframes fade-up{
  from{ opacity: 0; transform: translateY(14px); }
  to{ opacity: 1; transform: translateY(0); }
}
@keyframes pulse-dot{
  0%{ box-shadow: 0 0 0 0 rgba(31,122,76,0.45); }
  70%{ box-shadow: 0 0 0 7px rgba(31,122,76,0); }
  100%{ box-shadow: 0 0 0 0 rgba(31,122,76,0); }
}
@keyframes draw-check{
  from{ stroke-dashoffset: 24; }
  to{ stroke-dashoffset: 0; }
}
@keyframes confetti-fall{
  0%{ transform: translateY(-12px) rotate(0deg); opacity: 0; }
  10%{ opacity: 1; }
  100%{ transform: translateY(120px) rotate(280deg); opacity: 0; }
}
@keyframes wheel-spin{
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
}
@keyframes shimmer{
  0%{ background-position: -200px 0; }
  100%{ background-position: 200px 0; }
}
@keyframes smoke-rise{
  0%{ transform: translateY(0) scale(0.6); opacity: 0.55; }
  100%{ transform: translateY(-26px) scale(1.4); opacity: 0; }
}
@keyframes dash-move{
  to{ stroke-dashoffset: -22; }
}
@keyframes bob{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-5px); }
}
@keyframes ripple{
  0%{ transform: scale(0.6); opacity: 0.35; }
  100%{ transform: scale(1.6); opacity: 0; }
}
.anim-fade-up{ animation: fade-up 0.55s cubic-bezier(.2,.7,.2,1) both; }
.anim-pulse-dot{ animation: pulse-dot 2s infinite; }
@media (prefers-reduced-motion: reduce){
  .anim-fade-up, .anim-pulse-dot, [style*="animation"]{ animation: none !important; }
  .opacity-0{ opacity: 1 !important; }
}

/* soft glow behind hero gradients */
.paper-texture::after{
  content:''; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(80% 60% at 78% 12%, rgba(229,169,61,0.16) 0%, transparent 60%),
              radial-gradient(60% 50% at 8% 90%, rgba(31,122,76,0.14) 0%, transparent 65%);
}
.paper-texture > *{ position:relative; z-index:1; }
`;

/* ---------------- sample data (from the plan's search scenario) ---------------- */

const TRAINS = [
  { no: "12951", name: "Mumbai Rajdhani", type: "Rajdhani", dep: "16:35", arr: "08:35", dur: "16h 00m", from: "NDLS", to: "BCT",
    classes: { "1A": { status: "AVAILABLE", n: 12, fare: 4855 }, "2A": { status: "AVAILABLE", n: 34, fare: 2830 }, "3A": { status: "RAC", n: 6, fare: 1985 } } },
  { no: "12259", name: "Sealdah Duronto", type: "Duronto", dep: "08:05", arr: "23:55", dur: "15h 50m", from: "NDLS", to: "SDAH",
    classes: { "2A": { status: "AVAILABLE", n: 8, fare: 2650 }, "3A": { status: "WAITLIST", n: 0, fare: 1840, wl: 14 }, "SL": { status: "AVAILABLE", n: 61, fare: 685 } } },
  { no: "12002", name: "Bhopal Shatabdi", type: "Shatabdi", dep: "06:00", arr: "12:10", dur: "6h 10m", from: "NDLS", to: "BPL",
    classes: { "CC": { status: "AVAILABLE", n: 122, fare: 985 }, "EC": { status: "RAC", n: 3, fare: 1890 } } },
  { no: "14650", name: "Bikaner Express", type: "Express", dep: "20:15", arr: "10:40", dur: "14h 25m", from: "NDLS", to: "BME",
    classes: { "SL": { status: "AVAILABLE", n: 44, fare: 495 }, "3A": { status: "AVAILABLE", n: 19, fare: 1320 }, "2A": { status: "WAITLIST", n: 0, fare: 1955, wl: 3 } } },
  { no: "18238", name: "Chhattisgarh Exp", type: "Passenger", dep: "11:20", arr: "05:05", dur: "17h 45m", from: "NDLS", to: "BSP",
    classes: { "SL": { status: "RAC", n: 11, fare: 460 }, "3A": { status: "AVAILABLE", n: 27, fare: 1210 } } },
];

const STATUS_STYLE = {
  AVAILABLE: { bg: "var(--green-bg)", fg: "var(--green)", label: "Available" },
  RAC:       { bg: "var(--amber-bg)", fg: "var(--amber)", label: "RAC" },
  WAITLIST:  { bg: "var(--red-bg)",   fg: "var(--red)",   label: "Waitlist" },
};

/* ---------------- shared bits ---------------- */

function TrackLine({ compact, light }) {
  const lineColor = light ? "#5C7A98" : "var(--blue)";
  const dotColor = light ? "var(--marigold)" : "var(--blue)";
  return (
    <div className={`relative flex items-center gap-2 ${compact ? "my-4" : "my-8"}`} aria-hidden="true" style={{ overflow: "hidden" }}>
      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
      <div className="flex-1 h-[2px] relative" style={{
        background: `repeating-linear-gradient(90deg, ${lineColor} 0 10px, transparent 10px 18px)`
      }}>
        <div className="absolute -top-[9px]" style={{ animation: "train-cross 7s linear infinite" }}>
          <Train size={18} style={{ color: "var(--marigold)" }} />
        </div>
      </div>
      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
    </div>
  );
}

/* Small decorative hero illustration: rail scene with a chugging train,
   drifting clouds, and a blinking signal — the site's signature motif. */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto max-w-[380px]" aria-hidden="true">
      {/* sky clouds */}
      <g style={{ animation: "float-cloud 14s linear infinite alternate" }} opacity="0.5">
        <ellipse cx="60" cy="34" rx="26" ry="10" fill="#EAF1F6" />
        <ellipse cx="82" cy="30" rx="18" ry="8" fill="#EAF1F6" />
      </g>
      <g style={{ animation: "float-cloud 18s linear infinite alternate-reverse" }} opacity="0.35">
        <ellipse cx="260" cy="24" rx="30" ry="11" fill="#EAF1F6" />
      </g>
      {/* signal */}
      <rect x="300" y="60" width="4" height="60" fill="#8FA3B5" />
      <circle cx="302" cy="58" r="8" fill="#132C46" />
      <circle cx="302" cy="58" r="4" fill="var(--marigold)" style={{ animation: "signal-blink 1.6s ease-in-out infinite" }} />
      {/* ground */}
      <rect x="0" y="150" width="360" height="50" fill="#0B213A" opacity="0.15" />
      {/* rail */}
      <rect x="0" y="152" width="360" height="4" fill="#8FA3B5" />
      {Array.from({ length: 18 }).map((_, i) => (
        <rect key={i} x={i * 21} y="156" width="10" height="4" fill="#8FA3B5" opacity="0.6" />
      ))}
      {/* train, chugging as a group */}
      <g style={{ animation: "train-chug 0.6s ease-in-out infinite", transformOrigin: "150px 150px" }}>
        {/* smoke puffs */}
        <circle cx="120" cy="98" r="6" fill="#D7DEE6" style={{ animation: "smoke-rise 2.2s ease-out infinite", transformOrigin: "120px 98px" }} />
        <circle cx="126" cy="92" r="5" fill="#D7DEE6" style={{ animation: "smoke-rise 2.2s ease-out infinite 0.7s", transformOrigin: "126px 92px" }} />
        <circle cx="132" cy="88" r="4" fill="#D7DEE6" style={{ animation: "smoke-rise 2.2s ease-out infinite 1.4s", transformOrigin: "132px 88px" }} />
        {/* body */}
        <rect x="70" y="110" width="130" height="42" rx="8" fill="var(--marigold)" />
        <rect x="70" y="110" width="130" height="14" rx="7" fill="var(--blue)" />
        <rect x="118" y="96" width="20" height="18" rx="3" fill="var(--blue)" />
        {[92, 118, 144, 170].map((x) => (
          <rect key={x} x={x} y="128" width="16" height="14" rx="2" fill="#F5F2E9" />
        ))}
        {/* wheels */}
        {[90, 130, 170].map((cx) => (
          <g key={cx} style={{ transformOrigin: `${cx}px 158px`, animation: "wheel-spin 1s linear infinite" }}>
            <circle cx={cx} cy="158" r="10" fill="var(--blue)" />
            <circle cx={cx} cy="158" r="3" fill="var(--marigold)" />
            <rect x={cx - 1} y="150" width="2" height="16" fill="#0B213A" />
            <rect x={cx - 8} y="157" width="16" height="2" fill="#0B213A" />
          </g>
        ))}
        {/* coupling + coach hint */}
        <rect x="202" y="126" width="8" height="4" fill="#8FA3B5" />
        <rect x="210" y="112" width="46" height="40" rx="6" fill="var(--blue-2)" />
        <rect x="218" y="124" width="14" height="12" rx="2" fill="#F5F2E9" opacity="0.85" />
        <rect x="238" y="124" width="14" height="12" rx="2" fill="#F5F2E9" opacity="0.85" />
        <g style={{ transformOrigin: "222px 158px", animation: "wheel-spin 1s linear infinite" }}>
          <circle cx="222" cy="158" r="9" fill="var(--blue-2)" />
        </g>
        <g style={{ transformOrigin: "244px 158px", animation: "wheel-spin 1s linear infinite" }}>
          <circle cx="244" cy="158" r="9" fill="var(--blue-2)" />
        </g>
      </g>
    </svg>
  );
}

/* Playful chugging-train loader, used instead of a generic spinner
   anywhere the product is "working on it" — payment verification etc. */
function TrainLoader({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="relative w-24 h-10 overflow-hidden">
        <div className="absolute" style={{ animation: "train-cross 1.8s linear infinite" }}>
          <Train size={26} style={{ color: "var(--blue)" }} />
        </div>
      </div>
      {label && <p className="text-xs font-medium" style={{ color: "var(--steel)" }}>{label}</p>}
    </div>
  );
}

/* Small confetti burst for the booking-confirmation moment. */
function ConfettiBurst() {
  const pieces = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
    left: 6 + (i * 90) / 14 + (i % 3) * 2,
    delay: (i % 7) * 0.15,
    color: [ "var(--marigold)", "var(--green)", "var(--blue-2)", "var(--red)" ][i % 4],
    size: 5 + (i % 3) * 2,
  })), []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} style={{
          position: "absolute", left: `${p.left}%`, top: "-8px",
          width: p.size, height: p.size * 0.6, background: p.color, borderRadius: 2,
          animation: `confetti-fall 1.4s ease-in ${p.delay}s both`,
        }} />
      ))}
    </div>
  );
}

/* Reveal-on-mount wrapper for staggered list/card entrances. */
function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <div className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function TopNav({ screen, setScreen }) {
  const items = [
    { key: "search", label: "Book a Train", icon: Home },
    { key: "trips", label: "My Trips", icon: Ticket },
    { key: "explore", label: "Explore", icon: Compass },
    { key: "help", label: "Help & Support", icon: LifeBuoy },
  ];
  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--blue)", boxShadow: "var(--shadow-sm)" }}>
      <div className="text-[11px] f-body text-center py-1 px-4" style={{ background: "var(--blue-3)", color: "#B9C6D4" }}>
        An Indian Railways redesign concept · Helpline 139 for real bookings
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button onClick={() => setScreen("search")} className="flex items-center gap-2.5 f-display font-semibold text-white text-lg tracking-tight">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--marigold)" }}>
            <Train size={19} color="var(--blue)" />
          </div>
          <span>IRCTC<span className="hidden sm:inline font-normal text-[13px] ml-1.5 opacity-70">| Indian Railways</span></span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = screen === it.key || (it.key === "search" && ["search","results","booking","confirmation"].includes(screen));
            return (
              <button key={it.key} onClick={() => setScreen(it.key)}
                className="f-body flex items-center gap-2 px-3 h-11 rounded-lg text-sm font-medium transition-colors"
                style={{ color: active ? "var(--blue)" : "#D7DEE6", background: active ? "var(--marigold)" : "transparent" }}>
                <Icon size={16} /> {it.label}
              </button>
            );
          })}
        </nav>
        <button onClick={() => setScreen("account")} className="h-11 w-11 rounded-full flex items-center justify-center transition-colors"
          style={{ background: screen === "account" ? "var(--marigold)" : "var(--blue-2)" }}>
          <User size={18} color={screen === "account" ? "var(--blue)" : "white"} />
        </button>
      </div>
      <nav className="md:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = screen === it.key || (it.key === "search" && ["search","results","booking","confirmation"].includes(screen));
          return (
            <button key={it.key} onClick={() => setScreen(it.key)}
              className="f-body flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium flex-shrink-0"
              style={{ color: active ? "var(--blue)" : "#D7DEE6", background: active ? "var(--marigold)" : "var(--blue-2)" }}>
              <Icon size={13} /> {it.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function Footer() {
  const cols = [
    { title: "Quick links", items: ["PNR Status", "Train Between Stations", "Fare Enquiry", "Live Train Status", "Cancel / TDR"] },
    { title: "Explore", items: ["IRCTC Tourism", "Bharat Gaurav Trains", "Retiring Rooms", "e-Catering"] },
    { title: "Support", items: ["Helpline: 139", "care@irctc.co.in", "Grievance Tracker", "FAQs"] },
  ];
  return (
    <footer className="f-body" style={{ background: "var(--blue-3)", color: "#B9C6D4" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 f-display font-semibold text-white text-base mb-2">
            <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: "var(--marigold)" }}>
              <Train size={15} color="var(--blue)" />
            </div>
            IRCTC
          </div>
          <p className="text-xs leading-relaxed">Indian Railway Catering &amp; Tourism Corporation Ltd. A Mini Ratna (Category-I) PSU under the Ministry of Railways.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">{c.title}</p>
            <ul className="space-y-2 text-xs">
              {c.items.map((i) => <li key={i} className="hover:text-white cursor-pointer transition-colors">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-4 md:px-6 py-4 text-[11px] flex flex-col sm:flex-row gap-2 justify-between max-w-6xl mx-auto" style={{ borderColor: "#20405F" }}>
        <span>© Indian Railway Catering &amp; Tourism Corporation Ltd — redesign concept, not the live site.</span>
        <span className="f-mono">CIN: L74899DL1999GOI101707</span>
      </div>
    </footer>
  );
}

/* ---------------- SEARCH SCREEN ---------------- */

function SearchScreen({ onSearch }) {
  const [from, setFrom] = useState("New Delhi (NDLS)");
  const [to, setTo] = useState("Mumbai Central (BCT)");
  const [date, setDate] = useState("Tue, 25 Aug");
  const [cls, setCls] = useState("All classes");
  const [quota, setQuota] = useState("General");

  const dateStrip = ["24 Aug", "25 Aug", "26 Aug", "27 Aug", "28 Aug", "29 Aug", "30 Aug"];
  const availabilityHint = { "24 Aug": "amber", "25 Aug": "green", "26 Aug": "green", "27 Aug": "red", "28 Aug": "green", "29 Aug": "amber", "30 Aug": "green" };

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body relative">
      <div className="fixed top-0 left-4 md:left-8 bottom-0 w-[2px] z-50 opacity-30 pointer-events-none"
           style={{ background: "repeating-linear-gradient(180deg, var(--blue) 0 10px, transparent 10px 18px)" }}>
        <div className="absolute -left-[11px]" style={{ animation: "train-down 15s linear infinite" }}>
          <Train size={24} style={{ color: "var(--marigold)" }} />
        </div>
      </div>
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-24 md:pt-16 md:pb-32 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
          <FadeIn>
            <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Book a Train</p>
            <h1 className="f-display text-3xl md:text-[2.6rem] leading-tight font-semibold text-white mt-2 max-w-xl">
              Find your train, see what's actually available, book without the guesswork.
            </h1>
            <p className="text-sm mt-3 max-w-md" style={{ color: "#C7D2DD" }}>
              One search bar, honest availability, and a payment flow that never leaves you guessing where your money went.
            </p>
          </FadeIn>
          <FadeIn delay={0.15} className="hidden md:block">
            <HeroIllustration />
          </FadeIn>
        </div>
      </section>

      {/* search card overlapping hero */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
        <FadeIn delay={0.1}>
        <div className="rounded-2xl bg-white border p-4 md:p-6" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-lg)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <Field label="From" icon={MapPin} value={from} onChange={setFrom} />
            <button
              onClick={() => { setFrom(to); setTo(from); }}
              aria-label="Swap stations"
              className="h-11 w-11 rounded-full border flex items-center justify-center self-center mb-1 mx-auto transition-transform duration-300 hover:rotate-180 active:scale-90"
              style={{ borderColor: "var(--line)", color: "var(--blue)" }}>
              <ArrowLeftRight size={18} />
            </button>
            <Field label="To" icon={MapPin} value={to} onChange={setTo} />
          </div>

          <div className="mt-4">
            <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Journey date</label>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {dateStrip.map((d) => {
                const on = d === date;
                const dot = availabilityHint[d];
                return (
                  <button key={d} onClick={() => setDate(d)}
                    className="min-w-[76px] h-16 rounded-xl border flex flex-col items-center justify-center gap-1 flex-shrink-0 f-body text-sm font-medium"
                    style={{
                      borderColor: on ? "var(--blue)" : "var(--line)",
                      background: on ? "var(--blue)" : "white",
                      color: on ? "white" : "var(--ink)",
                    }}>
                    {d}
                    <span className="h-1.5 w-1.5 rounded-full" style={{
                      background: on ? "var(--marigold)" : { green: "var(--green)", amber: "var(--amber)", red: "var(--red)" }[dot],
                      animation: (!on && dot === "green") ? "pulse-dot 2s infinite" : "none",
                    }} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--steel)" }}>Dot shows seat pressure for General quota on that date.</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Select label="Class" value={cls} onChange={setCls} options={["All classes", "Sleeper (SL)", "AC 3-Tier (3A)", "AC 2-Tier (2A)", "AC First (1A)", "Chair Car (CC)"]} />
            <Select label="Quota" value={quota} onChange={setQuota} options={["General", "Tatkal", "Ladies", "Senior Citizen", "Premium Tatkal"]} />
          </div>

          <button onClick={onSearch}
            className="mt-5 w-full h-12 rounded-xl f-body font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            style={{ background: "var(--marigold)", color: "var(--blue)" }}>
            <Search size={18} /> Search trains
          </button>

          <div className="mt-4 flex flex-wrap gap-2">
            {["NDLS → BCT, last searched", "NDLS → SDAH", "NDLS → BPL"].map((r) => (
              <button key={r} className="text-xs px-3 h-8 rounded-full border transition-transform hover:scale-105" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>{r}</button>
            ))}
          </div>
        </div>
        </FadeIn>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <TrackLine />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FadeIn delay={0.05}><InfoCard icon={ShieldCheck} title="Never a dead end" body="Every payment outcome — success, pending, failed — gets a clear next step. No more silent debits." /></FadeIn>
          <FadeIn delay={0.15}><InfoCard icon={Clock} title="Sorted by time, by default" body="Results are ordered by departure time out of the box, with sort and filters one tap away." /></FadeIn>
          <FadeIn delay={0.25}><InfoCard icon={CalendarDays} title="Live PNR & refunds" body="Track your booking, PNR status and refund timeline in one place — My Trips." /></FadeIn>
        </div>
      </div>
      <QuickTools />
      <StatsBand />
      <PopularRoutes onSearch={onSearch} />
      <Services />
      <HowItWorks />
      <TrustStrip />
      <FAQ />
      <Footer />
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return stationList.slice(0, 50);
    const lower = search.toLowerCase();
    return stationList.filter(s => s.toLowerCase().includes(lower)).slice(0, 50);
  }, [search]);

  return (
    <div ref={inputRef} className="relative z-20">
      <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>{label}</label>
      <div className="mt-1.5 h-12 rounded-xl border flex items-center gap-2 px-3 bg-white transition-colors" style={{ borderColor: open ? "var(--blue)" : "var(--line)" }}>
        <Icon size={16} style={{ color: "var(--blue)" }} />
        <input 
          value={open ? search : value} 
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setSearch("");
            setOpen(true);
          }}
          placeholder={value}
          className="f-body flex-1 outline-none text-[15px] bg-transparent" style={{ color: "var(--ink)" }} />
      </div>
      
      {open && filtered.length > 0 && (
        <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: "var(--line)" }}>
          {filtered.map(station => (
            <div 
              key={station} 
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0 transition-colors truncate"
              style={{ borderColor: "var(--line)" }}
              onClick={() => {
                onChange(station);
                setOpen(false);
              }}
            >
              {station}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>{label}</label>
      <div className="mt-1.5 h-12 rounded-xl border flex items-center px-3 relative" style={{ borderColor: "var(--line)" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="f-body flex-1 outline-none text-[15px] bg-transparent appearance-none pr-6" style={{ color: "var(--ink)" }}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 pointer-events-none" style={{ color: "var(--steel)" }} />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, body }) {
  return (
    <div className="rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-1" style={{ borderColor: "var(--line)" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
      <div className="h-9 w-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--green-bg)" }}>
        <Icon size={17} style={{ color: "var(--green)" }} />
      </div>
      <p className="f-body font-semibold text-sm" style={{ color: "var(--ink)" }}>{title}</p>
      <p className="f-body text-sm mt-1 leading-relaxed" style={{ color: "var(--steel)" }}>{body}</p>
    </div>
  );
}

/* ---------------- RESULTS SCREEN ---------------- */

function ResultsScreen({ onBook, onBack }) {
  const [sort, setSort] = useState("Departure");
  const [expanded, setExpanded] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [trainTypes, setTrainTypes] = useState([]);
  const [classesF, setClassesF] = useState([]);

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let list = [...TRAINS];
    if (trainTypes.length) list = list.filter((t) => trainTypes.includes(t.type));
    if (classesF.length) list = list.filter((t) => Object.keys(t.classes).some((c) => classesF.includes(c)));
    if (sort === "Departure") list.sort((a, b) => a.dep.localeCompare(b.dep));
    if (sort === "Duration") list.sort((a, b) => a.dur.localeCompare(b.dur));
    if (sort === "Price") list.sort((a, b) => Math.min(...Object.values(a.classes).map(c=>c.fare)) - Math.min(...Object.values(b.classes).map(c=>c.fare)));
    return list;
  }, [sort, trainTypes, classesF]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="f-body text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--steel)" }}>Train type</p>
        <div className="space-y-2">
          {["Rajdhani", "Shatabdi", "Duronto", "Express", "Passenger"].map((t) => (
            <label key={t} className="flex items-center gap-2 f-body text-sm cursor-pointer">
              <input type="checkbox" checked={trainTypes.includes(t)} onChange={() => toggle(trainTypes, setTrainTypes, t)} className="h-4 w-4" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="f-body text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--steel)" }}>Class</p>
        <div className="flex flex-wrap gap-2">
          {["SL", "3A", "2A", "1A", "CC", "EC"].map((c) => (
            <button key={c} onClick={() => toggle(classesF, setClassesF, c)}
              className="px-3 h-9 rounded-lg border f-mono text-xs font-semibold"
              style={{
                borderColor: classesF.includes(c) ? "var(--blue)" : "var(--line)",
                background: classesF.includes(c) ? "var(--blue)" : "white",
                color: classesF.includes(c) ? "white" : "var(--ink)",
              }}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-16">
      {/* sticky summary bar */}
      <div className="sticky top-16 z-30 border-b" style={{ background: "white", borderColor: "var(--line)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--blue)" }}>
            <ChevronRight size={16} className="rotate-180" /> Edit search
          </button>
          <div className="flex items-center gap-2 f-mono text-sm font-semibold" style={{ color: "var(--ink)" }}>
            NDLS <ArrowLeftRight size={13} style={{ color: "var(--steel)" }} /> BCT
            <span className="text-xs font-normal f-body px-2 py-0.5 rounded-full" style={{ background: "var(--paper-2)", color: "var(--steel)" }}>Tue, 25 Aug · General</span>
          </div>
          <button onClick={() => setFiltersOpen(true)} className="md:hidden h-9 px-3 rounded-lg border flex items-center gap-1.5 text-sm font-medium" style={{ borderColor: "var(--line)" }}>
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* desktop left rail */}
        <aside className="hidden md:block">
          <div className="rounded-xl border bg-white p-4 sticky top-32" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold text-sm mb-3">Filters</p>
            {FilterPanel}
          </div>
        </aside>

        <main>
          <div className="flex items-center justify-between mb-3">
            <p className="f-body text-sm" style={{ color: "var(--steel)" }}>{filtered.length} trains found</p>
            <div className="flex items-center gap-1">
              {["Departure", "Duration", "Price"].map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className="text-xs px-3 h-8 rounded-full border font-medium"
                  style={{
                    borderColor: sort === s ? "var(--blue)" : "var(--line)",
                    background: sort === s ? "var(--blue)" : "white",
                    color: sort === s ? "white" : "var(--ink)",
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((t, ti) => (
              <FadeIn key={t.no} delay={ti * 0.06}>
              <div className="rounded-xl border bg-white overflow-hidden transition-shadow hover:shadow-md" style={{ borderColor: "var(--line)" }}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="f-display font-semibold text-[15px]" style={{ color: "var(--ink)" }}>{t.name}</p>
                      <p className="f-mono text-xs mt-0.5" style={{ color: "var(--steel)" }}>#{t.no} · {t.type}</p>
                    </div>
                    <div className="flex items-center gap-3 f-mono text-sm font-semibold text-right" style={{ color: "var(--ink)" }}>
                      <div>
                        <p>{t.dep}</p>
                        <p className="text-[10px] font-normal" style={{ color: "var(--steel)" }}>{t.from}</p>
                      </div>
                      <div className="flex flex-col items-center px-1">
                        <span className="text-[10px] f-body" style={{ color: "var(--steel)" }}>{t.dur}</span>
                        <div className="w-10 h-[1.5px] my-1" style={{ background: "var(--line)" }} />
                      </div>
                      <div>
                        <p>{t.arr}</p>
                        <p className="text-[10px] font-normal" style={{ color: "var(--steel)" }}>{t.to}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(t.classes).map(([c, info]) => {
                      const s = STATUS_STYLE[info.status];
                      const isOpen = expanded === `${t.no}-${c}`;
                      return (
                        <button key={c} onClick={() => setExpanded(isOpen ? null : `${t.no}-${c}`)}
                          className="px-3 h-9 rounded-lg text-xs font-semibold f-mono flex items-center gap-1.5 border transition-transform hover:scale-105"
                          style={{ background: s.bg, color: s.fg, borderColor: isOpen ? s.fg : "transparent" }}>
                          {info.status === "AVAILABLE" && <span className="h-1.5 w-1.5 rounded-full anim-pulse-dot" style={{ background: s.fg }} />}
                          {c} · {info.status === "WAITLIST" ? `WL ${info.wl}` : s.label}
                          <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {Object.entries(t.classes).map(([c, info]) => {
                  const isOpen = expanded === `${t.no}-${c}`;
                  if (!isOpen) return null;
                  const s = STATUS_STYLE[info.status];
                  return (
                    <div key={c} className="border-t px-4 py-4 anim-fade-up" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="f-body text-sm font-medium" style={{ color: "var(--ink)" }}>
                            {c} — <span style={{ color: s.fg }}>{info.status === "WAITLIST" ? `Waitlist #${info.wl}` : `${info.n} seats ${s.label.toLowerCase()}`}</span>
                          </p>
                          <p className="f-body text-xs mt-1" style={{ color: "var(--steel)" }}>Boarding: {t.from} · Base fare shown, convenience fee added at payment</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="f-mono text-lg font-semibold" style={{ color: "var(--ink)" }}>₹{info.fare.toLocaleString("en-IN")}</p>
                          <button onClick={() => onBook({ train: t, cls: c, fare: info.fare })}
                            className="h-10 px-4 rounded-lg f-body text-sm font-semibold transition-transform active:scale-95 hover:brightness-105"
                            style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </FadeIn>
            ))}
          </div>
        </main>
      </div>

      <div className="mt-10">
        <Footer />
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="f-display font-semibold">Filters</p>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="mt-6 w-full h-12 rounded-xl font-semibold" style={{ background: "var(--blue)", color: "white" }}>
              Show {filtered.length} trains
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

/* ---------------- BOOKING / PAYMENT SCREEN ---------------- */

const STEPS = ["Passengers", "Payment", "Confirmation"];

function BookingScreen({ selection, onDone, onBack, onConfirmed }) {
  const [step, setStep] = useState(0);
  const [payState, setPayState] = useState("idle"); // idle | processing | verifying | success | failed
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "M" }]);

  const fare = selection.fare;
  const convenience = 35;
  const total = fare + convenience;

  const addPassenger = () => setPassengers([...passengers, { name: "", age: "", gender: "M" }]);
  const updatePassenger = (i, field, val) => {
    const next = [...passengers];
    next[i][field] = val;
    setPassengers(next);
  };

  const runPayment = (outcome) => {
    setPayState("processing");
    setTimeout(() => {
      if (outcome === "verifying") {
        setPayState("verifying");
        setTimeout(() => { setPayState("success"); setStep(2); onConfirmed(buildBooking(selection, passengers)); }, 2200);
      } else if (outcome === "failed") {
        setPayState("failed");
      } else {
        setPayState("success");
        setStep(2);
        onConfirmed(buildBooking(selection, passengers));
      }
    }, 1000);
  };

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium mb-4" style={{ color: "var(--blue)" }}>
          <ChevronRight size={16} className="rotate-180" /> Back to results
        </button>

        {/* stepper — track line motif */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-8 w-8 rounded-full flex items-center justify-center f-mono text-xs font-semibold transition-all duration-300"
                  style={{
                    background: i <= step ? "var(--blue)" : "white",
                    color: i <= step ? "white" : "var(--steel)",
                    border: `1.5px solid ${i <= step ? "var(--blue)" : "var(--line)"}`,
                    transform: i === step ? "scale(1.1)" : "scale(1)",
                  }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[11px] font-medium" style={{ color: i <= step ? "var(--ink)" : "var(--steel)" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mb-4" style={{ background: i < step ? "var(--blue)" : "var(--line)" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* journey summary */}
        <div className="rounded-xl border bg-white p-4 mb-6 flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="f-display font-semibold text-sm">{selection.train.name} · #{selection.train.no}</p>
            <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{selection.train.dep} {selection.train.from} → {selection.train.arr} {selection.train.to} · {selection.cls}</p>
          </div>
          <p className="f-mono font-semibold" style={{ color: "var(--ink)" }}>₹{total.toLocaleString("en-IN")}</p>
        </div>

        {step === 0 && (
          <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-4">Passenger details</p>
            <div className="space-y-4">
              {passengers.map((p, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_90px] gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Full name</label>
                    <input value={p.name} onChange={(e) => updatePassenger(i, "name", e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none" style={{ borderColor: "var(--line)" }} placeholder="As per ID" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Age</label>
                    <input value={p.age} onChange={(e) => updatePassenger(i, "age", e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none" style={{ borderColor: "var(--line)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Gender</label>
                    <select value={p.gender} onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none bg-white" style={{ borderColor: "var(--line)" }}>
                      <option value="M">M</option><option value="F">F</option><option value="O">O</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addPassenger} className="mt-4 text-sm font-medium" style={{ color: "var(--blue)" }}>+ Add another passenger</button>
            <button onClick={() => setStep(1)} className="mt-6 w-full h-12 rounded-xl font-semibold" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
              Continue to payment
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Payment</p>
            <p className="text-sm mb-4" style={{ color: "var(--steel)" }}>Fare ₹{fare.toLocaleString("en-IN")} + convenience fee ₹{convenience} = <span className="f-mono font-semibold" style={{ color: "var(--ink)" }}>₹{total.toLocaleString("en-IN")}</span></p>

            {payState === "idle" && (
              <div className="space-y-3">
                <div className="rounded-lg border p-3 flex items-center gap-3" style={{ borderColor: "var(--blue)", background: "var(--paper)" }}>
                  <CreditCard size={18} style={{ color: "var(--blue)" }} />
                  <span className="text-sm font-medium">UPI / Card / Net Banking</span>
                </div>
                <p className="text-xs" style={{ color: "var(--steel)" }}>Demo: try each outcome to see how the redesigned flow handles it — no more silent dead ends.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button onClick={() => runPayment("success")} className="h-11 rounded-lg font-semibold text-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>Pay ₹{total} — succeeds</button>
                  <button onClick={() => runPayment("verifying")} className="h-11 rounded-lg font-semibold text-sm border" style={{ borderColor: "var(--amber)", color: "var(--amber)" }}>Simulate ambiguous debit</button>
                  <button onClick={() => runPayment("failed")} className="h-11 rounded-lg font-semibold text-sm border" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Simulate failure</button>
                </div>
              </div>
            )}

            {payState === "processing" && (
              <div className="flex flex-col items-center py-8 gap-1">
                <TrainLoader label="Processing payment…" />
              </div>
            )}

            {payState === "verifying" && (
              <div className="rounded-lg p-4 flex gap-3 anim-fade-up" style={{ background: "var(--amber-bg)" }}>
                <AlertTriangle size={20} style={{ color: "var(--amber)" }} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Verifying your payment</p>
                  <p className="text-sm mt-1" style={{ color: "var(--ink)" }}>
                    Your bank confirmed the debit but we're still confirming the booking. We'll confirm within 5 minutes —
                    if we can't, the amount is auto-refunded and you'll be notified. No action needed from you right now.
                  </p>
                  <TrainLoader label="Reconciling with bank…" />
                </div>
              </div>
            )}

            {payState === "failed" && (
              <div className="rounded-lg p-4 anim-fade-up" style={{ background: "var(--red-bg)" }}>
                <div className="flex gap-3">
                  <AlertTriangle size={20} style={{ color: "var(--red)" }} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Payment didn't go through</p>
                    <p className="text-sm mt-1" style={{ color: "var(--ink)" }}>No amount was deducted. Your seats are held for 4 more minutes.</p>
                  </div>
                </div>
                <button onClick={() => setPayState("idle")} className="mt-4 w-full h-11 rounded-lg font-semibold text-sm" style={{ background: "var(--blue)", color: "white" }}>
                  Try payment again
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="rounded-xl border bg-white overflow-hidden anim-fade-up" style={{ borderColor: "var(--line)" }}>
            <div className="p-6 flex flex-col items-center text-center relative" style={{ background: "var(--green-bg)" }}>
              <ConfettiBurst />
              <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--green)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "draw-check 0.5s 0.15s ease-out forwards" }} />
                </svg>
              </div>
              <p className="f-display font-semibold text-lg">Booking confirmed</p>
              <p className="f-mono text-sm mt-1" style={{ color: "var(--steel)" }}>PNR 8462 097 315</p>
            </div>
            <div className="p-5 border-t border-dashed" style={{ borderColor: "var(--line)" }}>
              <p className="text-sm" style={{ color: "var(--ink)" }}>{selection.train.name} · {selection.cls} · {passengers.length} passenger{passengers.length > 1 ? "s" : ""}</p>
              <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{selection.train.dep} {selection.train.from} → {selection.train.arr} {selection.train.to}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: "var(--line)" }}>
                  <Download size={15} /> Ticket
                </button>
                <button className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: "var(--line)" }}>
                  <Share2 size={15} /> Share
                </button>
                <button onClick={onDone} className="flex-1 h-11 rounded-lg font-semibold text-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                  My Trips
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- MY TRIPS ---------------- */

function TripsScreen() {
  const [tab, setTab] = useState("upcoming");
  const [pnr, setPnr] = useState("");
  const [pnrResult, setPnrResult] = useState(null);
  const [isSearchingPnr, setIsSearchingPnr] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const checkPnr = () => {
    if (!pnr.trim()) return;
    setIsSearchingPnr(true);
    setPnrResult(null);
    setTimeout(() => {
      setIsSearchingPnr(false);
      setPnrResult({
        pnr: pnr || "8462097315",
        train: "12951 Mumbai Rajdhani",
        date: "25 Aug 2026",
        from: "NDLS", to: "BCT",
        cls: "3A", coach: "B4", seat: "22, Side Lower",
        chart: "Not prepared", status: "CNF",
      });
    }, 800);
  };

  const handleCancelTicket = () => {
    setIsCancelled(true);
    setActiveModal(null);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "pnr", label: "PNR Status" },
    { key: "refunds", label: "Refunds & TDR" },
  ];

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="My Trips" title="Every booking, one place." sub="Upcoming journeys, PNR status, and refund tracking — consolidated from four scattered pages on the old site." />
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-20">
        <div className="flex gap-1 bg-white rounded-xl border p-1 w-fit mb-6" style={{ borderColor: "var(--line)" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 h-10 rounded-lg text-sm font-medium f-body transition-colors"
              style={{ background: tab === t.key ? "var(--blue)" : "transparent", color: tab === t.key ? "white" : "var(--ink)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "upcoming" && (
          <div onClick={() => setActiveModal('ticket_details')} className="rounded-xl border bg-white overflow-hidden mb-16 ticket-notch cursor-pointer hover:shadow-lg transition-shadow" style={{ borderColor: "var(--line)" }}>
            <div className="p-5 flex items-center justify-between transition-colors duration-500" style={{ background: isCancelled ? "var(--red-bg)" : "var(--green-bg)" }}>
              <div>
                <p className="f-display font-semibold text-sm">Mumbai Rajdhani · #12951</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>25 Aug · 16:35 NDLS → 08:35 BCT · 3A</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full transition-colors duration-500" style={{ background: isCancelled ? "var(--red)" : "var(--green)", color: "white" }}>
                {isCancelled ? "Cancelled" : "Confirmed"}
              </span>
            </div>
            <div className="border-t border-dashed p-5 flex flex-wrap gap-6 items-center" style={{ borderColor: "var(--line)" }}>
              <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>PNR</p><p className="f-mono text-sm font-semibold">8462 097 315</p></div>
              {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Coach / Seat</p><p className="f-mono text-sm font-semibold">B4 / 22 SL</p></div>}
              {!isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Live status</p><p className="text-sm font-semibold" style={{ color: "var(--green)" }}>On time</p></div>}
              {isCancelled && <div><p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--steel)" }}>Refund Status</p><p className="text-sm font-semibold" style={{ color: "var(--amber)" }}>Processing</p></div>}
              
              {!isCancelled && (
                <div className="ml-auto flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('live_tracking'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>Live tracking</button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveModal('cancel_ticket'); }} className="h-9 px-3 rounded-lg border text-xs font-semibold hover:bg-red-50 transition-colors" style={{ borderColor: "var(--red)", color: "var(--red)" }}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "pnr" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Check PNR status</p>
            <p className="text-sm mb-4" style={{ color: "var(--steel)" }}>10-digit number printed on your ticket / SMS.</p>
            <div className="flex gap-2">
              <input value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="e.g. 8462097315"
                className="flex-1 h-11 rounded-lg border px-3 text-sm f-mono outline-none focus:border-blue-500 transition-colors" style={{ borderColor: "var(--line)" }} />
              <button onClick={checkPnr} className="h-11 px-5 rounded-lg font-semibold text-sm flex items-center justify-center min-w-[80px] transition-transform active:scale-[0.98]" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
                {isSearchingPnr ? <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div> : "Check"}
              </button>
            </div>

            {pnrResult && !isSearchingPnr && (
              <div className="mt-5 rounded-lg border p-4 anim-fade-up" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="f-mono text-sm font-semibold">PNR {pnrResult.pnr}</p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{pnrResult.status} — Confirmed</span>
                </div>
                <p className="text-sm" style={{ color: "var(--ink)" }}>{pnrResult.train} · {pnrResult.date}</p>
                <p className="f-mono text-xs mt-1" style={{ color: "var(--steel)" }}>{pnrResult.from} → {pnrResult.to} · {pnrResult.cls} · Coach {pnrResult.coach} · Seat {pnrResult.seat}</p>
                <p className="text-xs mt-2" style={{ color: "var(--steel)" }}>Chart status: {pnrResult.chart}. Final seat/coach may change slightly after charting.</p>
              </div>
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="rounded-xl border bg-white p-5 mb-16" style={{ borderColor: "var(--line)" }}>
            <p className="f-display font-semibold mb-1">Refund status — TDR REF 20260812-441</p>
            <p className="text-sm mb-5" style={{ color: "var(--steel)" }}>Filed for a waitlisted passenger cancelled after chart preparation. Refunds are decided by the concerned zonal railway, typically within 60 days.</p>
            <div className="space-y-0">
              {[
                { label: "TDR filed", done: true, note: "12 Aug, 22:14" },
                { label: "Under review by Zonal Railway", done: true, note: "14 Aug" },
                { label: "Refund approved", done: false, note: "Expected by 10 Oct" },
                { label: "Credited to original payment method", done: false, note: "—" },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: s.done ? "var(--green)" : "white", border: `2px solid ${s.done ? "var(--green)" : "var(--line)"}` }}>
                      {s.done && <Check size={12} color="white" />}
                    </div>
                    {i < arr.length - 1 && <div className="w-[2px] flex-1 my-1" style={{ background: s.done ? "var(--green)" : "var(--line)", minHeight: 28 }} />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-semibold" style={{ color: s.done ? "var(--ink)" : "var(--steel)" }}>{s.label}</p>
                    <p className="text-xs f-mono mt-0.5" style={{ color: "var(--steel)" }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <Modal isOpen={activeModal === 'live_tracking'} onClose={() => setActiveModal(null)} title="Live Tracking">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ background: "var(--green-bg)" }}>
            <div>
              <p className="f-mono text-xs" style={{ color: "var(--green)" }}>LIVE STATUS</p>
              <p className="font-semibold text-lg">On Time</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--steel)" }}>Next Stop</p>
              <p className="font-semibold text-lg">Kota Jn (KOTA)</p>
            </div>
          </div>
          
          <div className="space-y-0 px-2">
            {[
              { station: "New Delhi (NDLS)", time: "16:35", status: "Departed", done: true },
              { station: "Mathura Jn (MTJ)", time: "18:02", status: "Departed", done: true },
              { station: "Kota Jn (KOTA)", time: "20:45", status: "Expected", active: true },
              { station: "Ratlam Jn (RTM)", time: "00:15", status: "Upcoming", done: false },
              { station: "Vadodara Jn (BRC)", time: "03:55", status: "Upcoming", done: false },
              { station: "Mumbai Central (BCT)", time: "08:35", status: "Destination", done: false },
            ].map((s, i, arr) => (
              <div key={s.station} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full flex-shrink-0 relative" style={{ background: s.active ? "var(--blue)" : s.done ? "var(--green)" : "var(--line)" }}>
                    {s.active && <div className="h-4 w-4 rounded-full bg-blue-400 animate-ping absolute top-0 left-0"></div>}
                  </div>
                  {i < arr.length - 1 && <div className="w-[2px] flex-1 my-1" style={{ background: s.done ? "var(--green)" : "var(--line)", minHeight: 40 }} />}
                </div>
                <div className="pb-6 w-full flex justify-between items-start">
                  <div>
                    <p className={`text-[15px] font-semibold ${s.active ? "text-blue-600" : s.done ? "" : "text-gray-400"}`}>{s.station}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>{s.status}</p>
                  </div>
                  <p className="f-mono text-sm font-semibold">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'cancel_ticket'} onClose={() => setActiveModal(null)} title="Cancel Ticket">
        <div className="flex flex-col py-2">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <X size={28} className="text-red-500" />
          </div>
          <h3 className="text-center font-semibold text-lg mb-1">Confirm Cancellation</h3>
          <p className="text-center text-sm mb-6" style={{ color: "var(--steel)" }}>Are you sure you want to cancel your ticket for Mumbai Rajdhani?</p>
          
          <div className="rounded-xl border p-4 mb-6 bg-gray-50" style={{ borderColor: "var(--line)" }}>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "var(--steel)" }}>Ticket Fare</span>
              <span className="font-semibold">₹2,840</span>
            </div>
            <div className="flex justify-between text-sm mb-2 text-red-600">
              <span>Cancellation Fee</span>
              <span className="font-semibold">-₹240</span>
            </div>
            <div className="w-full h-px bg-gray-200 my-3"></div>
            <div className="flex justify-between text-[15px] font-bold">
              <span>Estimated Refund</span>
              <span className="text-green-600">₹2,600</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-auto">
            <button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-semibold border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>Keep Ticket</button>
            <button onClick={handleCancelTicket} className="flex-1 h-12 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors" style={{ background: "var(--red)" }}>Confirm Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'ticket_details'} onClose={() => setActiveModal(null)} title="E-Ticket Details">
        <div className="flex flex-col py-2">
          <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "var(--line)" }}>
            <div className="p-5 text-white transition-colors duration-500" style={{ background: isCancelled ? "var(--red)" : "var(--blue)" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg leading-none">Mumbai Rajdhani</p>
                  <p className="text-white/80 text-xs mt-1">Train #12951</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg leading-none">{isCancelled ? "CANCELLED" : "CONFIRMED"}</p>
                  <p className="text-white/80 text-xs mt-1">PNR 8462097315</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">NDLS</p>
                  <p className="text-xs text-white/80">New Delhi</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] text-white/80">16:00 hr</span>
                  <div className="w-16 h-px bg-white/30 my-1 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Train size={12} className="text-white/80" /></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">BCT</p>
                  <p className="text-xs text-white/80">Mumbai Ctrl</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 bg-white">
              <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "var(--steel)" }}>Passenger Details</p>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--line)" }}>
                <div>
                  <p className="font-semibold text-sm">Ananya Rao</p>
                  <p className="text-xs" style={{ color: "var(--steel)" }}>28 Yrs, Female</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">B4, 22</p>
                  <p className="text-xs" style={{ color: "var(--steel)" }}>Side Lower</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center mt-6 mb-2">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <ScanLine size={32} style={{ color: "var(--steel)" }} />
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: "var(--steel)" }}>Show this QR code to the TT</p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full h-12 rounded-xl border font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

/* ---------------- EXPLORE ---------------- */

function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  
  const trending = [
    { name: "Kashmir Vaishno Devi", days: "5N/6D", price: "₹21,300", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800" },
    { name: "Dev Darshan Yatra", days: "6N/7D", price: "₹18,900", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800" },
    { name: "Kerala Backwaters", days: "4N/5D", price: "₹16,500", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
  ];

  const packages = [
    { name: "Bharat Gaurav Tourist Train", days: "8N/9D", desc: "AC III-Tier themed circuit train promoting domestic heritage tourism.", price: "₹24,500", image: "https://images.unsplash.com/photo-1533580556209-775b8dbbb9d1?auto=format&fit=crop&q=80&w=800" },
    { name: "Maharajas' Express", days: "7N/8D", desc: "Luxury heritage train — 'World's Leading Luxury Train' 6 years running.", price: "On request", image: "https://images.unsplash.com/photo-1515159495742-0b29c919d363?auto=format&fit=crop&q=80&w=800" },
    { name: "Goa Beach Holidays", days: "3N/4D", desc: "Relaxing beach vacation covering North and South Goa highlights.", price: "₹12,000", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20">
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Explore</p>
          <h1 className="f-display text-3xl md:text-4xl font-semibold text-white mt-2 max-w-xl">Beyond booking a seat.</h1>
          <p className="text-sm mt-2 max-w-lg mb-8" style={{ color: "#C7D2DD" }}>Planning tools and IRCTC Tourism packages, curated for your next journey.</p>
          
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} style={{ color: "var(--steel)" }} />
            </div>
            <input 
              type="text" 
              placeholder="Search packages, destinations or trains..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 rounded-xl border-none outline-none f-body shadow-lg"
              style={{ color: "var(--ink)", background: "white" }}
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <ToolCard onClick={() => setActiveModal({ title: "Trains between stations" })} icon={Train} title="Trains between stations" body="See every train on a route before you commit to a date." />
        <ToolCard onClick={() => setActiveModal({ title: "Fare enquiry" })} icon={Wallet} title="Fare enquiry" body="Compare fares by class without starting a booking." />
        <ToolCard onClick={() => setActiveModal({ title: "Retiring rooms" })} icon={Hotel} title="Retiring rooms" body="Book a room or dorm at the station for a layover." />
      </div>

      <div className="mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: "var(--marigold-2)" }} />
            <h2 className="f-display font-semibold text-xl">Trending Destinations</h2>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto flex overflow-x-auto px-4 md:px-6 gap-4 pb-4 snap-x hide-scrollbar">
          {trending.map(p => (
            <div onClick={() => setActiveModal(p)} key={p.name} className="snap-start relative w-[280px] md:w-[320px] h-[360px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 group cursor-pointer">
              <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block mb-2 text-[10px] f-mono px-2 py-1 rounded-full text-white bg-black/40 backdrop-blur-md border border-white/20">
                  {p.days}
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight mb-1">{p.name}</h3>
                <p className="text-white/80 text-sm font-semibold">{p.price}</p>
              </div>
            </div>
          ))}
          <div className="w-4 md:w-6 flex-shrink-0"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="f-display font-semibold text-xl mb-1">All Packages</h2>
        <p className="text-sm mb-5" style={{ color: "var(--steel)" }}>Domestic and international tours, pilgrimage circuits, and heritage trains.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packages.map((p) => (
            <div onClick={() => setActiveModal(p)} key={p.name} className="rounded-xl border bg-white overflow-hidden flex flex-col sm:flex-row group cursor-pointer transition-shadow hover:shadow-lg" style={{ borderColor: "var(--line)" }}>
              <div className="h-48 sm:h-auto sm:w-40 relative overflow-hidden flex-shrink-0">
                <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4 sm:p-5 flex flex-col justify-center flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="f-body font-semibold text-[15px]">{p.name}</h3>
                  <span className="text-[10px] f-mono px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "var(--paper-2)", color: "var(--steel)" }}>{p.days}</span>
                </div>
                <p className="text-xs mt-1 mb-4 leading-relaxed" style={{ color: "var(--steel)" }}>{p.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="f-mono text-sm font-semibold" style={{ color: "var(--ink)" }}>{p.price}</span>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color: "var(--blue)" }}>View details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal?.title || activeModal?.name}>
        <div className="flex flex-col items-center py-10 text-center">
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Compass size={32} style={{ color: "var(--blue)" }} />
          </div>
          <h4 className="font-semibold text-lg">{activeModal?.name || activeModal?.title}</h4>
          <p className="text-sm mt-2 max-w-[280px]" style={{ color: "var(--steel)" }}>This feature is a preview and will be fully available in a future update.</p>
          <button onClick={() => setActiveModal(null)} className="mt-6 h-11 px-8 rounded-xl font-semibold text-[15px] flex items-center justify-center text-white transition-transform active:scale-[0.98]" style={{ background: "var(--blue)" }}>
            Got it
          </button>
        </div>
      </Modal>

    </div>
  );
}

function ToolCard({ icon: Icon, title, body, onClick }) {
  return (
    <div onClick={onClick} className="rounded-xl border bg-white p-5 group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ borderColor: "var(--line)" }}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-blue-50" style={{ background: "var(--paper-2)" }}>
        <Icon size={20} className="transition-colors duration-300" style={{ color: "var(--blue)" }} />
      </div>
      <p className="font-semibold text-[15px]">{title}</p>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--steel)" }}>{body}</p>
    </div>
  );
}

/* ---------------- HELP & SUPPORT ---------------- */

function HelpScreen() {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    { q: "My money was debited but I didn't get a ticket. What now?", a: "You'll see a 'Verifying' status immediately with a confirmation SLA. If the booking can't be confirmed within that window, the amount is auto-refunded to your original payment method — no TDR filing needed for this case." },
    { q: "How do I file a TDR for a waitlisted passenger?", a: "Go to My Trips → Refunds & TDR, select the PNR, choose the affected passenger(s), and submit before the train's scheduled departure. Refunds are decided by the concerned Zonal Railway, usually within 60 days." },
    { q: "Why is my Tatkal ticket non-refundable?", a: "Confirmed Tatkal tickets carry zero refund on cancellation by rule. Waitlisted Tatkal tickets can still be cancelled up to 30 minutes before departure for a nominal clerkage fee." },
    { q: "What's the difference between chart-prepared and not-prepared?", a: "Charts are usually finalised 4 hours before departure. Before that, RAC/waitlist positions can still move. After charting, your final coach and berth are locked and shown on the PNR status." },
  ];
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="Help & Support" title="Surfaced, not buried." sub="Refund status, complaint tracking and FAQs — moved from three clicks deep to a top-level page." />

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--green-bg)" }}><PhoneCall size={17} style={{ color: "var(--green)" }} /></div>
          <div><p className="text-sm font-semibold">139</p><p className="text-xs" style={{ color: "var(--steel)" }}>24×7 helpline</p></div>
        </a>
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--amber-bg)" }}><Mail size={17} style={{ color: "var(--amber)" }} /></div>
          <div><p className="text-sm font-semibold">care@irctc.co.in</p><p className="text-xs" style={{ color: "var(--steel)" }}>Email support</p></div>
        </a>
        <a className="rounded-xl bg-white border p-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "#EAE3F5" }}><MessageSquareText size={17} style={{ color: "#6D4FA8" }} /></div>
          <div><p className="text-sm font-semibold">Track a complaint</p><p className="text-xs" style={{ color: "var(--steel)" }}>By reference number</p></div>
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--steel)" }} />
          <input placeholder="Search help articles — refunds, PNR, Tatkal, KYC…"
            className="w-full h-12 rounded-xl border pl-10 pr-4 text-sm outline-none bg-white" style={{ borderColor: "var(--line)" }} />
        </div>
        <p className="f-display font-semibold mb-3">Frequently asked</p>
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
          {faqs.map((f, i) => (
            <div key={f.q} style={{ borderBottom: i < faqs.length - 1 ? `1px solid var(--line)` : "none" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="text-sm font-medium">{f.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0" style={{ color: "var(--steel)" }} /> : <ChevronDown size={16} className="flex-shrink-0" style={{ color: "var(--steel)" }} />}
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--steel)" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ---------------- ACCOUNT ---------------- */

function SimpleInput({ label, icon: Icon, value }) {
  return (
    <div>
      <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>{label}</label>
      <div className="mt-1.5 h-11 rounded-xl border flex items-center gap-2 px-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
        <Icon size={16} style={{ color: "var(--steel)" }} />
        <input defaultValue={value} className="f-body flex-1 outline-none text-[15px] bg-transparent" style={{ color: "var(--ink)" }} />
      </div>
    </div>
  );
}

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="bg-white w-full md:w-[480px] max-h-[90vh] md:max-h-[80vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col anim-fade-up overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="h-14 px-5 border-b flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
          <h3 className="font-semibold text-lg" style={{ color: "var(--ink)" }}>{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} style={{ color: "var(--steel)" }} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ isOpen, onClose }) {
  return (
    <Modal title="Edit Profile" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <SimpleInput label="First Name" icon={User} value="Ananya" />
        <SimpleInput label="Last Name" icon={User} value="Rao" />
        <SimpleInput label="Mobile Number" icon={Phone} value="+91 98765 43210" />
        <SimpleInput label="Email Address" icon={Mail} value="ananya.rao@example.com" />
        <button className="mt-2 w-full h-12 rounded-xl f-body font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[0.99]" style={{ background: "var(--marigold)", color: "var(--blue)" }} onClick={onClose}>Save Changes</button>
      </div>
    </Modal>
  );
}

function PassengersModal({ isOpen, onClose }) {
  const passengers = [
    { name: "Ananya Rao", age: 28, gender: "Female", pref: "Lower" },
    { name: "Rohan Rao", age: 30, gender: "Male", pref: "Upper" },
    { name: "Sita Devi", age: 58, gender: "Female", pref: "Lower" },
    { name: "Arjun Rao", age: 8, gender: "Male", pref: "No Preference" },
  ];
  return (
    <Modal title="Saved Passengers" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {passengers.map((p, i) => (
          <div key={i} className="p-3 border rounded-xl flex items-center justify-between bg-gray-50" style={{ borderColor: "var(--line)" }}>
            <div>
              <p className="font-semibold text-[15px]">{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>{p.age} yrs, {p.gender} • {p.pref} Berth</p>
            </div>
            <button className="text-sm font-medium transition-colors hover:text-blue-700" style={{ color: "var(--blue)" }}>Edit</button>
          </div>
        ))}
        <button className="mt-2 w-full h-12 rounded-xl border-2 border-dashed font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors hover:bg-blue-50" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>
          <User size={16} /> Add New Passenger
        </button>
      </div>
    </Modal>
  );
}

function PaymentsModal({ isOpen, onClose }) {
  return (
    <Modal title="Payment Methods" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="p-4 border rounded-xl flex items-center gap-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-100"><CreditCard size={18} className="text-green-700" /></div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">HDFC Bank Credit Card</p>
            <p className="text-xs" style={{ color: "var(--steel)" }}>•••• 4242</p>
          </div>
        </div>
        <div className="p-4 border rounded-xl flex items-center gap-3 bg-gray-50" style={{ borderColor: "var(--line)" }}>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-100"><Landmark size={18} className="text-blue-700" /></div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">Google Pay</p>
            <p className="text-xs" style={{ color: "var(--steel)" }}>ananya@okaxis</p>
          </div>
        </div>
        <button className="mt-2 w-full h-12 rounded-xl border-2 border-dashed font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors hover:bg-blue-50" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>
          <CreditCard size={16} /> Add Payment Method
        </button>
      </div>
    </Modal>
  );
}

function KycModal({ isOpen, onClose }) {
  return (
    <Modal title="KYC / Aadhaar" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center py-6 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <BadgeCheck size={32} className="text-green-600" />
        </div>
        <h4 className="font-semibold text-lg">Verified Successfully</h4>
        <p className="text-sm mt-1 max-w-[250px]" style={{ color: "var(--steel)" }}>Your Aadhaar ending in <strong>8392</strong> is linked to your IRCTC account.</p>
        <button className="mt-6 w-full h-12 rounded-xl border font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
          Update Aadhaar
        </button>
      </div>
    </Modal>
  );
}

function LanguageModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("English");
  return (
    <Modal title="Select Language" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2">
        {["English", "हिंदी (Hindi)", "తెలుగు (Telugu)", "தமிழ் (Tamil)", "বাংলা (Bengali)", "मराठी (Marathi)"].map(l => (
          <button key={l} onClick={() => { setLang(l); setTimeout(onClose, 200); }} className="p-3 border rounded-xl text-left font-medium text-[15px] transition-colors hover:bg-gray-50 flex items-center justify-between" style={{ borderColor: lang === l ? "var(--blue)" : "var(--line)", background: lang === l ? "var(--blue-3)" : "transparent" }}>
            <span>{l}</span>
            {lang === l && <Check size={16} style={{ color: "var(--blue)" }} />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

function NotificationsModal({ isOpen, onClose }) {
  const [toggles, setToggles] = useState({ sms: true, wa: true, push: false });
  const items = [
    { id: "sms", icon: MessageSquareText, title: "SMS Updates", desc: "PNR status and journey alerts via SMS." },
    { id: "wa", icon: PhoneCall, title: "WhatsApp Updates", desc: "Get tickets directly on WhatsApp." },
    { id: "push", icon: Bell, title: "Push Notifications", desc: "App alerts for Tatkal and availability." }
  ];
  return (
    <Modal title="Notifications" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {items.map(n => (
          <div key={n.id} onClick={() => setToggles(p => ({ ...p, [n.id]: !p[n.id] }))} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"><n.icon size={18} style={{ color: "var(--blue)" }} /></div>
              <div>
                <p className="font-semibold text-[14px]">{n.title}</p>
                <p className="text-[11px]" style={{ color: "var(--steel)" }}>{n.desc}</p>
              </div>
            </div>
            <div className="w-11 h-6 rounded-full relative transition-colors duration-300" style={{ background: toggles[n.id] ? "var(--green)" : "var(--steel)" }}>
              <div className="absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-300" style={{ left: toggles[n.id] ? "calc(100% - 20px)" : "4px" }}></div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function AccountScreen({ onLogout }) {
  const [activeModal, setActiveModal] = useState(null);

  const rows = [
    { id: "profile", icon: User, label: "Profile", detail: "Name, mobile, email" },
    { id: "passengers", icon: Users, label: "Saved passengers", detail: "4 saved" },
    { id: "payments", icon: CreditCard, label: "Payment methods", detail: "2 UPI IDs, 1 card" },
    { id: "kyc", icon: BadgeCheck, label: "KYC / Aadhaar", detail: "Verified" },
    { id: "language", icon: Languages, label: "Language", detail: "English" },
    { id: "notifications", icon: Bell, label: "Notifications", detail: "SMS + push enabled" },
  ];
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body">
      <PageHero eyebrow="Account" title="Ananya Rao" sub="Member since 2019 · IRCTC ID: ananya.rao" small />
      <div className="max-w-2xl mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-16">
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
          {rows.map((r, i) => (
            <button key={r.id} onClick={() => setActiveModal(r.id)} className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100" style={{ borderBottom: i < rows.length - 1 ? `1px solid var(--line)` : "none" }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
                <r.icon size={16} style={{ color: "var(--blue)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs" style={{ color: "var(--steel)" }}>{r.detail}</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--steel)" }} />
            </button>
          ))}
        </div>
        <button onClick={() => { if(confirm("Are you sure you want to log out?")) onLogout(); }} className="mt-4 w-full h-12 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors" style={{ borderColor: "var(--red)", color: "var(--red)" }}>
          <LogOut size={15} /> Log out
        </button>
      </div>

      <ProfileModal isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)} />
      <PassengersModal isOpen={activeModal === "passengers"} onClose={() => setActiveModal(null)} />
      <PaymentsModal isOpen={activeModal === "payments"} onClose={() => setActiveModal(null)} />
      <KycModal isOpen={activeModal === "kyc"} onClose={() => setActiveModal(null)} />
      <LanguageModal isOpen={activeModal === "language"} onClose={() => setActiveModal(null)} />
      <NotificationsModal isOpen={activeModal === "notifications"} onClose={() => setActiveModal(null)} />

      <Footer />
    </div>
  );
}

/* ---------------- shared page hero ---------------- */

function PageHero({ eyebrow, title, sub, small }) {
  return (
    <section className="paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
        <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>{eyebrow}</p>
        <h1 className={`f-display ${small ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"} font-semibold text-white mt-2 max-w-xl`}>{title}</h1>
        {sub && <p className="text-sm mt-2 max-w-lg" style={{ color: "#C7D2DD" }}>{sub}</p>}
      </div>
    </section>
  );
}

/* ---------------- APP SHELL ---------------- */

export default function App() {
  const [screen, setScreen] = useState("search");
  const [selection, setSelection] = useState(null);
  const [booking, setBooking] = useState(null);

  return (
    <div className="f-body" style={{ minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>
      <TopNav screen={screen} setScreen={setScreen} />

      {screen === "search" && <SearchScreen onSearch={() => setScreen("results")} />}
      {screen === "results" && (
        <ResultsScreen
          onBack={() => setScreen("search")}
          onBook={(sel) => { setSelection(sel); setScreen("booking"); }}
        />
      )}
      {screen === "booking" && selection && (
        <BookingScreen
          selection={selection}
          onBack={() => setScreen("results")}
          onDone={() => setScreen("trips")}
          onConfirmed={(b) => { setBooking(b); setScreen("confirmation"); window.scrollTo({ top: 0 }); }}
        />
      )}
      {screen === "confirmation" && booking && (
        <ConfirmationScreen booking={booking} onTrips={() => setScreen("trips")} onHome={() => setScreen("search")} />
      )}
      {screen === "trips" && <TripsScreen />}
      {screen === "explore" && <ExploreScreen />}
      {screen === "help" && <HelpScreen />}
      {screen === "account" && <AccountScreen onLogout={() => setScreen("search")} />}
    </div>
  );
}