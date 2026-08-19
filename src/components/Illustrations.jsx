import React, { useEffect, useRef, useState } from "react";

/* Scroll-triggered reveal: adds the fade-up animation the first time the
   element enters the viewport. Falls back to visible if IO is unavailable. */
export function Reveal({ children, delay = 0, className = "", style, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${shown ? "anim-fade-up" : "opacity-0"} ${className}`}
      style={{ ...(style || {}), ...(shown ? { animationDelay: `${delay}s` } : null) }}>
      {children}
    </Tag>
  );
}

/* Number that counts up once it is on screen. */
export function CountUp({ value, suffix = "", prefix = "", duration = 1200, className, style }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setN(value); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(value); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref} className={className} style={style}>{prefix}{n.toLocaleString("en-IN")}{suffix}</span>;
}

/* Route map: two city markers joined by a travelling dashed line. */
export function RouteMapIllustration() {
  return (
    <svg viewBox="0 0 320 140" className="w-full h-auto" aria-hidden="true">
      <path d="M14 104 C 80 20, 220 150, 306 44" fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      <path d="M14 104 C 80 20, 220 150, 306 44" fill="none" stroke="var(--marigold)" strokeWidth="3"
        strokeLinecap="round" strokeDasharray="10 12" style={{ animation: "dash-move 1.6s linear infinite" }} />
      {[[14, 104], [306, 44]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="14" fill="var(--blue)" opacity="0.12"
            style={{ animation: `ripple 2.4s ease-out ${i * 0.8}s infinite`, transformOrigin: `${cx}px ${cy}px` }} />
          <circle cx={cx} cy={cy} r="7" fill="var(--blue)" />
          <circle cx={cx} cy={cy} r="2.6" fill="var(--marigold)" />
        </g>
      ))}
      <g style={{ animation: "bob 3s ease-in-out infinite" }}>
        <rect x="140" y="70" width="42" height="20" rx="6" fill="var(--blue-2)" />
        <rect x="146" y="75" width="10" height="8" rx="2" fill="#F5F2E9" opacity="0.9" />
        <rect x="160" y="75" width="10" height="8" rx="2" fill="#F5F2E9" opacity="0.9" />
        <circle cx="150" cy="92" r="4" fill="var(--blue)" />
        <circle cx="172" cy="92" r="4" fill="var(--blue)" />
      </g>
    </svg>
  );
}

/* Platform scene: station canopy, clock, bench and waiting travellers. */
export function StationIllustration() {
  return (
    <svg viewBox="0 0 340 170" className="w-full h-auto" aria-hidden="true">
      <rect x="18" y="34" width="304" height="12" rx="6" fill="var(--blue)" />
      {[40, 300].map((x) => <rect key={x} x={x} y="46" width="8" height="86" fill="var(--blue-2)" opacity="0.8" />)}
      <circle cx="170" cy="66" r="18" fill="#F5F2E9" stroke="var(--blue)" strokeWidth="3" />
      <line x1="170" y1="66" x2="170" y2="56" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round"
        style={{ transformOrigin: "170px 66px", animation: "wheel-spin 8s linear infinite" }} />
      <line x1="170" y1="66" x2="180" y2="66" stroke="var(--marigold-2)" strokeWidth="2" strokeLinecap="round"
        style={{ transformOrigin: "170px 66px", animation: "wheel-spin 48s linear infinite" }} />
      <rect x="52" y="58" width="84" height="34" rx="5" fill="var(--blue)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="60" y={65 + i * 9} width={i === 1 ? 44 : 60} height="4" rx="2" fill="var(--marigold)"
          opacity="0.85" style={{ animation: `signal-blink ${2 + i * 0.6}s ease-in-out infinite` }} />
      ))}
      {[[215, "var(--marigold)"], [240, "var(--green)"], [262, "var(--blue-2)"]].map(([x, c], i) => (
        <g key={x} style={{ animation: `bob ${2.6 + i * 0.4}s ease-in-out infinite` }}>
          <circle cx={x} cy="98" r="7" fill={c} />
          <rect x={Number(x) - 8} y="107" width="16" height="24" rx="7" fill={c} opacity="0.85" />
          <rect x={Number(x) + 9} y="118" width="10" height="13" rx="2" fill="var(--blue)" opacity="0.55" />
        </g>
      ))}
      <rect x="0" y="132" width="340" height="8" fill="var(--blue)" opacity="0.2" />
      <rect x="0" y="146" width="340" height="4" fill="#8FA3B5" />
      {Array.from({ length: 17 }).map((_, i) => <rect key={i} x={i * 21} y="150" width="10" height="4" fill="#8FA3B5" opacity="0.55" />)}
    </svg>
  );
}

/* Animated dashed rail used as a connector behind the "how it works" steps. */
export function TrackConnector() {
  return (
    <div className="relative h-6 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2"
        style={{ background: "repeating-linear-gradient(90deg, var(--line) 0 12px, transparent 12px 22px)" }} />
      <div className="absolute top-0" style={{ animation: "train-cross 9s linear infinite" }}>
        <svg width="34" height="24" viewBox="0 0 34 24">
          <rect x="2" y="4" width="24" height="12" rx="4" fill="var(--marigold)" />
          <rect x="2" y="4" width="24" height="4" rx="2" fill="var(--blue)" />
          <circle cx="8" cy="18" r="3.5" fill="var(--blue)" />
          <circle cx="20" cy="18" r="3.5" fill="var(--blue)" />
        </svg>
      </div>
    </div>
  );
}

/* Ticket + shield motif for the trust strip. */
export function TrustIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-auto max-w-[170px]" aria-hidden="true">
      <g style={{ animation: "bob 4s ease-in-out infinite" }}>
        <rect x="16" y="30" width="94" height="58" rx="10" fill="#FFFFFF" stroke="var(--line)" strokeWidth="2" />
        <circle cx="16" cy="59" r="7" fill="var(--paper-2)" />
        <circle cx="110" cy="59" r="7" fill="var(--paper-2)" />
        <rect x="28" y="42" width="42" height="5" rx="2.5" fill="var(--blue)" opacity="0.75" />
        <rect x="28" y="54" width="60" height="4" rx="2" fill="var(--line)" />
        <rect x="28" y="64" width="34" height="4" rx="2" fill="var(--line)" />
        <rect x="82" y="66" width="18" height="14" rx="2" fill="var(--blue)" opacity="0.18" />
      </g>
      <g style={{ animation: "bob 3.2s ease-in-out infinite 0.6s" }}>
        <path d="M120 34 l20 8 v16 c0 14 -9 22 -20 26 c-11 -4 -20 -12 -20 -26 V42 z" fill="var(--green)" opacity="0.14" />
        <path d="M120 34 l20 8 v16 c0 14 -9 22 -20 26 c-11 -4 -20 -12 -20 -26 V42 z" fill="none" stroke="var(--green)" strokeWidth="2.5" />
        <path d="M111 60 l6 7 l13 -15" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 30, animation: "draw-check 1.4s ease-out infinite" }} />
      </g>
    </svg>
  );
}
