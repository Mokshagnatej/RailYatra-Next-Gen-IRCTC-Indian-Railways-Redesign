import React, { useEffect, useRef } from 'react';

export default function CinematicHeroScenery() {
  const bgRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateTransform = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        // Calculate zoom scale based on scroll position (max scale 1.15 at 1000px scroll)
        const scale = 1.05 + Math.min(scrollY / 5000, 0.10);
        // Also translate slightly down to keep the focal point centered as we scale
        const translateY = scrollY * 0.15; // subtle parallax translation
        
        bgRef.current.style.transform = `scale(${scale}) translate3d(0, ${translateY}px, 0)`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTransform);
        ticking = true;
      }
    };

    // Initial call to set correct state on load
    updateTransform();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* High Quality Reference Image as Hero Background with Scroll Parallax Zoom */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center will-change-transform"
        style={{ 
          backgroundImage: `url('${import.meta.env.BASE_URL || '/'}train-reference.jpg')`, 
          filter: 'brightness(0.65) saturate(1.2)',
          transform: 'scale(1.05) translate3d(0, 0, 0)'
        }}
      ></div>
      
      {/* Cinematic Vignette Overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F2A45]/80 via-transparent to-[#F7F4EC] dark:to-[#0A192F] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
