import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

function StationDot({ smoothProgress, threshold, index }) {
  const isPassed = useTransform(smoothProgress, [Math.max(0, threshold - 0.05), threshold], [0, 1]);
  const bgColor = useTransform(smoothProgress, [Math.max(0, threshold - 0.05), threshold], ['var(--paper-2)', 'var(--green)']);
  const borderColor = useTransform(smoothProgress, [Math.max(0, threshold - 0.05), threshold], ['var(--amber)', 'var(--green)']);
  const scale = useTransform(smoothProgress, [Math.max(0, threshold - 0.05), threshold], [1, 1.25]);

  return (
    <div className="flex-1 flex flex-col items-center relative z-10">
      <motion.div
        className="w-6 h-6 rounded-full border-[3px] flex items-center justify-center shadow-md transition-colors"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          scale: scale,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
    </div>
  );
}

export default function ScrollLinkedRailLine({ steps = [] }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 35%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  });

  // Track starts at 12.5% (center of col 1) and ends at 87.5% (center of col 4)
  const trainLeft = useTransform(smoothProgress, [0, 1], ['12.5%', '87.5%']);
  const fillWidth = useTransform(smoothProgress, [0, 1], ['0%', '75%']);

  if (!steps || steps.length === 0) return null;

  return (
    <div ref={containerRef} className="relative py-6 max-w-5xl mx-auto">
      {/* Track & Train Stage */}
      <div className="relative h-12 flex items-center mb-8">
        {/* Background Track Line (Dashed) */}
        <div 
          className="absolute left-[12.5%] right-[12.5%] h-1 border-t-2 border-dashed z-0 opacity-40"
          style={{ borderColor: 'var(--steel)' }}
        />

        {/* Animated Filled Progress Track */}
        <motion.div
          className="absolute left-[12.5%] h-1 bg-[var(--green)] z-0 origin-left shadow-[0_0_8px_rgba(63,174,113,0.5)]"
          style={{ width: fillWidth }}
        />

        {/* Moving Toy Train */}
        <motion.div
          className="absolute -top-1 -ml-6 z-20 pointer-events-none drop-shadow-lg"
          style={{ left: trainLeft }}
        >
          <div className="relative">
            <svg viewBox="0 0 52 32" className="w-12 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Train Locomotive Body */}
              <rect x="2" y="6" width="46" height="18" rx="4" fill="#0A1626" stroke="#F0A63A" strokeWidth="1.5" />
              {/* Train Cab Window */}
              <rect x="8" y="10" width="8" height="6" rx="1.5" fill="#FFE3B0" />
              <rect x="20" y="10" width="8" height="6" rx="1.5" fill="#FFE3B0" />
              <rect x="32" y="10" width="10" height="6" rx="1.5" fill="#F0A63A" />
              {/* Wheels */}
              <circle cx="12" cy="25" r="4" fill="#F0A63A" stroke="#0A1626" strokeWidth="1.5" />
              <circle cx="24" cy="25" r="4" fill="#F0A63A" stroke="#0A1626" strokeWidth="1.5" />
              <circle cx="38" cy="25" r="4" fill="#F0A63A" stroke="#0A1626" strokeWidth="1.5" />
              {/* Headlamp Beam */}
              <polygon points="46,12 52,9 52,17" fill="#F0A63A" opacity="0.8" />
            </svg>
          </div>
        </motion.div>

        {/* Station Dots Row */}
        <div className="w-full flex justify-between items-center z-10">
          {steps.map((step, i) => {
            const threshold = steps.length > 1 ? i / (steps.length - 1) : 0;
            return (
              <StationDot
                key={step.n || i}
                smoothProgress={smoothProgress}
                threshold={threshold}
                index={i}
              />
            );
          })}
        </div>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <div
            key={step.n || i}
            className="p-5 rounded-2xl border bg-white/70 dark:bg-black/30 backdrop-blur-sm border-[var(--line)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-start"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--navy)] text-[var(--marigold)] f-mono text-xs font-bold flex items-center justify-center mb-3 shadow-inner">
              0{i + 1}
            </div>
            <h3 className="f-serif font-bold text-lg text-[var(--ink)] mb-1.5">
              {step.title}
            </h3>
            <p className="text-xs md:text-sm text-[var(--steel)] leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
