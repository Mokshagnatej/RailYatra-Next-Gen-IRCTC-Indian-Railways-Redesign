import React, { useMemo } from "react";

/* ── Rangoli-inspired geometric SVG overlay ──
   Rendered at low opacity as decorative corner elements.
   Inspired by traditional Indian geometric kolam / rangoli patterns. */
export function RangoliOverlay({ position = "top-right", size = 320, opacity = 0.045 }) {
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className="pointer-events-none absolute"
      style={{
        [isRight ? "right" : "left"]: -size * 0.15,
        [isBottom ? "bottom" : "top"]: -size * 0.15,
        opacity,
        transform: `rotate(${isRight ? (isBottom ? 180 : 90) : isBottom ? 270 : 0}deg)`,
      }}
      aria-hidden="true"
    >
      {/* Concentric rangoli rings */}
      {[160, 130, 100, 70, 42].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="#C08321"
          strokeWidth={i === 0 ? 1.5 : 1}
          strokeDasharray={i % 2 === 0 ? "8 6" : "3 5"}
          opacity={0.6 + i * 0.08}
        />
      ))}

      {/* Petal / lotus motifs at cardinal points */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <ellipse cx="200" cy="60" rx="8" ry="22" fill="#E5A93D" opacity="0.3" />
          <ellipse cx="200" cy="60" rx="4" ry="14" fill="#C08321" opacity="0.25" />
        </g>
      ))}

      {/* Inner diamond lattice */}
      {[0, 90].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M200 140 L260 200 L200 260 L140 200 Z"
            fill="none"
            stroke="#C08321"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      ))}

      {/* Central dot cluster (bindu) */}
      <circle cx="200" cy="200" r="6" fill="#E5A93D" opacity="0.35" />
      <circle cx="200" cy="200" r="2.5" fill="#C08321" opacity="0.5" />

      {/* Small accent dots on rings */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={`d-${angle}`}
          cx={200 + 100 * Math.cos((angle * Math.PI) / 180)}
          cy={200 + 100 * Math.sin((angle * Math.PI) / 180)}
          r="3"
          fill="#E5A93D"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

/* ── Animated Railway Network Dots ──
   Floating dots connected by dashed lines, evoking India's rail network topology.
   Uses pure CSS animations for smooth performance. */
export function DotNetwork({ count = 18 }) {
  const nodes = useMemo(() => {
    const seed = 42;
    const rng = (i) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      x: 10 + rng(i) * 80,
      y: 15 + rng(i + 50) * 70,
      r: 2 + rng(i + 100) * 3,
      delay: rng(i + 200) * 6,
      dur: 4 + rng(i + 300) * 5,
    }));
  }, [count]);

  // Generate connections between nearby nodes
  const edges = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25 && result.length < 14) {
          result.push({ from: i, to: j, dist });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.12 }}
      >
        {/* Dashed connection lines */}
        {edges.map((e, i) => (
          <line
            key={`edge-${i}`}
            x1={nodes[e.from].x}
            y1={nodes[e.from].y}
            x2={nodes[e.to].x}
            y2={nodes[e.to].y}
            stroke="#C08321"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
            opacity="0.6"
          />
        ))}

        {/* Station dots */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            {/* Pulse ring */}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 2}
              fill="none"
              stroke="#E5A93D"
              strokeWidth="0.3"
              opacity="0"
              style={{
                animation: `dot-network-pulse ${n.dur}s ease-in-out ${n.delay}s infinite`,
                transformOrigin: `${n.x}px ${n.y}px`,
              }}
            />
            {/* Core dot */}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="#0F2A45"
              opacity="0.7"
              style={{
                animation: `dot-network-float ${n.dur}s ease-in-out ${n.delay}s infinite`,
                transformOrigin: `${n.x}px ${n.y}px`,
              }}
            />
            {/* Inner highlight */}
            <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill="#E5A93D" opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Warm Glow Orbs ──
   Soft golden ambient circles with blur and gentle float.
   Replaces the cold star-twinkle from the dark theme. */
export function WarmGlowOrbs({ count = 7 }) {
  const orbs = useMemo(() => {
    return [
      { x: 8, y: 20, size: 120, opacity: 0.06, delay: 0, dur: 12 },
      { x: 75, y: 10, size: 180, opacity: 0.04, delay: 2, dur: 15 },
      { x: 45, y: 65, size: 90, opacity: 0.07, delay: 1, dur: 10 },
      { x: 90, y: 55, size: 140, opacity: 0.05, delay: 3, dur: 14 },
      { x: 20, y: 70, size: 100, opacity: 0.06, delay: 4, dur: 11 },
      { x: 60, y: 30, size: 160, opacity: 0.04, delay: 1.5, dur: 13 },
      { x: 35, y: 45, size: 80, opacity: 0.05, delay: 2.5, dur: 9 },
    ].slice(0, count);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, rgba(229,169,61,${orb.opacity * 3}) 0%, rgba(229,169,61,0) 70%)`,
            filter: "blur(20px)",
            animation: `warm-orb-drift ${orb.dur}s ease-in-out ${orb.delay}s infinite alternate`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Warm Gradient Wave ──
   A flowing saffron-to-cream SVG wave that replaces the dark mountain backdrop. */
export function WarmGradientWave() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 560"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "80%" }}
      >
        <defs>
          <linearGradient id="warm-wave-1" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#F5DEB3" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#E5A93D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FEF3E2" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="warm-wave-2" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#E5A93D" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C08321" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="warm-wave-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF9F0" stopOpacity="0" />
            <stop offset="100%" stopColor="#F7F4EC" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Primary flowing wave */}
        <path
          d="M0 320 C240 220 480 380 720 280 C960 180 1200 340 1440 260 L1440 560 L0 560Z"
          fill="url(#warm-wave-1)"
        />

        {/* Secondary wave */}
        <path
          d="M0 380 C200 310 440 430 720 350 C1000 270 1240 400 1440 340 L1440 560 L0 560Z"
          fill="url(#warm-wave-2)"
        />

        {/* Subtle top wave */}
        <path
          d="M0 200 C360 140 720 260 1080 180 C1260 140 1360 190 1440 170 L1440 560 L0 560Z"
          fill="#E5A93D"
          opacity="0.03"
        />

        {/* Bottom fade to page */}
        <rect x="0" y="460" width="1440" height="100" fill="url(#warm-wave-3)" />
      </svg>

      {/* Train silhouette at the bottom of the wave */}
      <div
        className="absolute bottom-[12%] w-full"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 5%, rgba(192,131,33,0.12) 30%, rgba(192,131,33,0.12) 70%, transparent 95%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10px",
            animation: "train-cross 18s linear infinite",
          }}
        >
          <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
            <rect x="0" y="2" width="36" height="14" rx="4" fill="#0F2A45" opacity="0.08" />
            <rect x="6" y="5" width="8" height="6" rx="1.5" fill="#E5A93D" opacity="0.15" />
            <rect x="18" y="5" width="8" height="6" rx="1.5" fill="#E5A93D" opacity="0.15" />
            <circle cx="10" cy="18" r="2.5" fill="#0F2A45" opacity="0.1" />
            <circle cx="28" cy="18" r="2.5" fill="#0F2A45" opacity="0.1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
