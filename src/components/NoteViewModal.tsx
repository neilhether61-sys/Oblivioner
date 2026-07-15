/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Flame, 
  FileEdit, 
  Trash2, 
  Paperclip, 
  Calendar, 
  Sparkles, 
  Lock, 
  Clock, 
  ArrowRight,
  HeartCrack,
  Frown,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ShadowNote, MoodType } from '../types';
import CountdownDisplay from './CountdownDisplay';

interface NoteViewModalProps {
  note: ShadowNote;
  onClose: () => void;
  onContinueWriting: (note: ShadowNote) => void;
  onRelease: (note: ShadowNote) => void;
  onDeleteNote: (id: string) => void;
  onTimerComplete: (id: string) => void;
}

const MOOD_CONFIGS: Record<MoodType, { color: string; bg: string; label: string; icon: any; glow: string }> = {
  Fear: { 
    color: 'text-purple-400 border-purple-500/20', 
    bg: 'bg-purple-950/20', 
    label: 'Fear', 
    icon: HeartCrack,
    glow: 'shadow-[0_0_30px_rgba(167,139,250,0.1)]'
  },
  Regret: { 
    color: 'text-blue-400 border-blue-500/20', 
    bg: 'bg-blue-950/20', 
    label: 'Regret', 
    icon: Frown,
    glow: 'shadow-[0_0_30px_rgba(96,165,250,0.1)]'
  },
  Stress: { 
    color: 'text-yellow-400 border-yellow-500/20', 
    bg: 'bg-yellow-950/20', 
    label: 'Stress', 
    icon: Zap,
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.1)]'
  },
  Anger: { 
    color: 'text-red-400 border-red-500/20', 
    bg: 'bg-red-950/20', 
    label: 'Anger', 
    icon: Flame,
    glow: 'shadow-[0_0_30px_rgba(248,113,113,0.1)]'
  },
  Other: { 
    color: 'text-neutral-400 border-neutral-700', 
    bg: 'bg-neutral-900/30', 
    label: 'Other', 
    icon: HelpCircle,
    glow: 'shadow-[0_0_30px_rgba(163,163,163,0.05)]'
  }
};

