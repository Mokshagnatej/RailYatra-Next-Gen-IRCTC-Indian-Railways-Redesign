import React from 'react';
import { motion } from 'framer-motion';
import { WarmGradientWave, RangoliOverlay } from './CulturalPatterns.jsx';

export default function PageHero({ eyebrow, title, sub, small }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9F0] via-[#FEF3E2] to-[#F7F4EC] border-b border-[rgba(10,22,38,0.08)]">
      <WarmGradientWave />
      <RangoliOverlay position="bottom-right" size={240} opacity={0.03} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-14 md:pb-20">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#C97F1F] animate-pulse" />
            <p className="font-mono text-xs tracking-widest uppercase font-bold text-[#C97F1F]">
              {eyebrow}
            </p>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className={`f-serif font-bold ${
            small ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl lg:text-5xl"
          } text-[#0A1626] tracking-tight max-w-2xl leading-tight drop-shadow-sm`}
        >
          {title}
        </motion.h1>

        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm md:text-base text-[#4B5563] font-medium mt-2.5 max-w-xl leading-relaxed"
          >
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}
