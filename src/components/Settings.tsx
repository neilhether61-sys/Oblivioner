/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  Sparkles, 
  Flame,
  CheckCircle,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';
import { AppSettings, ShadowNote, ReleasedLog } from '../types';

interface SettingsProps {
  settings: AppSettings;
  notes: ShadowNote[];
  releasedLogs: ReleasedLog[];
  onUpdateSettings: (settings: AppSettings) => void;
  onImportData: (notes: ShadowNote[], logs: ReleasedLog[]) => void;
  onClearAllData: () => void;
}

export default function Settings({
  settings,
  notes,
  releasedLogs,
  onUpdateSettings,
  onImportData,
  onClearAllData
}: SettingsProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export Data as JSON file download
  const handleExport = () => {
    try {
      const backupData = {
        notes,
        releasedLogs,
        settings,
        exportedAt: Date.now(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `shadow_note_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      showSuccess('Your shadow portal backup was successfully downloaded.');
    } catch (err) {
      showError('Failed to generate export file.');
    }
  };

  // Import Data from JSON file upload
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error('Invalid file format');

        const parsed = JSON.parse(text);

        if (!parsed.notes || !Array.isArray(parsed.notes)) {
          throw new Error('Missing notes collection in backup file.');
        }

        // Import
        onImportData(parsed.notes, parsed.releasedLogs || []);
        showSuccess('Portal backup imported successfully. Your local sanctuary has been restored.');
      } catch (err: any) {
        showError(err.message || 'Malformed backup file. Please verify it is a valid Shadow Note export.');
      }
    };
    reader.readAsText(file);
  };

  const triggerReset = () => {
    setShowConfirmReset(true);
  };

  const confirmReset = () => {
    onClearAllData();
    setShowConfirmReset(false);
    showSuccess('Your portal has been completely purged and reset.');
  };

  const showSuccess = (msg: string) => {
    setErrorMsg(null);
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const showError = (msg: string) => {
    setSuccessMsg(null);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  return (
    <div id="settings-root" className="w-full max-w-4xl mx-auto px-2 md:px-6 py-6 md:py-10 z-10 relative text-white">
      
      {/* Top Header */}
      <div className="space-y-1.5 mb-8 md:mb-12">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-neutral-100">Portal Settings</h1>
        <p className="text-xs text-neutral-500 font-sans font-light">
          Configure visual aesthetics, export confidential thoughts, or reset your local sanctum.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center space-x-2.5"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-mono flex items-center space-x-2.5"
        >
          <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left main Settings items */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Aesthetic Controls */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg tracking-wide text-neutral-200">Aesthetic Intensity</h2>
            <p className="text-xs text-neutral-500 font-light">
              Tune the density of background floating shadows and purple/red embers in your portal.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {(['soft', 'deep', 'void'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => onUpdateSettings({ ...settings, intensity })}
                  className={`py-3 px-4 rounded-xl border text-center font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    settings.intensity === intensity
                      ? 'bg-purple-950/25 border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                      : 'border-neutral-900 bg-neutral-950/50 hover:border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>

            <div className="text-[10px] text-neutral-600 font-mono px-1">
              {settings.intensity === 'soft' && '● Soft: Minimum particles, perfect for simple reading.'}
              {settings.intensity === 'deep' && '● Deep: Atmospheric haze and active glowing embers.'}
              {settings.intensity === 'void' && '● Void: Heavy dense smoke storms, maximum dark aesthetic.'}
            </div>
          </div>

          {/* Backup/Import Options */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg tracking-wide text-neutral-200">Export & Import Portal</h2>
            <p className="text-xs text-neutral-500 font-light">
              Keep a local backup copy of your letters and released ash histories. Your secrets remain strictly your own.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleExport}
                className="py-3 px-4 rounded-xl border border-neutral-900 hover:border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-mono text-neutral-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Export Portal Data</span>
              </button>

              <button
                onClick={handleImportClick}
                className="py-3 px-4 rounded-xl border border-neutral-900 hover:border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs font-mono text-neutral-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Portal Data</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Destructive Actions */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg tracking-wide text-red-400 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>Incinerate Sanctuary</span>
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Permanently erase all letters, drafts, attachments, settings, and release histories. This action is instantaneous and cannot be undone.
            </p>

            <div className="pt-2">
              {showConfirmReset ? (
                <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl space-y-4">
                  <div className="flex items-start space-x-3 text-xs text-red-400 leading-relaxed font-sans">
                    <AlertOctagon className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5 animate-bounce" />
                    <div>
                      <strong className="block font-semibold">ARE YOU ABSOLUTELY SURE?</strong>
                      This will incinerate all local drafts and releasing timers. This removes everything immediately from browser localStorage.
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-4 py-2 border border-neutral-800 text-neutral-400 rounded-xl text-xs font-mono hover:text-white hover:bg-neutral-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmReset}
                      className="px-4 py-2 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs font-mono hover:bg-red-900 hover:text-white cursor-pointer"
                    >
                      Incinerate Everything
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={triggerReset}
                  className="py-3 px-5 rounded-xl border border-red-950 hover:border-red-500/30 bg-neutral-950 text-red-400 text-xs font-mono font-medium hover:bg-red-950/20 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Purge All local Files & Cache</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Info sidebar (Privacy & Lore) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Privacy Sanctum details */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-purple-400">
              <Lock className="w-4 h-4 text-purple-500" />
              <h3 className="font-serif text-base tracking-wide text-neutral-200">Privacy Manifesto</h3>
            </div>
            
            <div className="space-y-4 text-xs text-neutral-400 leading-relaxed font-light font-sans">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-500/50 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>No Server Connections:</strong> All letters you write, and images you attach, are strictly saved inside your browser's private local sandbox.
                </p>
              </div>

              <div className="flex items-start space-x-2.5">
                <EyeOff className="w-4 h-4 text-purple-500/50 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Frictionless Disposal:</strong> Once released, the letter enters a locked burning timer. When the timer hits zero, the text contents are completely expunged.
                </p>
              </div>

              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-purple-500/50 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Symbolic Closure:</strong> A permanent "Dissolved Ashes" log records only the emotion and date of release, keeping a record of relief without caching the burden.
                </p>
              </div>
            </div>
          </div>

          {/* Lore card */}
          <div className="p-6 bg-gradient-to-tr from-neutral-950 to-purple-950/20 border border-neutral-900/80 rounded-3xl space-y-3">
            <h4 className="font-serif text-sm text-neutral-300 tracking-wide flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span>Why write and release?</span>
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-light font-sans">
              Psychological studies suggest that writing down our worries or secret problems acts as an externalization exercise. It takes abstract anxiety and turns it into tangible ink. By letting it count down and fade, you symbolically permit yourself to move forward.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
