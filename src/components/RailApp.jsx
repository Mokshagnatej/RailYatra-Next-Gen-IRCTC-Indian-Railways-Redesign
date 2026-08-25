import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "../lib/store.ts";
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
  QuickTools, StatsBand, PopularRoutes, Services, HowItWorks, TrustStrip, FAQ, DestinationDiscovery,
} from "./HomeSections.jsx";
import stationsData from "../data/stationsData.json";
import stationList from "../data/stationList.json";
import ExploreScreen from "../screens/ExploreScreen";
import MyTripsScreen from "../screens/MyTripsScreen";
import HelpScreen from "../screens/HelpScreen";
import AccountScreen from "../screens/AccountScreen";
import SeatAvailabilityScreen from "../screens/SeatAvailabilityScreen";
import PageHero from "./common/PageHero";
import LiveJourneyDashboard from "./features/LiveJourneyDashboard.jsx";
import { useJourneyStore } from "../lib/store.ts";
import AuthModal from "./common/AuthModal.jsx";
import { useAuthStore } from "../lib/store.ts";
import CinematicStory from "./features/CinematicStory.jsx";
import CinematicHeroScenery from "./common/CinematicHero.jsx";
import { RangoliOverlay, DotNetwork, WarmGlowOrbs, WarmGradientWave } from "./common/CulturalPatterns.jsx";
import { searchTrains, getPNRStatus, getLiveTrainStatus } from "../lib/api.ts";
import MagneticButton from "./common/MagneticButton";
import TiltWrapper from "./common/TiltWrapper";
import DateStrip from "./common/DateStrip";
import LiveRailRadarCard from "../components/features/radar/LiveRailRadarCard";
import LiveRailNetworkHub from "../components/features/LiveRailNetworkHub";
import CinematicPlatformPanel from "./common/CinematicPlatformPanel";
import TrainTimetableModal from "./common/TrainTimetableModal";
import StationPickerDropdown from "./common/StationPickerDropdown";
import CustomCursor from "./common/CustomCursor.jsx";
import ScrollProgress from "./common/ScrollProgress.jsx";
import AIAssistFAB from "./common/AIAssistFAB.jsx";
import { getTrainByNumber } from "../lib/trainRouteService";

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

// FONT_IMPORT migrated to styles.css

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

/* ── Cinematic Hero Scenery ── */
function HeroScenery() {
  return <CinematicHeroScenery />;
}

