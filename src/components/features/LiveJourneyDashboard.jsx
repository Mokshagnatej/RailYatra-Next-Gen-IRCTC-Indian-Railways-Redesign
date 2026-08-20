import React, { useEffect, useState } from 'react';
import { useJourneyStore, useBookingStore } from '../../lib/store.ts';
import { MapPin, Navigation, Clock, Activity } from 'lucide-react';

export default function LiveJourneyDashboard() {
  const { currentStation, nextStation, eta, speed, distanceRemaining, platform, serviceState, routeProgress, setJourneyData } = useJourneyStore();
  const [liveProgress, setLiveProgress] = useState(routeProgress || 0);
  const [showFoodModal, setShowFoodModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(p => p >= 100 ? 0 : p + 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { from, to } = useBookingStore();

  return (
    <div className="absolute top-24 right-4 md:right-8 z-40 w-80 glass-hero-card p-4 rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="f-display text-sm font-bold" style={{ color: 'var(--ink)' }}>Live Journey</h3>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-green-100 text-green-800 border border-green-200 uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {serviceState}
        </span>
      </div>

      <div className="space-y-4">
        {/* Route Progress */}
        <div className="relative pt-2 pb-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
            <span>{from.split('(')[0].trim()}</span>
            <span>{to.split('(')[0].trim()}</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000"
              style={{ width: `${liveProgress}%` }}
            />
          </div>
        </div>

        {/* Current & Next Station */}
        <div className="flex justify-between items-start pt-2 border-t border-slate-200/50">
          <div className="flex gap-2">
            <MapPin size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Current/Last</p>
              <p className="text-sm font-semibold text-slate-800">{currentStation}</p>
              <p className="text-xs text-slate-500">Platform {platform}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Next Stop</p>
            <p className="text-sm font-semibold text-slate-800">{nextStation}</p>
            <p className="text-xs text-slate-500">{eta}</p>
          </div>
        </div>

        {/* Speed & Distance */}
        <div className="flex justify-between items-center bg-white/50 rounded-lg p-2.5 border border-slate-200/50">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-amber-600" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Speed</p>
              <p className="text-xs font-mono font-bold text-slate-800">{speed}</p>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-200/50" />
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-blue-600" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Remaining</p>
              <p className="text-xs font-mono font-bold text-slate-800">{distanceRemaining}</p>
            </div>
          </div>
        </div>
        
        {/* eCatering Button */}
        <button 
          onClick={() => setShowFoodModal(true)}
          className="w-full h-10 mt-2 bg-[var(--marigold)] text-[var(--blue)] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Coffee size={16} />
          Order Food to Seat
        </button>
      </div>

      {/* eCatering Modal */}
      {showFoodModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--paper)] rounded-2xl shadow-2xl overflow-hidden anim-fade-up border border-[var(--line)]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--line)] bg-[var(--surface)]">
              <div>
                <h2 className="f-serif text-xl font-bold text-[var(--ink)]">IRCTC eCatering</h2>
                <p className="text-xs text-[var(--steel)]">Upcoming Station: {nextStation} ({eta})</p>
              </div>
              <button onClick={() => setShowFoodModal(false)} className="p-2 hover:bg-[var(--paper-2)] rounded-full transition-colors text-[var(--steel)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <p className="text-sm font-semibold mb-3 text-[var(--ink)]">Available at {nextStation}</p>
              <div className="space-y-4">
                {[
                  { name: "Domino's Pizza", desc: "Pizzas, Fast Food", time: "Delivers in 45 mins", img: "🍕" },
                  { name: "Comesum", desc: "North Indian, Thali", time: "Delivers in 40 mins", img: "🍛" },
                  { name: "Haldiram's", desc: "Snacks, Sweets", time: "Delivers in 35 mins", img: "🥟" }
                ].map(restaurant => (
                  <div key={restaurant.name} className="flex gap-4 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-16 h-16 rounded-lg bg-[var(--paper-2)] flex items-center justify-center text-3xl">
                      {restaurant.img}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[var(--ink)]">{restaurant.name}</p>
                      <p className="text-xs text-[var(--steel)]">{restaurant.desc}</p>
                      <p className="text-xs mt-2 font-mono text-[var(--green)]">{restaurant.time}</p>
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
