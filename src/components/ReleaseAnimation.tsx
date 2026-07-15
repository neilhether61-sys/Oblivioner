/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, ShieldAlert, KeyRound, Star } from 'lucide-react';

interface ReleaseAnimationProps {
  noteTitle: string;
  noteMood: string;
  onAnimationComplete: () => void;
}

type RitualPhase = 'darkening' | 'floating' | 'smoke' | 'guardian' | 'sealing' | 'complete';

export default function ReleaseAnimation({ noteTitle, noteMood, onAnimationComplete }: ReleaseAnimationProps) {
  const [phase, setPhase] = useState<RitualPhase>('darkening');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // 1. Darkening (1.5 seconds)
    const t1 = setTimeout(() => {
      setPhase('floating');
    }, 1500);

    // 2. Letter floating (2.0 seconds)
    const t2 = setTimeout(() => {
      setPhase('smoke');
    }, 3500);

    // 3. Smoke surrounding (2.0 seconds)
    const t3 = setTimeout(() => {
      setPhase('guardian');
    }, 5500);

    // 4. Guardian rising (2.0 seconds)
    const t4 = setTimeout(() => {
      setPhase('sealing');
    }, 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Handle progress counter for phase 'sealing'
  useEffect(() => {
    if (phase !== 'sealing') return;

    let interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('complete');
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8 + 3);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [phase]);

  // Complete and trigger callback
  useEffect(() => {
    if (phase !== 'complete') return;

    const timeout = setTimeout(() => {
      onAnimationComplete();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [phase, onAnimationComplete]);

  // Messages corresponding to each mystical state
  const getRitualMessage = () => {
    switch (phase) {
      case 'darkening':
        return 'The physical realm recedes. Prepare to let go.';
      case 'floating':
        return `Your secret letter, "${noteTitle}", floats into the void...`;
      case 'smoke':
        return 'Ancient shadows surround your confessions, whispering comfort.';
      case 'guardian':
        return 'The celestial guardian rises to absorb your emotional burden.';
      case 'sealing':
        return 'Sealing your shadow... Dissolving the regret.';
      case 'complete':
        return 'Ritual complete. The seal is set.';
      default:
        return '';
    }
  };

  return (
    <div id="ritual-animation-fullscreen" className="fixed inset-0 w-full h-full bg-black z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Immersive Particle Emissions for Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating dust embers */}
        {phase !== 'darkening' && (
          <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: window.innerHeight + 20, 
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: Math.random() * 0.7 + 0.3 
                }}
                animate={{ 
                  y: -50,
                  x: `calc(10% + ${Math.random() * 100}px)`,
                  opacity: 0
                }}
                transition={{ 
                  duration: Math.random() * 4 + 3, 
                  repeat: Infinity,
                  delay: Math.random() * 2 
                }}
                className={`absolute w-1 h-1 rounded-full ${
                  noteMood === 'Anger' ? 'bg-red-500' : 'bg-purple-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          
          {/* Phase 1: Screen Darkens */}
          {phase === 'darkening' && (
            <motion.div
              key="darkening-visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-black border border-purple-950" />
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Letter appears floating */}
          {phase === 'floating' && (
            <motion.div
              key="floating-visual"
              initial={{ opacity: 0, scale: 0.5, y: 150, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: -5 }}
              exit={{ opacity: 0, scale: 0.8, y: -50, rotate: 5 }}
              transition={{ duration: 1.5, type: 'spring' }}
              className="w-48 h-64 bg-neutral-900/90 border border-neutral-800/80 rounded-xl p-5 shadow-2xl flex flex-col justify-between relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent rounded-xl" />
              <div className="space-y-2 opacity-50">
                <div className="w-12 h-2 bg-neutral-700 rounded" />
                <div className="w-full h-1 bg-neutral-800 rounded" />
                <div className="w-full h-1 bg-neutral-800 rounded" />
                <div className="w-5/6 h-1 bg-neutral-800 rounded" />
              </div>
              
              {/* Symbolic seal stamp on paper */}
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>

              <div className="flex justify-between items-center text-[9px] font-mono text-neutral-600">
                <span>SEALED</span>
                <span>{noteMood.toUpperCase()}</span>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Smoke rising */}
          {phase === 'smoke' && (
            <motion.div
              key="smoke-visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-56 h-72 flex items-center justify-center"
            >
              {/* Floating translucent paper letter in middle */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [-5, -3, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-40 h-52 bg-neutral-950 border border-neutral-900 rounded-lg p-4 shadow-xl z-10 flex flex-col justify-between opacity-70"
              >
                <div className="space-y-1.5 opacity-30">
                  <div className="w-10 h-1 bg-neutral-700 rounded" />
                  <div className="w-full h-1 bg-neutral-800 rounded" />
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-900/20 border border-purple-500/10 mx-auto" />
                <div className="h-1 w-1/2 bg-neutral-800 mx-auto rounded" />
              </motion.div>

              {/* Smoke Tendrils */}
              {[...Array(6)].map((_, idx) => (
                <motion.svg
                  key={idx}
                  viewBox="0 0 100 200"
                  className="absolute bottom-0 w-28 h-60 text-purple-950/40 fill-current filter blur-[4px]"
                  style={{ 
                    left: `${idx * 20 - 10}px`,
                    transformOrigin: 'bottom center',
                  }}
                  animate={{
                    scaleY: [1, 1.2, 1],
                    scaleX: [1, 0.8, 1],
                    skewX: [0, 10, -10, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 4 + idx,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.3
                  }}
                >
                  <path d="M 50,200 C 20,150 20,100 50,50 C 60,30 40,10 50,0 C 60,10 40,30 50,50 C 80,100 80,150 50,200 Z" />
                </motion.svg>
              ))}
            </motion.div>
          )}

          {/* Phase 4: Guardian creature appears */}
          {phase === 'guardian' && (
            <motion.div
              key="guardian-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative w-64 h-64 flex items-center justify-center"
            >
              {/* Giant abstract SVG shadow guardian face with glowing celestial eyes */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <motion.path 
                  d="M 100,20 C 130,10 160,30 170,60 C 180,90 160,130 140,150 C 120,170 80,170 60,150 C 40,130 20,90 30,60 C 40,30 70,10 100,20 Z" 
                  fill="url(#animCreatureGrad)"
                  animate={{
                    d: [
                      "M 100,20 C 130,10 160,30 170,60 C 180,90 160,130 140,150 C 120,170 80,170 60,150 C 40,130 20,90 30,60 C 40,30 70,10 100,20 Z",
                      "M 100,15 C 135,15 165,25 175,55 C 185,85 155,125 135,155 C 115,175 85,175 65,155 C 45,125 15,85 25,55 C 35,25 65,15 100,15 Z",
                      "M 100,20 C 130,10 160,30 170,60 C 180,90 160,130 140,150 C 120,170 80,170 60,150 C 40,130 20,90 30,60 C 40,30 70,10 100,20 Z"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                {/* Glowing eyes */}
                <motion.g
                  animate={{
                    scaleY: [1, 0.1, 1, 1], // Blink cycle
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  style={{ transformOrigin: '100px 90px' }}
                >
                  <ellipse cx="75" cy="90" rx="6" ry="6" fill="#e9d5ff" />
                  <ellipse cx="75" cy="90" rx="2" ry="2" fill="#ffffff" />
                  <ellipse cx="125" cy="90" rx="6" ry="6" fill="#e9d5ff" />
                  <ellipse cx="125" cy="90" rx="2" ry="2" fill="#ffffff" />
                </motion.g>

                <defs>
                  <radialGradient id="animCreatureGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#080512" />
                    <stop offset="65%" stopColor="#1e1030" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          )}

          {/* Phase 5: Sealing Ritual ring progress */}
          {phase === 'sealing' && (
            <motion.div
              key="sealing-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Mystical loading ring with rune markings */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                
                {/* Rotating rune circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border border-red-500/10"
                />

                {/* Concentric Progress SVG */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-neutral-950 fill-none"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    className="stroke-purple-500/70 fill-none"
                    strokeWidth="3.5"
                    strokeDasharray="241"
                    strokeDashoffset={241 - (241 * loadingProgress) / 100}
                  />
                </svg>

                {/* Value display */}
                <div className="flex flex-col items-center">
                  <span className="font-mono text-2xl font-bold text-neutral-100">{loadingProgress}%</span>
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase mt-1">SEALING</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 6: Completed final seal */}
          {phase === 'complete' && (
            <motion.div
              key="complete-visual"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: [1, 1.2, 1] }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Massive lock / Seal icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-900 to-red-950 border border-purple-400/40 flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <KeyRound className="w-9 h-9 text-purple-200 animate-pulse" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h3 className="font-serif text-lg tracking-widest text-purple-300 uppercase">Shadow Sealed</h3>
                <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">BURDEN ENTRUSTED TO THE VOID</p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Narrative Legend Caption */}
      <div className="absolute bottom-16 left-0 right-0 text-center px-6">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 max-w-sm mx-auto"
        >
          <p className="font-serif text-neutral-200 text-sm md:text-base leading-relaxed">
            {getRitualMessage()}
          </p>
          <div className="flex justify-center space-x-1.5 opacity-30">
            {['darkening', 'floating', 'smoke', 'guardian', 'sealing', 'complete'].map((p) => (
              <div 
                key={p} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  p === phase 
                    ? 'w-4 bg-purple-500 opacity-100' 
                    : 'w-1.5 bg-neutral-800'
                }`} 
              />
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
