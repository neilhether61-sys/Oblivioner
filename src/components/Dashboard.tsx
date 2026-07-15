/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  FileEdit, 
  Flame, 
  Paperclip, 
  Calendar, 
  Search, 
  Hourglass, 
  Ghost, 
  CheckCircle, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { ShadowNote, ReleasedLog, MoodType } from '../types';
import CountdownDisplay from './CountdownDisplay';

interface DashboardProps {
  notes: ShadowNote[];
  releasedLogs: ReleasedLog[];
  activeSection: 'all' | 'drafts' | 'releasing';
  onContinueWriting: (note: ShadowNote) => void;
  onRelease: (note: ShadowNote) => void;
  onDeleteNote: (id: string) => void;
  onTimerComplete: (id: string) => void;
  onNewNote: () => void;
  onSelectNote: (note: ShadowNote) => void;
}

const MOOD_BADGES: Record<MoodType, { color: string; label: string; bg: string }> = {
  Fear: { color: 'text-purple-400 border-purple-500/20', bg: 'bg-purple-950/20', label: 'Fear' },
  Regret: { color: 'text-blue-400 border-blue-500/20', bg: 'bg-blue-950/20', label: 'Regret' },
  Stress: { color: 'text-yellow-400 border-yellow-500/20', bg: 'bg-yellow-950/20', label: 'Stress' },
  Anger: { color: 'text-red-400 border-red-500/20', bg: 'bg-red-950/20', label: 'Anger' },
  Other: { color: 'text-neutral-400 border-neutral-700', bg: 'bg-neutral-900/30', label: 'Other' }
};