export default function NoteViewModal({
  note,
  onClose,
  onContinueWriting,
  onRelease,
  onDeleteNote,
  onTimerComplete
}: NoteViewModalProps) {
  const isReleasing = note.status === 'releasing';
  const moodConfig = MOOD_CONFIGS[note.mood];
  const MoodIcon = moodConfig.icon;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="note-view-modal-backdrop" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Background clicking exits */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 25 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`bg-neutral-950 border border-neutral-900 w-full max-w-4xl rounded-3xl overflow-hidden relative z-10 shadow-2xl ${moodConfig.glow}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glowing bars */}
        {isReleasing ? (
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-purple-500 via-red-500 to-purple-500" />
        ) : (
          <div className="absolute top-0 inset-x-0 h-[2px] bg-neutral-800" />
        )}

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-neutral-900/60 hover:bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-500 hover:text-white transition-all cursor-pointer z-20"
          title="Close full-screen"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[480px]">
          
          {/* LEFT AREA: Note Information and Main Content Body */}
          <div className={`p-6 md:p-10 flex flex-col justify-between ${
            isReleasing ? 'md:col-span-7 border-b md:border-b-0 md:border-r border-neutral-900' : 'md:col-span-8 border-b md:border-b-0 md:border-r border-neutral-900'
          }`}>
            <div className="space-y-6">
              {/* Header Tags */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`text-[10px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 ${moodConfig.color} ${moodConfig.bg}`}>
                  <MoodIcon className="w-3.5 h-3.5" />
                  <span>{moodConfig.label} burden</span>
                </span>
              </div>

              {/* Title heading */}
              <div className="space-y-1.5">
                <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-neutral-100">
                  {note.title}
                </h1>
                <div className="flex items-center space-x-2 text-neutral-600 text-[10px] font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Recorded on: {formatDate(note.createdAt)}</span>
                </div>
              </div>

              {/* Content Body: beautifully spaced text */}
              <div className="text-neutral-300 text-sm md:text-base leading-relaxed font-sans font-light whitespace-pre-wrap max-h-[280px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-neutral-800">
                {note.content}
              </div>
            </div>

            {/* Symbolic Attachment Box if any */}
            {note.attachment && (
              <div className="mt-8 p-3.5 bg-neutral-950 border border-neutral-900 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {note.attachment.type.startsWith('image/') ? (
                    <img 
                      src={note.attachment.dataUrl} 
                      alt="Confession Symbol" 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg border border-neutral-800 bg-neutral-900" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-950/30 border border-purple-900/30 flex items-center justify-center">
                      <Paperclip className="w-5.5 h-5.5 text-purple-400" />
                    </div>
                  )}
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-mono text-neutral-300 truncate max-w-[180px]">{note.attachment.name}</p>
                    <p className="text-[10px] font-mono text-neutral-500">{(note.attachment.size / 1024).toFixed(1)} KB • locked attachment</p>
                  </div>
                </div>
                
                {/* Download / View Button */}
                <a
                  href={note.attachment.dataUrl}
                  download={note.attachment.name}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-[10px] font-mono text-neutral-300 transition-colors cursor-pointer"
                >
                  Download Symbol
                </a>
              </div>
            )}
          </div>

          {/* RIGHT AREA: Active controls / Countdown sidebar */}
          <div className={`p-6 md:p-10 flex flex-col justify-center bg-neutral-950/40 backdrop-blur-sm ${
            isReleasing ? 'md:col-span-5' : 'md:col-span-4'
          }`}>
            {isReleasing ? (
              /* If sealed in release countdown: show full interactive countdown display and incinerate option */
              <div className="space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase block">ACTIVE DISSOLUTION</span>
                  <h3 className="font-serif text-lg text-neutral-200">Cosmic Void Timer</h3>
                  <p className="text-[11px] text-neutral-500 font-sans font-light">
                    This burden is undergoing the slow purge ritual. Content is encrypted locally and will vanish instantly upon timer expiry.
                  </p>
                </div>

                <div className="flex justify-center py-2">
                  <CountdownDisplay
                    releasedAt={note.releasedAt || Date.now()}
                    duration={note.countdownDuration}
                    onComplete={() => {
                      onTimerComplete(note.id);
                      onClose();
                    }}
                    size="large"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      onTimerComplete(note.id);
                      onClose();
                    }}
                    className="w-full py-3 border border-red-900/40 bg-red-950/15 text-red-400 hover:bg-red-950/25 text-xs font-mono font-medium tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98]"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Incinerate Instantly</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-mono rounded-xl transition-all cursor-pointer"
                  >
                    Keep Dissolving
                  </button>
                </div>
              </div>
            ) : (
              /* If silent draft: show write, release, discard options alongside void information */
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">UNSEALED THOUGHTS</span>
                  <h3 className="font-serif text-lg text-neutral-200">Release Decision</h3>
                  <p className="text-[11px] text-neutral-500 font-sans font-light leading-relaxed">
                    This draft is currently safe and dormant. When you are ready, release it to start the countdown timer after which it is lost forever.
                  </p>
                </div>

                {/* Primary draft action buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onRelease(note);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-900 to-red-950 border border-purple-500/20 text-white font-serif font-semibold tracking-widest uppercase hover:from-purple-800 hover:to-red-900 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-red-400" />
                    <span>RELEASE TO VOID</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onContinueWriting(note);
                    }}
                    className="w-full py-3 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit Draft</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Discard this silent confession from existence? This cannot be undone.')) {
                        onDeleteNote(note.id);
                        onClose();
                      }
                    }}
                    className="w-full py-2.5 rounded-xl text-neutral-600 hover:text-red-400 text-xs font-mono font-light tracking-wide uppercase transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard Draft</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </motion.div>
    </div>
  );
}
