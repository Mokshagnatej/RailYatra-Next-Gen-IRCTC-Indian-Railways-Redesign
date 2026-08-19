import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, 
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';
import FadeIn from '../common/FadeIn';
import PageHero from '../common/PageHero';
\nfunction EndToEndTrainTrack() {
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
\nexport default EndToEndTrainTrack;\n