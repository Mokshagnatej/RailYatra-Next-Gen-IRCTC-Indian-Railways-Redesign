import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CinematicPlatformPanel() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const parY = useTransform(scrollYProgress, [0, 1], [-44, 44]);

  const titleWords = "Six minutes to platform four. Every second of it, on your side.".split(" ");

  return (
    <section ref={sectionRef} className="relative h-[85vh] min-h-[600px] overflow-hidden bg-[var(--navy)] flex items-center justify-center group">
      
      {/* Background Media */}
      <motion.div 
        className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover opacity-80"
        style={{ y: parY }}
      >
        <img 
          src={`${import.meta.env.BASE_URL || '/'}trains/station_platform.jpg`} 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2000&auto=format&fit=crop"; }}
          alt="Indian Railway Platform" 
          className="w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
        />
      </motion.div>

      {/* Cinematic Effects */}
      <div className="absolute inset-0 mix-blend-multiply bg-blue-950/50" />
      <div className="absolute inset-0 mix-blend-overlay bg-amber-500/20" />
      
      {/* Animated Grain */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />
      
      {/* Floor Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[var(--navy)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col items-start mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center gap-3"
        >
          <span className="w-4 h-0.5 bg-[var(--amber)]" />
          <p className="f-mono text-xs tracking-[0.2em] uppercase text-[var(--amber)] font-bold">The moment this is all built around</p>
        </motion.div>

        <h2 className="f-serif text-5xl md:text-7xl font-bold text-white leading-[1.1] mt-6 max-w-3xl flex flex-wrap gap-x-4 gap-y-2">
          {titleWords.map((word, i) => {
            const isAmber = i >= titleWords.length - 3;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: 90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: isAmber ? 'var(--amber)' : 'white' }}
              >
                {word}
              </motion.span>
            );
          })}
        </h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex items-center gap-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 p-4 md:p-6 shadow-2xl"
        >
          <div>
            <p className="f-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">Status</p>
            <p className="f-body text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
              BOARDING
            </p>
          </div>
          <div className="w-[1px] h-10 bg-white/20" />
          <div>
            <p className="f-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">Platform</p>
            <p className="f-body text-sm font-bold text-white">04</p>
          </div>
          <div className="w-[1px] h-10 bg-white/20" />
          <div>
            <p className="f-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">Route</p>
            <p className="f-body text-sm font-bold text-white font-mono">NDLS ⇄ MMCT (RAJDHANI)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
