import React, { useEffect, useState } from 'react';
import { useJourneyStore, useBookingStore } from '../../lib/store.ts';
import { MapPin, Navigation, Clock, Activity, Coffee, X } from 'lucide-react';
import { computeLiveTrainTracking } from '../../lib/liveTrackingEngine';

export default function LiveJourneyDashboard() {
  const { from, to } = useBookingStore();
  const [telemetry, setTelemetry] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);

  useEffect(() => {
    // Initial compute
    const t = computeLiveTrainTracking("12951");
    setTelemetry(t);

    const interval = setInterval(() => {
      const updated = computeLiveTrainTracking("12951");
      setTelemetry(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentStation = telemetry?.currentStation.name || "Ratlam Jn";
  const platform = telemetry?.currentStation.platform || "PF 1";
  const nextStation = telemetry?.nextStation.name || "Vadodara Jn";
  const eta = telemetry ? `ETA ${telemetry.nextStation.etaMinutes} mins` : "ETA 14 mins";
  const speed = telemetry ? `${telemetry.currentSpeedKmH} km/h` : "128 km/h";
  const distanceRemaining = telemetry ? `${telemetry.distanceRemainingKm} km` : "652 km";
  const liveProgress = telemetry?.progressPercent || 48;
  const statusLabel = telemetry?.status || "On Time · Cruising";

  return (
    <div className="absolute top-24 right-4 md:right-8 z-40 w-80 glass-hero-card p-4 rounded-2xl shadow-xl border border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.95)]">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="f-heading text-sm font-bold text-[#0A1626]">Live Journey Radar</h3>
          <p className="text-[10px] text-[#4B5563] font-mono">#12951 Tejas Rajdhani</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Live GPS
        </span>
      </div>

      <div className="space-y-4">
        {/* Route Progress */}
        <div className="relative pt-2 pb-1">
          <div className="flex justify-between text-[10px] font-mono font-bold text-[#4B5563] mb-1">
            <span>{from ? from.split('(')[0].trim() : "New Delhi"}</span>
            <span>{to ? to.split('(')[0].trim() : "Mumbai Central"}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 transition-all duration-1000"
              style={{ width: `${liveProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#4B5563] mt-1 font-mono">
            <span>{liveProgress}% completed</span>
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Current & Next Station */}
        <div className="flex justify-between items-start pt-2 border-t border-slate-200">
          <div className="flex gap-2">
            <MapPin size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wide text-slate-500">Current Station</p>
              <p className="text-sm font-bold text-[#0A1626]">{currentStation}</p>
              <p className="text-xs text-slate-600 font-semibold">{platform}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wide text-slate-500">Next Stop</p>
            <p className="text-sm font-bold text-[#0A1626]">{nextStation}</p>
            <p className="text-xs font-mono font-bold text-amber-700">{eta}</p>
          </div>
        </div>

        {/* Speed & Distance */}
        <div className="flex justify-between items-center bg-[#F3EEE0]/60 rounded-xl p-2.5 border border-[rgba(10,22,38,0.1)]">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-amber-600" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wide text-slate-500">Speed</p>
              <p className="text-xs font-mono font-bold text-[#0A1626]">{speed}</p>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-300" />
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-blue-600" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wide text-slate-500">Remaining</p>
              <p className="text-xs font-mono font-bold text-[#0A1626]">{distanceRemaining}</p>
            </div>
          </div>
        </div>
        
        {/* eCatering Button */}
        <button 
          onClick={() => setShowFoodModal(true)}
          className="w-full h-10 mt-2 bg-[#F0A63A] hover:bg-[#E29525] text-[#0A1626] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          <Coffee size={15} />
          Order eCatering to Seat
        </button>
      </div>

      {/* eCatering Modal */}
      {showFoodModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#F3EEE0] rounded-2xl shadow-2xl overflow-hidden anim-fade-up border border-gray-300">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white">
              <div>
                <h2 className="f-serif text-xl font-bold text-[#0A1626]">IRCTC eCatering</h2>
                <p className="text-xs text-[#4B5563]">Upcoming Delivery: {nextStation} ({eta})</p>
              </div>
              <button onClick={() => setShowFoodModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <p className="text-sm font-semibold mb-3 text-[#0A1626]">Available at {nextStation}</p>
              <div className="space-y-4">
                {[
                  { name: "Domino's Pizza", desc: "Pizzas, Garlic Bread", time: "Delivers in 35 mins", img: "🍕" },
                  { name: "Comesum Restaurant", desc: "Royal Thali, Biryani", time: "Delivers in 30 mins", img: "🍛" },
                  { name: "Haldiram's Sweets", desc: "Snacks, Sweets, Meals", time: "Delivers in 25 mins", img: "🥟" }
                ].map(restaurant => (
                  <div key={restaurant.name} className="flex gap-4 p-3.5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-14 h-14 rounded-lg bg-[#F3EEE0] flex items-center justify-center text-3xl">
                      {restaurant.img}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#0A1626]">{restaurant.name}</p>
                      <p className="text-xs text-[#4B5563]">{restaurant.desc}</p>
                      <p className="text-xs mt-1 font-mono font-bold text-emerald-700">{restaurant.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
