/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodType = 'Fear' | 'Regret' | 'Stress' | 'Anger' | 'Other';

export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Stored as base64 in localStorage
}

export interface ShadowNote {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  status: 'draft' | 'releasing' | 'released';
  releasedAt: number | null; // timestamp when the ritual began
  countdownDuration: number; // duration in milliseconds (e.g. 1 min, 1 hour, 1 day, 7 days, 30 days)
  attachment: FileAttachment | null;
}

// Released logs to keep a record that a shadow note was successfully dissolved, but without storing the confidential content.
export interface ReleasedLog {
  id: string;
  originalTitle: string; // or an obscured title like "A silent regret"
  mood: MoodType;
  releasedAt: number;
  dissolvedAt: number;
}

export type PageId = 'landing' | 'dashboard' | 'create' | 'settings';

export interface AppSettings {
  darkMode: boolean; // default true
  mysteriousSounds: boolean; // default false
  autoPurge: boolean; // default true
  intensity: 'soft' | 'deep' | 'void'; // visual intensity of shadow effects
}

export const getRandomDuration = (): number => {
  // A selection of highly evocative random timer intervals:
  // We include fast durations for immediate feedback, and standard days for realistic mystery.
  const options = [
    1 * 60 * 1000,          // 1 Minute (Fast test)
    5 * 60 * 1000,          // 5 Minutes (Quick test)
    15 * 60 * 1000,         // 15 Minutes
    30 * 60 * 1000,         // 30 Minutes
    60 * 60 * 1000,         // 1 Hour
    3 * 60 * 60 * 1000,     // 3 Hours
    6 * 60 * 60 * 1000,     // 6 Hours
    12 * 60 * 60 * 1000,    // 12 Hours
    24 * 60 * 60 * 1000,    // 24 Hours
    3 * 24 * 60 * 60 * 1000,  // 3 Days
    7 * 24 * 60 * 60 * 1000,  // 7 Days
    14 * 24 * 60 * 60 * 1000, // 14 Days
    30 * 24 * 60 * 60 * 1000, // 30 Days
  ];
  return options[Math.floor(Math.random() * options.length)];
};

