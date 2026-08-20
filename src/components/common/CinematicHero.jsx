import React from 'react';

export default function CinematicHeroScenery() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Sky - Very slow */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#E0F6FF] to-[#FFF9F0]"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute top-10 left-10 w-96 h-32 bg-white/40 blur-3xl rounded-full" />
        <div className="absolute top-20 right-20 w-64 h-24 bg-white/30 blur-2xl rounded-full" />
      </div>

      {/* Mountains - Slow */}
      <div 
        className="absolute bottom-[30%] w-[200%] h-[40%] opacity-80"
        style={{ 
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1000\' height=\'400\' viewBox=\'0 0 1000 400\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,400 L0,200 Q100,100 200,250 T400,150 T600,280 T800,120 T1000,220 L1000,400 Z\' fill=\'%23a3b8c2\' opacity=\'0.6\'/%3E%3Cpath d=\'M0,400 L0,280 Q150,180 250,300 T500,200 T750,320 T1000,250 L1000,400 Z\' fill=\'%238c9ca6\' opacity=\'0.8\'/%3E%3C/svg%3E") repeat-x bottom',
          backgroundSize: 'auto 100%',
          animation: 'scroll-left 120s linear infinite'
        }}
      />

      {/* Landscape - Slow/Medium */}
      <div 
        className="absolute bottom-[20%] w-[200%] h-[30%]"
        style={{ 
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'200\' viewBox=\'0 0 800 200\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,200 L0,100 Q100,80 200,120 T400,90 T600,140 T800,100 L800,200 Z\' fill=\'%234a6e50\'/%3E%3C/svg%3E") repeat-x bottom',
          backgroundSize: 'auto 100%',
          animation: 'scroll-left 60s linear infinite'
        }}
      />

      {/* Poles & Wires - Medium/fast */}
      <div 
        className="absolute bottom-[10%] w-[200%] h-[40%]"
        style={{
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\'%3E%3Crect x=\'195\' y=\'50\' width=\'10\' height=\'150\' fill=\'%232c3e50\'/%3E%3Cpath d=\'M0,60 L200,60 L400,60\' stroke=\'%2334495e\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E") repeat-x bottom',
          backgroundSize: 'auto 100%',
          animation: 'scroll-left 10s linear infinite'
        }}
      />

      {/* Track - Fast */}
      <div 
        className="absolute bottom-0 w-full h-[25%] perspective-1000"
        style={{
          background: 'linear-gradient(to bottom, #2c3e50 0%, #1a252f 100%)',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0 origin-bottom"
          style={{
            background: 'repeating-linear-gradient(90deg, #475569 0 20px, transparent 20px 100px)',
            transform: 'rotateX(75deg) scale(2)',
            animation: 'scroll-left 2s linear infinite'
          }}
        />
        <div className="absolute bottom-[20%] left-0 right-0 h-2 bg-[#95a5a6] shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
        <div className="absolute bottom-[60%] left-0 right-0 h-1 bg-[#95a5a6]" />
      </div>

      {/* Foreground Train Blur overlay - Fastest */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-md opacity-20" style={{ animation: 'train-pass 1.5s linear infinite' }} />
    </div>
  );
}
