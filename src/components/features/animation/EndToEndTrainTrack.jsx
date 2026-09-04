import React from 'react';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import FadeIn from '../../common/FadeIn';

function EndToEndTrainTrack() {
  return (
    <div className="w-full select-none relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 group mt-6" style={{ height: '400px' }}>
      
      {/* High Quality Image as Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
      ></div>
      
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

      {/* Hero Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        
        <FadeIn className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-marigold text-blue uppercase flex items-center gap-1 shadow-lg">
              <Sparkles size={14} /> Classic Route
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-white/20 backdrop-blur-md border border-white/30 text-white uppercase shadow-lg">
              KERALA ⟷ CENTRAL GOVT.
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl f-heading font-bold text-white mb-2 leading-tight drop-shadow-lg">
            Experience the Soul of India
          </h2>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-md drop-shadow-md">
            The classic blue coach. The bustling platform. The steam of fresh coffee. Your journey begins long before you board.
          </p>
        </FadeIn>

        {/* Live Status Glassmorphic Pill */}
        <FadeIn delay={0.2} className="shrink-0">
          <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-5 shadow-2xl border border-white/20" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 font-semibold tracking-wider uppercase mb-0.5">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse"></div>
                <span className="text-sm f-accent font-bold text-white">BOARDING</span>
              </div>
            </div>
            
            <div className="w-px h-8 bg-white/20 mx-2"></div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 font-semibold tracking-wider uppercase mb-0.5">Platform</span>
              <span className="text-sm f-accent font-bold text-white flex items-center gap-1"><MapPin size={14}/> 04</span>
            </div>

            <div className="w-px h-8 bg-white/20 mx-2"></div>
            
            <button className="h-9 w-9 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
               <ArrowRight size={18} className="text-slate-900" />
            </button>
          </div>
        </FadeIn>
      </div>

    </div>
  );
}

export default EndToEndTrainTrack;