function TopNav({ screen, setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, addJourney } = useAuthStore();
  const isHome = ["search","results","booking","confirmation"].includes(screen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { key: "search", label: "Book Tickets", icon: Home },
    { key: "seat-availability", label: "Seat Availability", icon: CalendarDays },
    { key: "trips", label: "My Trips", icon: Ticket },
    { key: "explore", label: "Explore", icon: Compass },
    { key: "help", label: "Help", icon: LifeBuoy },
  ];

  /* Light theme globally: warm frosted glass when on top of hero, solid cream otherwise. */
  const onLightHero = isHome && !scrolled;
  const navBg = onLightHero
    ? "rgba(255,255,255,0.15)"
    : "rgba(255,249,240,0.98)";

  const textColor = "var(--blue)";
  const textInactive = onLightHero ? "rgba(15,42,69,0.6)" : "rgba(15,42,69,0.6)";
  const hamburgerColor = "var(--blue)";
  const accountBorder = "rgba(15,42,69,0.15)";

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-50 text-center py-2 px-4 f-body text-xs font-medium"
        style={{ background: "var(--marigold)", color: "var(--blue)" }}>
        ✦ Concept redesign &mdash; for real bookings call{" "}
        <span className="f-mono font-semibold">139</span> or visit irctc.co.in
      </div>

      <header className="sticky top-4 z-40 transition-all duration-500 mx-auto max-w-7xl px-4 md:px-8 mt-2 w-full"
        style={{ transform: scrolled ? "translateY(0)" : "translateY(10px)" }}>
        
        <motion.div 
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center justify-between gap-4 px-4 h-[66px] rounded-full shadow-xl transition-all duration-500"
          style={{
            background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}>
          
          {/* Logo */}
          <button onClick={() => setScreen("search")}
            className="flex items-center gap-3 flex-shrink-0 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--marigold)" }}>
              <Train size={20} color="var(--blue)" />
            </motion.div>
            <span className="f-serif font-bold text-xl tracking-tight" style={{ color: "var(--blue)" }}>
              Rail<span style={{ color: "var(--marigold)" }}>Yatra</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = screen === it.key || (it.key === "search" && isHome);
              return (
                <motion.button 
                  key={it.key} 
                  onClick={() => setScreen(it.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative f-body flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold transition-colors duration-200"
                  style={{
                    color: active ? "var(--blue)" : textInactive,
                  }}>
                  {active && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--marigold)", zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={16} /> <span className="relative z-10">{it.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* CTA area */}
          <div className="flex items-center gap-3 relative">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-4 h-11 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-gray-100/70 border border-[rgba(10,22,38,0.1)] bg-white/80 cursor-pointer shadow-sm"
                  style={{ color: textColor }}>
                  <div className="w-6 h-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-bold text-xs max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-2xl border border-[rgba(10,22,38,0.12)] p-3 z-50 divide-y divide-gray-100"
                    >
                      <div className="p-2">
                        <p className="text-xs font-bold text-[#0A1626] truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                          IRCTC ID: {user?.irctcId || "verified.user"}
                        </span>
                      </div>

                      <div className="py-1.5 space-y-1">
                        <button
                          onClick={() => {
                            setScreen("account");
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1626] hover:bg-[#F3EEE0] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <User size={14} className="text-[#0A1626]" /> My Profile &amp; Settings
                        </button>
                        <button
                          onClick={() => {
                            setScreen("trips");
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1626] hover:bg-[#F3EEE0] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Ticket size={14} className="text-[#0A1626]" /> My Bookings &amp; Trips
                        </button>
                      </div>

                      <div className="pt-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            setScreen("search");
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut size={14} /> Log Out from IRCTC
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-gray-100/50 cursor-pointer"
                style={{ color: textColor }}>
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}

            {authModalOpen && (
              <AuthModal 
                onClose={() => setAuthModalOpen(false)} 
                onSuccess={() => setScreen("account")}
              />
            )}
            
            <MagneticButton 
              onClick={() => { setScreen("search"); setMobileMenuOpen(false); }}
              className="h-11 px-6 rounded-full text-sm font-bold shadow-lg text-white"
              style={{ background: "var(--amber)" }}>
              Book Now
            </MagneticButton>
            
            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
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
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden mt-2 rounded-2xl shadow-xl" 
              style={{
                background: isHome ? "rgba(255,249,240,0.98)" : "rgba(9,28,49,0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)"
              }}>
              
              {isAuthenticated && (
                <div className="p-4 border-b border-gray-200/50 bg-white/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0A1626]">Logged in as {user?.name}</p>
                    <p className="text-[10px] text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      setScreen("search");
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200 flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut size={12} /> Log Out
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 p-4">
                {[...items, { key:"account", label:"Account", icon:User }].map((it) => {
                  const Icon = it.icon;
                  const active = screen === it.key || (it.key === "search" && isHome);
                  return (
                    <button key={it.key} onClick={() => { setScreen(it.key); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                      style={{
                        color: active ? "var(--blue)" : isHome ? "var(--blue)" : "rgba(255,255,255,0.8)",
                        background: active ? "var(--marigold)" : isHome ? "rgba(15,42,69,0.04)" : "rgba(255,255,255,0.06)"
                      }}>
                      <Icon size={16} /> {it.label}
                    </button>
                  );
                })}
              </div>

              {!isAuthenticated && (
                <div className="p-3 border-t border-gray-200/50 bg-white/30">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0A1626] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <User size={14} /> Sign In / Register
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
  const [pnrData, setPnrData] = useState(null);
  const [liveData, setLiveData] = useState(null);

  if (!modal) return null;

  const handleFetch = async (type) => {
    setLoading(true);
    try {
      if (type === 'pnr') {
        const data = await getPNRStatus(pnrInput);
        setPnrData(data);
      } else if (type === 'live') {
        const data = await getLiveTrainStatus(trainInput, "1");
        setLiveData(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
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
              onClick={() => handleFetch('pnr')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check PNR"}
            </button>
          </div>

          {pnrData ? (
            <div className="p-4 rounded-xl border bg-green-50/60 border-green-200">
              <div className="flex justify-between items-center pb-2 border-b border-green-200 mb-2">
                <span className="font-mono text-xs font-bold text-green-900">PNR {pnrData.pnr}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">{pnrData.chartStatus}</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between"><span>Train:</span><span className="font-semibold">{pnrData.trainNo} {pnrData.trainName}</span></div>
                <div className="flex justify-between"><span>Route:</span><span className="font-semibold">{pnrData.from} → {pnrData.to}</span></div>
                {pnrData.passengers && pnrData.passengers.map((p, i) => (
                  <div key={i} className="flex justify-between"><span>Passenger {p.no}:</span><span className="font-semibold text-blue-900">{p.currentStatus} (Booking: {p.bookingStatus})</span></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-sm text-gray-500">
              Enter PNR to see details
            </div>
          )}
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
              onClick={() => handleFetch('live')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Track Live"}
            </button>
          </div>

          {liveData ? (
            <div className="p-4 rounded-xl border bg-blue-50/70 border-blue-200">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200 mb-2">
                <span className="font-bold text-xs text-blue-950">{liveData.trainNo} Live Status</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">{liveData.status.toUpperCase()}</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between"><span>Start Date:</span><span className="font-semibold">{liveData.startDate}</span></div>
                <div className="flex justify-between"><span>Current Station:</span><span className="font-semibold">{liveData.currentStation}</span></div>
                <div className="flex justify-between"><span>Delay:</span><span className="font-semibold text-red-600">{liveData.delay}</span></div>
                <div className="flex justify-between"><span>Last Updated:</span><span className="font-semibold">{liveData.lastUpdated}</span></div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-sm text-gray-500">
              Enter Train Number to track status
            </div>
          )}
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
            <button 
              onClick={() => {
                const targetPnr = pnrInput.trim() || "8462097315";
                useAuthStore.getState().cancelJourney(targetPnr);
                onClose();
              }} 
              className="flex-1 h-11 rounded-xl font-bold text-xs md:text-sm text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm"
            >
              Submit Cancellation & Claim Refund
            </button>
            <button onClick={onClose} className="px-4 h-11 rounded-xl border font-semibold text-xs md:text-sm hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Dedicated Interactive Seat Availability Tool in Modal */}
      {modal.type === "seat" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Train number or name (e.g. 16052, 12951)"
              value={trainInput} 
              onChange={e => setTrainInput(e.target.value)}
              className="flex-1 h-12 px-3.5 rounded-xl border bg-gray-50 text-sm font-semibold outline-none"
            />
            <button 
              onClick={() => handleFetch('train')}
              disabled={loading}
              className="h-12 px-5 rounded-xl text-white font-semibold text-sm bg-blue-900 hover:bg-blue-800 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Check Seats"}
            </button>
          </div>

          {trainData ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border bg-emerald-50/70 border-emerald-200">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200 mb-2">
                  <span className="font-bold text-xs text-emerald-950">#{trainData.trainNo} {trainData.trainName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">LIVE SYNCED</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(trainData.classes || {}).map(([cls, info]) => (
                    <div key={cls} className="p-2 rounded-lg bg-white border border-emerald-200 text-center">
                      <span className="font-mono font-bold text-xs block text-[#0A1626]">{cls}</span>
                      <span className="text-[11px] font-extrabold text-emerald-700 block">AVL {info.n || 42}</span>
                      <span className="text-[10px] text-gray-500 font-mono">₹{info.fare}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 text-center text-xs text-gray-500">
              Enter train number (e.g. 16052, 12951, 22436) to see live available seats and fares.
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => { onClose(); if (onNavigate) onNavigate("seat-availability"); }} 
              className="flex-1 h-11 rounded-xl text-white font-bold text-xs bg-[#0A1626] hover:bg-[#132338] cursor-pointer"
            >
              Open Full 6-Day Forecast Page
            </button>
            <button onClick={onClose} className="px-4 h-11 rounded-xl border font-semibold text-xs hover:bg-gray-50 cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* Explore info / Generic notice */}
      {modal.type === "explore_info" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border bg-amber-50 border-amber-200">
            <p className="font-bold text-sm text-amber-950 mb-1">{modal.title || "Official Indian Railways Portal"}</p>
            <p className="text-xs text-amber-900 leading-relaxed">
              Official Indian Railways information and direct services are actively integrated and available in RailYatra Next-Gen.
            </p>
          </div>
          <button onClick={onClose} className="w-full h-11 rounded-xl bg-[#0A1626] text-[#F0A63A] font-bold text-xs cursor-pointer shadow-sm">
            Close Notice
          </button>
        </div>
      )}

      {/* Fare Enquiry & Other Services */}
      {(modal.type === "fare_enquiry" || modal.type === "trains_between_stations" || modal.type === "retiring_rooms" || modal.type === "e_catering") && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border bg-blue-50/50">
            <p className="font-bold text-sm text-blue-950 mb-2">Instant Railway Tool</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {modal.type === "fare_enquiry" ? "Calculate transparent fare breakdowns across AC 1st, 2nd, 3rd Tier, Sleeper and Tatkal." :
               modal.type === "trains_between_stations" ? "Browse all timetable schedules, intermediate halts, and pantry availability across all routes." :
               modal.type === "e_catering" ? "Order hot meals from 500+ FSSAI-approved restaurant partners delivered straight to your seat." :
               "Book AC Deluxe and Standard rooms or dormitory pods at station junctions."}
            </p>
          </div>
          <button onClick={() => { onClose(); if (onNavigate) onNavigate("explore"); }} className="w-full h-12 rounded-xl text-white font-bold text-sm bg-blue-900 hover:bg-blue-800 cursor-pointer">
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
    <footer className="f-body relative bg-[#0A1626] text-[#94A3B8] overflow-hidden">
      {/* Top gold accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#F0A63A] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 md:gap-10">
        {/* Brand col */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#F0A63A] shadow-md">
              <Train size={20} className="text-[#0A1626]" />
            </div>
            <span className="f-serif font-bold text-white text-2xl tracking-tight">Rail<span className="text-[#F0A63A]">Yatra</span></span>
          </div>
          <p className="text-xs leading-relaxed mb-6 max-w-[240px] text-[#94A3B8]">Indian Railway Catering &amp; Tourism Corporation — Mini Ratna (Category-I) PSU, Ministry of Railways, Govt. of India.</p>
          <div className="flex items-center gap-2.5 mb-6">
            {[["𝕏","Twitter"],["f","Facebook"],["▶","YouTube"]].map(([sym, name]) => (
              <a key={name} aria-label={name} className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-white/10 border border-white/15 hover:bg-[#F0A63A] hover:text-[#0A1626] transition-all cursor-pointer shadow-sm">
                {sym}
              </a>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["iOS App", "Android"].map(label => (
              <span key={label} className="text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all font-semibold">
                📱 {label}
              </span>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 font-mono">{c.title}</p>
            <ul className="space-y-3 text-xs">
              {c.items.map((item) => (
                <li key={item} onClick={() => onAction && onAction(item)}
                  className="text-[#94A3B8] hover:text-[#F0A63A] cursor-pointer transition-colors duration-150 flex items-start gap-1.5 leading-relaxed font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[11px] text-[#64748B]">
          <div className="space-y-1">
            <span className="text-[#94A3B8] font-medium">© IRCTC Ltd — redesign concept · not the live site</span>
            <span className="block font-mono text-[#64748B]">CIN: L74899DL1999GOI101707</span>
          </div>
          <div className="flex gap-5 flex-wrap">
            {["Privacy Policy", "Terms of Service", "Refund Policy", "Security"].map((t) => (
              <span key={t} onClick={() => onAction && onAction(t)} className="hover:text-[#F0A63A] cursor-pointer transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[10px] mt-4 opacity-40 leading-relaxed text-[#94A3B8]">A UX redesign concept — not affiliated with or endorsed by Indian Railways or IRCTC. For real bookings visit irctc.co.in or call 139.</p>
      </div>
    </footer>
  );
}

/* ---------------- SEARCH SCREEN ---------------- */

function SearchScreen({ onSearch, onFooterAction }) {
  const { from, setFrom, to, setTo, date, setDate, cls, setCls, quota, setQuota, passengers, setPassengers } = useBookingStore();
  const { mode } = useJourneyStore();
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
    <div  className="min-h-screen f-body relative">

      {/* ── HERO SECTION (Warm Light Theme) ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end"
        style={{ background: "linear-gradient(160deg, #FFF9F0 0%, #FEF3E2 40%, #F7F4EC 100%)" }}>

        {mode === "journey" && <LiveJourneyDashboard />}
        <HeroScenery />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 md:px-8 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Badge */}
          <div className="anim-fade-up" style={{ animationDelay:"0.05s" }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold f-mono tracking-wide shadow-lg"
              style={{ borderColor:"rgba(255,255,255,0.3)", color:"white", background:"rgba(0,0,0,0.3)", backdropFilter:"blur(8px)" }}>
              <span className="h-1.5 w-1.5 rounded-full anim-glow-pulse" style={{ background:"var(--marigold)" }} />
              India's Railways · 13,000+ trains · 7,000+ stations
            </span>
          </div>

          {/* Headline */}
          <h1 className="f-serif font-bold mt-5 leading-[1.08] anim-fade-up-md drop-shadow-xl"
            style={{ fontSize:"clamp(2.2rem,5.5vw,4.2rem)", animationDelay:"0.12s", color:"white" }}>
            Journey across India,<br />
            <em className="not-italic" style={{ color:"var(--marigold)" }}>without the guesswork.</em>
          </h1>

          <p className="f-body mt-4 max-w-lg anim-fade-up drop-shadow-md" style={{ color:"rgba(255,255,255,0.85)", fontSize:"1.05rem", animationDelay:"0.22s", lineHeight:1.65 }}>
            Honest seat availability. Transparent fares. A booking flow that confirms or refunds clearly — no silent debits, no dead ends.
          </p>

          {/* Stats row — warm glassmorphism */}
          <div className="flex flex-wrap gap-3 mt-6 anim-fade-up" style={{ animationDelay:"0.3s" }}>
            {[
              { icon: ShieldCheck, label:"Confirmed daily", value:"1.2M+ tickets", color:"var(--green)" },
              { icon: Clock, label:"Avg booking time", value:"Under 3 min", color:"var(--marigold)" },
              { icon: BadgeCheck, label:"Payment success", value:"99.4% rate", color:"#38BDF8" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl border border-white/20" style={{ background:"rgba(0,0,0,0.4)", backdropFilter:"blur(12px)" }}>
                <Icon size={16} style={{ color }} />
                <div>
                  <p className="f-mono text-[11px] uppercase tracking-wider font-semibold" style={{ color:"rgba(255,255,255,0.6)" }}>{label}</p>
                  <p className="f-body text-sm font-semibold leading-tight text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Ticket Card — Exactly matching prototype design */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4 md:px-8 pb-0 -mb-16 md:-mb-20 anim-fade-up" style={{ animationDelay:"0.38s" }}>
          <TiltWrapper className="relative rounded-2xl md:rounded-[22px] bg-[#F3EEE0] text-[#0A1626] p-6 md:p-8 shadow-2xl border border-[rgba(10,22,38,0.1)]">
            
            {/* Punch Hole Notches on Left and Right */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#0A1626] -translate-y-1/2 z-20 hidden md:block" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#0A1626] -translate-y-1/2 z-20 hidden md:block" />

            {/* From, Swap, To Row */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_44px_1fr] gap-4 items-end">
              {/* From */}
              <StationPickerDropdown
                label="FROM"
                value={from}
                onChange={setFrom}
                placeholder="Select departure station..."
              />

              {/* Swap Button */}
              <button
                type="button"
                onClick={() => { setFrom(to); setTo(from); }}
                aria-label="Swap stations"
                className="w-11 h-11 rounded-full border border-[rgba(10,22,38,0.14)] bg-white hover:bg-[#EAE2C9] hover:border-amber-500 flex items-center justify-center text-lg text-[#0A1626] transition-all hover:rotate-180 hover:scale-105 shadow-sm self-center md:self-end md:mb-1 mx-auto cursor-pointer"
              >
                ⇄
              </button>

              {/* To */}
              <StationPickerDropdown
                label="TO"
                value={to}
                onChange={setTo}
                placeholder="Select destination station..."
              />
            </div>

            {/* Date Strip */}
            <div className="mt-5">
              <DateStrip 
                dates={dateStrip} 
                activeDate={date} 
                onSelect={setDate} 
                availabilityHint={availabilityHint} 
                dayNames={dayNames} 
              />
            </div>

            {/* Metadata Row (Class, Quota, Adults, Children) */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Class */}
              <div>
                <label className="block text-[11px] font-mono tracking-[0.14em] uppercase text-[#6b6250] font-bold mb-2">CLASS</label>
                <div className="relative flex items-center bg-white border border-[rgba(10,22,38,0.14)] hover:border-amber-500 rounded-xl px-3.5 py-3 shadow-sm transition-all">
                  <select 
                    value={cls} 
                    onChange={(e) => setCls(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#0A1626] focus:outline-none cursor-pointer"
                  >
                    {["All classes", "Sleeper (SL)", "AC 3-Tier (3A)", "AC 3-Tier Economy (3E)", "AC 2-Tier (2A)", "AC First (1A)", "Chair Car (CC)", "Executive Chair (EC)", "Second Sitting (2S)"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quota */}
              <div>
                <label className="block text-[11px] font-mono tracking-[0.14em] uppercase text-[#6b6250] font-bold mb-2">QUOTA</label>
                <div className="relative flex items-center bg-white border border-[rgba(10,22,38,0.14)] hover:border-amber-500 rounded-xl px-3.5 py-3 shadow-sm transition-all">
                  <select 
                    value={quota} 
                    onChange={(e) => setQuota(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#0A1626] focus:outline-none cursor-pointer"
                  >
                    {["General", "Tatkal", "Premium Tatkal", "Ladies", "Senior Citizen", "Divyangjan", "Defence", "Foreign Tourist"].map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Adults */}
              <div>
                <label className="block text-[11px] font-mono tracking-[0.14em] uppercase text-[#6b6250] font-bold mb-2">ADULTS</label>
                <div className="flex items-center justify-between bg-white border border-[rgba(10,22,38,0.14)] hover:border-amber-500 rounded-xl px-3.5 py-3 shadow-sm transition-all">
                  <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="text-[#6b6250] hover:text-[#0A1626] font-bold px-2 text-lg">−</button>
                  <span className="text-base font-bold text-[#0A1626]" style={{ fontFamily: "'Oswald', sans-serif" }}>{passengers.adults}</span>
                  <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.min(6, p.adults + 1) }))} className="text-[#6b6250] hover:text-[#0A1626] font-bold px-2 text-lg">+</button>
                </div>
              </div>

              {/* Children */}
              <div>
                <label className="block text-[11px] font-mono tracking-[0.14em] uppercase text-[#6b6250] font-bold mb-2">CHILDREN</label>
                <div className="flex items-center justify-between bg-white border border-[rgba(10,22,38,0.14)] hover:border-amber-500 rounded-xl px-3.5 py-3 shadow-sm transition-all">
                  <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="text-[#6b6250] hover:text-[#0A1626] font-bold px-2 text-lg">−</button>
                  <span className="text-base font-bold text-[#0A1626]" style={{ fontFamily: "'Oswald', sans-serif" }}>{passengers.children}</span>
                  <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.min(4, p.children + 1) }))} className="text-[#6b6250] hover:text-[#0A1626] font-bold px-2 text-lg">+</button>
                </div>
              </div>
            </div>

            {/* Big CTA Button */}
            <motion.button 
              whileHover={{ scale: 1.005, backgroundColor: "#000000" }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSearch({ from, to, date, cls, quota, passengers })}
              className="mt-6 w-full h-14 rounded-xl font-bold text-base tracking-[0.08em] uppercase flex items-center justify-center gap-3 shadow-xl transition-all"
              style={{ background: "#0A1626", color: "#F3EEE0", fontFamily: "'Oswald', sans-serif" }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] animate-pulse shadow-[0_0_8px_#22c55e]" />
              SEARCH TRAINS
            </motion.button>

          </TiltWrapper>
        </div>
      </section>

      {/* Spacer for elevated search card */}
      <div className="pt-24 md:pt-28" style={{ background:"var(--paper)" }} />

      {/* Flagship Indian Railways Corridor Showcase & Smart Hub */}
      <LiveRailNetworkHub onSelectRoute={onSearch} />

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
                style={{ background: "transparent", borderColor:"var(--line)", boxShadow:"var(--shadow-sm)" }}>
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

      <CinematicPlatformPanel />
      <QuickTools />
      <StatsBand />
      <PopularRoutes onSearch={onSearch} />
      <DestinationDiscovery />
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
      <div className="mt-1.5 h-12 rounded-xl border flex items-center gap-2 px-3 glass-card transition-colors" style={{ borderColor: open ? "var(--blue)" : "var(--line)" }}>
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
        <div className="absolute top-[100%] left-0 right-0 mt-2 glass-card border rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-gray-100" style={{ borderColor: "var(--line)" }}>
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
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold glass-card border text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 transition-colors shadow-2xs"
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
    <div className="rounded-xl border glass-card p-4 transition-all duration-200 hover:-translate-y-1" style={{ borderColor: "var(--line)" }}
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

function ResultsScreen({ searchParams, onBook, onBack }) {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("Departure");
  const [expanded, setExpanded] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [trainTypes, setTrainTypes] = useState([]);
  const [classesF, setClassesF] = useState([]);
  const [selectedTimetableTrain, setSelectedTimetableTrain] = useState(null);

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const from = searchParams?.from || "NDLS";
    const to = searchParams?.to || "BCT";
    const date = searchParams?.date || "25-Aug-2026";
    
    searchTrains(from, to, date).then(data => {
      if(mounted) {
        setTrains(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...trains];
    if (trainTypes.length) list = list.filter((t) => trainTypes.includes(t.type));
    if (classesF.length) list = list.filter((t) => Object.keys(t.classes || {}).some((c) => classesF.includes(c)));
    if (sort === "Departure") list.sort((a, b) => (a.dep || "").localeCompare(b.dep || ""));
    if (sort === "Duration") list.sort((a, b) => (a.dur || "").localeCompare(b.dur || ""));
    if (sort === "Price") list.sort((a, b) => {
      const minA = a.classes ? Math.min(...Object.values(a.classes).map(c => c.fare || 500)) : 500;
      const minB = b.classes ? Math.min(...Object.values(b.classes).map(c => c.fare || 500)) : 500;
      return minA - minB;
    });
    return list;
  }, [trains, sort, trainTypes, classesF]);

  const fromDisplay = searchParams?.from || "NDLS";
  const toDisplay = searchParams?.to || "BCT";
  const dateDisplay = searchParams?.date || "25-Aug-2026";
  const quotaDisplay = searchParams?.quota || "General";

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2.5 font-mono">Train Type</p>
        <div className="space-y-2">
          {["Rajdhani", "Shatabdi", "Duronto", "Superfast", "Express", "Mail/Exp"].map((t) => (
            <label key={t} className="flex items-center gap-2 text-xs font-bold text-[#0A1626] cursor-pointer hover:text-blue-700">
              <input type="checkbox" checked={trainTypes.includes(t)} onChange={() => toggle(trainTypes, setTrainTypes, t)} className="h-4 w-4 accent-[#0A1626]" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2.5 font-mono">Class</p>
        <div className="flex flex-wrap gap-1.5">
          {["SL", "3A", "2A", "1A", "CC", "EC"].map((c) => (
            <button key={c} onClick={() => toggle(classesF, setClassesF, c)}
              className={`px-3 h-8 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer shadow-xs ${
                classesF.includes(c)
                  ? "bg-[#0A1626] text-[#F0A63A] border-[#0A1626]"
                  : "bg-white text-[#0A1626] border-gray-300 hover:border-gray-500"
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2.5 font-mono">Departure Time</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Early morning", sub: "00:00–06:00" },
            { label: "Morning", sub: "06:00–12:00" },
            { label: "Afternoon", sub: "12:00–18:00" },
            { label: "Night", sub: "18:00–00:00" },
          ].map((slot) => (
            <button key={slot.label} className="px-2.5 py-2 rounded-xl border border-gray-200 bg-[#FAF8F2] hover:border-[#0A1626] text-left text-xs cursor-pointer transition-all">
              <span className="font-bold text-[#0A1626] block text-[11px]">{slot.label}</span>
              <span className="text-[10px] text-gray-500 font-mono">{slot.sub}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-2 font-mono">Amenities</p>
        <label className="flex items-center gap-2 text-xs font-bold text-[#0A1626] cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[#0A1626]" />
          Pantry / Food on Board
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen f-body pb-16">
      {/* sticky summary bar */}
      <div className="sticky top-16 z-30 border-b bg-[#FAF8F2]/95 backdrop-blur-md border-[rgba(10,22,38,0.1)]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-xs md:text-sm font-bold cursor-pointer text-[#0A1626] hover:text-blue-700">
            <ChevronRight size={16} className="rotate-180" /> Edit Search
          </button>
          <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-[#0A1626]">
            <span>{fromDisplay}</span>
            <ArrowLeftRight size={14} className="text-[#F0A63A]" />
            <span>{toDisplay}</span>
            <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
              {dateDisplay} · {quotaDisplay}
            </span>
          </div>
          <button onClick={() => setFiltersOpen(true)} className="md:hidden h-9 px-3 rounded-xl border border-gray-300 bg-white flex items-center gap-1.5 text-xs font-bold text-[#0A1626]">
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* desktop left rail */}
        <aside className="hidden md:block">
          <div className="rounded-3xl border border-[rgba(10,22,38,0.12)] bg-white p-5 sticky top-32 shadow-sm">
            <h3 className="font-serif font-bold text-sm text-[#0A1626] mb-4">Refine Search</h3>
            {FilterPanel}
          </div>
        </aside>

        <main>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs md:text-sm font-bold text-[#0A1626]">{filtered.length} Train{filtered.length !== 1 ? 's' : ''} Found</p>
            <div className="flex items-center gap-1">
              {["Departure", "Duration", "Price"].map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={`text-xs px-3 h-8 rounded-full border font-bold transition-all cursor-pointer ${
                    sort === s
                      ? "bg-[#0A1626] text-[#F0A63A] border-[#0A1626]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-xl glass-card border" style={{ borderColor: "var(--line)" }}>
                <Loader2 size={32} className="animate-spin mb-4" style={{ color: "var(--blue)" }} />
                <p className="f-body text-sm font-medium" style={{ color: "var(--steel)" }}>Fetching real-time train availability...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-xl glass-card border" style={{ borderColor: "var(--line)" }}>
                <p className="f-body text-sm font-medium" style={{ color: "var(--steel)" }}>No trains found matching your criteria.</p>
              </div>
            ) : filtered.map((t, ti) => (
              <FadeIn key={t.no} delay={ti * 0.06}>
              <div className="rounded-2xl border glass-bento overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" style={{ borderColor: "rgba(15,42,69,0.1)" }}>
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="f-mono text-sm font-bold px-2.5 py-1 rounded-lg shadow-sm tracking-wide" style={{ background: "var(--premium-blue)", color: "var(--marigold)" }}>#{t.no}</span>
                        <p className="f-display font-bold text-[17px] tracking-tight" style={{ color: "var(--premium-blue)" }}>{t.name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="f-body text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider" style={{ color: "var(--steel)", borderColor: "var(--line)" }}>{t.type}</span>
                        {t.pantry && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 shadow-sm">🍽 Pantry</span>}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTimetableTrain(t.rawTrain || getTrainByNumber(t.no));
                          }}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#F3EEE0] hover:bg-[#EAE2C9] text-[#0A1626] font-bold border border-[rgba(10,22,38,0.12)] flex items-center gap-1 transition-all cursor-pointer shadow-xs hover:border-[#F0A63A]"
                        >
                          <Activity size={12} className="text-[#F0A63A]" />
                          <span>View Route &amp; Halts ({t.schedule?.length || t.stops + 2} stops)</span>
                        </button>
                      </div>
                      {t.days && (
                        <div className="flex items-center gap-1 mt-3">
                          {["M","T","W","T","F","S","S"].map((d, di) => (
                            <span key={di} className="h-6 w-6 rounded-md text-[10px] font-bold flex items-center justify-center shadow-sm"
                              style={{
                                background: t.days[di] !== "_" ? "var(--blue)" : "white",
                                color: t.days[di] !== "_" ? "white" : "var(--steel)",
                                opacity: t.days[di] !== "_" ? 1 : 0.5,
                                border: t.days[di] !== "_" ? "none" : "1px solid var(--line)"
                              }}>{d}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center md:justify-end gap-5 f-mono text-sm font-bold text-center flex-1 mt-4 md:mt-0" style={{ color: "var(--premium-blue)" }}>
                      <div className="text-right">
                        <p className="text-2xl">{t.dep}</p>
                        <p className="text-[11px] font-bold mt-1" style={{ color: "var(--steel)" }}>{t.from}</p>
                      </div>
                      
                      <div className="flex flex-col items-center px-2 min-w-[120px] relative">
                        <span className="text-[10px] f-body font-bold px-2.5 py-0.5 rounded-full border bg-white shadow-sm mb-2" style={{ color: "var(--steel)", borderColor: "rgba(15,42,69,0.1)" }}>{t.dur}</span>
                        <div className="w-full flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full border-[2.5px]" style={{ borderColor: "var(--blue)", background: "white" }} />
                          <div className="flex-1 h-[2px] border-t-2 border-dashed mx-1" style={{ borderColor: "var(--steel)", opacity: 0.5 }} />
                          <div className="h-2.5 w-2.5 rounded-full border-[2.5px]" style={{ borderColor: "var(--marigold)", background: "white" }} />
                        </div>
                        <span className="text-[10px] mt-2 f-mono font-bold" style={{ color: "var(--steel)" }}>{t.distance} km · {t.stops === 0 ? "Non-stop" : `${t.stops} stops`}</span>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-2xl">{t.arr}</p>
                        <p className="text-[11px] font-bold mt-1" style={{ color: "var(--steel)" }}>{t.to}</p>
                      </div>
                    </div>
                  </div>

                  {/* Class tabs styled like tickets */}
                  <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-dashed" style={{ borderColor: "rgba(15,42,69,0.15)" }}>
                    {Object.entries(t.classes).map(([c, info]) => {
                      const s = STATUS_STYLE[info.status];
                      const isOpen = expanded === `${t.no}-${c}`;
                      return (
                        <button key={c} onClick={() => setExpanded(isOpen ? null : `${t.no}-${c}`)}
                          className="px-4 h-10 rounded-xl text-xs font-bold f-mono flex items-center gap-2 border shadow-sm transition-all hover:-translate-y-0.5"
                          style={{ 
                            background: isOpen ? s.fg : s.bg, 
                            color: isOpen ? "white" : s.fg, 
                            borderColor: isOpen ? s.fg : "rgba(15,42,69,0.15)" 
                          }}>
                          {!isOpen && info.status === "AVAILABLE" && <span className="h-2 w-2 rounded-full anim-pulse-dot shadow-sm" style={{ background: s.fg }} />}
                          {c} <span className="opacity-40">|</span> {info.status === "WAITLIST" ? `WL ${info.wl}` : s.label}
                          <ChevronDown size={14} className={`transition-transform ml-1 ${isOpen ? "rotate-180 opacity-100" : "opacity-60"}`} />
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
                    <div key={c} className="px-5 py-5 anim-fade-down relative overflow-hidden" style={{ background: "var(--glass-bg)", borderTop: "2px dashed rgba(15,42,69,0.1)" }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div>
                          <p className="f-body text-[15px] font-bold" style={{ color: "var(--premium-blue)" }}>
                            {c} Class <span className="mx-2 opacity-30">|</span> <span style={{ color: s.fg }}>{info.status === "WAITLIST" ? `Waitlist #${info.wl}` : `${info.n} seats ${s.label.toLowerCase()}`}</span>
                          </p>
                          <p className="f-body text-[11px] mt-2 font-semibold flex flex-wrap items-center gap-2" style={{ color: "var(--steel)" }}>
                            <span className="h-6 px-2.5 rounded-md bg-white border flex items-center justify-center shadow-sm" style={{ borderColor: "rgba(15,42,69,0.1)" }}>Boarding: {t.from}</span>
                            Base fare shown, convenience fee added at payment
                          </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 pl-5 rounded-2xl border shadow-md" style={{ borderColor: "rgba(15,42,69,0.15)" }}>
                          <p className="f-mono text-2xl font-bold tracking-tight" style={{ color: "var(--premium-blue)" }}>₹{info.fare.toLocaleString("en-IN")}</p>
                          <button onClick={() => onBook({ train: t, cls: c, fare: info.fare })}
                            className="h-12 px-7 rounded-xl f-body text-[15px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                            style={{ background: "var(--marigold)", color: "var(--premium-blue)" }}>
                            Book Now
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
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl glass-card p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="f-display font-semibold">Filters</p>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="mt-6 w-full h-12 rounded-xl font-semibold shadow-sm" style={{ background: "var(--marigold)", color: "var(--blue)" }}>
              Show {filtered.length} trains
            </button>
          </div>
        </div>
      )}

      {/* Interactive Train Timetable & Route Modal */}
      <TrainTimetableModal
        train={selectedTimetableTrain}
        isOpen={!!selectedTimetableTrain}
        onClose={() => setSelectedTimetableTrain(null)}
        selectedFromCode={searchParams?.from}
        selectedToCode={searchParams?.to}
      />
    </div>
  );
}

/* ---------------- BOOKING / PAYMENT SCREEN ---------------- */

const STEPS = ["Passengers", "Payment", "Confirmation"];

function BookingScreen({ selection, onDone, onBack, onConfirmed }) {
  const safeSelection = useMemo(() => {
    if (!selection) {
      return {
        train: { no: "12951", name: "Mumbai Tejas Rajdhani", from: "NDLS", to: "MMCT", dep: "16:55", arr: "08:35", type: "Rajdhani" },
        cls: "3A",
        fare: 1680
      };
    }
    const trainObj = selection.train || {
      name: selection.trainName || "Superfast Express",
      no: selection.trainNo || "12951",
      dep: selection.dep || "16:55",
      arr: selection.arr || "08:35",
      from: selection.from || "NDLS",
      to: selection.to || "MMCT",
      type: selection.type || "Express"
    };
    return {
      ...selection,
      train: trainObj,
      cls: selection.cls || "3A",
      fare: selection.fare || 1680
    };
  }, [selection]);

  const [step, setStep] = useState(0);
  const [payState, setPayState] = useState("idle"); // idle | otp | processing | verifying | success | failed
  const [selectedMethod, setSelectedMethod] = useState("upi"); // upi | card | netbanking | wallet
  const [upiId, setUpiId] = useState("passenger@okhdfcbank");
  const [upiTab, setUpiTab] = useState("id"); // id | qr
  const [cardNumber, setCardNumber] = useState("4532 8921 7392 4810");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("834");
  const [cardName, setCardName] = useState("RAHUL SHARMA");
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [walletPin, setWalletPin] = useState("4829");
  const [ticketDownloaded, setTicketDownloaded] = useState(false);
  const [ticketShared, setTicketShared] = useState(false);
  const [passengers, setPassengers] = useState([{ name: "Rahul Sharma", age: "28", gender: "M", berth: "LB" }]);

  const fare = safeSelection.fare;
  const convenience = 35;
  const total = fare * passengers.length + convenience;

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: "", age: "", gender: "M", berth: "NP" }]);
    }
  };

  const updatePassenger = (i, field, val) => {
    const next = [...passengers];
    next[i][field] = val;
    setPassengers(next);
  };

  const runPayment = (outcome = "success") => {
    setPayState("processing");
    setTimeout(() => {
      if (outcome === "verifying") {
        setPayState("verifying");
        setTimeout(() => { 
          const confirmedBooking = buildBooking(safeSelection, passengers);
          try { useAuthStore.getState().addJourney(confirmedBooking); } catch(e) {}
          setPayState("success"); 
          setStep(2); 
          if (typeof onConfirmed === "function") {
            try { onConfirmed(confirmedBooking); } catch(e) {}
          }
        }, 2200);
      } else if (outcome === "failed") {
        setPayState("failed");
      } else {
        const confirmedBooking = buildBooking(safeSelection, passengers);
        try { useAuthStore.getState().addJourney(confirmedBooking); } catch(e) {}
        setPayState("success");
        setStep(2);
        if (typeof onConfirmed === "function") {
          try { onConfirmed(confirmedBooking); } catch(e) {}
        }
      }
    }, 1200);
  };

  const BANKS = [
    { id: "sbi", name: "State Bank of India", icon: "🏛️" },
    { id: "hdfc", name: "HDFC Bank", icon: "🏦" },
    { id: "icici", name: "ICICI Bank", icon: "🏢" },
    { id: "axis", name: "Axis Bank", icon: "🏧" },
    { id: "kotak", name: "Kotak Mahindra", icon: "💳" },
    { id: "pnb", name: "Punjab National Bank", icon: "🏤" },
  ];

  return (
    <div className="min-h-screen f-body pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-5 text-[#0A1626] hover:text-blue-700 cursor-pointer">
          <ChevronRight size={16} className="rotate-180" /> Back to Search Results
        </button>

        {/* stepper — track line motif */}
        <div className="flex items-center mb-8 bg-white p-4 rounded-2xl border border-[rgba(10,22,38,0.08)] shadow-xs">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-sm"
                  style={{
                    background: i <= step ? "#0A1626" : "white",
                    color: i <= step ? "#F0A63A" : "#6B7280",
                    border: `2px solid ${i <= step ? "#0A1626" : "#E5E7EB"}`,
                    transform: i === step ? "scale(1.1)" : "scale(1)",
                  }}>
                  {i < step ? <Check size={16} className="text-[#F0A63A]" /> : i + 1}
                </div>
                <span className="text-xs font-bold" style={{ color: i <= step ? "#0A1626" : "#9CA3AF" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mb-4 transition-colors duration-300" style={{ background: i < step ? "#0A1626" : "#E5E7EB" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* journey summary */}
        <div className="rounded-3xl bg-[#0A1626] text-white p-5 md:p-6 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4 border border-[rgba(255,255,255,0.1)]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0A63A] font-mono block mb-1">Journey Summary</span>
            <h2 className="font-serif font-bold text-lg md:text-xl text-white">{safeSelection.train.name} · #{safeSelection.train.no}</h2>
            <p className="font-mono text-xs text-blue-200 mt-1">
              {safeSelection.train.dep} {safeSelection.train.from} → {safeSelection.train.arr} {safeSelection.train.to} · Class: <span className="font-bold text-[#F0A63A]">{safeSelection.cls}</span> · Quota: General
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-blue-200 uppercase font-mono block">Total Amount</span>
            <p className="font-mono font-black text-2xl text-[#F0A63A]">₹{total.toLocaleString("en-IN")}</p>
            <span className="text-[10px] text-gray-400 block">{passengers.length} Passenger{passengers.length > 1 ? "s" : ""}</span>
          </div>
        </div>

        {step === 0 && (
          <div className="space-y-5">
            <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0A1626]">Passenger Details</h3>
                  <p className="text-xs text-[#6B7280]">Enter passenger details as printed on government ID card.</p>
                </div>
                <span className="text-xs font-bold font-mono px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full">
                  {passengers.length} of 6 Seats
                </span>
              </div>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-[rgba(10,22,38,0.08)] p-4.5 bg-[#FAF8F2]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-[#0A1626] font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F0A63A]" /> Passenger {i + 1}
                      </p>
                      {passengers.length > 1 && (
                        <button 
                          onClick={() => setPassengers(passengers.filter((_, idx) => idx !== i))}
                          className="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_1fr] gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">Full Name</label>
                        <input 
                          value={p.name} 
                          onChange={(e) => updatePassenger(i, "name", e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-semibold text-[#0A1626] focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] outline-none shadow-xs" 
                          placeholder="e.g. Rahul Sharma" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">Age</label>
                        <input 
                          value={p.age} 
                          onChange={(e) => updatePassenger(i, "age", e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-semibold text-[#0A1626] focus:border-[#0A1626] focus:ring-1 focus:ring-[#F0A63A] outline-none shadow-xs text-center" 
                          placeholder="28" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">Gender</label>
                        <select 
                          value={p.gender} 
                          onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-semibold text-[#0A1626] focus:border-[#0A1626] outline-none shadow-xs cursor-pointer"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">Berth Preference</label>
                        <select 
                          value={p.berth || "NP"} 
                          onChange={(e) => updatePassenger(i, "berth", e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-semibold text-[#0A1626] focus:border-[#0A1626] outline-none shadow-xs cursor-pointer"
                        >
                          <option value="NP">No Preference</option>
                          <option value="LB">Lower Berth</option>
                          <option value="MB">Middle Berth</option>
                          <option value="UB">Upper Berth</option>
                          <option value="SL">Side Lower</option>
                          <option value="SU">Side Upper</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={addPassenger} 
                className="mt-4 text-xs font-bold text-[#0A1626] hover:text-blue-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                + Add Another Passenger (Max 6)
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#0A1626] mb-1">Contact Details</h3>
              <p className="text-xs text-[#6B7280] mb-4">E-ticket and PNR SMS updates will be sent here.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">Mobile Number</label>
                  <div className="h-11 rounded-xl border border-gray-300 bg-white flex items-center gap-2 px-3 focus-within:border-[#0A1626] focus-within:ring-1 focus-within:ring-[#F0A63A] shadow-xs">
                    <Phone size={15} className="text-gray-400" />
                    <input className="flex-1 outline-none text-xs md:text-sm text-[#0A1626] font-semibold bg-transparent" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">Email Address</label>
                  <div className="h-11 rounded-xl border border-gray-300 bg-white flex items-center gap-2 px-3 focus-within:border-[#0A1626] focus-within:ring-1 focus-within:ring-[#F0A63A] shadow-xs">
                    <Mail size={15} className="text-gray-400" />
                    <input className="flex-1 outline-none text-xs md:text-sm text-[#0A1626] font-semibold bg-transparent" placeholder="you@example.com" defaultValue="passenger@irctc.in" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#0A1626] mb-3">Preferences & Add-ons</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 bg-[#FAF8F2] cursor-pointer hover:border-gray-300 transition-colors">
                  <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0A1626]" defaultChecked />
                  <div>
                    <p className="text-xs md:text-sm font-bold text-[#0A1626]">Travel insurance — ₹0.45 per passenger</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">IRCTC iPay travel insurance covers accidental death (₹10 lakh) and hospitalisation.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 bg-[#FAF8F2] cursor-pointer hover:border-gray-300 transition-colors">
                  <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0A1626]" />
                  <div>
                    <p className="text-xs md:text-sm font-bold text-[#0A1626]">Opt-in for IRCTC e-Catering meal</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Pre-order hot hygienic meals delivered directly to your seat at en-route stations.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 bg-[#FAF8F2] cursor-pointer hover:border-gray-300 transition-colors">
                  <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0A1626]" defaultChecked />
                  <div>
                    <p className="text-xs md:text-sm font-bold text-[#0A1626]">Consider for auto-upgrade</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">If a higher class has vacancies close to chart preparation, auto-upgrade at ₹0 charge.</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={() => setStep(1)} 
              className="w-full h-13 rounded-2xl font-bold text-sm md:text-base bg-[#0A1626] hover:bg-black text-[#F0A63A] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Continue to Payment (₹{total.toLocaleString("en-IN")})</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {/* Fare Breakdown Card */}
            <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#0A1626] mb-3">Fare Breakdown</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span><span className="font-mono font-bold text-[#0A1626]">₹{(fare * passengers.length).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">Reservation Charge</span><span className="font-mono font-bold text-[#0A1626]">₹60</span></div>
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">Superfast Surcharge</span><span className="font-mono font-bold text-[#0A1626]">₹45</span></div>
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">GST (5%)</span><span className="font-mono font-bold text-[#0A1626]">₹{Math.round(fare * passengers.length * 0.05)}</span></div>
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">Convenience Fee (incl. GST)</span><span className="font-mono font-bold text-[#0A1626]">₹{convenience}</span></div>
                <div className="flex justify-between text-xs md:text-sm"><span className="text-[#6B7280]">Travel Insurance</span><span className="font-mono font-bold text-[#0A1626]">₹{(0.45 * passengers.length).toFixed(2)}</span></div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-base">
                  <span className="font-bold text-[#0A1626]">Total Payable</span>
                  <span className="font-mono font-black text-2xl text-[#0A1626]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Interactive Payment Methods Card */}
            <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#0A1626] mb-1">Select Payment Method</h3>
              <p className="text-xs text-[#6B7280] mb-5">All transactions are 256-bit encrypted with instant IRCTC PRS confirmation.</p>

              {payState === "idle" && (
                <div className="space-y-4">
                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "upi", icon: "⚡", label: "UPI Apps / QR", sub: "GPay, PhonePe" },
                      { id: "card", icon: "💳", label: "Cards", sub: "Debit / Credit" },
                      { id: "netbanking", icon: "🏦", label: "Net Banking", sub: "50+ Banks" },
                      { id: "wallet", icon: "👛", label: "IRCTC Wallet", sub: "1-Click Pay" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedMethod(pm.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[84px] ${
                          selectedMethod === pm.id
                            ? "bg-[#0A1626] text-white border-[#0A1626] shadow-md ring-2 ring-[#F0A63A]/50"
                            : "bg-[#FAF8F2] text-[#0A1626] border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-xl">{pm.icon}</span>
                        <div>
                          <p className="text-xs font-bold leading-tight">{pm.label}</p>
                          <p className={`text-[10px] ${selectedMethod === pm.id ? "text-amber-300" : "text-gray-500"}`}>{pm.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Interactive Panel Based on Selected Method */}
                  <div className="mt-4 p-5 rounded-2xl bg-[#FAF8F2] border border-gray-200">
                    {/* UPI Option */}
                    {selectedMethod === "upi" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 max-w-xs">
                          <button
                            onClick={() => setUpiTab("id")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              upiTab === "id" ? "bg-[#0A1626] text-white" : "text-gray-600 hover:text-black"
                            }`}
                          >
                            Enter UPI ID
                          </button>
                          <button
                            onClick={() => setUpiTab("qr")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              upiTab === "qr" ? "bg-[#0A1626] text-white" : "text-gray-600 hover:text-black"
                            }`}
                          >
                            Scan QR Code
                          </button>
                        </div>

                        {upiTab === "id" ? (
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">
                              Virtual Payment Address (VPA)
                            </label>
                            <div className="flex gap-2">
                              <input
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="h-11 flex-1 rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-semibold text-[#0A1626] outline-none focus:border-[#0A1626] shadow-xs font-mono"
                                placeholder="mobilenumber@upi"
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {["@okhdfcbank", "@okaxis", "@ybl", "@paytm", "@ibl"].map((handle) => (
                                <button
                                  key={handle}
                                  onClick={() => setUpiId((prev) => (prev.split("@")[0] || "user") + handle)}
                                  className="text-[10px] font-bold px-2 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:border-[#0A1626] cursor-pointer"
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 text-center">
                            <div className="w-36 h-36 border-4 border-[#0A1626] rounded-2xl p-2 flex items-center justify-center bg-white shadow-inner mb-2">
                              <div className="grid grid-cols-5 gap-1 w-full h-full opacity-80">
                                {Array.from({ length: 25 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`rounded-xs ${
                                      i % 2 === 0 || i % 5 === 0 ? "bg-[#0A1626]" : "bg-transparent"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs font-bold text-[#0A1626]">Scan using any UPI App</p>
                            <p className="text-[10px] text-gray-500">Google Pay · PhonePe · Paytm · BHIM · CRED</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Debit / Credit Card Option */}
                    {selectedMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                            Card Number
                          </label>
                          <div className="h-11 rounded-xl border border-gray-300 bg-white flex items-center px-3 shadow-xs">
                            <input
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="flex-1 outline-none text-xs md:text-sm font-mono font-bold text-[#0A1626] bg-transparent"
                              placeholder="4532 •••• •••• 1092"
                            />
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                              RuPay / VISA
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                              Valid Thru
                            </label>
                            <input
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-mono font-bold text-[#0A1626] outline-none shadow-xs text-center"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-mono font-bold text-[#0A1626] outline-none shadow-xs text-center"
                              placeholder="•••"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                            Name on Card
                          </label>
                          <input
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-xs md:text-sm font-bold text-[#0A1626] outline-none shadow-xs uppercase"
                            placeholder="NAME AS PRINTED"
                          />
                        </div>
                      </div>
                    )}

                    {/* Net Banking Option */}
                    {selectedMethod === "netbanking" && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">
                          Popular Indian Banks
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {BANKS.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBank(b.id)}
                              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                selectedBank === b.id
                                  ? "bg-[#0A1626] text-white border-[#0A1626] shadow-sm"
                                  : "bg-white text-[#0A1626] border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              <span>{b.icon}</span>
                              <span className="truncate">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* IRCTC eWallet Option */}
                    {selectedMethod === "wallet" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                          <div>
                            <p className="text-xs font-bold text-amber-950">IRCTC iMudra eWallet</p>
                            <p className="text-[11px] text-amber-800">Available Balance: ₹5,420.00</p>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white font-mono">
                            SUFFICIENT
                          </span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                            Enter 4-Digit Wallet Security PIN
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={walletPin}
                            onChange={(e) => setWalletPin(e.target.value)}
                            className="h-11 w-40 rounded-xl border border-gray-300 bg-white px-3 text-sm font-mono font-bold text-[#0A1626] tracking-widest text-center shadow-xs outline-none focus:border-[#0A1626]"
                            placeholder="••••"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    onClick={() => runPayment("success")}
                    className="w-full h-14 rounded-2xl font-bold text-base bg-[#0A1626] hover:bg-black text-[#F0A63A] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-4"
                  >
                    <ShieldCheck size={20} className="text-[#F0A63A]" />
                    <span>Pay ₹{total.toLocaleString("en-IN")} Securely</span>
                  </button>

                  {/* Demo Outcome Simulation Buttons */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[11px] text-[#6B7280] mb-2 font-mono text-center">
                      Interactive Evaluation: test edge-case recovery
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => runPayment("verifying")}
                        className="h-10 rounded-xl font-bold text-xs border border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Clock size={13} /> Simulate Ambiguous Bank Debit
                      </button>
                      <button
                        onClick={() => runPayment("failed")}
                        className="h-10 rounded-xl font-bold text-xs border border-red-400 bg-red-50 text-red-900 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <AlertTriangle size={13} /> Simulate Bank Timeout
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing State Animation */}
              {payState === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1626] flex items-center justify-center shadow-lg animate-bounce">
                    <Train size={28} className="text-[#F0A63A]" />
                  </div>
                  <p className="font-serif font-bold text-lg text-[#0A1626]">Communicating with IRCTC PRS Gateway…</p>
                  <p className="text-xs text-[#6B7280]">Encrypting transaction token and securing berth allocation.</p>
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div className="w-full h-full bg-[#F0A63A] animate-pulse" />
                  </div>
                </div>
              )}

              {/* Ambiguous Debit Reassurance State */}
              {payState === "verifying" && (
                <div className="rounded-2xl p-6 anim-fade-up bg-amber-50 border border-amber-200">
                  <div className="flex gap-3.5">
                    <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-base font-bold text-amber-950">Payment Reconciliation in Progress</p>
                      <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                        Your bank has acknowledged the debit. We are actively polling the IRCTC PRS booking cluster.
                        Your seats are held securely. If the PRS does not respond within 2 minutes, a 100% instant auto-refund is triggered to your source account.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-800">
                        <Clock size={14} className="animate-spin" /> Verifying with Indian Railway servers…
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Failed Recovery State */}
              {payState === "failed" && (
                <div className="rounded-2xl p-6 anim-fade-up bg-red-50 border border-red-200">
                  <div className="flex gap-3.5">
                    <AlertTriangle size={24} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-bold text-red-950">Bank Gateway Timed Out</p>
                      <p className="text-xs text-red-800 mt-1 leading-relaxed">
                        No funds were deducted from your account. Your berth reservations are held for 4 minutes so you can re-try without losing your seats.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPayState("idle")}
                    className="mt-4 w-full h-12 rounded-xl font-bold text-sm bg-[#0A1626] text-white hover:bg-black transition-all cursor-pointer"
                  >
                    Try Again with UPI or Card
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Instant Booking Confirmed E-Ticket Card */}
        {step === 2 && (
          <div className="rounded-3xl bg-white border border-[rgba(10,22,38,0.12)] shadow-2xl overflow-hidden anim-fade-up">
            {/* Top Confirmed Banner */}
            <div className="p-6 md:p-8 flex flex-col items-center text-center relative bg-emerald-600 text-white">
              <ConfettiBurst />
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg">
                <Check size={32} className="text-emerald-600 stroke-[3]" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-700 text-emerald-100 mb-1">
                Booking Confirmed (CNF)
              </span>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-white">
                Ticket Issued Successfully!
              </h2>
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 font-mono text-sm font-bold text-white border border-emerald-500">
                <span>PNR: 8462-097-315</span>
              </div>
            </div>

            {/* E-Ticket Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Journey Details */}
              <div className="p-5 rounded-2xl bg-[#FAF8F2] border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0A1626]">
                      {selection.train.name} (#{selection.train.no})
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">Class {selection.cls} · Quota: General</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0A1626] text-[#F0A63A] font-mono">
                    ₹{total.toLocaleString("en-IN")} PAID
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="font-mono font-bold text-lg text-[#0A1626]">{selection.train.dep}</p>
                    <p className="text-xs font-bold text-gray-600">{selection.train.from}</p>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-[10px] text-gray-400 font-mono">Direct Superfast</span>
                    <div className="w-24 h-0.5 bg-gray-300 my-1 relative">
                      <div className="w-2 h-2 rounded-full bg-[#0A1626] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">On Time</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-[#0A1626]">{selection.train.arr}</p>
                    <p className="text-xs font-bold text-gray-600">{selection.train.to}</p>
                  </div>
                </div>
              </div>

              {/* Passenger & Berth Allocation Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2.5 font-mono">
                  Allocated Coach & Berths
                </h4>
                <div className="space-y-2">
                  {passengers.map((p, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center font-mono">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#0A1626]">{p.name || `Passenger ${i + 1}`}</p>
                          <p className="text-[10px] text-gray-500">{p.age || "28"} Yrs · {p.gender === "M" ? "Male" : "Female"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                          Coach B4 · Berth {42 + i * 3} ({p.berth === "LB" ? "Lower" : p.berth === "MB" ? "Middle" : "Upper"})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => {
                    setTicketDownloaded(true);
                    setTimeout(() => setTicketDownloaded(false), 3000);
                  }}
                  className="h-12 rounded-xl border border-gray-300 hover:border-[#0A1626] font-bold text-xs md:text-sm text-[#0A1626] bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>{ticketDownloaded ? "PDF Saved!" : "Download Ticket PDF"}</span>
                </button>
                <button
                  onClick={() => {
                    setTicketShared(true);
                    setTimeout(() => setTicketShared(false), 3000);
                  }}
                  className="h-12 rounded-xl border border-gray-300 hover:border-[#0A1626] font-bold text-xs md:text-sm text-[#0A1626] bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>{ticketShared ? "Link Copied!" : "Share via WhatsApp"}</span>
                </button>
                <button
                  onClick={onDone}
                  className="h-12 rounded-xl font-bold text-xs md:text-sm bg-[#0A1626] text-[#F0A63A] hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket size={16} />
                  <span>View in My Trips</span>
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
    <div onClick={onClick} className="rounded-xl border glass-card p-5 group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ borderColor: "var(--line)" }}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-blue-50" style={{ background: "var(--paper-2)" }}>
        <Icon size={20} className="transition-colors duration-300" style={{ color: "var(--blue)" }} />
      </div>
      <p className="font-semibold text-[15px]">{title}</p>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--steel)" }}>{body}</p>
    </div>
  );
}

/* ---------------- HELP & SUPPORT ---------------- */


/* ---------------- shared page hero ---------------- */

export default function App({ initialScreen }) {
  const getBasePath = () => {
    if (typeof window === "undefined") return "";
    const base = (import.meta.env?.BASE_URL || "").replace(/\/$/, "");
    if (base && window.location.pathname.startsWith(base)) return base;
    if (window.location.pathname.startsWith("/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign")) {
      return "/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign";
    }
    if (window.location.pathname.startsWith("/UI-UX-Design-Event")) {
      return "/UI-UX-Design-Event";
    }
    return "";
  };

  const VALID_SCREENS = ["search", "explore", "trips", "help", "account", "results", "booking", "seat-availability", "confirmation"];

  const getScreenFromPath = () => {
    if (typeof window === "undefined") return "search";
    const basePath = getBasePath();

    // Check query params (?screen=seat-availability or ?p=explore)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qScreen = urlParams.get("screen") || urlParams.get("p") || urlParams.get("page");
      if (qScreen && VALID_SCREENS.includes(qScreen.toLowerCase())) {
        return qScreen.toLowerCase();
      }
    } catch (e) {}

    // Check hash (#seat-availability, #trips)
    try {
      const hashScreen = window.location.hash.replace(/^#\/?/, "").toLowerCase();
      if (hashScreen && VALID_SCREENS.includes(hashScreen)) {
        return hashScreen;
      }
    } catch (e) {}

    // Check path (/seat-availability, /trips, etc.)
    const cleanPath = window.location.pathname
      .replace(basePath, "")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    if (VALID_SCREENS.includes(cleanPath)) {
      return cleanPath;
    }
    return "search";
  };

  const [screen, setScreenState] = useState(() => initialScreen || getScreenFromPath());
  const [searchParams, setSearchParams] = useState(null);
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
      setScreen("seat-availability");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      setQuickModal({ type: "explore_info", title: action });
    }
  };

  return (
    <div className="f-body" style={{ minHeight: "100vh" }}>
      <ScrollProgress />
      <CustomCursor />
      <AIAssistFAB />

      <TopNav screen={screen} setScreen={setScreen} />

      {screen === "search" && <SearchScreen onSearch={(params) => { setSearchParams(params); setScreen("results"); }} onFooterAction={handleFooterAction} />}
      {screen === "results" && (
        <ResultsScreen
          searchParams={searchParams}
          onBack={() => setScreen("search")}
          onBook={(sel) => { setSelection(sel); setScreen("booking"); }}
        />
      )}
      {screen === "booking" && selection && (
        <BookingScreen
          selection={selection}
          onBack={() => setScreen("results")}
          onDone={() => setScreen("trips")}
          onConfirmed={(b) => { setBooking(b); addJourney(b); setScreen("confirmation"); window.scrollTo({ top: 0 }); }}
        />
      )}
      {screen === "confirmation" && booking && (
        <ConfirmationScreen booking={booking} onTrips={() => setScreen("trips")} onHome={() => setScreen("search")} />
      )}
      {screen === "trips" && <MyTripsScreen />}
      {screen === "explore" && <ExploreScreen onNavigate={setScreen} />}
      {screen === "seat-availability" && (
        <SeatAvailabilityScreen
          onBook={(sel) => { setSelection(sel); setScreen("booking"); }}
          onNavigate={setScreen}
        />
      )}
      {screen === "help" && <HelpScreen />}
      {screen === "account" && <AccountScreen onLogout={() => setScreen("search")} />}

      {/* Global Quick Links Modal */}
      <QuickLinksModal modal={quickModal} onClose={() => setQuickModal(null)} onNavigate={setScreen} />

      {/* Global Interactive Footer */}
      <Footer onAction={handleFooterAction} />
    </div>
  );
}