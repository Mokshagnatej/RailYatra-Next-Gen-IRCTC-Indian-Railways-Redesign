import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight } from 'lucide-react';

const MESSAGES = [
  'Scanning 13,169 trains for your route… fastest confirmed berth is Rajdhani, platform 04.',
  'Tatkal opens in 6h 20m for this route — AC quota historically clears by minute 2.',
  'Prices on NDLS → BCT trend lower on Tuesdays. Want me to watch this route?'
];

export default function AIAssistFAB() {
  const [open, setOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const timerRef = useRef(null);

  const typeMessage = (text) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText('');
    setIsTyping(true);
    
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 22);
  };

  useEffect(() => {
    if (open) {
      typeMessage(MESSAGES[msgIndex % MESSAGES.length]);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, msgIndex]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white relative z-50 overflow-hidden"
          style={{ background: 'var(--premium-blue)' }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: open ? 180 : 0, scale: open ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles size={24} style={{ color: 'var(--marigold)' }} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ rotate: open ? 0 : -180, scale: open ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <X size={24} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[340px] rounded-2xl shadow-2xl overflow-hidden z-40 border"
            style={{ 
              background: 'var(--glass-bg)', 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'var(--glass-border)'
            }}
          >
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(15,42,69,0.08)' }}>
              <span className="w-2 h-2 rounded-full bg-[var(--marigold)] animate-pulse" />
              <span className="f-accent text-[11px] uppercase tracking-wider font-bold text-[var(--premium-blue)]">
                RailYatra AI · Scanning live fares
              </span>
            </div>
            
            <div className="p-5 min-h-[100px]">
              <p className="f-body text-sm leading-relaxed text-[var(--ink)]">
                {displayedText}
                {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-[var(--amber)] animate-pulse" />}
              </p>
            </div>
            
            <div className="p-3 bg-[var(--paper-2)] border-t border-[rgba(15,42,69,0.08)]">
              <div className="flex flex-wrap gap-2">
                {['Fastest confirmed berth', 'Cheapest this week', 'Tatkal odds'].map((chip, idx) => (
                  <button
                    key={chip}
                    onClick={() => setMsgIndex(idx)}
                    className="f-body text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-white flex items-center gap-1"
                    style={{ 
                      background: msgIndex === idx ? 'white' : 'transparent',
                      borderColor: msgIndex === idx ? 'var(--amber)' : 'rgba(15,42,69,0.15)',
                      color: 'var(--premium-blue)'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