export default function Dashboard({
  notes,
  releasedLogs,
  activeSection,
  onContinueWriting,
  onRelease,
  onDeleteNote,
  onTimerComplete,
  onNewNote,
  onSelectNote
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notes based on sidebar section
  const sectionNotes = notes.filter((note) => {
    if (activeSection === 'drafts') return note.status === 'draft';
    if (activeSection === 'releasing') return note.status === 'releasing';
    // 'all' section shows both
    return true;
  });

  // Filter based on search query
  const filteredNotes = sectionNotes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.mood.toLowerCase().includes(query)
    );
  });

  const draftsCount = notes.filter(n => n.status === 'draft').length;
  const releasingCount = notes.filter(n => n.status === 'releasing').length;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="dashboard-container" className="w-full max-w-6xl mx-auto px-2 md:px-6 py-6 md:py-10 z-10 relative">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-neutral-100">
            {activeSection === 'all' && 'Your Hidden Thoughts'}
            {activeSection === 'drafts' && 'Your Silent Drafts'}
            {activeSection === 'releasing' && 'Burdens Dissolving'}
          </h1>
          <p className="text-xs text-neutral-500 font-sans font-light">
            {activeSection === 'all' && 'A sanctuary of locked confessions and active release rituals.'}
            {activeSection === 'drafts' && 'Thoughts written but not yet sealed into the cosmic fire.'}
            {activeSection === 'releasing' && 'Active countdowns. Once these expire, their content is deleted forever.'}
          </p>
        </div>

        {/* Quick actions search + Add note */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
            <input
              id="dashboard-search-input"
              type="text"
              placeholder="Search secrets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 bg-neutral-950 border border-neutral-900 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-300 placeholder-neutral-700 focus:outline-none focus:border-purple-500/30 font-mono transition-all"
            />
          </div>

          <button
            onClick={onNewNote}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold tracking-wider flex items-center space-x-1.5 hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Letter</span>
          </button>
        </div>
      </div>

      {/* Main Grid display of notes */}
      <div className="space-y-12">
        
        {filteredNotes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center p-12 bg-neutral-950/20 border border-neutral-900/50 rounded-3xl"
          >
            <Ghost className="w-10 h-10 text-neutral-800 mb-3 animate-pulse" />
            <h3 className="font-serif text-base text-neutral-400">The void is silent.</h3>
            <p className="text-xs text-neutral-600 max-w-sm mt-1">
              No letters match your request. Click 'New Letter' to formulate your first secret confession.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => {
                const badge = MOOD_BADGES[note.mood];
                const isReleasing = note.status === 'releasing';

                return (
                  <motion.div
                    key={note.id}
                    layoutId={`note-card-${note.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => onSelectNote(note)}
                    className={`bg-neutral-950/90 border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group cursor-pointer hover:border-purple-500/40 hover:bg-neutral-900/40 hover:shadow-xl hover:shadow-purple-950/5 ${
                      isReleasing 
                        ? 'border-neutral-900' 
                        : 'border-neutral-900'
                    }`}
                  >
                    {/* Tiny glowing indicator for active releases */}
                    {isReleasing && (
                      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500/50 to-red-500/50" />
                    )}

                    <div className="space-y-4">
                      {/* Card Header metadata */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color} ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {note.attachment && (
                            <div className="flex items-center text-neutral-500" title={`Has Attachment: ${note.attachment.name}`}>
                              <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                              <span className="text-[9px] font-mono ml-0.5 text-neutral-600 truncate max-w-[80px]">
                                {note.attachment.name}
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-neutral-600">
                          {isReleasing ? 'Sealed' : 'Draft'}
                        </span>
                      </div>

                      {/* Title only (No Content preview shown as per instructions) */}
                      <div className="space-y-1.5">
                        <h3 className="font-serif text-lg tracking-wide text-neutral-200 group-hover:text-white transition-colors truncate">
                          {note.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Actions based on status */}
                    <div className="pt-6 mt-6 border-t border-neutral-900/60 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-neutral-600 text-[10px] font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(isReleasing && note.releasedAt ? note.releasedAt : note.createdAt)}</span>
                      </div>

                      {isReleasing ? (
                        /* Countdown block */
                        <div className="text-right">
                          <CountdownDisplay
                            releasedAt={note.releasedAt || Date.now()}
                            duration={note.countdownDuration}
                            onComplete={() => onTimerComplete(note.id)}
                            size="small"
                          />
                        </div>
                      ) : (
                        /* Editable Draft Buttons */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNote(note.id);
                            }}
                            className="p-2 border border-neutral-900 bg-neutral-950 text-neutral-500 hover:text-red-400 hover:border-red-900/30 rounded-xl transition-all cursor-pointer"
                            title="Discard Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onContinueWriting(note);
                            }}
                            className="px-3.5 py-1.5 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Write</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRelease(note);
                            }}
                            className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/20 text-purple-300 hover:bg-purple-900 hover:text-white text-xs font-mono font-semibold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Flame className="w-3.5 h-3.5 text-red-400" />
                            <span>Release</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Section: Dissolved Ashes logs (only shown if activeSection is 'all' or 'releasing') */}
        {(activeSection === 'all' || activeSection === 'releasing') && (
          <div className="pt-8 border-t border-neutral-900/60 space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-xl tracking-tight text-neutral-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Dissolved Ashes</span>
              </h2>
              <p className="text-xs text-neutral-600 font-sans font-light">
                A permanent monument of relief. These are the burdens that have successfully completed their countdown, completely purged of confidential content.
              </p>
            </div>

            {releasedLogs.length === 0 ? (
              <div className="p-8 text-center bg-neutral-950/10 border border-neutral-900/40 border-dashed rounded-2xl">
                <Inbox className="w-7 h-7 text-neutral-800 mx-auto mb-2" />
                <span className="text-xs text-neutral-600 font-mono">No ashes are logged yet. Seal an oblivion letter and let it dissolve.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {releasedLogs.map((log) => {
                    const badge = MOOD_BADGES[log.mood];
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-neutral-950/40 border border-neutral-900/50 rounded-xl gap-2.5 hover:bg-neutral-950 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500/80" />
                          <div>
                            <span className="text-xs font-mono font-medium text-neutral-300 block">
                              A dark shadow of <span className={`${badge.color} font-bold`}>{log.mood}</span> has dissolved
                            </span>
                            <span className="text-[10px] text-neutral-500 font-light block">
                              Letter original title: <span className="font-mono text-neutral-400">"{log.originalTitle}"</span> — content erased.
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right text-[10px] font-mono text-neutral-600">
                          <div>Released: {new Date(log.releasedAt).toLocaleDateString()}</div>
                          <div>Purged: {new Date(log.dissolvedAt).toLocaleDateString()}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
