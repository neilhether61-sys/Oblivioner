/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  PenTool, 
  Lock, 
  Hourglass, 
  FileUp, 
  Sparkles, 
  EyeOff, 
  BookOpen, 
  Flame,
  ChevronDown
} from 'lucide-react';
import { PageId } from '../types';
import OblivionLogo from './OblivionLogo';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  onExploreHowItWorks: () => void;
}

export default function LandingPage({ onNavigate, onExploreHowItWorks }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'steps' | 'features'>('steps');

  return (
    <div id="landing-page-container" className="relative min-h-screen text-white flex flex-col items-center justify-between overflow-hidden px-4 py-8 md:py-16">
      
      {/* Decorative Mysterious Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-purple-950/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-red-950/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header/Title logo */}
      <motion.div 
        id="landing-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-6xl flex justify-between items-center z-10 mb-8 md:mb-12"
      >
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <OblivionLogo className="w-8 h-8 shadow-lg shadow-purple-500/10 hover:scale-105 transition-transform" />
          <span className="font-serif text-xl tracking-widest text-neutral-200">OBLIVION</span>
        </div>
        
        <button 
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/50 text-xs font-medium tracking-wider uppercase hover:border-purple-500/40 hover:text-purple-300 transition-all duration-300"
        >
          Enter Portal
        </button>
      </motion.div>

      {/* Main Hero Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        
        {/* Left column: Text Content */}
        <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-950/20 border border-purple-900/30 rounded-full text-xs text-purple-300 tracking-wider font-mono uppercase"
          >
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>A Safe Haven for Your Burdens</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-neutral-100"
            >
              Release What <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-neutral-200 to-red-400 filter drop-shadow-[0_2px_15px_rgba(139,92,246,0.3)]">
                Haunts You.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-neutral-400 text-base md:text-lg max-w-lg font-sans font-light leading-relaxed"
            >
              Write your hidden worries, private regrets, or burning fears into secret letters. Seal them, start the ritual, and watch them dissolve into the shadows forever.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-white text-black font-semibold tracking-wider flex items-center justify-center space-x-2 hover:bg-neutral-200 transition-all duration-300 shadow-xl shadow-white/5 active:scale-[0.98] cursor-pointer"
            >
              <span>Create Oblivion Letter</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreHowItWorks}
              className="px-6 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-300 font-medium tracking-wider flex items-center justify-center space-x-2 hover:bg-neutral-800/60 hover:text-white transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-neutral-500" />
              <span>How It Works</span>
            </button>
          </motion.div>
        </div>

        {/* Right column: Breathing Shadow Creature Visual */}
        <motion.div
          id="hero-visual"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="lg:col-span-5 relative flex items-center justify-center py-8"
        >
          {/* Animated paper letter floating behind/beside the creature */}
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-10 w-24 h-32 bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-lg p-3 shadow-2xl shadow-black/80 flex flex-col justify-between"
          >
            <div className="space-y-1.5 opacity-60">
              <div className="w-10 h-1.5 bg-neutral-700 rounded" />
              <div className="w-full h-1 bg-neutral-800 rounded" />
              <div className="w-full h-1 bg-neutral-800 rounded" />
              <div className="w-5/6 h-1 bg-neutral-800 rounded" />
            </div>
            <div className="w-full flex justify-end">
              <Flame className="w-4 h-4 text-red-500/50" />
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [15, -15, 15],
              rotate: [3, -3, 3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-6 left-2 w-20 h-28 bg-purple-950/20 backdrop-blur-sm border border-purple-900/30 rounded-lg p-2.5 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-1.5 opacity-50">
              <div className="w-8 h-1 bg-purple-800/60 rounded" />
              <div className="w-full h-1 bg-purple-800/40 rounded" />
              <div className="w-2/3 h-1 bg-purple-800/40 rounded" />
            </div>
            <div className="w-full flex justify-end">
              <Hourglass className="w-3.5 h-3.5 text-purple-400/50 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </motion.div>

          {/* Creature Container & Breath Pulse */}
          <div className="relative w-[300px] h-[340px] md:w-[350px] md:h-[400px]">
            {/* Pulsing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-red-900/10 rounded-full blur-[80px]"
            />

            {/* Custom SVG Mystic Shadow Creature Silhouette */}
            <svg
              id="shadow-creature-silhouette"
              viewBox="0 0 400 450"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(74,29,109,0.35)]"
            >
              {/* Outer smoke layers */}
              <motion.path
                d="M 200,80 C 250,50 320,100 330,160 C 340,220 300,280 320,340 C 330,370 300,410 250,420 C 200,430 150,410 120,380 C 100,360 80,320 80,280 C 80,220 120,180 130,140 C 140,100 160,50 200,80 Z"
                fill="url(#creatureGradientOuter)"
                animate={{
                  d: [
                    "M 200,80 C 250,50 320,100 330,160 C 340,220 300,280 320,340 C 330,370 300,410 250,420 C 200,430 150,410 120,380 C 100,360 80,320 80,280 C 80,220 120,180 130,140 C 140,100 160,50 200,80 Z",
                    "M 200,75 C 245,55 315,95 335,165 C 345,215 305,275 315,345 C 325,375 295,405 245,415 C 205,425 155,415 125,385 C 95,355 85,315 85,275 C 85,225 115,175 125,135 C 135,95 165,55 200,75 Z",
                    "M 200,80 C 250,50 320,100 330,160 C 340,220 300,280 320,340 C 330,370 300,410 250,420 C 200,430 150,410 120,380 C 100,360 80,320 80,280 C 80,220 120,180 130,140 C 140,100 160,50 200,80 Z"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Core Body silhouette */}
              <motion.path
                d="M 200,100 C 235,70 290,110 300,160 C 310,210 270,260 285,320 C 300,380 250,400 200,400 C 150,400 100,380 115,320 C 130,260 90,210 100,160 C 110,110 165,70 200,100 Z"
                fill="url(#creatureGradientInner)"
                animate={{
                  scaleY: [1, 1.03, 1],
                  scaleX: [1, 0.98, 1],
                }}
                style={{ originX: '200px', originY: '400px' }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Swirling celestial sparks and mystical chest core */}
              <circle cx="200" cy="240" r="25" fill="url(#coreGlow)" opacity="0.6" />
              
              {/* Star-like pulsing eyes */}
              <motion.g
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Left eye star */}
                <path d="M 170,165 L 172,170 L 177,172 L 172,174 L 170,179 L 168,174 L 163,172 L 168,170 Z" fill="#e9d5ff" />
                <circle cx="170" cy="172" r="1.5" fill="#ffffff" />
                
                {/* Right eye star */}
                <path d="M 230,165 L 232,170 L 237,172 L 232,174 L 230,179 L 228,174 L 223,172 L 228,170 Z" fill="#e9d5ff" />
                <circle cx="230" cy="172" r="1.5" fill="#ffffff" />
              </motion.g>

              {/* Floating soot/smoke lines orbiting creature */}
              <motion.ellipse 
                cx="200" cy="380" rx="90" ry="15" 
                fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.5"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ originX: '200px', originY: '380px' }}
              />

              {/* Definitions for Gradients */}
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="60%" stopColor="#4a1d6d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="creatureGradientOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a0b2e" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0a0a0f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2e0b11" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="creatureGradientInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c0714" />
                  <stop offset="50%" stopColor="#110d1a" />
                  <stop offset="100%" stopColor="#170c0f" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Floating prompt scroll arrow */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 flex flex-col items-center space-y-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer mb-6"
        onClick={onExploreHowItWorks}
      >
        <span className="text-xs font-mono tracking-widest text-neutral-400">DISCOVER THE RITUAL</span>
        <ChevronDown className="w-4 h-4 text-purple-400" />
      </motion.div>

      {/* Narrative Section & Details */}
      <div id="how-it-works-anchor" className="w-full max-w-5xl z-10 pt-16 border-t border-neutral-900 mt-16 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">The Mechanics of Release</h2>
            <p className="text-neutral-400 font-sans font-light max-w-md">
              Shadow Note is designed around the psychology of letting go. By turning silent burdens into concrete writing, you separate yourself from them.
            </p>
          </div>
          
          <div className="flex bg-neutral-900/60 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setActiveTab('steps')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                activeTab === 'steps' 
                  ? 'bg-neutral-800 text-purple-300 border border-purple-500/20' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              The Ritual Steps
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                activeTab === 'features' 
                  ? 'bg-neutral-800 text-purple-300 border border-purple-500/20' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Mystic Features
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'steps' ? (
            <motion.div
              key="steps-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  step: "01",
                  title: "Write Your Problem",
                  desc: "Confess what is weighing on you. The editor is designed in full privacy; your thoughts never leave this browser.",
                  icon: PenTool,
                  color: "border-purple-950 hover:border-purple-500/30"
                },
                {
                  step: "02",
                  title: "Seal the Letter",
                  desc: "Commit to releasing it. You can attach a symbolic image or document file to lock with the worry.",
                  icon: Lock,
                  color: "border-neutral-900 hover:border-neutral-500/30"
                },
                {
                  step: "03",
                  title: "Trigger the Ritual",
                  desc: "Watch the shadows surround and lock the note in an immersive cinematic interface, setting the cosmic timer.",
                  icon: Sparkles,
                  color: "border-red-950 hover:border-red-500/30"
                },
                {
                  step: "04",
                  title: "Fade to Oblivion",
                  desc: "As the clock counts down, the note burns. Once the timer reaches zero, the memory is purged forever.",
                  icon: Hourglass,
                  color: "border-neutral-900 hover:border-purple-500/30"
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`bg-neutral-950/60 backdrop-blur-md border ${item.color} p-6 rounded-2xl space-y-4 hover:shadow-xl hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-purple-500/70 font-semibold">{item.step}</span>
                      <item.icon className="w-5 h-5 text-neutral-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <h3 className="font-serif text-lg tracking-wide text-neutral-200">{item.title}</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed font-light font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="features-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: "Private Local Sanctum",
                  desc: "Built entirely with local, non-network storage. Your letters, problems, and uploads stay 100% private inside your browser cache.",
                  icon: EyeOff,
                  highlight: "Absolute Privacy"
                },
                {
                  title: "Symbolic File Attachments",
                  desc: "Attach photos, documents, or screenshots related to your concern. Seal them within the letter and let them burn together.",
                  icon: FileUp,
                  highlight: "Symbolic Purge"
                },
                {
                  title: "Adaptive Ritual Speeds",
                  desc: "Choose countdown periods ranging from a standard 30-day slow release to a 1-minute demo burn for immediate visual relief.",
                  icon: Hourglass,
                  highlight: "Flexible Timers"
                },
                {
                  title: "Cinematic Dark Rituals",
                  desc: "Experience high-fidelity loading shadows, smoke rituals, and interactive particles designed to engage your focus.",
                  icon: Flame,
                  highlight: "Fictional Ritual"
                },
                {
                  title: "Atmospheric Soundscapes",
                  desc: "Toggle deep, ambient visual intensities matching your desired release state, from a light fog to the complete cosmic void.",
                  icon: Sparkles,
                  highlight: "Bespoke Styling"
                },
                {
                  title: "Safe Draft Safeguards",
                  desc: "Save drafts of your thoughts while you're still processing them. Take all the time you need before initiating the final seal.",
                  icon: PenTool,
                  highlight: "Draft Storage"
                }
              ].map((feat, idx) => (
                <div 
                  key={idx} 
                  className="bg-neutral-950/40 backdrop-blur-sm border border-neutral-900 hover:border-neutral-800 p-6 rounded-2xl space-y-3 group transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="p-2 bg-neutral-900/80 rounded-lg group-hover:bg-purple-950/40 transition-colors">
                      <feat.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-purple-500 bg-purple-950/20 px-2 py-0.5 rounded-full border border-purple-900/30">
                      {feat.highlight}
                    </span>
                  </div>
                  <h3 className="font-serif text-base tracking-wide text-neutral-200 pt-1">{feat.title}</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed font-sans font-light">{feat.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl z-10 text-center text-neutral-600 text-xs font-light font-sans pt-12 mt-12 border-t border-neutral-950">
        <p>© 2026 Shadow Note. A dark-mystic fictional release journal.</p>
        <p className="mt-1 opacity-70">Crafted with absolute privacy. No letters ever touch any server.</p>
      </footer>

    </div>
  );
}
