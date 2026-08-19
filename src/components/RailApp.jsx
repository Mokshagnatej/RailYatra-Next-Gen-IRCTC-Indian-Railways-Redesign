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
import stationsData from "../data/stationsData.json";
import stationList from "../data/stationList.json";
import ExploreScreen from "../screens/ExploreScreen";
import PageHero from "./common/PageHero";
import { RangoliOverlay, DotNetwork, WarmGlowOrbs, WarmGradientWave } from "./common/CulturalPatterns.jsx";

import TripsScreen from "../screens/MyTripsScreen";

import AccountScreen from "../screens/AccountScreen";

import HelpScreen from "../screens/HelpScreen";

import LiveRailRadarCard from "../components/features/radar/LiveRailRadarCard";

import EndToEndTrainTrack from "../components/features/animation/EndToEndTrainTrack";

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
  --blue:#0F2A45; --blue-2:#1B4470; --blue-3:#060F1D;
  --marigold:#E5A93D; --marigold-2:#C08321; --marigold-dim:rgba(229,169,61,0.12);
  --green:#1F7A4C; --green-bg:#E9F4EE;
  --amber:#C9861F; --amber-bg:#FCF2E1;
  --red:#C23B32; --red-bg:#FBEBE9;
  --steel:#6D7681; --line:#E2DCCD;
  --shadow-lg: 0 28px 56px -24px rgba(9,28,49,0.34), 0 4px 14px -6px rgba(9,28,49,0.12);
  --shadow-sm: 0 1px 2px rgba(9,28,49,0.04), 0 6px 16px -10px rgba(9,28,49,0.18);
  --shadow-hover: 0 18px 34px -18px rgba(9,28,49,0.30);
  --shadow-gold: 0 0 0 1px rgba(229,169,61,0.25), 0 8px 32px -8px rgba(229,169,61,0.28);
}
html{ scroll-behavior:smooth; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
::selection{ background: rgba(229,169,61,0.32); }
.f-display{ letter-spacing:-0.02em; }
.f-serif{ font-family:'Fraunces',Georgia,serif; letter-spacing:-0.02em; }
button, a, input, select{ outline-color: var(--marigold); }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible{
  outline:2px solid var(--marigold); outline-offset:2px; border-radius:10px;
}
input, select, button{ transition: border-color .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease, transform .18s ease; }
input:focus, select:focus{ border-color: var(--blue) !important; box-shadow: 0 0 0 3px rgba(15,42,69,0.08); }
.paper-texture{ position:relative; }
::-webkit-scrollbar{ height:6px; width:6px; }
::-webkit-scrollbar-thumb{ background: #CFC7B4; border-radius:8px; }
::-webkit-scrollbar-track{ background: transparent; }
.f-display{font-family:'Inter',system-ui,sans-serif; letter-spacing:-0.02em;}
.f-body{font-family:'Inter',system-ui,sans-serif;}
.f-mono{font-family:'IBM Plex Mono',monospace;}
.paper-texture{
  background-image: radial-gradient(circle, rgba(15,42,69,0.045) 1px, transparent 1px);
  background-size: 18px 18px;
}
.ticket-notch{ position: relative; }
.ticket-notch::before, .ticket-notch::after{
  content:''; position:absolute; top:50%; width:16px; height:16px; border-radius:9999px;
  background: var(--paper); transform: translateY(-50%);
}
.ticket-notch::before{ left:-8px; }
.ticket-notch::after{ right:-8px; }

/* Hero star field (legacy) */
.star-field{ position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.star{ position:absolute; border-radius:50%; background:white; }

/* Scroll-reveal */
.reveal{ opacity:0; transform:translateY(22px); transition: opacity 0.65s cubic-bezier(.2,.8,.2,1), transform 0.65s cubic-bezier(.2,.8,.2,1); }
.reveal.visible{ opacity:1; transform:translateY(0); }
.reveal-delay-1{ transition-delay: 0.1s; }
.reveal-delay-2{ transition-delay: 0.2s; }
.reveal-delay-3{ transition-delay: 0.3s; }

/* glass card — warm hero glassmorphism */
.glass-card{
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
.glass-hero-card{
  background: rgba(255,255,255,0.68);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(229,169,61,0.22);
  box-shadow: 0 0 0 1px rgba(229,169,61,0.1), 0 24px 48px -12px rgba(229,169,61,0.12), 0 8px 24px rgba(15,42,69,0.06);
  animation: glow-border 4s ease-in-out infinite;
}
.glass-stat-badge{
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(229,169,61,0.18);
}

@keyframes train-cross{
  0%{ transform: translateX(-10%); }
  100%{ transform: translateX(110%); }
}
@keyframes train-down{
  0%{ transform: translateY(-10vh); }
  100%{ transform: translateY(110vh); }
}
@keyframes train-chug{
  0%,100%{ transform: translateY(0); }
  50%{ transform: translateY(-1.5px); }
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
  from{ opacity: 0; transform: translateY(18px); }
  to{ opacity: 1; transform: translateY(0); }
}
@keyframes fade-up-md{
  from{ opacity: 0; transform: translateY(28px); }
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
  50%{ transform: translateY(-6px); }
}
@keyframes bob-slow{
  0%,100%{ transform: translateY(0) rotate(-1deg); }
  50%{ transform: translateY(-9px) rotate(1deg); }
}
@keyframes ripple{
  0%{ transform: scale(0.6); opacity: 0.35; }
  100%{ transform: scale(1.6); opacity: 0; }
}
@keyframes glow-pulse{
  0%,100%{ opacity:0.5; transform:scale(1); }
  50%{ opacity:1; transform:scale(1.08); }
}
@keyframes star-twinkle{
  0%,100%{ opacity:0.15; }
  50%{ opacity:0.9; }
}
@keyframes gradient-shift{
  0%{ background-position:0% 50%; }
  50%{ background-position:100% 50%; }
  100%{ background-position:0% 50%; }
}
@keyframes slide-in-up{
  from{ opacity:0; transform:translateY(32px); }
  to{ opacity:1; transform:translateY(0); }
}
@keyframes dot-network-pulse{
  0%,100%{ opacity:0; transform:scale(0.8); }
  50%{ opacity:0.5; transform:scale(1.4); }
}
@keyframes dot-network-float{
  0%,100%{ transform:translateY(0); }
  50%{ transform:translateY(-2px); }
}
@keyframes warm-orb-drift{
  0%{ transform:translate(-50%,-50%) translateX(0) translateY(0); }
  100%{ transform:translate(-50%,-50%) translateX(12px) translateY(-8px); }
}
@keyframes glow-border{
  0%,100%{ box-shadow: 0 0 0 1px rgba(229,169,61,0.1), 0 24px 48px -12px rgba(229,169,61,0.12), 0 8px 24px rgba(15,42,69,0.06); }
  50%{ box-shadow: 0 0 0 1px rgba(229,169,61,0.25), 0 24px 48px -12px rgba(229,169,61,0.2), 0 8px 24px rgba(15,42,69,0.08); }
}
.anim-fade-up{ animation: fade-up 0.6s cubic-bezier(.16,1,.3,1) both; }
.anim-fade-up-md{ animation: fade-up-md 0.75s cubic-bezier(.16,1,.3,1) both; }
.anim-pulse-dot{ animation: pulse-dot 2s infinite; }
.anim-bob{ animation: bob 3.5s ease-in-out infinite; }
.anim-bob-slow{ animation: bob-slow 5s ease-in-out infinite; }
.anim-glow-pulse{ animation: glow-pulse 3s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce){
  .anim-fade-up,.anim-fade-up-md,.anim-pulse-dot,.anim-bob,.anim-bob-slow,.anim-glow-pulse,
  .reveal,[style*="animation"]{ animation: none !important; transition: none !important; }
  .reveal{ opacity:1; transform:none; }
  .opacity-0{ opacity:1 !important; }
}
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
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, delay = 0, className = "", hero = false }) {
  const ref = useReveal();
  if (hero) {
    return (
      <div ref={ref} className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Warm Light Hero Scenery (Cultural + Futuristic) ── */
function HeroScenery() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Warm gradient wave backdrop */}
      <WarmGradientWave />

      {/* Railway network dot animation */}
      <DotNetwork count={18} />

      {/* Warm floating golden orbs */}
      <WarmGlowOrbs count={7} />

      {/* Cultural rangoli overlays — subtle decorative corners */}
      <RangoliOverlay position="top-right" size={340} opacity={0.04} />
      <RangoliOverlay position="bottom-left" size={280} opacity={0.035} />
    </div>
  );
}

function TopNav({ screen, setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = ["search","results","booking","confirmation"].includes(screen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { key: "search", label: "Book Tickets", icon: Home },
    { key: "trips", label: "My Trips", icon: Ticket },
    { key: "explore", label: "Explore", icon: Compass },
    { key: "help", label: "Help", icon: LifeBuoy },
  ];

  /* Light hero: warm frosted glass when on hero, solid cream on scroll.
     Non-home pages: dark navy nav (unchanged). */
  const onLightHero = isHome && !scrolled;
  const navBg = !isHome
    ? "rgba(9,28,49,0.97)"
    : scrolled
      ? "rgba(255,249,240,0.96)"
      : "rgba(255,255,255,0.15)";

  const textColor = onLightHero ? "var(--blue)" : !isHome ? "rgba(255,255,255,0.82)" : "var(--blue)";
  const textInactive = onLightHero ? "rgba(15,42,69,0.6)" : !isHome ? "rgba(255,255,255,0.65)" : "rgba(15,42,69,0.6)";
  const hamburgerColor = onLightHero ? "var(--blue)" : !isHome ? "rgba(255,255,255,0.8)" : "var(--blue)";
  const accountBorder = onLightHero ? "rgba(15,42,69,0.15)" : !isHome ? "rgba(255,255,255,0.2)" : "rgba(15,42,69,0.15)";

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-50 text-center py-2 px-4 f-body text-xs font-medium"
        style={{ background: "var(--marigold)", color: "var(--blue)" }}>
        ✦ Concept redesign &mdash; for real bookings call{" "}
        <span className="f-mono font-semibold">139</span> or visit irctc.co.in
      </div>

      <header className="sticky top-[33px] z-40 transition-all duration-300"
        style={{
          background: navBg,
          backdropFilter: scrolled || !isHome ? "blur(16px)" : onLightHero ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled || !isHome ? "blur(16px)" : onLightHero ? "blur(12px)" : "none",
          borderBottom: scrolled && isHome ? "1px solid rgba(192,131,33,0.12)" : scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: scrolled && isHome ? "0 4px 24px rgba(192,131,33,0.08)" : scrolled ? "0 4px 32px rgba(6,15,29,0.4)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[66px] flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={() => setScreen("search")}
            className="flex items-center gap-3 flex-shrink-0 group">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{ background: "var(--marigold)" }}>
              <Train size={18} color="var(--blue)" />
            </div>
            <span className="f-serif font-bold text-xl" style={{ color: "var(--blue)" }}>
              Rail<span style={{ color: "var(--marigold)" }}>Yatra</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {items.map((it) => {
              const Icon = it.icon;
              const active = screen === it.key || (it.key === "search" && isHome);
              return (
                <button key={it.key} onClick={() => setScreen(it.key)}
                  className="f-body flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? "var(--blue)" : textInactive,
                    background: active ? "var(--marigold)" : "transparent",
                    fontWeight: active ? 600 : 400,
                  }}>
                  <Icon size={15} /> {it.label}
                </button>
              );
            })}
          </nav>

          {/* CTA area */}
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen("account")}
              className="hidden md:flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{ borderColor: accountBorder, color: textColor }}>
              <User size={15} />
              <span className={screen === "account" ? "text-[var(--marigold)]" : ""}>{screen === "account" ? "Account" : "Account"}</span>
            </button>
            <button onClick={() => { setScreen("search"); setMobileMenuOpen(false); }}
              className="h-10 px-5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97] shadow-md"
              style={{ background: "var(--marigold)", color: "var(--blue)" }}>
              Book Now
            </button>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu">
              {[0,1,2].map(i => (
                <span key={i} className="block h-0.5 w-5 rounded-full transition-all"
                  style={{ background: hamburgerColor, transformOrigin:"center",
                    transform: mobileMenuOpen && i===0 ? "rotate(45deg) translate(3px,3px)" :
                               mobileMenuOpen && i===1 ? "scaleX(0)" :
                               mobileMenuOpen && i===2 ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 border-t" style={{
            borderColor: isHome ? "rgba(192,131,33,0.12)" : "rgba(255,255,255,0.08)",
            background: isHome ? "rgba(255,249,240,0.98)" : "rgba(9,28,49,0.98)"
          }}>
            <div className="grid grid-cols-2 gap-2 pt-3">
              {[...items, { key:"account", label:"Account", icon:User }].map((it) => {
                const Icon = it.icon;
                const active = screen === it.key || (it.key === "search" && isHome);
                return (
                  <button key={it.key} onClick={() => { setScreen(it.key); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: active ? "var(--blue)" : isHome ? "var(--blue)" : "rgba(255,255,255,0.8)",
                      background: active ? "var(--marigold)" : isHome ? "rgba(15,42,69,0.04)" : "rgba(255,255,255,0.06)"
                    }}>
                    <Icon size={16} /> {it.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/* Hyper-Realistic Full-Width Panoramic End-to-End Moving Train Track (Exclusive to Hero Page) */

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
    { title: "Quick Tools", items: ["PNR Status", "Train Between Stations", "Fare Enquiry", "Live Train Status", "Seat Availability", "Cancel / TDR"] },
    { title: "Explore", items: ["IRCTC Tourism", "Bharat Gaurav Trains", "Maharajas' Express", "Retiring Rooms", "e-Catering", "Buddhist Circuit"] },
    { title: "Company", items: ["RTI Disclosure", "Annual Report", "Tenders & Notices", "Careers at IRCTC", "Vigilance Corner"] },
    { title: "Support", items: ["Helpline: 139", "care@irctc.co.in", "Grievance Tracker", "Complaint Status", "FAQs", "Accessibility"] },
  ];
  return (
    <footer className="f-body relative" style={{ background: "var(--blue-3)", color: "#8BA5BE" }}>
      {/* Top border accent */}
      <div className="h-px w-full" style={{ background:"linear-gradient(90deg,transparent,var(--marigold),transparent)", opacity:0.3 }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 md:gap-10">
        {/* Brand col */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--marigold)" }}>
              <Train size={18} color="var(--blue)" />
            </div>
            <span className="f-serif font-bold text-white text-xl">Rail<span style={{ color:"var(--marigold)" }}>Yatra</span></span>
          </div>
          <p className="text-xs leading-relaxed mb-5 max-w-[220px]">Indian Railway Catering &amp; Tourism Corporation — Mini Ratna (Category-I) PSU, Ministry of Railways, Govt. of India.</p>
          <div className="flex items-center gap-2 mb-5">
            {[["𝕏","Twitter"],["f","Facebook"],["▶","YouTube"]].map(([sym, name]) => (
              <a key={name} aria-label={name} className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold hover:text-white transition-colors cursor-pointer"
                style={{ background: "rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                {sym}
              </a>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["iOS App", "Android"].map(label => (
              <span key={label} className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer hover:text-white transition-colors font-medium"
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)" }}>
                📱 {label}
              </span>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4 f-mono">{c.title}</p>
            <ul className="space-y-2.5 text-xs">
              {c.items.map((item) => (
                <li key={item} onClick={() => onAction && onAction(item)}
                  className="hover:text-white cursor-pointer transition-colors duration-150 flex items-start gap-1.5 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t max-w-7xl mx-auto px-4 md:px-8 py-5" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[11px]">
          <div className="space-y-1">
            <span>© IRCTC Ltd — redesign concept · not the live site</span>
            <span className="block f-mono opacity-50">CIN: L74899DL1999GOI101707</span>
          </div>
          <div className="flex gap-5 flex-wrap">
            {["Privacy Policy","Terms of Use","Disclaimer","Sitemap"].map(l => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
        <p className="text-[10px] mt-3 opacity-40 leading-relaxed">A UX redesign concept — not affiliated with or endorsed by Indian Railways or IRCTC. For real bookings visit irctc.co.in or call 139.</p>
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
      // Hardcoded coordinates of major rail hubs for realistic distance calculation
      const hubs = {
        "NDLS": { lat: 28.6433, lon: 77.2196, label: "New Delhi (NDLS)" },
        "BCT": { lat: 18.9696, lon: 72.8193, label: "Mumbai Central (BCT)" },
        "HWH": { lat: 22.5830, lon: 88.3426, label: "Howrah Jn (HWH)" },
        "MAS": { lat: 13.0827, lon: 80.2707, label: "MGR Chennai Central (MAS)" },
        "SBC": { lat: 12.9779, lon: 77.5662, label: "KSR Bengaluru (SBC)" },
        "ADI": { lat: 23.0245, lon: 72.6015, label: "Ahmedabad Jn (ADI)" },
        "PNBE": { lat: 25.6027, lon: 85.1374, label: "Patna Jn (PNBE)" },
        "BSB": { lat: 25.3340, lon: 82.9868, label: "Varanasi Jn (BSB)" },
        "PUNE": { lat: 18.5283, lon: 73.8742, label: "Pune Jn (PUNE)" },
        "SC": { lat: 17.4332, lon: 78.5020, label: "Secunderabad Jn (SC)" },
        "BBS": { lat: 20.2749, lon: 85.8361, label: "Bhubaneswar (BBS)" },
        "GHY": { lat: 26.1834, lon: 91.7505, label: "Guwahati (GHY)" }
      };

      const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

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
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          
          let closestHub = null;
          let minDistance = Infinity;

          for (const data of Object.values(hubs)) {
            const dist = getDistance(userLat, userLon, data.lat, data.lon);
            if (dist < minDistance) {
              minDistance = dist;
              closestHub = data.label;
            }
          }
          
          setTimeout(() => {
            setFrom(closestHub || "KSR Bengaluru (SBC)");
            resolve();
          }, 400); // Small UI delay to show loading state nicely
        },
        (error) => {
          console.warn("Geolocation blocked/failed (often happens in iframe previews), using fallback.", error);
          mockLocation();
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen f-body relative">

      {/* ── HERO SECTION (Warm Light Theme) ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden"
        style={{ background: "linear-gradient(160deg, #FFF9F0 0%, #FEF3E2 40%, #F7F4EC 100%)" }}>

        <HeroScenery />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 md:px-8 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Badge */}
          <div className="anim-fade-up" style={{ animationDelay:"0.05s" }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold f-mono tracking-wide"
              style={{ borderColor:"rgba(192,131,33,0.3)", color:"var(--marigold-2)", background:"rgba(229,169,61,0.08)" }}>
              <span className="h-1.5 w-1.5 rounded-full anim-glow-pulse" style={{ background:"var(--marigold)" }} />
              India's Railways · 13,000+ trains · 7,000+ stations
            </span>
          </div>

          {/* Headline */}
          <h1 className="f-serif font-bold mt-5 leading-[1.08] anim-fade-up-md"
            style={{ fontSize:"clamp(2.2rem,5.5vw,4.2rem)", animationDelay:"0.12s", color:"var(--blue)" }}>
            Journey across India,<br />
            <em className="not-italic" style={{ color:"var(--marigold-2)" }}>without the guesswork.</em>
          </h1>

          <p className="f-body mt-4 max-w-lg anim-fade-up" style={{ color:"var(--steel)", fontSize:"1.05rem", animationDelay:"0.22s", lineHeight:1.65 }}>
            Honest seat availability. Transparent fares. A booking flow that confirms or refunds clearly — no silent debits, no dead ends.
          </p>

          {/* Stats row — warm glassmorphism */}
          <div className="flex flex-wrap gap-3 mt-6 anim-fade-up" style={{ animationDelay:"0.3s" }}>
            {[
              { icon: ShieldCheck, label:"Confirmed daily", value:"1.2M+ tickets", color:"var(--green)" },
              { icon: Clock, label:"Avg booking time", value:"Under 3 min", color:"var(--marigold-2)" },
              { icon: BadgeCheck, label:"Payment success", value:"99.4% rate", color:"var(--blue-2)" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-stat-badge flex items-center gap-2.5 px-4 py-2.5 rounded-2xl">
                <Icon size={15} style={{ color }} />
                <div>
                  <p className="f-mono text-xs" style={{ color:"var(--steel)" }}>{label}</p>
                  <p className="f-body text-sm font-semibold leading-tight" style={{ color:"var(--ink)" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search card — glassmorphism with warm glow */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4 md:px-8 pb-0 -mb-16 md:-mb-20 anim-fade-up" style={{ animationDelay:"0.38s" }}>
          <div className="rounded-3xl glass-hero-card p-5 md:p-7">
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
        </div>
      </section>

      {/* Spacer for elevated search card */}
      <div className="pt-24 md:pt-28" style={{ background:"var(--paper)" }} />

      {/* Train track animation */}
      <EndToEndTrainTrack />

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <FadeIn className="text-center mb-10">
          <p className="f-mono text-xs tracking-widest uppercase mb-2" style={{ color:"var(--marigold)" }}>Why RailYatra</p>
          <h2 className="f-serif font-bold text-3xl md:text-4xl" style={{ color:"var(--blue)" }}>
            Built for the modern traveller
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base" style={{ color:"var(--steel)", lineHeight:1.7 }}>
            Every detail redesigned so booking a train feels as effortless as buying a coffee.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, title:"Zero dead ends", body:"Every payment outcome — success, pending, failed — gets a clear next step. No silent debits, no lost money.", color:"var(--green)" },
            { icon: Clock, title:"Time-sorted by default", body:"Results ordered by departure time out of the box. Filter by price, duration, class, or quota — one click.", color:"var(--marigold)" },
            { icon: CalendarDays, title:"Live PNR & refunds", body:"Track PNR status, chart preparation, coach allotment and refund timeline in one place.", color:"#60B8F4" },
          ].map(({ icon: Icon, title, body, color }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="rounded-2xl p-6 border h-full transition-all duration-300 group hover:-translate-y-1"
                style={{ background:"white", borderColor:"var(--line)", boxShadow:"var(--shadow-sm)" }}>
                <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background:`color-mix(in srgb,${color} 12%,transparent)` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="f-display font-semibold text-base mb-2" style={{ color:"var(--ink)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--steel)" }}>{body}</p>
              </div>
            </FadeIn>
          ))}
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
      setSearch("");
      setOpen(false);
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


/* ---------------- EXPLORE SCREEN ---------------- */


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


/* ---------------- shared page hero ---------------- */


export default function App({ initialScreen }) {
  const getBasePath = () => {
    if (typeof window === "undefined") return "";
    return window.location.pathname.startsWith("/UI-UX-Design-Event") ? "/UI-UX-Design-Event" : "";
  };

  const getScreenFromPath = () => {
    if (typeof window === "undefined") return "search";
    const basePath = getBasePath();
    const cleanPath = window.location.pathname
      .replace(basePath, "")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
    if (["explore", "trips", "help", "account", "results", "booking"].includes(cleanPath)) {
      return cleanPath;
    }
    return "search";
  };

  const [screen, setScreenState] = useState(() => initialScreen || getScreenFromPath());
  const [selection, setSelection] = useState(null);
  const [booking, setBooking] = useState(null);
  const [quickModal, setQuickModal] = useState(null);

  const setScreen = (newScreen) => {
    setScreenState(newScreen);
    if (typeof window !== "undefined") {
      const basePath = getBasePath();
      const targetPath = newScreen === "search" ? `${basePath}/` : `${basePath}/${newScreen}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ screen: newScreen }, "", targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setScreenState(getScreenFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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