import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, Sparkles, Navigation, Globe, Utensils, Mountain, Calendar, Activity,
  Filter, Star, Info, ChevronRight, Play, Compass, MapPin, Coffee, Tag, Ticket, Train, User, LifeBuoy, CreditCard, Bell, Shield, Wallet, ChevronDown, CheckCircle2, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';
import FadeIn from '../../common/FadeIn';
import PageHero from '../../common/PageHero';

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

export default LiveRailRadarCard;
