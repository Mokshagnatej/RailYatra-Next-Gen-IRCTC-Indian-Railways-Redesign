import React from 'react';

function PageHero({ eyebrow, title, sub, small }) {
  return (
    <section className="paper-texture relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--blue) 0%, var(--blue-2) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-12 md:pb-20">
        <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold)" }}>{eyebrow}</p>
        <h1 className={`f-display ${small ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"} font-semibold text-white mt-2 max-w-xl`}>{title}</h1>
        {sub && <p className="text-sm mt-2 max-w-lg" style={{ color: "#C7D2DD" }}>{sub}</p>}
      </div>
    </section>
  );
}
export default PageHero;
