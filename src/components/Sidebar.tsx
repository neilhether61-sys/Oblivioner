/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  FileText, 
  PenTool, 
  Hourglass, 
  Settings as SettingsIcon, 
  HelpCircle,
  Sparkles,
  Flame,
  Activity,
  Trash2
} from 'lucide-react';
import { PageId } from '../types';
import OblivionLogo from './OblivionLogo';

interface SidebarProps {
  currentPage: PageId;
  activeSection: 'all' | 'drafts' | 'releasing' | 'settings';
  draftsCount: number;
  releasingCount: number;
  purgedCount: number;
  onNavigate: (page: PageId) => void;
  onSelectSection: (section: 'all' | 'drafts' | 'releasing' | 'settings') => void;
  onNewNote: () => void;
}

export default function Sidebar({
  currentPage,
  activeSection,
  draftsCount,
  releasingCount,
  purgedCount,
  onNavigate,
  onSelectSection,
  onNewNote
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      id: 'all' as const, 
      label: 'Oblivion Letters', 
      desc: 'All hidden documents', 
      icon: FileText, 
      count: draftsCount + releasingCount 
    },
    { 
      id: 'drafts' as const, 
      label: 'Drafts', 
      desc: 'Letters being sculpted', 
      icon: PenTool, 
      count: draftsCount 
    },
    { 
      id: 'releasing' as const, 
      label: 'Released Notes', 
      desc: 'Active countdown timers', 
      icon: Hourglass, 
      count: releasingCount 
    },
    { 
      id: 'settings' as const, 
      label: 'Settings', 
      desc: 'Customize visual sanctum', 
      icon: SettingsIcon, 
      count: 0 
    },
  ];

  const handleItemClick = (id: 'all' | 'drafts' | 'releasing' | 'settings') => {
    if (id === 'settings') {
      onNavigate('settings');
      onSelectSection('settings');
    } else {
      onNavigate('dashboard');
      onSelectSection(id);
    }
    setIsOpen(false);
  };

  const handleCreateNote = () => {
    onNewNote();
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between p-6 bg-neutral-950 border-r border-neutral-900 text-white z-20">
      
      {/* Top Section: Branding & Creation */}
      <div className="space-y-8">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => { onNavigate('landing'); setIsOpen(false); }} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <OblivionLogo className="w-9 h-9 shadow-lg shadow-purple-500/10 hover:scale-105 transition-transform" />
          <div>
            <span className="font-serif text-sm tracking-widest text-neutral-100 block group-hover:text-purple-300 transition-colors">OBLIVION</span>
            <span className="text-[9px] font-mono tracking-wider text-neutral-500 block">RELEASE PORTAL</span>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleCreateNote}
          className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 border border-purple-500/20 text-purple-200 text-xs font-mono font-medium tracking-wider uppercase hover:border-purple-500/40 hover:bg-neutral-950 hover:text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/10 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-purple-400" />
          <span>Sculpt Oblivion Letter</span>
        </button>

        {/* Navigation items */}
        <div className="space-y-1">
          <span className="block text-[9px] font-mono text-neutral-600 tracking-widest uppercase px-3 pb-2">
            Categories
          </span>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = 
                (item.id === 'settings' && currentPage === 'settings') ||
                (item.id !== 'settings' && currentPage === 'dashboard' && activeSection === item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left group transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-950/20 border-purple-900/40 text-purple-300' 
                      : 'bg-transparent border-transparent hover:bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isSelected ? 'text-purple-400' : 'text-neutral-500 group-hover:text-neutral-300'
                    }`} />
                    <div>
                      <span className="text-xs font-mono font-medium block">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 font-light block line-clamp-1">{item.desc}</span>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-purple-900/40 text-purple-200 border border-purple-500/10' 
                        : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Safe Zone Stats Card */}
      <div className="space-y-4 pt-4 border-t border-neutral-900">
        <div className="p-4 bg-neutral-950 border border-neutral-900/80 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-neutral-400 text-[10px] font-mono uppercase">
            <Activity className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span>Ritual Safe Zone</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-0.5">
              <span className="text-[10px] font-sans text-neutral-500 block">Purged</span>
              <span className="text-sm font-mono font-bold text-neutral-200">{purgedCount}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-sans text-neutral-500 block">Releasing</span>
              <span className="text-sm font-mono font-bold text-purple-400">{releasingCount}</span>
            </div>
          </div>

          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-red-500 h-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${purgedCount + releasingCount > 0 
                  ? (purgedCount / (purgedCount + releasingCount)) * 100 
                  : 0}%` 
              }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className="block text-[9px] font-mono text-neutral-600">
            {purgedCount > 0 
              ? `${purgedCount} burden${purgedCount === 1 ? '' : 's'} dissolved to stardust` 
              : 'No burdens faded yet'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header + Burger */}
      <div className="md:hidden w-full bg-neutral-950 border-b border-neutral-900 px-4 py-3 flex justify-between items-center fixed top-0 left-0 z-20 text-white">
        <div className="flex items-center space-x-2" onClick={() => onNavigate('landing')}>
          <OblivionLogo className="w-6 h-6 shadow-md" />
          <span className="font-serif text-sm tracking-widest text-neutral-200">OBLIVION</span>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleCreateNote}
            className="p-1.5 bg-neutral-900 rounded-lg border border-purple-500/20 text-purple-300"
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Slide Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-10"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 h-screen w-64 z-20 pt-14 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
