import React from 'react';

export default function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <div className={`anim-fade-up ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
