import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const SHOTS = [
  { id: '1', title: 'Departing the Station', duration: 8, image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=2000' },
  { id: '2', title: 'Speeding through Countryside', duration: 10, image: 'https://images.unsplash.com/photo-1496350756381-d1c9fb8b0d2f?auto=format&fit=crop&q=80&w=2000' },
  { id: '3', title: 'Crossing the River Bridge', duration: 7, image: 'https://images.unsplash.com/photo-1628243452445-560bf974b94a?auto=format&fit=crop&q=80&w=2000' },
  { id: '4', title: 'Sunset Arrival', duration: 10, image: 'https://images.unsplash.com/photo-1534062033054-7f1c1fce9db5?auto=format&fit=crop&q=80&w=2000' },
];

export default function CinematicStory() {
  const [activeShot, setActiveShot] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    let startTime;
    const currentDuration = SHOTS[activeShot].duration * 1000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percent = (elapsed / currentDuration) * 100;

      if (percent >= 100) {
        if (activeShot < SHOTS.length - 1) {
          setActiveShot(s => s + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
          setProgress(100);
        }
      } else {
        setProgress(percent);
        if (isPlaying) frame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying && activeShot < SHOTS.length) {
      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [isPlaying, activeShot]);

  const togglePlay = () => {
    if (activeShot === SHOTS.length - 1 && progress === 100) {
      setActiveShot(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden group">
      {/* Shots (Images with Ken Burns Effect) */}
      {SHOTS.map((shot, index) => (
        <div 
          key={shot.id}
          className={`absolute inset-0 transition-opacity duration-1000 bg-black flex items-center justify-center overflow-hidden`}
          style={{ opacity: index === activeShot ? 1 : 0, zIndex: index === activeShot ? 10 : 0 }}
        >
          {/* Animated Background Image simulating a video pan */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${shot.image}')`,
              // If it's the active shot, apply a slow zoom/pan animation
              animation: index === activeShot && isPlaying ? `ken-burns ${shot.duration}s linear forwards` : 'none',
              transform: index === activeShot && !isPlaying ? 'scale(1.05)' : 'scale(1)',
              filter: 'brightness(0.7)'
            }}
          />

          {/* Cinematic Title Overlay */}
          <div className={`relative z-10 text-center space-y-4 transition-all duration-1000 delay-300 ${index === activeShot ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="f-accent text-sm tracking-widest uppercase text-white/70">Cinematic Shot {index + 1}</p>
            <h2 className="f-heading text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">{shot.title}</h2>
          </div>
        </div>
      ))}

      {/* Overlay UI Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-20 pointer-events-none" />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-30 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer pointer-events-auto"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex-1">
            <p className="text-white font-semibold mb-2">{SHOTS[activeShot].title}</p>
            {/* Timeline Progress */}
            <div className="flex gap-2">
              {SHOTS.map((shot, index) => (
                <div key={shot.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer pointer-events-auto" onClick={() => { setActiveShot(index); setProgress(0); setIsPlaying(true); }}>
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ 
                      width: index === activeShot ? `${progress}%` : index < activeShot ? '100%' : '0%' 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
