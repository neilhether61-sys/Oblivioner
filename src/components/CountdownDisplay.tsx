/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hourglass, Flame, Sparkles } from 'lucide-react';

interface CountdownDisplayProps {
  releasedAt: number;
  duration: number;
  onComplete?: () => void;
  size?: 'small' | 'large';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export default function CountdownDisplay({ releasedAt, duration, onComplete, size = 'small' }: CountdownDisplayProps) {
  const targetTime = releasedAt + duration;

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = Date.now();
    const totalMs = targetTime - now;

    if (totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }

    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, totalMs };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    // Initial check
    const initial = calculateTimeRemaining();
    setTimeLeft(initial);
    if (initial.totalMs <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeLeft(remaining);

      if (remaining.totalMs <= 0) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [releasedAt, duration]);

  const percentageLeft = Math.max(0, Math.min(100, (timeLeft.totalMs / duration) * 100));

  // Monospace block display helper
  const TimeBlock = ({ value, label }: { value: number; label: string }) => {
    const formatted = String(value).padStart(2, '0');
    return (
      <div className="flex flex-col items-center">
        <div className={`bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center font-mono font-bold tracking-tight text-white relative shadow-inner shadow-black/80 ${
          size === 'large' 
            ? 'w-16 h-16 text-2xl md:w-20 md:h-20 md:text-4xl' 
            : 'w-11 h-11 text-sm md:w-12 md:h-12 md:text-base'
        }`}>
          {/* Top subtle glow split */}
          <div className="absolute inset-x-0 top-0 h-[50%] bg-white/[0.02] border-b border-black/40 rounded-t-xl" />
          <span className="relative z-10">{formatted}</span>
          
          {/* Glow indicator */}
          {percentageLeft < 20 && (
            <span className="absolute inset-0 bg-red-500/5 rounded-xl animate-pulse" />
          )}
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-1.5 font-medium ${
          size === 'large' ? 'text-[10px]' : ''
        }`}>
          {label}
        </span>
      </div>
    );
  };

  if (size === 'large') {
    return (
      <div className="flex flex-col items-center space-y-6">
        
        {/* Circular Burning Aura Indicator */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center">
          
          {/* Outer rotating/pulsing ring */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-neutral-900 fill-none"
              strokeWidth="4"
            />
            {/* Active Progress */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="44%"
              className={`fill-none ${
                percentageLeft < 20 ? 'stroke-red-500/80' : 'stroke-purple-500/60'
              }`}
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * percentageLeft) / 100}
              transition={{ ease: "linear", duration: 1 }}
            />
          </svg>

          {/* Core Content */}
          <div className="absolute inset-4 rounded-full bg-neutral-950 border border-neutral-900/60 flex flex-col items-center justify-center text-center p-4">
            <Hourglass className={`w-6 h-6 animate-spin mb-1 ${
              percentageLeft < 20 ? 'text-red-500/60' : 'text-purple-500/40'
            }`} style={{ animationDuration: '4s' }} />
            
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">DISSOLVING</span>
            <span className="text-xl md:text-2xl font-mono font-bold text-white mt-1">
              {percentageLeft.toFixed(1)}%
            </span>
            <span className="text-[9px] font-sans text-neutral-600 mt-0.5">remaining</span>
          </div>

          {/* Sparks/Embers on ring */}
          {percentageLeft < 50 && (
            <div className="absolute inset-0 animate-pulse pointer-events-none">
              <Sparkles className="absolute top-2 left-10 w-3 h-3 text-red-500/30 animate-ping" />
              <Sparkles className="absolute bottom-4 right-12 w-4 h-4 text-purple-500/20 animate-bounce" />
            </div>
          )}
        </div>

        {/* Big Monospace Numbers */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-xl text-neutral-600 font-mono self-start mt-4 animate-pulse">:</span>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <span className="text-xl text-neutral-600 font-mono self-start mt-4 animate-pulse">:</span>
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <span className="text-xl text-neutral-600 font-mono self-start mt-4 animate-pulse">:</span>
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>

        {/* Small Progress Line Bar */}
        <div className="w-full max-w-sm space-y-1">
          <div className="w-full h-[3px] bg-neutral-900 rounded-full overflow-hidden relative">
            <motion.div 
              className={`h-full rounded-full ${
                percentageLeft < 20 
                  ? 'bg-gradient-to-r from-red-600 to-amber-600' 
                  : 'bg-gradient-to-r from-purple-600 to-red-600'
              }`}
              style={{ width: `${percentageLeft}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-neutral-600">
            <span>BURNING INTENSITY</span>
            <span>{percentageLeft < 20 ? 'CRITICAL VANISH' : 'SLOW SMOKE'}</span>
          </div>
        </div>

      </div>
    );
  }

  // Small size for dashboard lists
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 font-mono text-[13px] font-semibold text-purple-400">
          <span className="w-8 py-0.5 bg-neutral-900 border border-neutral-800/80 rounded text-center text-white">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-neutral-700 font-normal">:</span>
          <span className="w-8 py-0.5 bg-neutral-900 border border-neutral-800/80 rounded text-center text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-neutral-700 font-normal">:</span>
          <span className="w-8 py-0.5 bg-neutral-900 border border-neutral-800/80 rounded text-center text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-neutral-700 font-normal">:</span>
          <span className="w-8 py-0.5 bg-neutral-900 border border-neutral-800/80 rounded text-center text-red-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Tiny slide meter */}
      <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            percentageLeft < 20 ? 'bg-red-500' : 'bg-purple-500/80'
          }`}
          style={{ width: `${percentageLeft}%` }}
        />
      </div>
    </div>
  );
}
