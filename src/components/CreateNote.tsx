/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { 
  FileUp, 
  Trash2, 
  Save, 
  Flame, 
  Smile, 
  HeartCrack, 
  Frown, 
  Flame as AngerIcon, 
  Zap, 
  HelpCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { MoodType, FileAttachment, ShadowNote, getRandomDuration } from '../types';

interface CreateNoteProps {
  initialNote?: ShadowNote | null;
  onSaveDraft: (title: string, content: string, mood: MoodType, attachment: FileAttachment | null, duration: number) => void;
  onReleaseNote: (title: string, content: string, mood: MoodType, attachment: FileAttachment | null, duration: number) => void;
  onCancel: () => void;
}

const MOODS: { type: MoodType; label: string; icon: any; color: string; bg: string; glow: string }[] = [
  { 
    type: 'Fear', 
    label: 'Fear', 
    icon: HeartCrack, 
    color: 'text-purple-400 border-purple-500/30', 
    bg: 'bg-purple-950/25', 
    glow: 'shadow-[0_0_15px_rgba(167,139,250,0.15)]' 
  },
  { 
    type: 'Regret', 
    label: 'Regret', 
    icon: Frown, 
    color: 'text-blue-400 border-blue-500/30', 
    bg: 'bg-blue-950/25', 
    glow: 'shadow-[0_0_15px_rgba(96,165,250,0.15)]' 
  },
  { 
    type: 'Stress', 
    label: 'Stress', 
    icon: Zap, 
    color: 'text-yellow-400 border-yellow-500/30', 
    bg: 'bg-yellow-950/25', 
    glow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]' 
  },
  { 
    type: 'Anger', 
    label: 'Anger', 
    icon: AngerIcon, 
    color: 'text-red-400 border-red-500/30', 
    bg: 'bg-red-950/25', 
    glow: 'shadow-[0_0_15px_rgba(248,113,113,0.15)]' 
  },
  { 
    type: 'Other', 
    label: 'Other', 
    icon: HelpCircle, 
    color: 'text-neutral-400 border-neutral-500/30', 
    bg: 'bg-neutral-900/45', 
    glow: 'shadow-[0_0_15px_rgba(163,163,163,0.1)]' 
  }
];

export default function CreateNote({ initialNote, onSaveDraft, onReleaseNote, onCancel }: CreateNoteProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [mood, setMood] = useState<MoodType>(initialNote?.mood || 'Fear');
  const [attachment, setAttachment] = useState<FileAttachment | null>(initialNote?.attachment || null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File processing to Base64
  const processFile = (file: File) => {
    setErrorMsg(null);
    const maxSize = 1.5 * 1024 * 1024; // 1.5MB limit
    if (file.size > maxSize) {
      setErrorMsg('File exceeds 1.5MB. Please choose a smaller symbol or image to respect local cache storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setAttachment({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result
        });
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process attachment file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setAttachment(null);
    setErrorMsg(null);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Every letter requires a Title and some thoughts to seal.');
      return;
    }
    const randDuration = initialNote?.countdownDuration || getRandomDuration();
    onSaveDraft(title, content, mood, attachment, randDuration);
  };

  const handleRelease = () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please write a Title and confess your burden before releasing.');
      return;
    }
    const randDuration = getRandomDuration();
    onReleaseNote(title, content, mood, attachment, randDuration);
  };

  const activeMoodConfig = MOODS.find(m => m.type === mood) || MOODS[4];

  return (
    <div id="create-note-root" className="w-full max-w-4xl mx-auto px-2 md:px-6 py-6 md:py-10 z-10 relative">
      
      {/* Back Header navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors py-2 text-sm font-mono tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO VOID</span>
        </button>

        <span className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase">
          {initialNote ? 'Refashioning Letter' : 'Formulating Confession'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Large letter scroll editor */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative bg-neutral-950 border border-neutral-900 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 overflow-hidden ${activeMoodConfig.glow}`}
          >
            {/* Sealed watermark or subtle scroll lines */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <div className="absolute top-10 right-10 opacity-5 pointer-events-none select-none">
              <Sparkles className="w-32 h-32 text-white" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* Title input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                  Letter Heading
                </label>
                <input
                  id="note-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="What is the title of your burden?..."
                  className="w-full bg-transparent text-xl md:text-2xl font-serif text-neutral-100 placeholder-neutral-700 border-b border-neutral-900 focus:border-purple-500/40 focus:outline-none pb-2 transition-colors"
                />
              </div>

              {/* Problem description textarea */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                  Your Hidden Worries & Regrets
                </label>
                <textarea
                  id="note-content-input"
                  rows={10}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Write your secret letters here. Describe your problem, worry, regret, or thoughts. No one else will ever see this, and once released, it will slowly burn down and disappear..."
                  className="w-full bg-transparent text-neutral-300 placeholder-neutral-800 focus:outline-none text-sm md:text-base leading-relaxed resize-none font-sans font-light min-h-[220px]"
                />
              </div>

              {/* Errors and warnings */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-mono"
                >
                  {errorMsg}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Interactive drag-and-drop file uploader */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase px-1">
              Symbolic Attachment (Lock an associated image/document)
            </label>
            <div
              id="file-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`bg-neutral-950/50 backdrop-blur-md border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-purple-500 bg-purple-950/10' 
                  : attachment 
                    ? 'border-neutral-800 bg-neutral-900/10' 
                    : 'border-neutral-900 hover:border-neutral-800'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,text/plain"
              />

              {attachment ? (
                <div className="w-full flex items-center justify-between px-3 py-1 bg-neutral-950/80 border border-neutral-800 rounded-xl max-w-md" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {attachment.type.startsWith('image/') ? (
                      <img 
                        src={attachment.dataUrl} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-md border border-neutral-800 bg-neutral-900" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-purple-950/30 border border-purple-900/30 flex items-center justify-center">
                        <FileUp className="w-5 h-5 text-purple-400" />
                      </div>
                    )}
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-mono text-neutral-300 truncate max-w-[200px]">{attachment.name}</p>
                      <p className="text-[10px] font-mono text-neutral-600">{(attachment.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={removeAttachment}
                    className="p-2 hover:bg-red-950/30 rounded-lg text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileUp className={`w-8 h-8 mx-auto transition-colors ${isDragging ? 'text-purple-400 animate-bounce' : 'text-neutral-700'}`} />
                  <div>
                    <span className="text-xs font-medium text-neutral-300">Drag & drop a symbolic file, or <span className="text-purple-400 hover:underline">browse</span></span>
                    <p className="text-[10px] font-mono text-neutral-600 mt-1">Images, text files, or PDFs up to 1.5MB to burn along with the note.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Mood controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mood Picker */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-base tracking-wide text-neutral-200">Select Burden Energy</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Mood categorizes the specific emotional weight of this shadow note.
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              {MOODS.map((item) => {
                const Icon = item.icon;
                const isSelected = mood === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setMood(item.type)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group cursor-pointer ${
                      isSelected 
                        ? `${item.color} ${item.bg} ${item.glow} scale-[1.02]` 
                        : 'border-neutral-900 bg-neutral-950 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isSelected ? '' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                      <span className={`text-xs font-mono font-medium tracking-wide ${isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                        {item.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleRelease}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-900 to-red-950 border border-purple-500/20 text-white font-serif font-semibold tracking-widest uppercase hover:from-purple-800 hover:to-red-900 transition-all duration-300 shadow-xl shadow-purple-950/20 active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              <span>RELEASE NOTE</span>
            </button>

            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-neutral-600" />
              <span>Save as Draft</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
