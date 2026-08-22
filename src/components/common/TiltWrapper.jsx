import React, { useRef, useEffect } from 'react';

export default function TiltWrapper({ children, className = '', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover:none), (pointer:coarse)').matches) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;

    const render = () => {
      // Smooth spring interpolation
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const translateY = isHovered ? -4 : 0;
      el.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(${translateY}px)`;

      if (isHovered || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = -py * 7;
      targetY = px * 7;

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
      el.style.boxShadow = '0 30px 60px -15px rgba(10,22,38,0.35), 0 0 0 1px rgba(10,22,38,0.08)';
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      el.style.boxShadow = '0 20px 40px -15px rgba(10,22,38,0.25), 0 0 0 1px rgba(10,22,38,0.06)';
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform, box-shadow',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {children}
    </div>
  );
}
