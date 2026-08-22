import React, { useState, useEffect, useRef } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.% ';

function Flap({ char, delay, isFlipping }) {
  const [current, setCurrent] = useState(' ');
  const [next, setNext] = useState(' ');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!isFlipping) return;
    
    let timer;
    const animateFlap = () => {
      setNext(char);
      setAnimating(true);
      
      timer = setTimeout(() => {
        setCurrent(char);
        setAnimating(false);
      }, 130);
    };

    const delayTimer = setTimeout(() => {
      // Start rapid fluttering
      let step = 0;
      const cycles = 3 + Math.floor(Math.random() * 3);
      
      const flutter = () => {
        if (step < cycles) {
          const rand = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          setNext(rand);
          setAnimating(true);
          setTimeout(() => {
            setCurrent(rand);
            setAnimating(false);
            step++;
            setTimeout(flutter, 130);
          }, 130);
        } else {
          animateFlap();
        }
      };
      flutter();
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timer);
    };
  }, [char, delay, isFlipping]);

  // If not currently animating but char changed (initial load)
  useEffect(() => {
    if (!isFlipping && current !== char) {
      setCurrent(char);
      setNext(char);
    }
  }, [char, isFlipping, current]);

  return (
    <div className={`flap ${animating ? 'flipping' : ''}`}>
      <div className="layer front-top"><span>{current}</span></div>
      <div className="layer front-bottom"><span>{current}</span></div>
      <div className="layer flip-top"><span>{current}</span></div>
      <div className="layer flip-bottom"><span>{next}</span></div>
    </div>
  );
}

export default function SplitFlap({ words = ['ON TIME.', 'CONFIRMED.', 'NO GUESSWORK.'], interval = 3200 }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const currentWord = words[wordIndex] || '';
  
  useEffect(() => {
    const cycle = setInterval(() => {
      setIsFlipping(true);
      setWordIndex((prev) => (prev + 1) % words.length);
      
      // Reset flip state after animation finishes
      setTimeout(() => setIsFlipping(false), 2000); 
    }, interval);
    
    return () => clearInterval(cycle);
  }, [words.length, interval]);

  // Ensure constant width or flex layout
  return (
    <div className="flapboard inline-flex flex-wrap gap-1">
      {currentWord.split('').map((char, i) => (
        <Flap key={`${wordIndex}-${i}`} char={char} delay={i * 40} isFlipping={isFlipping} />
      ))}
    </div>
  );
}
