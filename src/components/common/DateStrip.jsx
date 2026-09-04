import React from 'react';
import { motion } from 'framer-motion';

export default function DateStrip({ dates = [], activeDate, onSelect, availabilityHint = {}, dayNames = {} }) {
  // Normalize comparison helper
  const isSelected = (d) => {
    if (!activeDate) return false;
    if (d === activeDate) return true;
    const normD = String(d).toLowerCase().replace(/[^a-z0-9]/g, '');
    const normActive = String(activeDate).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normActive.includes(normD) || normD.includes(normActive)) return true;
    return false;
  };

  return (
    <div className="relative flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
      {dates.map((d, i) => {
        const on = isSelected(d) || (!activeDate && i === 0);
        const dayLabel = dayNames[d] || 'Day';
        const dateNum = d.split(' ')[0] || d;

        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className="relative flex-1 min-w-[70px] md:min-w-[76px] py-2.5 px-1.5 rounded-xl flex flex-col items-center justify-center cursor-pointer select-none group focus:outline-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Smooth Sliding Dark Pill Background */}
            {on && (
              <motion.div
                layoutId="activeDatePill"
                className="absolute inset-0 bg-[#0A1626] rounded-xl shadow-lg border border-[#0A1626] z-0"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            {/* Inactive Chip Border & Background */}
            {!on && (
              <div className="absolute inset-0 rounded-xl bg-[#EAE2C9]/60 group-hover:bg-[#EAE2C9] border border-[rgba(10,22,38,0.12)] transition-colors duration-200 z-0" />
            )}

            {/* Day Text Label */}
            <span
              className={`relative z-10 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                on ? 'text-[#F3EEE0]/90' : 'text-[#6b6250]'
              }`}
            >
              {dayLabel}
            </span>

            {/* Day Number */}
            <span
              className={`relative z-10 f-accent font-bold text-lg md:text-xl leading-tight mt-0.5 transition-colors duration-200 ${
                on ? 'text-[#F3EEE0]' : 'text-[#0A1626]'
              }`}
            >
              {dateNum}
            </span>
          </button>
        );
      })}
    </div>
  );
}
