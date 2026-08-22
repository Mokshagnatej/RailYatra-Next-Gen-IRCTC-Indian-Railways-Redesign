import React, { useState, useEffect } from 'react';
import { 
  Train, MapPin, Activity
} from 'lucide-react';
import { computeLiveTrainTracking } from '../../../lib/liveTrackingEngine';

const TRACKED_TRAIN_NUMBERS = ["22436", "12951", "12002", "12622"];

function LiveRailRadarCard({ onQuickAction }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [telemetries, setTelemetries] = useState([]);

  useEffect(() => {
    const updateAll = () => {
      const results = TRACKED_TRAIN_NUMBERS.map(num => computeLiveTrainTracking(num)).filter(Boolean);
      setTelemetries(results);
    };

    updateAll();
    const interval = setInterval(updateAll, 1000);
    return () => clearInterval(interval);
  }, []);

  const curr = telemetries[activeIdx] || telemetries[0];

  if (!curr) return null;

  return (
    <div className="w-full rounded-2xl border border-white/15 p-4 md:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl text-white" style={{
      background: "linear-gradient(135deg, rgba(14, 28, 48, 0.9) 0%, rgba(8, 16, 30, 0.98) 100%)",
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
    }}>
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Live Rail Radar</span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          GPS REAL-TIME
        </span>
      </div>

      {/* Train Selector Pills */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 mb-3 p-1 rounded-xl bg-slate-900/60 border border-white/5">
        {telemetries.map((t, idx) => (
          <button
            key={t.trainNo}
            onClick={() => setActiveIdx(idx)}
            className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all duration-200 truncate text-center ${
              activeIdx === idx 
                ? "bg-amber-400 text-slate-950 shadow-md font-bold" 
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.trainNo}
          </button>
        ))}
      </div>

      {/* Train Name and Route Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Train size={15} className="text-amber-400" />
            #{curr.trainNo} {curr.trainName}
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
            {curr.from.code} ({curr.from.name}) → {curr.to.code} ({curr.to.name})
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {curr.currentSpeedKmH} km/h
        </span>
      </div>

      {/* Live Route Progress Bar */}
      <div className="mt-4 mb-3">
        <div className="flex justify-between text-[10px] font-mono text-slate-300 mb-1.5">
          <span>Dep: {curr.from.dep}</span>
          <span className="text-amber-300 font-bold">{curr.status}</span>
          <span>Arr: {curr.to.arr}</span>
        </div>
        
        {/* Track Line with Moving Train Node */}
        <div className="w-full h-2 rounded-full bg-slate-800 relative overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500" 
            style={{ width: `${curr.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Next Station Telemetry Box */}
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-[11px] flex items-center gap-1 font-medium">
            <MapPin size={12} className="text-sky-400" /> Next Stoppage:
          </span>
          <span className="font-bold text-white">{curr.nextStation.name} ({curr.nextStation.code})</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300">Countdown ETA / Platform:</span>
          <span className="font-mono text-amber-300 font-bold">ETA {curr.nextStation.etaMinutes} mins · {curr.nextStation.platform}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
          <span className="text-slate-300">Distance Remaining:</span>
          <span className="font-mono text-emerald-300 font-medium">{curr.distanceRemainingKm} km ({curr.progressPercent}% covered)</span>
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
