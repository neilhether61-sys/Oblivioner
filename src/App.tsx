/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Hourglass, 
  Sparkles, 
  Flame, 
  ArrowLeft, 
  Lock, 
  ShieldAlert, 
  HeartCrack,
  CheckCircle,
  Bell
} from 'lucide-react';

import { ShadowNote, ReleasedLog, AppSettings, PageId, MoodType, FileAttachment, getRandomDuration } from './types';
import BackgroundParticles from './components/BackgroundParticles';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateNote from './components/CreateNote';
import ReleaseAnimation from './components/ReleaseAnimation';
import Settings from './components/Settings';
import CountdownDisplay from './components/CountdownDisplay';
import NoteViewModal from './components/NoteViewModal';

// Local storage keys
const NOTES_KEY = 'shadow_notes_list';
const LOGS_KEY = 'shadow_notes_purged_logs';
const SETTINGS_KEY = 'shadow_notes_portal_settings';

export default function App() {
  // --- Core States ---
  const [notes, setNotes] = useState<ShadowNote[]>([]);
  const [releasedLogs, setReleasedLogs] = useState<ReleasedLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    mysteriousSounds: false,
    autoPurge: true,
    intensity: 'deep'
  });

  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [activeSection, setActiveSection] = useState<'all' | 'drafts' | 'releasing' | 'settings'>('all');
  
  const [selectedNote, setSelectedNote] = useState<ShadowNote | null>(null);
  const [releasingNote, setReleasingNote] = useState<ShadowNote | null>(null);
  
  // Flash notifications for dissolved state
  const [dissolvedNotification, setDissolvedNotification] = useState<string | null>(null);

  // --- Initial Mount & Loading ---
  useEffect(() => {
    // 1. Load Settings
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    let loadedSettings = settings;
    if (savedSettings) {
      try {
        loadedSettings = JSON.parse(savedSettings);
        setSettings(loadedSettings);
      } catch (e) {
        console.error('Error parsing settings', e);
      }
    }

    // 2. Load Logs
    const savedLogs = localStorage.getItem(LOGS_KEY);
    let loadedLogs: ReleasedLog[] = [];
    if (savedLogs) {
      try {
        loadedLogs = JSON.parse(savedLogs);
        setReleasedLogs(loadedLogs);
      } catch (e) {
        console.error('Error parsing logs', e);
      }
    }

    // 3. Load Notes & Purge any that expired while away
    const savedNotes = localStorage.getItem(NOTES_KEY);
    if (savedNotes) {
      try {
        const parsedNotes: ShadowNote[] = JSON.parse(savedNotes);
        const now = Date.now();
        
        const activeNotes: ShadowNote[] = [];
        const newLogs: ReleasedLog[] = [];

        parsedNotes.forEach((note) => {
          if (note.status === 'releasing' && note.releasedAt) {
            const expiryTime = note.releasedAt + note.countdownDuration;
            if (expiryTime <= now) {
              // Expired! Purge content and log
              newLogs.push({
                id: note.id,
                originalTitle: note.title.length > 15 ? note.title.substring(0, 15) + '...' : note.title,
                mood: note.mood,
                releasedAt: note.releasedAt,
                dissolvedAt: expiryTime
              });
            } else {
              activeNotes.push(note);
            }
          } else {
            activeNotes.push(note);
          }
        });

        if (newLogs.length > 0) {
          const mergedLogs = [...newLogs, ...loadedLogs];
          setReleasedLogs(mergedLogs);
          localStorage.setItem(LOGS_KEY, JSON.stringify(mergedLogs));
          setDissolvedNotification(`${newLogs.length} burden${newLogs.length === 1 ? '' : 's'} fully dissolved while you were away!`);
          setTimeout(() => setDissolvedNotification(null), 8000);
        }

        setNotes(activeNotes);
        localStorage.setItem(NOTES_KEY, JSON.stringify(activeNotes));
      } catch (e) {
        console.error('Error parsing notes', e);
      }
    }
  }, []);

  // --- Periodic Check for Expired Countdown Notes (runs every 5 seconds) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasChanges = false;
      
      const updatedNotes: ShadowNote[] = [];
      const newLogs: ReleasedLog[] = [];

      notes.forEach((note) => {
        if (note.status === 'releasing' && note.releasedAt) {
          const expiryTime = note.releasedAt + note.countdownDuration;
          if (expiryTime <= now) {
            hasChanges = true;
            newLogs.push({
              id: note.id,
              originalTitle: note.title.length > 15 ? note.title.substring(0, 15) + '...' : note.title,
              mood: note.mood,
              releasedAt: note.releasedAt,
              dissolvedAt: expiryTime
            });

            // If the user is currently looking at this countdown, close it
            if (selectedNote && selectedNote.id === note.id) {
              setSelectedNote(null);
            }
          } else {
            updatedNotes.push(note);
          }
        } else {
          updatedNotes.push(note);
        }
      });

      if (hasChanges) {
        setNotes(updatedNotes);
        localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));

        const mergedLogs = [...newLogs, ...releasedLogs];
        setReleasedLogs(mergedLogs);
        localStorage.setItem(LOGS_KEY, JSON.stringify(mergedLogs));

        // Display notifications
        const dissolvedNames = newLogs.map(l => `"${l.originalTitle}"`).join(', ');
        setDissolvedNotification(`Your burden ${dissolvedNames} has faded into complete dust.`);
        setTimeout(() => setDissolvedNotification(null), 7000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [notes, releasedLogs, selectedNote]);

  // --- Helper state persistence ---
  const saveNotesToStore = (newNotes: ShadowNote[]) => {
    setNotes(newNotes);
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
  };

  const saveSettingsToStore = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleUpdateSettings = (updatedSettings: AppSettings) => {
    saveSettingsToStore(updatedSettings);
  };

  const handleImportData = (importedNotes: ShadowNote[], importedLogs: ReleasedLog[]) => {
    setNotes(importedNotes);
    setReleasedLogs(importedLogs);
    localStorage.setItem(NOTES_KEY, JSON.stringify(importedNotes));
    localStorage.setItem(LOGS_KEY, JSON.stringify(importedLogs));
  };

  const handleClearAllData = () => {
    setNotes([]);
    setReleasedLogs([]);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(LOGS_KEY);
  };

  // --- Router Navigation ---
  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setSelectedNote(null);
  };

  const handleExploreHowItWorks = () => {
    const target = document.getElementById('how-it-works-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Draft Writing & Saving ---
  const handleNewNote = () => {
    setSelectedNote(null);
    setCurrentPage('create');
  };

  const handleContinueWriting = (note: ShadowNote) => {
    setSelectedNote(note);
    setCurrentPage('create');
  };

  const handleSaveDraft = (
    title: string,
    content: string,
    mood: MoodType,
    attachment: FileAttachment | null,
    duration: number
  ) => {
    const now = Date.now();
    let updatedNotes: ShadowNote[];

    if (selectedNote) {
      // Editing existing draft
      updatedNotes = notes.map((n) => {
        if (n.id === selectedNote.id) {
          return {
            ...n,
            title,
            content,
            mood,
            attachment,
            countdownDuration: duration,
            updatedAt: now
          };
        }
        return n;
      });
    } else {
      // Creating brand new draft
      const newNote: ShadowNote = {
        id: 'note_' + Math.random().toString(36).substring(2, 11),
        title,
        content,
        mood,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        releasedAt: null,
        countdownDuration: duration,
        attachment
      };
      updatedNotes = [newNote, ...notes];
    }

    saveNotesToStore(updatedNotes);
    setSelectedNote(null);
    setCurrentPage('dashboard');
    setActiveSection('drafts');
  };

  // --- Letter Release & Cinematic Ritual Triggers ---
  const handleReleaseNote = (
    title: string,
    content: string,
    mood: MoodType,
    attachment: FileAttachment | null,
    duration: number
  ) => {
    // 1. Prepare/Save the note with "releasing" status so we can trigger the cinematic state
    const now = Date.now();
    let targetNote: ShadowNote;

    if (selectedNote) {
      targetNote = {
        ...selectedNote,
        title,
        content,
        mood,
        attachment,
        countdownDuration: duration,
        status: 'releasing',
        releasedAt: now,
        updatedAt: now
      };
    } else {
      targetNote = {
        id: 'note_' + Math.random().toString(36).substring(2, 11),
        title,
        content,
        mood,
        createdAt: now,
        updatedAt: now,
        status: 'releasing',
        releasedAt: now,
        countdownDuration: duration,
        attachment
      };
    }

    // Set the releasingNote state to start the cinematic ritual fullscreen overlay
    setReleasingNote(targetNote);
  };

  const handleQuickRelease = (note: ShadowNote) => {
    // Release a draft instantly from dashboard card button
    const updatedNote: ShadowNote = {
      ...note,
      status: 'releasing',
      releasedAt: Date.now(),
      countdownDuration: getRandomDuration()
    };
    setReleasingNote(updatedNote);
  };

  const handleRitualAnimationComplete = () => {
    if (!releasingNote) return;

    // Save releasing note to the state
    const existingIndex = notes.findIndex(n => n.id === releasingNote.id);
    let updatedNotes: ShadowNote[];

    if (existingIndex > -1) {
      updatedNotes = notes.map(n => n.id === releasingNote.id ? releasingNote : n);
    } else {
      updatedNotes = [releasingNote, ...notes];
    }

    saveNotesToStore(updatedNotes);
    
    // Clear releasing animation state
    setReleasingNote(null);

    // Open Countdown View (Page 5: Countdown Page) for this note immediately!
    setSelectedNote(releasingNote);
    setCurrentPage('dashboard');
    setActiveSection('releasing');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotesToStore(updated);
  };

  const handleTimerComplete = (id: string) => {
    // Handled by the periodic checker, but we can fast-track if needed
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const expiryTime = (note.releasedAt || Date.now()) + note.countdownDuration;
    const newLog: ReleasedLog = {
      id: note.id,
      originalTitle: note.title.length > 15 ? note.title.substring(0, 15) + '...' : note.title,
      mood: note.mood,
      releasedAt: note.releasedAt || Date.now(),
      dissolvedAt: expiryTime
    };

    setNotes(prev => prev.filter(n => n.id !== id));
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes.filter(n => n.id !== id)));

    const mergedLogs = [newLog, ...releasedLogs];
    setReleasedLogs(mergedLogs);
    localStorage.setItem(LOGS_KEY, JSON.stringify(mergedLogs));

    setDissolvedNotification(`Your burden "${newLog.originalTitle}" has faded into complete dust.`);
    setTimeout(() => setDissolvedNotification(null), 7000);
  };

  // --- Count calculations ---
  const draftsCount = notes.filter(n => n.status === 'draft').length;
  const releasingCount = notes.filter(n => n.status === 'releasing').length;

  return (
    <div className="min-h-screen bg-mystery-dark relative font-sans overflow-x-hidden selection:bg-purple-950 selection:text-purple-300">
      
      {/* 1. Procedural Mystic Particle Background Canvas */}
      <BackgroundParticles intensity={settings.intensity} />

      {/* 2. Full-Screen Cinematic Dark Ritual Overlay */}
      <AnimatePresence>
        {releasingNote && (
          <ReleaseAnimation
            noteTitle={releasingNote.title}
            noteMood={releasingNote.mood}
            onAnimationComplete={handleRitualAnimationComplete}
          />
        )}
      </AnimatePresence>

      {/* 3. Global Floating Dissolve Notification Toast */}
      <AnimatePresence>
        {dissolvedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 max-w-sm p-4 bg-neutral-950 border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-950/40 flex items-start space-x-3 text-white backdrop-blur-md"
          >
            <div className="p-2 bg-purple-950/30 border border-purple-900/30 rounded-lg">
              <Bell className="w-4 h-4 text-purple-400 animate-swing" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-wide text-purple-300 uppercase block">Void Purge Complete</span>
              <p className="text-xs text-neutral-400 font-light mt-0.5 leading-relaxed">{dissolvedNotification}</p>
            </div>
            <button 
              onClick={() => setDissolvedNotification(null)}
              className="text-neutral-600 hover:text-neutral-400 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Active Letter Countdown / Draft Focus Modal (Full Screen View) */}
      <AnimatePresence>
        {selectedNote && currentPage !== 'create' && (
          <NoteViewModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onContinueWriting={handleContinueWriting}
            onRelease={handleQuickRelease}
            onDeleteNote={handleDeleteNote}
            onTimerComplete={handleTimerComplete}
          />
        )}
      </AnimatePresence>

      {/* 5. Main Application Routing Layout Shell */}
      {currentPage === 'landing' ? (
        /* landing is full screen */
        <LandingPage 
          onNavigate={handleNavigate} 
          onExploreHowItWorks={handleExploreHowItWorks} 
        />
      ) : (
        /* Other pages are wrapped in a responsive Sidebar Layout */
        <div className="min-h-screen md:pl-64 pt-14 md:pt-0 flex flex-col">
          
          {/* Responsive Sidebar component */}
          <Sidebar
            currentPage={currentPage}
            activeSection={currentPage === 'settings' ? 'settings' : (activeSection as any)}
            draftsCount={draftsCount}
            releasingCount={releasingCount}
            purgedCount={releasedLogs.length}
            onNavigate={handleNavigate}
            onSelectSection={(sec) => {
              if (sec === 'settings') {
                setCurrentPage('settings');
              } else {
                setCurrentPage('dashboard');
                setActiveSection(sec);
              }
            }}
            onNewNote={handleNewNote}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col z-10 overflow-y-auto">
            
            <AnimatePresence mode="wait">
              
              {currentPage === 'dashboard' && (
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <Dashboard
                    notes={notes}
                    releasedLogs={releasedLogs}
                    activeSection={activeSection as any}
                    onContinueWriting={handleContinueWriting}
                    onRelease={handleQuickRelease}
                    onDeleteNote={handleDeleteNote}
                    onTimerComplete={handleTimerComplete}
                    onNewNote={handleNewNote}
                    onSelectNote={(note) => setSelectedNote(note)}
                  />
                </motion.div>
              )}

              {currentPage === 'create' && (
                <motion.div
                  key="create-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <CreateNote
                    initialNote={selectedNote}
                    onSaveDraft={handleSaveDraft}
                    onReleaseNote={handleReleaseNote}
                    onCancel={() => {
                      setCurrentPage('dashboard');
                      setSelectedNote(null);
                    }}
                  />
                </motion.div>
              )}

              {currentPage === 'settings' && (
                <motion.div
                  key="settings-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <Settings
                    settings={settings}
                    notes={notes}
                    releasedLogs={releasedLogs}
                    onUpdateSettings={handleUpdateSettings}
                    onImportData={handleImportData}
                    onClearAllData={handleClearAllData}
                  />
                </motion.div>
              )}

            </AnimatePresence>
            
          </main>
          
        </div>
      )}

    </div>
  );
}
