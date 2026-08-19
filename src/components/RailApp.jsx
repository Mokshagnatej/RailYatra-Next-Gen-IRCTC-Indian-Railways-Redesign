import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeftRight, Search, SlidersHorizontal, ChevronDown, ChevronRight,
  Check, Clock, Users, CreditCard, ShieldCheck, AlertTriangle, Loader2,
  Download, Share2, Home, Ticket, Compass, LifeBuoy, User, X, Train,
  MapPin, CalendarDays, Phone, Mail, HelpCircle, FileText, ChevronUp,
  BadgeCheck, Wallet, Languages, Bell, LogOut, Hotel, Sparkles, PhoneCall,
  MessageSquareText, PackageSearch, Landmark, ScanLine, Activity, LocateFixed
} from "lucide-react";
import ConfirmationScreen, { buildBooking } from "./ConfirmationScreen.jsx";
import {
  QuickTools, StatsBand, PopularRoutes, Services, HowItWorks, TrustStrip, FAQ,
} from "./HomeSections.jsx";
import stationsData from "../stationsData.json";
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

/* ---------------- sample data (enriched with running days, pantry, distance) ---------------- */

const TRAINS = [
  { no: "12951", name: "Mumbai Rajdhani", type: "Rajdhani", dep: "16:35", arr: "08:35", dur: "16h 00m", from: "NDLS", to: "BCT",
    days: "MTWTFSS", pantry: true, distance: 1384, stops: 5,
    classes: { "1A": { status: "AVAILABLE", n: 12, fare: 4855 }, "2A": { status: "AVAILABLE", n: 34, fare: 2830 }, "3A": { status: "RAC", n: 6, fare: 1985 } } },
  { no: "12953", name: "August Kranti Rajdhani", type: "Rajdhani", dep: "17:40", arr: "10:55", dur: "17h 15m", from: "NDLS", to: "BCT",
    days: "MTWTFSS", pantry: true, distance: 1384, stops: 6,
    classes: { "1A": { status: "AVAILABLE", n: 4, fare: 4855 }, "2A": { status: "RAC", n: 2, fare: 2830 }, "3A": { status: "AVAILABLE", n: 18, fare: 1985 } } },
  { no: "12259", name: "Sealdah Duronto", type: "Duronto", dep: "08:05", arr: "23:55", dur: "15h 50m", from: "NDLS", to: "SDAH",
    days: "M_W_F__", pantry: true, distance: 1453, stops: 0,
    classes: { "2A": { status: "AVAILABLE", n: 8, fare: 2650 }, "3A": { status: "WAITLIST", n: 0, fare: 1840, wl: 14 }, "SL": { status: "AVAILABLE", n: 61, fare: 685 } } },
  { no: "12002", name: "Bhopal Shatabdi", type: "Shatabdi", dep: "06:00", arr: "12:10", dur: "6h 10m", from: "NDLS", to: "BPL",
    days: "MTWTFSS", pantry: true, distance: 704, stops: 4,
    classes: { "CC": { status: "AVAILABLE", n: 122, fare: 985 }, "EC": { status: "RAC", n: 3, fare: 1890 } } },
  { no: "22210", name: "MMCT Duronto", type: "Duronto", dep: "23:00", arr: "16:10", dur: "17h 10m", from: "NDLS", to: "BCT",
    days: "_T_T___", pantry: true, distance: 1384, stops: 0,
    classes: { "1A": { status: "AVAILABLE", n: 10, fare: 4590 }, "2A": { status: "AVAILABLE", n: 28, fare: 2540 }, "3A": { status: "AVAILABLE", n: 45, fare: 1780 } } },
  { no: "14650", name: "Bikaner Express", type: "Express", dep: "20:15", arr: "10:40", dur: "14h 25m", from: "NDLS", to: "BME",
    days: "MTWTFSS", pantry: false, distance: 467, stops: 12,
    classes: { "SL": { status: "AVAILABLE", n: 44, fare: 495 }, "3A": { status: "AVAILABLE", n: 19, fare: 1320 }, "2A": { status: "WAITLIST", n: 0, fare: 1955, wl: 3 } } },
  { no: "12622", name: "Tamil Nadu Express", type: "Superfast", dep: "22:30", arr: "05:50", dur: "31h 20m", from: "NDLS", to: "MAS",
    days: "MTWTFSS", pantry: true, distance: 2182, stops: 8,
    classes: { "SL": { status: "AVAILABLE", n: 92, fare: 720 }, "3A": { status: "AVAILABLE", n: 56, fare: 1895 }, "2A": { status: "AVAILABLE", n: 24, fare: 2760 }, "1A": { status: "RAC", n: 1, fare: 4680 } } },
  { no: "18238", name: "Chhattisgarh Exp", type: "Mail/Exp", dep: "11:20", arr: "05:05", dur: "17h 45m", from: "NDLS", to: "BSP",
    days: "M__T__S", pantry: false, distance: 1185, stops: 18,
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

/* Interactive Live Rail Telemetry & Quick Corridor Board (Replaces static HeroIllustration) */
function LiveRailRadarCard({ onQuickAction }) {
  const [activeTrain, setActiveTrain] = useState(0);

  const trains = [
    {
      num: "22436",
      name: "Vande Bharat Express",
      from: "NDLS (New Delhi)",
      to: "BSB (Varanasi Jn)",
      dep: "06:00 AM",
      arr: "02:00 PM",
      currentSpeed: "160 km/h",
      status: "Cruising On-Time",
      progress: 68,
      nextStation: "Prayagraj Jn (PRYJ)",
      eta: "14 mins",
      platform: "PF 1",
      seats: "48 seats (3A) · 98% CNF",
      type: "Vande Bharat"
    },
    {
      num: "12951",
      name: "Mumbai Rajdhani Exp",
      from: "NDLS (New Delhi)",
      to: "BCT (Mumbai Central)",
      dep: "04:55 PM",
      arr: "08:35 AM",
      currentSpeed: "130 km/h",
      status: "On Time (+0 min)",
      progress: 42,
      nextStation: "Kota Jn (KOTA)",
      eta: "28 mins",
      platform: "PF 1A",
      seats: "112 seats (3A) · 95% CNF",
      type: "Rajdhani"
    },
    {
      num: "12004",
      name: "Lucknow Shatabdi",
      from: "NDLS (New Delhi)",
      to: "LKO (Lucknow NR)",
      dep: "06:10 AM",
      arr: "12:40 PM",
      currentSpeed: "135 km/h",
      status: "Departed CNB",
      progress: 84,
      nextStation: "Kanpur Central (CNB)",
      eta: "8 mins",
      platform: "PF 3",
      seats: "76 seats (CC) · 99% CNF",
      type: "Shatabdi"
    }
  ];

  const curr = trains[activeTrain];

  return (
    <div className="w-full rounded-2xl border border-white/15 p-4 md:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl text-white" style={{
      background: "linear-gradient(135deg, rgba(14, 28, 48, 0.85) 0%, rgba(8, 16, 30, 0.95) 100%)",
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
    }}>
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="f-mono text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Live Rail Radar</span>
        </div>
        <span className="f-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          GPS SYNCED
        </span>
      </div>

      {/* Train Selector Pills */}
      <div className="grid grid-cols-3 gap-1.5 mt-3 mb-3 p-1 rounded-xl bg-slate-900/60 border border-white/5">
        {trains.map((t, idx) => (
          <button
            key={t.num}
            onClick={() => setActiveTrain(idx)}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 truncate text-center ${
              activeTrain === idx 
                ? "bg-amber-400 text-slate-950 shadow-md font-bold" 
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.num} {t.type.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Train Name and Route Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Train size={15} className="text-amber-400" />
            {curr.num} {curr.name}
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5">
            {curr.from} → {curr.to}
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {curr.currentSpeed}
        </span>
      </div>

      {/* Live Route Progress Bar */}
      <div className="mt-4 mb-3">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
          <span>{curr.dep}</span>
          <span className="text-amber-300 font-bold">{curr.status}</span>
          <span>{curr.arr}</span>
        </div>
        
        {/* Track Line with Moving Train Node */}
        <div className="w-full h-2 rounded-full bg-slate-800 relative overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500" 
            style={{ width: `${curr.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Next Station Telemetry Box */}
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <MapPin size={12} className="text-sky-400" /> Next Stoppage
          </span>
          <span className="font-semibold text-white">{curr.nextStation}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">ETA / Platform:</span>
          <span className="font-mono text-amber-300 font-bold">{curr.eta} · {curr.platform}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
          <span className="text-slate-400">Seat Availability:</span>
          <span className="font-mono text-emerald-300 font-medium">{curr.seats}</span>
        </div>
      </div>

      {/* Quick Interactive Tool Trigger */}
      <button 
        onClick={() => {
          if (onQuickAction) onQuickAction("Live Train Status");
        }}
        className="w-full mt-3 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Activity size={14} className="text-sky-400" /> Live GPS Tracking & Route Halts
      </button>
    </div>
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

/* Hyper-Realistic Full-Width Panoramic End-to-End Moving Train Track (Exclusive to Hero Page) */
function EndToEndTrainTrack() {
  const [mode, setMode] = useState("vande"); // "vande" | "rajdhani" | "tejas"
  const [isPaused, setIsPaused] = useState(false);

  const trainConfigs = {
    vande: {
      name: "22436 VANDE BHARAT EXPRESS",
      speed: "160 KM/H",
      route: "NDLS ➔ BSB SUPERFAST CORRIDOR",
      duration: "7s",
      primaryColor: "#0284C7",
      accentColor: "#F59E0B",
      bodyGradId: "vandeBody",
      liveryName: "Vande Bharat White & Blue",
      voltage: "25.2 kV AC",
      signal: "PROCEED 🟢"
    },
    rajdhani: {
      name: "12951 MUMBAI RAJDHANI EXPRESS",
      speed: "130 KM/H",
      route: "NDLS ➔ MMCT RAJDHANI TRUNK",
      duration: "9s",
      primaryColor: "#DC2626",
      accentColor: "#FACC15",
      bodyGradId: "rajdhaniBody",
      liveryName: "LHB Red & Silver",
      voltage: "25.0 kV AC",
      signal: "PROCEED 🟢"
    },
    tejas: {
      name: "82501 TEJAS SUPERFAST EXPRESS",
      speed: "180 KM/H",
      route: "LKO ➔ NDLS HIGH-SPEED LINK",
      duration: "5.5s",
      primaryColor: "#F59E0B",
      accentColor: "#0284C7",
      bodyGradId: "tejasBody",
      liveryName: "Tejas Saffron & Gold",
      voltage: "25.4 kV AC",
      signal: "PROCEED 🟢"
    }
  };

  const current = trainConfigs[mode];

  return (
    <div className="w-full select-none relative my-6" style={{
      background: "linear-gradient(180deg, #051322 0%, #030b14 60%, #02060c 100%)",
      borderTop: "1px solid rgba(56, 189, 248, 0.25)",
      borderBottom: "1px solid rgba(56, 189, 248, 0.15)",
      boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7), inset 0 2px 10px rgba(56, 189, 248, 0.1)"
    }}>
      {/* Top Telemetry & Control Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono font-bold text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            LIVE CORRIDOR SIMULATOR
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="font-mono text-slate-300 font-semibold hidden sm:inline">{current.name}</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 hidden md:inline">
            {current.route}
          </span>
        </div>

        {/* Train Switcher & Speed Pill Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 hidden lg:inline">Select Train:</span>
          <button
            onClick={() => setMode("vande")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${mode === "vande" ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            ⚡ Vande Bharat (160)
          </button>
          <button
            onClick={() => setMode("rajdhani")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${mode === "rajdhani" ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            🔴 Rajdhani (130)
          </button>
          <button
            onClick={() => setMode("tejas")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${mode === "tejas" ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            ⚡ Tejas (180)
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume Animation" : "Pause Animation"}
            className="px-2 py-1 rounded-lg text-[11px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>
        </div>
      </div>

      {/* Panoramic Scenic Canvas */}
      <div className="relative w-full h-32 overflow-hidden">
        {/* Background Distant Mountain Silhouette & Starfield */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
            {/* Mountain Ridges */}
            <path d="M 0 70 Q 150 40 300 65 T 600 50 T 900 60 T 1200 45 L 1200 120 L 0 120 Z" fill="#0B1C30" />
            <path d="M 0 85 Q 200 60 400 80 T 800 70 T 1200 75 L 1200 120 L 0 120 Z" fill="#081422" opacity="0.7" />
            {/* Distant Stars */}
            {[40, 120, 220, 340, 480, 620, 750, 890, 1020, 1140].map((cx, i) => (
              <circle key={i} cx={cx} cy={15 + (i % 4) * 8} r="1" fill="#FFFFFF" opacity={0.6 + (i % 3) * 0.2} />
            ))}
          </svg>
        </div>

        {/* Overhead Catenary Electric Traction System (25 kV OHE Mast & Dropper Wires) */}
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none z-10 opacity-70">
          {/* Top Messenger Wire */}
          <div className="w-full h-[1px] bg-slate-400 absolute top-2"></div>
          {/* Lower 25kV Contact Wire */}
          <div className="w-full h-[1px] bg-sky-300/80 absolute top-5 shadow-[0_0_4px_#38BDF8]"></div>
          
          {/* Portal Cantilever Masts & Live Railway Block Signal */}
          <div className="flex justify-between px-10 absolute inset-x-0 top-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center relative">
                {/* Steel Mast Post */}
                <div className="w-[2px] h-10 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-700"></div>
                {/* Cantilever Arm */}
                <div className="w-4 h-[1.5px] bg-slate-300 -mt-7"></div>
                {/* Insulator */}
                <div className="w-1.5 h-2 bg-amber-400/80 rounded-xs -mt-1"></div>
                
                {/* Block Signal on mast #4 and #10 */}
                {(i === 3 || i === 9) && (
                  <div className="absolute -left-3 top-3 w-3.5 h-6 bg-slate-900 rounded border border-slate-600 flex flex-col items-center justify-center gap-1 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399] animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Continuous High-Speed Moving Train (Left to Right, GPU-accelerated) */}
        <div className="absolute inset-x-0 bottom-7 h-16 pointer-events-none z-20">
          <div
            className="absolute flex items-end"
            style={{
              animationName: "train-end-to-end",
              animationDuration: current.duration,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPaused ? "paused" : "running",
              willChange: "transform",
              left: 0,
              bottom: "2px"
            }}
          >
            {/* SVG Defs for Shaders & Liveries */}
            <svg width="0" height="0" className="absolute">
              <defs>
                {/* Vande Bharat Gradient */}
                <linearGradient id="vandeBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>
                {/* Rajdhani Gradient */}
                <linearGradient id="rajdhaniBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="50%" stopColor="#B91C1C" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
                {/* Tejas Gradient */}
                <linearGradient id="tejasBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                {/* Window Interior Warm Light Gradient */}
                <linearGradient id="winInterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="60%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
                {/* Driver Cockpit Windshield Gradient */}
                <linearGradient id="cockpitGlass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0B1320" />
                  <stop offset="50%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
              </defs>
            </svg>

            {/* Coach 4: Tail Driving Car (Rear with glowing red marker LEDs) */}
            <svg width="150" height="48" viewBox="0 0 150 48" className="flex-shrink-0">
              <rect x="2" y="10" width="144" height="27" rx="3" fill={`url(#${current.bodyGradId})`} stroke="#475569" strokeWidth="0.8" />
              <rect x="2" y="24" width="144" height="6" fill={current.primaryColor} />
              <line x1="2" y1="31" x2="146" y2="31" stroke={current.accentColor} strokeWidth="1.5" />
              {/* Red Tail Markers */}
              <circle cx="6" cy="18" r="2.2" fill="#EF4444" filter="drop-shadow(0 0 5px #EF4444)" />
              <circle cx="6" cy="28" r="2.2" fill="#EF4444" filter="drop-shadow(0 0 5px #EF4444)" />
              {/* Illuminated Windows with Silhouettes */}
              {[20, 46, 72, 98, 124].map((x) => (
                <g key={x}>
                  <rect x={x} y="13" width="18" height="9" rx="2" fill="url(#winInterior)" stroke="#0F172A" strokeWidth="0.8" opacity="0.9" />
                  {/* Passenger silhouette */}
                  <circle cx={x + 9} cy="18" r="2.2" fill="#1E293B" opacity="0.7" />
                </g>
              ))}
              {/* Bogies */}
              <g transform="translate(20, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
              <g transform="translate(110, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
            </svg>

            {/* Vestibule Gangway */}
            <div className="w-2 h-6 bg-slate-950 rounded-xs mb-3 -mx-0.5 z-10 flex-shrink-0 border border-slate-700"></div>

            {/* Coach 3: AC Chair Car (Passenger Coach) */}
            <svg width="150" height="48" viewBox="0 0 150 48" className="flex-shrink-0">
              <rect x="2" y="10" width="144" height="27" rx="3" fill={`url(#${current.bodyGradId})`} stroke="#475569" strokeWidth="0.8" />
              <rect x="2" y="24" width="144" height="6" fill={current.primaryColor} />
              <line x1="2" y1="31" x2="146" y2="31" stroke={current.accentColor} strokeWidth="1.5" />
              {/* LED Destination Board */}
              <rect x="62" y="11" width="22" height="2" rx="0.5" fill="#F59E0B" opacity="0.95" />
              {[12, 38, 64, 90, 116].map((x) => (
                <g key={x}>
                  <rect x={x} y="13" width="18" height="9" rx="2" fill="url(#winInterior)" stroke="#0F172A" strokeWidth="0.8" opacity="0.9" />
                  <circle cx={x + 9} cy="18" r="2.2" fill="#1E293B" opacity="0.7" />
                </g>
              ))}
              <g transform="translate(20, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
              <g transform="translate(110, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
            </svg>

            {/* Vestibule Gangway */}
            <div className="w-2 h-6 bg-slate-950 rounded-xs mb-3 -mx-0.5 z-10 flex-shrink-0 border border-slate-700"></div>

            {/* Coach 2: Pantograph Coach with Electrical Arc Spark */}
            <svg width="150" height="48" viewBox="0 0 150 48" className="flex-shrink-0 overflow-visible">
              {/* High Speed Single-Arm Pantograph */}
              <g stroke="#94A3B8" strokeWidth="1.6" fill="none">
                <line x1="65" y1="10" x2="75" y2="-1" />
                <line x1="75" y1="-1" x2="90" y2="-1" />
                <line x1="90" y1="-1" x2="98" y2="10" />
                <line x1="70" y1="-1" x2="95" y2="-1" stroke="#38BDF8" strokeWidth="2.5" />
              </g>
              {/* Pantograph Spark Effect */}
              <circle cx="82" cy="-1" r="3" fill="#38BDF8" style={{ animation: "catenary-spark 1.5s infinite" }} />
              
              <rect x="2" y="10" width="144" height="27" rx="3" fill={`url(#${current.bodyGradId})`} stroke="#475569" strokeWidth="0.8" />
              <rect x="2" y="24" width="144" height="6" fill={current.primaryColor} />
              <line x1="2" y1="31" x2="146" y2="31" stroke={current.accentColor} strokeWidth="1.5" />
              {[12, 38, 64, 90, 116].map((x) => (
                <g key={x}>
                  <rect x={x} y="13" width="18" height="9" rx="2" fill="url(#winInterior)" stroke="#0F172A" strokeWidth="0.8" opacity="0.9" />
                  <circle cx={x + 9} cy="18" r="2.2" fill="#1E293B" opacity="0.7" />
                </g>
              ))}
              <g transform="translate(20, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
              <g transform="translate(110, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
            </svg>

            {/* Vestibule Gangway */}
            <div className="w-2 h-6 bg-slate-950 rounded-xs mb-3 -mx-0.5 z-10 flex-shrink-0 border border-slate-700"></div>

            {/* Coach 1: Lead Aerodynamic Bullet-Nose Locomotive & Driver Cab */}
            <svg width="185" height="48" viewBox="0 0 185 48" className="flex-shrink-0">
              {/* Bullet nose aerodynamic contours */}
              <path d="M 2 10 L 140 10 Q 170 10 180 24 L 184 35 Q 184 37 175 37 L 2 37 Z" fill={`url(#${current.bodyGradId})`} stroke="#475569" strokeWidth="0.8" />
              {/* Sweeping Speed Livery Stripe */}
              <path d="M 2 24 L 144 24 Q 165 24 176 30 L 178 34 Q 175 35 165 35 L 2 35 Z" fill={current.primaryColor} />
              <path d="M 2 31 L 156 31 Q 166 31 170 34 L 2 34 Z" fill={current.accentColor} />
              
              {/* Driver Cockpit Windshield (Aerodynamic wrap-around) */}
              <path d="M 148 12 L 160 12 Q 172 14 176 22 L 152 22 Z" fill="url(#cockpitGlass)" stroke="#38BDF8" strokeWidth="1" />
              
              {/* Lead Coach Windows */}
              {[12, 38, 64, 90, 116].map((x) => (
                <rect key={x} x={x} y="13" width="18" height="9" rx="2" fill="url(#winInterior)" stroke="#0F172A" strokeWidth="0.8" opacity="0.9" />
              ))}
              
              {/* Twin High-Intensity LED Headlights */}
              <circle cx="178" cy="29" r="3.5" fill="#FEF08A" filter="drop-shadow(0 0 8px #FEF08A)" />
              <circle cx="178" cy="29" r="1.8" fill="#FFFFFF" />

              {/* Heavy Bogies */}
              <g transform="translate(20, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
              <g transform="translate(115, 36)">
                <rect x="-4" y="0" width="24" height="4" rx="1.5" fill="#0F172A" />
                <circle cx="0" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
                <circle cx="16" cy="3.5" r="4.5" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
            </svg>

            {/* Volumetric Expanding Headlight Beam Cone */}
            <div className="w-80 h-16 -ml-3 pointer-events-none flex-shrink-0" style={{
              background: "linear-gradient(90deg, rgba(254, 240, 138, 0.9) 0%, rgba(254, 240, 138, 0.45) 35%, rgba(254, 240, 138, 0.1) 70%, transparent 100%)",
              clipPath: "polygon(0 42%, 100% 0%, 100% 100%, 0 75%)",
              animation: "headlight-glow 2s infinite"
            }}></div>
          </div>
        </div>

        {/* Heavy Ballast & Welded Steel Rail Track Infrastructure */}
        <div className="absolute inset-x-0 bottom-0 h-8 z-30">
          {/* Top Rail Head (Specular Polished Chrome Sheen) */}
          <div className="w-full h-[3px] bg-gradient-to-r from-slate-400 via-white to-slate-400 shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
          
          {/* Concrete Sleepers with Pandrol Fasteners */}
          <div className="w-full h-4 relative overflow-hidden bg-slate-900/90 border-t border-slate-700">
            <div className="flex justify-between w-full h-full px-2">
              {Array.from({ length: 45 }).map((_, i) => (
                <div key={i} className="w-2.5 h-full bg-slate-700 border-x border-slate-800/80 flex flex-col justify-between py-0.5 items-center">
                  <div className="w-1 h-0.5 bg-slate-400"></div>
                  <div className="w-1 h-0.5 bg-slate-400"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Rail & Granite Ballast Base */}
          <div className="w-full h-[2.5px] bg-slate-600"></div>
        </div>
      </div>

      {/* Bottom Live Corridor Status & Route Ticker */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span>OHE TRACTION: <strong className="text-sky-400">{current.voltage}</strong></span>
          <span className="hidden sm:inline">SIGNAL ASPECT: <strong className="text-emerald-400">{current.signal}</strong></span>
          <span className="hidden md:inline">SPEED LIMIT: <strong className="text-amber-300">{current.speed}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 hidden sm:inline">IRCTC HIGH SPEED NETWORK</span>
          <span className="text-emerald-400 font-bold">AUTOMATIC TRAIN PROTECTION (KAVACH) ACTIVE ●</span>
        </div>
      </div>
    </div>
  );
}

/* Global Quick Tool Modal (PNR, Trains, Fare, Live, Cancel, etc.) */
function QuickLinksModal({ modal, onClose, onNavigate }) {
  const [pnrInput, setPnrInput] = useState("4517228091");
  const [trainInput, setTrainInput] = useState("12951");
  const [activeTab, setActiveTab] = useState("result");
  const [loading, setLoading] = useState(false);

  if (!modal) return null;

  const handleSimulate = (cb) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (cb) cb();
    }, 600);
  };

  return (
    <Modal isOpen={!!modal} onClose={onClose} title={
      modal.type === "pnr" ? "PNR Status Enquiry" :
      modal.type === "trains_between_stations" ? "Trains Between Stations" :
      modal.type === "fare_enquiry" ? "Fare Enquiry Calculator" :
      modal.type === "live" ? "Live Train Running Status" :
      modal.type === "seat" ? "Seat Availability Check" :
      modal.type === "cancel_tdr" ? "Cancel Ticket & TDR Refund" :
      modal.type === "retiring_rooms" ? "Station Retiring Rooms" :
      modal.type === "e_catering" ? "e-Catering Onboard Meal Booking" :
      "IRCTC Railway Service"
    }>
      {/* PNR Status */}
      {modal.type === "pnr" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter 10-digit PNR"
              value={pnrInput} 
              onChange={e => setPnrInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-mono font-semibold outline-none"
            />
            <button 
              onClick={() => handleSimulate()}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check PNR"}
            </button>
          </div>

          <div className="p-4 rounded-xl border bg-green-50/60 border-green-200">
            <div className="flex justify-between items-center pb-2 border-b border-green-200 mb-2">
              <span className="font-mono text-xs font-bold text-green-900">PNR {pnrInput || "4517228091"}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">CONFIRMED (CNF)</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between"><span>Train:</span><span className="font-semibold">12951 Mumbai Rajdhani Express</span></div>
              <div className="flex justify-between"><span>Route:</span><span className="font-semibold">New Delhi (NDLS) → Mumbai Central (BCT)</span></div>
              <div className="flex justify-between"><span>Passenger 1:</span><span className="font-semibold text-blue-900">Coach B2 · Berth 41 (Lower Berth)</span></div>
              <div className="flex justify-between"><span>Chart Status:</span><span className="font-semibold text-green-700">Chart Prepared</span></div>
            </div>
          </div>
          <button onClick={onClose} className="w-full h-11 rounded-xl border font-semibold text-sm hover:bg-gray-50">Done</button>
        </div>
      )}

      {/* Live Train Status */}
      {modal.type === "live" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Train number or name"
              value={trainInput} 
              onChange={e => setTrainInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-semibold outline-none"
            />
            <button 
              onClick={() => handleSimulate()}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Track Live"}
            </button>
          </div>

          <div className="p-4 rounded-xl border bg-blue-50/70 border-blue-200">
            <div className="flex justify-between items-center pb-2 border-b border-blue-200 mb-2">
              <span className="font-bold text-xs text-blue-950">{trainInput || "12951"} Rajdhani Express</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">ON TIME · +0 MIN</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between"><span>Current Status:</span><span className="font-semibold text-green-700">Cruising at 130 km/h</span></div>
              <div className="flex justify-between"><span>Current Station:</span><span className="font-semibold">Departed Sawai Madhopur (20:42)</span></div>
              <div className="flex justify-between"><span>Next Stoppage:</span><span className="font-semibold text-blue-900">Kota Jn (22:15) · Platform 1</span></div>
              <div className="flex justify-between"><span>Destination Arrival:</span><span className="font-semibold">Tomorrow 08:35 AM (BCT)</span></div>
            </div>
          </div>
          <button onClick={onClose} className="w-full h-11 rounded-xl border font-semibold text-sm hover:bg-gray-50">Close</button>
        </div>
      )}

      {/* Cancel Ticket / TDR */}
      {modal.type === "cancel_tdr" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-600">Enter your PNR to calculate cancellation refund or file online TDR before train departure.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="10-digit PNR number"
              value={pnrInput} 
              onChange={e => setPnrInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-mono font-semibold outline-none"
            />
            <button 
              onClick={() => handleSimulate()}
              disabled={loading}
              className="h-12 px-4 rounded-xl text-white font-semibold text-sm bg-red-600 hover:bg-red-700"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check Refund"}
            </button>
          </div>

          <div className="p-4 rounded-xl border bg-gray-50">
            <div className="flex justify-between text-xs py-1 border-b">
              <span className="text-gray-500">Original Fare Paid:</span>
              <span className="font-bold">₹2,840</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b text-red-600">
              <span>Clerkage / IRCTC Cancellation Fee:</span>
              <span className="font-bold">-₹240</span>
            </div>
            <div className="flex justify-between text-sm py-2 font-bold text-green-700">
              <span>Instant Refund to Source Account:</span>
              <span>₹2,600</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { alert("TDR request submitted successfully! Reference #TDR-981742. Refund will credit in 3 business days."); onClose(); }} className="flex-1 h-11 rounded-xl font-semibold text-sm text-white bg-red-600 hover:bg-red-700">
              Submit Cancellation
            </button>
            <button onClick={onClose} className="px-4 h-11 rounded-xl border font-semibold text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Seat Availability & Fare Enquiry */}
      {(modal.type === "seat" || modal.type === "fare_enquiry" || modal.type === "trains_between_stations" || modal.type === "retiring_rooms" || modal.type === "e_catering") && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border bg-blue-50/50">
            <p className="font-bold text-sm text-blue-950 mb-2">Instant Railway Tool</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {modal.type === "seat" ? "Check live seat confirmation chances, RAC movement probability, and quota allocations across 13,000+ trains." :
               modal.type === "fare_enquiry" ? "Calculate transparent fare breakdowns across AC 1st, 2nd, 3rd Tier, Sleeper and Tatkal." :
               modal.type === "trains_between_stations" ? "Browse all timetable schedules, intermediate halts, and pantry availability across all routes." :
               modal.type === "e_catering" ? "Order hot meals from 500+ FSSAI-approved restaurant partners delivered straight to your seat." :
               "Book AC Deluxe and Standard rooms or dormitory pods at station junctions."}
            </p>
          </div>
          <button onClick={() => { onClose(); if (onNavigate) onNavigate("explore"); }} className="w-full h-12 rounded-xl text-white font-bold text-sm bg-blue-900 hover:bg-blue-800">
            Launch Interactive Tool
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ---------------- INTERACTIVE FOOTER ---------------- */

function Footer({ onAction }) {
  const cols = [
    { title: "Quick links", items: ["PNR Status", "Train Between Stations", "Fare Enquiry", "Live Train Status", "Seat Availability", "Cancel / TDR"] },
    { title: "Explore", items: ["IRCTC Tourism", "Bharat Gaurav Trains", "Maharajas' Express", "Retiring Rooms", "e-Catering", "Buddhist Circuit"] },
    { title: "Important", items: ["RTI Disclosure", "Annual Report", "Tenders & Notices", "Careers at IRCTC", "Vigilance Corner"] },
    { title: "Support", items: ["Helpline: 139", "care@irctc.co.in", "Grievance Tracker", "Complaint Status", "FAQs", "Accessibility"] },
  ];
  return (
    <footer className="f-body" style={{ background: "var(--blue-3)", color: "#B9C6D4" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 f-display font-semibold text-white text-base mb-2">
            <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: "var(--marigold)" }}>
              <Train size={15} color="var(--blue)" />
            </div>
            IRCTC
          </div>
          <p className="text-xs leading-relaxed mb-3">Indian Railway Catering &amp; Tourism Corporation Ltd. A Mini Ratna (Category-I) PSU under the Ministry of Railways, Govt. of India.</p>
          <div className="flex items-center gap-2 mb-3">
            {["Twitter", "Facebook", "Instagram", "YouTube"].map((s) => (
              <a key={s} className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold hover:bg-white/10 transition-colors cursor-pointer" style={{ background: "var(--blue-2)" }}>
                {s[0]}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] px-2 py-1.5 rounded-md cursor-pointer hover:bg-white/10 transition-colors" style={{ background: "var(--blue-2)" }}>📱 iOS App</span>
            <span className="text-[10px] px-2 py-1.5 rounded-md cursor-pointer hover:bg-white/10 transition-colors" style={{ background: "var(--blue-2)" }}>📱 Android</span>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">{c.title}</p>
            <ul className="space-y-2 text-xs">
              {c.items.map((i) => (
                <li 
                  key={i} 
                  onClick={() => onAction && onAction(i)} 
                  className="hover:text-white hover:underline cursor-pointer transition-colors"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-4 md:px-6 py-4 max-w-6xl mx-auto" style={{ borderColor: "#20405F" }}>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[11px]">
          <div>
            <span>© Indian Railway Catering &amp; Tourism Corporation Ltd — redesign concept, not the live site.</span>
            <span className="block sm:inline sm:ml-3 f-mono">CIN: L74899DL1999GOI101707</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span className="hover:text-white cursor-pointer">Disclaimer</span>
          </div>
        </div>
        <p className="text-[10px] mt-2 opacity-60">Ministry of Railways · Government of India · A UX redesign concept by the design community — not affiliated with or endorsed by Indian Railways or IRCTC.</p>
      </div>
    </footer>
  );
}

/* ---------------- SEARCH SCREEN ---------------- */

function SearchScreen({ onSearch, onFooterAction }) {
  const [from, setFrom] = useState("New Delhi (NDLS)");
  const [to, setTo] = useState("Mumbai Central (BCT)");
  const [date, setDate] = useState("Tue, 25 Aug");
  const [cls, setCls] = useState("All classes");
  const [quota, setQuota] = useState("General");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [flexDates, setFlexDates] = useState(false);

  const dateStrip = ["23 Aug", "24 Aug", "25 Aug", "26 Aug", "27 Aug", "28 Aug", "29 Aug", "30 Aug", "31 Aug", "01 Sep"];
  const availabilityHint = { "23 Aug": "green", "24 Aug": "amber", "25 Aug": "green", "26 Aug": "green", "27 Aug": "red", "28 Aug": "green", "29 Aug": "amber", "30 Aug": "green", "31 Aug": "green", "01 Sep": "amber" };
  const dayNames = { "23 Aug": "Sat", "24 Aug": "Sun", "25 Aug": "Mon", "26 Aug": "Tue", "27 Aug": "Wed", "28 Aug": "Thu", "29 Aug": "Fri", "30 Aug": "Sat", "31 Aug": "Sun", "01 Sep": "Mon" };

  const handleLocate = () => {
    return new Promise((resolve) => {
      // Helper to simulate setting nearest station
      const mockLocation = () => {
        setTimeout(() => {
          setFrom("KSR Bengaluru (SBC)"); // Mock nearest station
          resolve();
        }, 1200);
      };

      if (!navigator.geolocation) {
        mockLocation();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          mockLocation();
        },
        (error) => {
          console.warn("Geolocation blocked/failed (often happens in iframe previews), using fallback.", error);
          mockLocation();
        }
      );
    });
  };

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body relative">
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-14 md:pb-20 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
          <FadeIn>
            <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Book a Train</p>
            <h1 className="f-display text-3xl md:text-[2.6rem] leading-tight font-semibold text-white mt-2 max-w-xl">
              Find your train, see what's actually available, book without the guesswork.
            </h1>
            <p className="text-sm mt-3 max-w-md" style={{ color: "#C7D2DD" }}>
              Search 13,000+ trains across 7,000+ stations. Honest seat availability, transparent fares, and a payment flow that never leaves you guessing where your money went.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: "#9DB4CA" }}>
                <ShieldCheck size={14} style={{ color: "var(--green)" }} /> <span>Govt. of India Enterprise</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#9DB4CA" }}>
                <Clock size={14} style={{ color: "var(--marigold)" }} /> <span>1.2M+ bookings daily</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="w-full max-w-[420px] mx-auto mt-4 md:mt-0">
            <LiveRailRadarCard onQuickAction={onFooterAction} />
          </FadeIn>
        </div>
      </section>

      {/* Search Card Container with clean elevated placement */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 md:-mt-12 relative z-20">
        <FadeIn delay={0.1}>
        <div className="rounded-2xl bg-white border p-4 md:p-6 shadow-2xl" style={{ borderColor: "var(--line)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <Field label="From" icon={MapPin} value={from} onChange={setFrom} onLocate={handleLocate} />
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
            <div className="flex items-center justify-between">
              <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Journey date</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-medium" style={{ color: flexDates ? "var(--blue)" : "var(--steel)" }}>± 3 days flexible</span>
                <div onClick={() => setFlexDates(!flexDates)} className="w-9 h-5 rounded-full relative transition-colors duration-300 cursor-pointer" style={{ background: flexDates ? "var(--green)" : "var(--line)" }}>
                  <div className="absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-300" style={{ left: flexDates ? "calc(100% - 18px)" : "2px" }}></div>
                </div>
              </label>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {dateStrip.map((d) => {
                const on = d === date;
                const dot = availabilityHint[d];
                return (
                  <button key={d} onClick={() => setDate(d)}
                    className="min-w-[76px] h-16 rounded-xl border flex flex-col items-center justify-center gap-0.5 flex-shrink-0 f-body text-sm font-medium"
                    style={{
                      borderColor: on ? "var(--blue)" : "var(--line)",
                      background: on ? "var(--blue)" : "white",
                      color: on ? "white" : "var(--ink)",
                    }}>
                    <span className="text-[10px] font-normal" style={{ color: on ? "rgba(255,255,255,0.7)" : "var(--steel)" }}>{dayNames[d]}</span>
                    {d}
                    <span className="h-1.5 w-1.5 rounded-full" style={{
                      background: on ? "var(--marigold)" : { green: "var(--green)", amber: "var(--amber)", red: "var(--red)" }[dot],
                      animation: (!on && dot === "green") ? "pulse-dot 2s infinite" : "none",
                    }} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--steel)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full mr-1" style={{ background: "var(--green)" }} /> Available
              <span className="inline-block h-1.5 w-1.5 rounded-full ml-3 mr-1" style={{ background: "var(--amber)" }} /> Filling fast
              <span className="inline-block h-1.5 w-1.5 rounded-full ml-3 mr-1" style={{ background: "var(--red)" }} /> Waitlisted
              {" · General quota"}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select label="Class" value={cls} onChange={setCls} options={["All classes", "Sleeper (SL)", "AC 3-Tier (3A)", "AC 3-Tier Economy (3E)", "AC 2-Tier (2A)", "AC First (1A)", "Chair Car (CC)", "Executive Chair (EC)", "Second Sitting (2S)"]} />
            <Select label="Quota" value={quota} onChange={setQuota} options={["General", "Tatkal", "Premium Tatkal", "Ladies", "Senior Citizen", "Divyangjan", "Defence", "Foreign Tourist", "Yuva"]} />
            <div>
              <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Adults</label>
              <div className="mt-1.5 h-12 rounded-xl border flex items-center justify-between px-3" style={{ borderColor: "var(--line)" }}>
                <button onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="h-7 w-7 rounded-md border flex items-center justify-center text-lg" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>−</button>
                <span className="f-mono text-sm font-semibold">{passengers.adults}</span>
                <button onClick={() => setPassengers(p => ({ ...p, adults: Math.min(6, p.adults + 1) }))} className="h-7 w-7 rounded-md border flex items-center justify-center text-lg" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>+</button>
              </div>
            </div>
            <div>
              <label className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Children (5-11)</label>
              <div className="mt-1.5 h-12 rounded-xl border flex items-center justify-between px-3" style={{ borderColor: "var(--line)" }}>
                <button onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="h-7 w-7 rounded-md border flex items-center justify-center text-lg" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>−</button>
                <span className="f-mono text-sm font-semibold">{passengers.children}</span>
                <button onClick={() => setPassengers(p => ({ ...p, children: Math.min(4, p.children + 1) }))} className="h-7 w-7 rounded-md border flex items-center justify-center text-lg" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>+</button>
              </div>
            </div>
          </div>

          <button onClick={onSearch}
            className="mt-5 w-full h-12 rounded-xl f-body font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            style={{ background: "var(--marigold)", color: "var(--blue)" }}>
            <Search size={18} /> Search trains
          </button>

          <div className="mt-4 flex flex-wrap gap-2">
            {["NDLS → BCT, last searched", "NDLS → SDAH, Duronto", "NDLS → MAS, Tamil Nadu Exp", "HWH → NDLS, Rajdhani"].map((r) => (
              <button key={r} className="text-xs px-3 h-8 rounded-full border transition-transform hover:scale-105" style={{ borderColor: "var(--line)", color: "var(--blue)" }}>{r}</button>
            ))}
          </div>
        </div>
        </FadeIn>
      </div>

      {/* Full-width Panoramic End-to-End Moving Train Track - 100% Unobstructed & Visible */}
      <EndToEndTrainTrack />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <TrackLine />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FadeIn delay={0.05}><InfoCard icon={ShieldCheck} title="Never a dead end" body="Every payment outcome — success, pending, failed — gets a clear next step. No more silent debits or lost money." /></FadeIn>
          <FadeIn delay={0.15}><InfoCard icon={Clock} title="Sorted by time, by default" body="Results are ordered by departure time out of the box, with sort by duration and price plus filters one tap away." /></FadeIn>
          <FadeIn delay={0.25}><InfoCard icon={CalendarDays} title="Live PNR & refunds" body="Track your booking, PNR status, chart preparation, coach-berth allotment and refund timeline in one place — My Trips." /></FadeIn>
        </div>
      </div>
      <QuickTools />
      <StatsBand />
      <PopularRoutes onSearch={onSearch} />
      <Services />
      <HowItWorks />
      <TrustStrip />
      <FAQ />
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, onLocate }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLocateClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onLocate) return;
    setLocating(true);
    try {
      await onLocate();
    } finally {
      setLocating(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return (stationsData || []).slice(0, 35);
    const q = search.toLowerCase().trim();
    return (stationsData || []).filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      (s.zoneCode && s.zoneCode.toLowerCase().includes(q))
    ).slice(0, 35);
  }, [search]);

  const popularStations = [
    { label: "New Delhi (NDLS)", code: "NDLS" },
    { label: "Mumbai Central (BCT)", code: "BCT" },
    { label: "Howrah Jn (HWH)", code: "HWH" },
    { label: "KSR Bengaluru (SBC)", code: "SBC" },
    { label: "MGR Chennai Central (MAS)", code: "MAS" },
    { label: "Ahmedabad Jn (ADI)", code: "ADI" },
    { label: "Varanasi Jn (BSB)", code: "BSB" },
    { label: "Kanpur Central (CNB)", code: "CNB" }
  ];

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
        {onLocate && (
          <button 
            type="button"
            onClick={handleLocateClick}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            title="Use current location"
          >
            {locating ? (
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--blue)" }} />
            ) : (
              <LocateFixed size={16} style={{ color: "var(--blue)" }} />
            )}
          </button>
        )}
      </div>
      
      {open && (
        <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white border rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-gray-100" style={{ borderColor: "var(--line)" }}>
          {/* Quick Popular Station Junctions */}
          {!search && (
            <div className="p-3 bg-slate-50 border-b" style={{ borderColor: "var(--line)" }}>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1.5">
                <span>⚡ POPULAR RAIL HUBS</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularStations.map(p => (
                  <button
                    key={p.code}
                    onClick={() => {
                      onChange(p.label);
                      setOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 transition-colors shadow-2xs"
                    style={{ borderColor: "var(--line)" }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtered.length > 0 ? (
            filtered.map(station => (
              <div 
                key={station.code} 
                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                onClick={() => {
                  onChange(station.label);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${station.isJunction ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                    <Train size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-900">{station.name}</span>
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {station.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {station.state} · <span className="font-medium text-slate-600">{station.zone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {station.isJunction && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                      Junction
                    </span>
                  )}
                  {station.routes > 0 && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                      {station.routes} routes
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs">
              No matching station found for "{search}". Try searching by station code, name, or state.
            </div>
          )}
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
          {["Rajdhani", "Shatabdi", "Duronto", "Superfast", "Express", "Mail/Exp"].map((t) => (
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
      <div>
        <p className="f-body text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--steel)" }}>Departure time</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Early morning", sub: "00:00–06:00" },
            { label: "Morning", sub: "06:00–12:00" },
            { label: "Afternoon", sub: "12:00–18:00" },
            { label: "Night", sub: "18:00–00:00" },
          ].map((slot) => (
            <button key={slot.label} className="px-2 py-2 rounded-lg border text-left text-xs" style={{ borderColor: "var(--line)" }}>
              <span className="font-medium block">{slot.label}</span>
              <span style={{ color: "var(--steel)" }}>{slot.sub}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="f-body text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--steel)" }}>Amenities</p>
        <label className="flex items-center gap-2 f-body text-sm cursor-pointer">
          <input type="checkbox" className="h-4 w-4" />
          Pantry / food available
        </label>
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
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="f-mono text-xs" style={{ color: "var(--steel)" }}>#{t.no} · {t.type}</span>
                        {t.pantry && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">🍽 Pantry</span>}
                        {t.stops === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 font-medium" style={{ color: "var(--blue)" }}>Non-stop</span>}
                      </div>
                      {t.days && (
                        <div className="flex items-center gap-0.5 mt-1.5">
                          {["M","T","W","T","F","S","S"].map((d, di) => (
                            <span key={di} className="h-5 w-5 rounded text-[9px] font-semibold flex items-center justify-center"
                              style={{
                                background: t.days[di] !== "_" ? "var(--blue)" : "var(--paper-2)",
                                color: t.days[di] !== "_" ? "white" : "var(--steel)",
                              }}>{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 f-mono text-sm font-semibold text-right" style={{ color: "var(--ink)" }}>
                      <div>
                        <p>{t.dep}</p>
                        <p className="text-[10px] font-normal" style={{ color: "var(--steel)" }}>{t.from}</p>
                      </div>
                      <div className="flex flex-col items-center px-1">
                        <span className="text-[10px] f-body" style={{ color: "var(--steel)" }}>{t.dur}</span>
                        <div className="w-10 h-[1.5px] my-1" style={{ background: "var(--line)" }} />
                        <span className="text-[9px] f-mono" style={{ color: "var(--steel)" }}>{t.distance} km · {t.stops === 0 ? "Non-stop" : `${t.stops} stops`}</span>
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
          <div className="space-y-5">
            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold mb-4">Passenger details</p>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="rounded-lg border p-3" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--blue)" }}>Passenger {i + 1}</p>
                    <div className="grid grid-cols-[1fr_70px_70px_1fr] gap-2">
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Full name</label>
                        <input value={p.name} onChange={(e) => updatePassenger(i, "name", e.target.value)}
                          className="mt-1 h-10 w-full rounded-lg border px-2.5 text-sm outline-none" style={{ borderColor: "var(--line)" }} placeholder="As per govt. ID" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Age</label>
                        <input value={p.age} onChange={(e) => updatePassenger(i, "age", e.target.value)}
                          className="mt-1 h-10 w-full rounded-lg border px-2.5 text-sm outline-none" style={{ borderColor: "var(--line)" }} placeholder="Yrs" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Gender</label>
                        <select value={p.gender} onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                          className="mt-1 h-10 w-full rounded-lg border px-2 text-sm outline-none bg-white" style={{ borderColor: "var(--line)" }}>
                          <option value="M">M</option><option value="F">F</option><option value="O">O</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Berth preference</label>
                        <select value={p.berth || "NP"} onChange={(e) => updatePassenger(i, "berth", e.target.value)}
                          className="mt-1 h-10 w-full rounded-lg border px-2 text-sm outline-none bg-white" style={{ borderColor: "var(--line)" }}>
                          <option value="NP">No pref</option><option value="LB">Lower</option><option value="MB">Middle</option><option value="UB">Upper</option><option value="SL">Side Lower</option><option value="SU">Side Upper</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addPassenger} className="mt-3 text-sm font-medium" style={{ color: "var(--blue)" }}>+ Add another passenger (max 6)</button>
            </div>

            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold mb-3">Contact details</p>
              <p className="text-xs mb-3" style={{ color: "var(--steel)" }}>E-ticket and booking updates will be sent here.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Mobile number</label>
                  <div className="mt-1.5 h-11 rounded-lg border flex items-center gap-2 px-3" style={{ borderColor: "var(--line)" }}>
                    <Phone size={14} style={{ color: "var(--steel)" }} />
                    <input className="flex-1 outline-none text-sm bg-transparent" placeholder="+91 98765 43210" style={{ color: "var(--ink)" }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--steel)" }}>Email address</label>
                  <div className="mt-1.5 h-11 rounded-lg border flex items-center gap-2 px-3" style={{ borderColor: "var(--line)" }}>
                    <Mail size={14} style={{ color: "var(--steel)" }} />
                    <input className="flex-1 outline-none text-sm bg-transparent" placeholder="you@example.com" style={{ color: "var(--ink)" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold mb-3">Preferences & add-ons</p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
                  <input type="checkbox" className="h-4 w-4 mt-0.5" defaultChecked />
                  <div>
                    <p className="text-sm font-medium">Travel insurance — ₹0.45 per passenger</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>IRCTC iPay travel insurance covers accidental death (₹10 lakh) and hospitalisation. Opt-in recommended.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
                  <input type="checkbox" className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Opt-in for IRCTC e-Catering meal</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>Pre-order meals from FSSAI-approved restaurants, delivered to your seat at en-route stations.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
                  <input type="checkbox" className="h-4 w-4 mt-0.5" defaultChecked />
                  <div>
                    <p className="text-sm font-medium">Consider for auto-upgrade</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--steel)" }}>If a higher class has vacancies close to departure, upgrade your berth at no additional charge.</p>
                  </div>
                </label>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="w-full h-12 rounded-xl font-semibold" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
              Continue to payment
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold mb-3">Fare breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>Base fare ({passengers.length} pax)</span><span className="f-mono font-semibold">₹{fare.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>Reservation charge</span><span className="f-mono font-semibold">₹60</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>Superfast surcharge</span><span className="f-mono font-semibold">₹45</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>GST (5%)</span><span className="f-mono font-semibold">₹{Math.round(fare * 0.05)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>Convenience fee (incl. GST)</span><span className="f-mono font-semibold">₹{convenience}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "var(--steel)" }}>Travel insurance</span><span className="f-mono font-semibold">₹0.45</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between text-[15px]" style={{ borderColor: "var(--line)" }}>
                  <span className="font-semibold">Total payable</span>
                  <span className="f-mono font-bold" style={{ color: "var(--ink)" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
              <p className="f-display font-semibold mb-1">Select payment method</p>
              <p className="text-xs mb-4" style={{ color: "var(--steel)" }}>All transactions are PCI-DSS compliant. Card data is tokenised and never stored.</p>

            {payState === "idle" && (
              <div className="space-y-3">
                {[
                  { icon: "💳", label: "UPI (GPay, PhonePe, Paytm)", desc: "Pay instantly via UPI ID or QR scan" },
                  { icon: "🏦", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay accepted" },
                  { icon: "🏢", label: "Net Banking", desc: "All major banks supported" },
                  { icon: "👛", label: "IRCTC eWallet", desc: "Pre-loaded wallet for faster checkout" },
                ].map((pm) => (
                  <div key={pm.label} className="rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--line)" }}>
                    <span className="text-xl">{pm.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.label}</p>
                      <p className="text-xs" style={{ color: "var(--steel)" }}>{pm.desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--steel)" }} />
                  </div>
                ))}
                <p className="text-xs pt-2" style={{ color: "var(--steel)" }}>Demo: try each outcome to see how the redesigned flow handles it — no more silent dead ends.</p>
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
    </div>
  );
}

/* ---------------- EXPLORE SCREEN ---------------- */

function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [toolState, setToolState] = useState({
    trains: { from: "NDLS", to: "BCT", searched: true },
    fare: { classType: "3A", quota: "General", base: 1820 },
    room: { station: "NDLS", type: "AC Deluxe", hours: "12 hrs", available: true }
  });
  
  const trending = [
    { name: "Kashmir Vaishno Devi", days: "5N/6D", price: "₹21,300", desc: "Pilgrimage to the holy shrine of Vaishno Devi via Katra, with scenic views of the Trikuta Mountains. Includes train, hotel, and helicopter options.", highlights: "Katra base camp, Bhawan darshan, Patnitop excursion", meals: "Breakfast + Dinner", accommodation: "3-star hotel in Katra", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800" },
    { name: "Dev Darshan Yatra", days: "6N/7D", price: "₹18,900", desc: "Multi-city religious circuit covering Varanasi, Prayagraj, Ayodhya and Mathura by train. Guided temple tours included.", highlights: "Kashi Vishwanath, Triveni Sangam, Ram Janmabhoomi", meals: "All meals included", accommodation: "AC Deluxe Hotel", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800" },
    { name: "Kerala Backwaters", days: "4N/5D", price: "₹16,500", desc: "Houseboat stay in Alleppey, tea plantations in Munnar, and the beaches of Kovalam. Train from home city to Ernakulam.", highlights: "Alleppey houseboat, Munnar tea gardens, Kovalam beach", meals: "Breakfast included", accommodation: "Luxury Houseboat & Resort", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800" },
    { name: "Rajasthan Heritage", days: "7N/8D", price: "₹26,800", desc: "Explore the royal forts and palaces of Jaipur, Jodhpur, Udaipur and Jaisalmer. Desert safari and folk culture evenings.", highlights: "Amber Fort, Mehrangarh, Lake Pichola, Sam Sand Dunes", meals: "Breakfast + Dinner", accommodation: "Heritage Haveli Stay", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" },
    { name: "North East Explorer", days: "8N/9D", price: "₹32,500", desc: "Discover the untouched beauty of Meghalaya, Assam and Arunachal Pradesh. Living root bridges, tea gardens and monasteries.", highlights: "Cherrapunji, Kaziranga, Tawang Monastery", meals: "All meals included", accommodation: "Eco-Lodge & Resorts", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800" },
    { name: "Buddhist Circuit Special", days: "5N/6D", price: "₹14,200", desc: "Follow the footsteps of Buddha — Bodh Gaya, Sarnath, Kushinagar and Lumbini (Nepal). Special IRCTC Buddhist circuit train.", highlights: "Mahabodhi Temple, Sarnath Stupa, Kushinagar", meals: "Vegetarian meals included", accommodation: "Pilgrim Rest Houses & Hotels", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800" },
  ];

  const packages = [
    { name: "Bharat Gaurav Tourist Train", days: "8N/9D", desc: "AC III-Tier themed circuit train promoting domestic heritage tourism. Covers Kashi, Puri, Mahabalipuram, Rameswaram and Madurai in one loop.", price: "₹24,500", accommodation: "Onboard AC-III", meals: "All meals on train", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" },
    { name: "Maharajas' Express", days: "7N/8D", desc: "Luxury heritage train — 'World's Leading Luxury Train' 6 years running. Suites with en-suite bathrooms, fine dining, and curated excursions.", price: "On request", accommodation: "Luxury suite", meals: "Multi-cuisine à la carte", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" },
    { name: "Goa Beach Holidays", days: "3N/4D", desc: "Train + stay package covering North and South Goa highlights. Includes Dudhsagar Falls excursion, spice plantation visit, and beach activities.", price: "₹12,000", accommodation: "3-star resort", meals: "Breakfast included", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800" },
    { name: "Andaman Island Explorer", days: "6N/7D", desc: "Train to Chennai + flight to Port Blair. Havelock Island, Ross Island, Cellular Jail and pristine beaches. Snorkelling and glass-bottom boat rides.", price: "₹38,500", accommodation: "Beach resort", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800" },
    { name: "Shimla-Manali Delight", days: "5N/6D", desc: "Take the toy train from Kalka to Shimla (UNESCO World Heritage), then proceed to Manali by road. Rohtang Pass, Solang Valley included.", price: "₹15,800", accommodation: "3-star hotel", meals: "Breakfast + Dinner", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800" },
    { name: "Statue of Unity Special", days: "2N/3D", price: "₹8,900", desc: "Weekend getaway to the world's tallest statue. Includes Valley of Flowers, Sardar Sarovar Dam, jungle safari at Shoolpaneshwar Wildlife Sanctuary.", accommodation: "Tent City Narmada", meals: "All meals included", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800" },
  ];

  // Dynamic filter based on search query
  const filteredTrending = useMemo(() => {
    if (!searchQuery.trim()) return trending;
    const q = searchQuery.toLowerCase();
    return trending.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.highlights?.toLowerCase().includes(q));
  }, [searchQuery, trending]);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages;
    const q = searchQuery.toLowerCase();
    return packages.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }, [searchQuery, packages]);

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body pb-20">
      <section className="relative overflow-hidden paper-texture" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>Explore</p>
          <h1 className="f-display text-3xl md:text-4xl font-semibold text-white mt-2 max-w-xl">Beyond booking a seat.</h1>
          <p className="text-sm mt-2 max-w-lg mb-8" style={{ color: "#C7D2DD" }}>Interactive rail planning tools and curated IRCTC Tourism packages for your next journey.</p>
          
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} style={{ color: "var(--steel)" }} />
            </div>
            <input 
              type="text" 
              placeholder="Search packages, destinations or tour types..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-10 py-3.5 rounded-xl border-none outline-none f-body shadow-lg text-sm"
              style={{ color: "var(--ink)", background: "white" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3 Interactive Quick Tools */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <ToolCard onClick={() => setActiveModal({ type: "trains_between_stations", title: "Trains Between Stations" })} icon={Train} title="Trains between stations" body="Explore full timetables and running days across any two stations." />
        <ToolCard onClick={() => setActiveModal({ type: "fare_enquiry", title: "Fare Enquiry Calculator" })} icon={Wallet} title="Fare enquiry calculator" body="Calculate transparent breakdown across 1A, 2A, 3A, SL and Tatkal quotas." />
        <ToolCard onClick={() => setActiveModal({ type: "retiring_rooms", title: "Station Retiring Rooms" })} icon={Hotel} title="Retiring rooms & dorms" body="Reserve comfortable AC/Non-AC rooms for station layovers at 900+ junctions." />
      </div>

      {/* Trending Destinations with sliding carousel */}
      <div className="mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: "var(--marigold-2)" }} />
              <h2 className="f-display font-semibold text-xl">Trending Destinations</h2>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--steel)" }}>
              {searchQuery ? `Showing ${filteredTrending.length} matching destinations` : "Curated packages from IRCTC Tourism — train travel included."}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border bg-white text-gray-500 font-medium hidden sm:inline-block">
            Hover to pause · Click card for details
          </span>
        </div>
        
        {/* Auto-scrolling carousel with pause-on-hover */}
        <div className="overflow-hidden relative" style={{ 
          maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)", 
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)" 
        }}>
          <div className="flex gap-4 px-4 md:px-6 pause-hover" style={{
            animation: "scroll-left 35s linear infinite",
            width: "max-content",
          }}>
            {/* Duplicate for seamless infinite loop */}
            {[...(filteredTrending.length ? filteredTrending : trending), ...(filteredTrending.length ? filteredTrending : trending)].map((p, idx) => (
              <div 
                onClick={() => setActiveModal({ ...p, type: "package_detail" })} 
                key={`${p.name}-${idx}`} 
                className="relative w-[280px] md:w-[320px] h-[380px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 group cursor-pointer border border-black/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900"
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="text-[11px] font-bold f-mono px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-md border border-white/20">
                    {p.days}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/90 text-slate-900">
                    Popular
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1.5 drop-shadow">{p.name}</h3>
                  <p className="text-white/80 text-xs mb-3 line-clamp-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <div>
                      <span className="text-[10px] text-white/60 block">Starting from</span>
                      <span className="text-white font-extrabold text-base">{p.price}</span>
                    </div>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-blue-900 backdrop-blur-md transition-all">
                      View Tour
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Packages Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="f-display font-semibold text-xl mb-1">All Tourism Packages</h2>
            <p className="text-sm" style={{ color: "var(--steel)" }}>Domestic and international circuits, heritage luxury trains, and spiritual yatras.</p>
          </div>
          {filteredPackages.length !== packages.length && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
              {filteredPackages.length} packages found
            </span>
          )}
        </div>
        
        {filteredPackages.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center bg-white">
            <p className="font-semibold text-gray-700">No packages found matching "{searchQuery}"</p>
            <p className="text-xs text-gray-500 mt-1">Try searching for "Goa", "Kashmir", "Heritage", or "Bharat Gaurav"</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPackages.map((p) => (
              <div 
                onClick={() => setActiveModal({ ...p, type: "package_detail" })} 
                key={p.name} 
                className="rounded-2xl border bg-white overflow-hidden flex flex-col sm:flex-row group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-200" 
                style={{ borderColor: "var(--line)" }}
              >
                <div className="h-48 sm:h-auto sm:w-48 relative overflow-hidden flex-shrink-0">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold f-mono px-2 py-0.5 rounded-md text-white bg-black/60 backdrop-blur-md">
                    {p.days}
                  </span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="f-body font-bold text-[16px] text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-4">
                      {p.accommodation && <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">🏨 {p.accommodation}</span>}
                      {p.meals && <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">🍽️ {p.meals}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium">All-Inclusive</span>
                      <span className="f-mono text-base font-extrabold text-blue-900">{p.price}</span>
                    </div>
                    <button className="text-xs font-bold px-4 py-2 rounded-xl text-white shadow-sm transition-all" style={{ background: "var(--blue)" }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Tool Modals & Details */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal?.title || activeModal?.name}>
        {/* 1. Trains Between Stations Interactive Modal */}
        {activeModal?.type === "trains_between_stations" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">From Station</label>
                <select 
                  value={toolState.trains.from} 
                  onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, from: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                  <option value="SBC">Bengaluru (SBC)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">To Station</label>
                <select 
                  value={toolState.trains.to} 
                  onChange={(e) => setToolState({ ...toolState, trains: { ...toolState.trains, to: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="HWH">Howrah (HWH)</option>
                  <option value="MAS">Chennai Central (MAS)</option>
                  <option value="SBC">Bengaluru (SBC)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Available Daily Trains ({toolState.trains.from} → {toolState.trains.to})</p>
              <div className="space-y-2.5">
                {[
                  { no: "12951", name: "Mumbai Rajdhani Express", dep: "16:55", arr: "08:35", dur: "15h 40m", days: "Daily", classes: ["1A", "2A", "3A"] },
                  { no: "12953", name: "August Kranti Rajdhani", dep: "17:15", arr: "10:05", dur: "16h 50m", days: "Daily", classes: ["1A", "2A", "3A", "3E"] },
                  { no: "22221", name: "CSMT Rajdhani Express", dep: "16:55", arr: "11:15", dur: "18h 20m", days: "Mon, Wed, Fri", classes: ["1A", "2A", "3A"] }
                ].map((t) => (
                  <div key={t.no} className="p-3 rounded-xl border bg-gray-50/70 hover:bg-blue-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="f-mono text-xs font-bold text-blue-700 mr-2">{t.no}</span>
                        <span className="font-semibold text-sm text-gray-900">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">{t.days}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span>Dep: <strong>{t.dep}</strong> → Arr: <strong>{t.arr}</strong> ({t.dur})</span>
                      <div className="flex gap-1">
                        {t.classes.map(c => <span key={c} className="px-1.5 py-0.5 rounded bg-white border text-[10px] font-mono">{c}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Fare Enquiry Interactive Modal */}
        {activeModal?.type === "fare_enquiry" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Select Class</label>
                <select 
                  value={toolState.fare.classType} 
                  onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, classType: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="SL">Sleeper (SL)</option>
                  <option value="3E">AC 3-Tier Economy (3E)</option>
                  <option value="3A">AC 3-Tier (3A)</option>
                  <option value="2A">AC 2-Tier (2A)</option>
                  <option value="1A">AC First Class (1A)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quota</label>
                <select 
                  value={toolState.fare.quota} 
                  onChange={(e) => setToolState({ ...toolState, fare: { ...toolState.fare, quota: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="General">General Quota</option>
                  <option value="Tatkal">Tatkal (Premium)</option>
                  <option value="Ladies">Ladies Quota</option>
                  <option value="Senior">Senior Citizen</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-blue-50/50">
              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <div>
                  <p className="text-xs text-blue-800 font-semibold uppercase">Total Fare Estimate</p>
                  <p className="text-2xl font-extrabold text-blue-950 mt-0.5">
                    {toolState.fare.classType === "1A" ? "₹4,750" : 
                     toolState.fare.classType === "2A" ? "₹2,830" : 
                     toolState.fare.classType === "3A" ? "₹1,985" : 
                     toolState.fare.classType === "3E" ? "₹1,750" : "₹685"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">NDLS ⇄ BCT</span>
              </div>
              <div className="grid gap-1.5 pt-3 text-xs text-gray-700">
                <div className="flex justify-between"><span>Base Distance Fare:</span><span className="font-semibold">₹1,640</span></div>
                <div className="flex justify-between"><span>Superfast Surcharge:</span><span className="font-semibold">₹45</span></div>
                <div className="flex justify-between"><span>Reservation Fee:</span><span className="font-semibold">₹40</span></div>
                <div className="flex justify-between"><span>GST (5% for AC):</span><span className="font-semibold">₹110</span></div>
                <div className="flex justify-between"><span>Dynamic Tatkal Fee:</span><span className="font-semibold">{toolState.fare.quota === "Tatkal" ? "+₹400" : "₹0"}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Retiring Rooms Interactive Modal */}
        {activeModal?.type === "retiring_rooms" && (
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Station</label>
                <select 
                  value={toolState.room.station} 
                  onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, station: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="NDLS">New Delhi (NDLS)</option>
                  <option value="BCT">Mumbai Central (BCT)</option>
                  <option value="HWH">Howrah Jn (HWH)</option>
                  <option value="BSB">Varanasi Jn (BSB)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Duration</label>
                <select 
                  value={toolState.room.hours} 
                  onChange={(e) => setToolState({ ...toolState, room: { ...toolState.room, hours: e.target.value } })}
                  className="w-full h-11 px-3 rounded-xl border bg-gray-50 text-sm font-medium outline-none"
                >
                  <option value="12 hrs">12 Hours Slot</option>
                  <option value="24 hrs">24 Hours Full Day</option>
                  <option value="48 hrs">48 Hours Stay</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { name: "Executive AC Deluxe Room", beds: "1 King Bed (2 Guests)", tariff: "₹1,450 / 12h", available: "3 Rooms Free", rating: "4.4 ★" },
                { name: "Standard AC Double Room", beds: "2 Single Beds (2 Guests)", tariff: "₹950 / 12h", available: "5 Rooms Free", rating: "4.1 ★" },
                { name: "AC Dormitory Bed", beds: "Individual Pod with Locker", tariff: "₹380 / 12h", available: "14 Beds Free", rating: "4.2 ★" }
              ].map((r) => (
                <div key={r.name} className="p-3.5 rounded-xl border bg-gray-50 flex items-center justify-between hover:border-blue-300 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.beds} · {r.rating}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      ● {r.available}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-blue-900 block">{r.tariff}</span>
                    <button onClick={() => alert(`Reserved slot for ${r.name} at ${toolState.room.station}!`)} className="mt-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      Book Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Package Detail Modal */}
        {activeModal?.type === "package_detail" && (
          <div className="flex flex-col">
            <div className="relative h-48 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-lg">
              <img 
                src={activeModal.image} 
                alt={activeModal.name} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
                }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <span className="text-xs f-mono font-bold px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-md border border-white/20">{activeModal.days}</span>
                <div className="text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-medium">Package Fare</span>
                  <span className="text-white font-extrabold text-xl">{activeModal.price}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed mb-4 text-gray-700">{activeModal.desc}</p>
            
            {activeModal.highlights && (
              <div className="rounded-xl p-3.5 mb-3 bg-blue-50/70 border border-blue-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1">Key Highlights</p>
                <p className="text-xs text-blue-950 leading-normal">{activeModal.highlights}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border p-3 bg-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Meals Included</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.meals || "Breakfast & Dinner"}</p>
              </div>
              <div className="rounded-xl border p-3 bg-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Accommodation</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{activeModal.accommodation || "3-Star Hotel / Resort"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { alert(`Thank you! Booking inquiry initiated for ${activeModal.name}. Our IRCTC tourism executive will contact you shortly.`); setActiveModal(null); }} className="flex-1 h-12 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-[0.98]" style={{ background: "var(--blue)" }}>
                Book This Package
              </button>
              <button onClick={() => setActiveModal(null)} className="px-5 h-12 rounded-xl font-semibold text-sm border text-gray-700 hover:bg-gray-50">
                Close
              </button>
            </div>
            <p className="text-[11px] text-center mt-2.5 text-gray-400">IRCTC Official Tourism Partner · 100% Verified Itinerary</p>
          </div>
        )}
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
    { q: "My money was debited but I didn't get a ticket. What now?", a: "You'll see a 'Verifying' status immediately with a confirmation SLA. If the booking can't be confirmed within that window, the amount is auto-refunded to your original payment method — no TDR filing needed for this case. Refunds typically appear within 3–5 working days." },
    { q: "How do I file a TDR for a waitlisted passenger?", a: "Go to My Trips → Refunds & TDR, select the PNR, choose the affected passenger(s), and submit before the train's scheduled departure. Refunds are decided by the concerned Zonal Railway, usually within 60 days." },
    { q: "Why is my Tatkal ticket non-refundable?", a: "Confirmed Tatkal tickets carry zero refund on cancellation by rule. Waitlisted Tatkal tickets can still be cancelled up to 30 minutes before departure for a nominal clerkage fee. Premium Tatkal tickets follow the same rule." },
    { q: "What's the difference between chart-prepared and not-prepared?", a: "Charts are usually finalised 4 hours before departure. Before that, RAC/waitlist positions can still move. After charting, your final coach and berth are locked and shown on the PNR status." },
    { q: "How many tickets can I book in a month?", a: "Individual users can book up to 6 tickets per user ID per month for non-Tatkal bookings. For Tatkal bookings, the limit is 2 tickets per user ID per day. IRCTC-verified users (Aadhaar-linked) get a higher limit of 12 tickets per month." },
    { q: "Do children need a separate ticket?", a: "Children below 5 years travel free without a berth. Children aged 5–11 can either share a berth with a guardian (free) or be booked a separate berth at full adult fare. Children 12 and above require a full ticket." },
    { q: "Can I change the boarding station after booking?", a: "Yes, you can change the boarding point online up to 24 hours before the train's scheduled departure, once per ticket. The new station must be on the same route before your original boarding station." },
    { q: "How do I order food on the train?", a: "Use the e-Catering service available during booking or on My Trips after booking. Select your delivery station from 500+ FSSAI-approved partner restaurants. Meals are delivered to your seat by restaurant staff at the station. Minimum order time is 2 hours before the train arrives at the station." },
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
    </div>
  );
}

/* ---------------- shared page hero ---------------- */

function PageHero({ eyebrow, title, sub, small }) {
  return (
    <section className="paper-texture relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-12 md:pb-20">
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
  const [quickModal, setQuickModal] = useState(null);

  const handleFooterAction = (action) => {
    if (action === "PNR Status") {
      setQuickModal({ type: "pnr" });
    } else if (action === "Train Between Stations") {
      setQuickModal({ type: "trains_between_stations" });
    } else if (action === "Fare Enquiry") {
      setQuickModal({ type: "fare_enquiry" });
    } else if (action === "Live Train Status") {
      setQuickModal({ type: "live" });
    } else if (action === "Seat Availability") {
      setQuickModal({ type: "seat" });
    } else if (action === "Cancel / TDR") {
      setQuickModal({ type: "cancel_tdr" });
    } else if (action === "IRCTC Tourism" || action === "Bharat Gaurav Trains" || action === "Maharajas' Express" || action === "Buddhist Circuit") {
      setScreen("explore");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (action === "Retiring Rooms") {
      setQuickModal({ type: "retiring_rooms" });
    } else if (action === "e-Catering") {
      setQuickModal({ type: "e_catering" });
    } else if (action === "Helpline: 139") {
      window.location.href = "tel:139";
    } else if (action === "care@irctc.co.in") {
      window.location.href = "mailto:care@irctc.co.in";
    } else if (action === "Grievance Tracker" || action === "Complaint Status" || action === "FAQs" || action === "Accessibility") {
      setScreen("help");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert(`Viewing ${action} · IRCTC Official Redesign Portal`);
    }
  };

  return (
    <div className="f-body" style={{ minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>
      <TopNav screen={screen} setScreen={setScreen} />

      {screen === "search" && <SearchScreen onSearch={() => setScreen("results")} onFooterAction={handleFooterAction} />}
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

      {/* Global Quick Links Modal */}
      <QuickLinksModal modal={quickModal} onClose={() => setQuickModal(null)} onNavigate={setScreen} />

      {/* Global Interactive Footer */}
      <Footer onAction={handleFooterAction} />
    </div>
  );
}