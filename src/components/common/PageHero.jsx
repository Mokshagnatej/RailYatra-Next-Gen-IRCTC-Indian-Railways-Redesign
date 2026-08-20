import React from 'react';
import { WarmGradientWave } from './CulturalPatterns.jsx';

function PageHero({ eyebrow, title, sub, small }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FFF9F0 0%, #FEF3E2 40%, #F7F4EC 100%)" }}>
      <WarmGradientWave />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-12 md:pb-20">
        <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>{eyebrow}</p>
        <h1 className={`f-display ${small ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"} font-semibold mt-2 max-w-xl`} style={{ color: "var(--blue)" }}>{title}</h1>
        {sub && <p className="text-sm mt-2 max-w-lg mb-8" style={{ color: "var(--steel)" }}>{sub}</p>}
      </div>
    </section>
  );
}
export default PageHero;
