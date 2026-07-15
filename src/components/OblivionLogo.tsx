/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface OblivionLogoProps {
  className?: string;
}

export default function OblivionLogo({ className = "w-8 h-8" }: OblivionLogoProps) {
  const rawId = useId();
  const safeId = "oblivion_grad_" + rawId.replace(/:/g, "_");

  return (
    <svg 
      className={`${className} drop-shadow-[0_0_8px_rgba(192,132,252,0.55)]`}
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sharp Vibrant Neon Violet Gradient for high visibility on dark backgrounds */}
        <linearGradient id={safeId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* No background - icon only */}

      {/* Oblivion Gate Symbol (Oht) Group */}
      <g transform="translate(16, 16)">
        
        {/* Outer Arc/Arch */}
        <path d="M 240 70 
                 C 130 70, 50 140, 50 240 
                 C 50 320, 85 380, 130 410 
                 C 150 425, 175 400, 165 375 
                 C 145 330, 130 270, 160 210 
                 C 185 160, 220 130, 240 130
                 C 260 130, 295 160, 320 210
                 C 350 270, 335 330, 315 375
                 C 305 400, 330 425, 350 410
                 C 395 380, 430 320, 430 240
                 C 430 140, 350 70, 240 70 Z" 
              fill={`url(#${safeId})`} />

        {/* Center Hanging Spire */}
        <path d="M 240 130 
                 C 230 170, 220 210, 220 260
                 L 240 380
                 L 260 260
                 C 260 210, 250 170, 240 130 Z" 
              fill={`url(#${safeId})`} />
        
      </g>
    </svg>
  );
}

