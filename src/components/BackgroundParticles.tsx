/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  intensity?: 'soft' | 'deep' | 'void';
}

export default function BackgroundParticles({ intensity = 'deep' }: BackgroundParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle settings based on visual intensity
    let particleCount = 45;
    let emberCount = 30;
    let shadowGlowSize = 150;

    if (intensity === 'soft') {
      particleCount = 20;
      emberCount = 15;
      shadowGlowSize = 100;
    } else if (intensity === 'void') {
      particleCount = 80;
      emberCount = 60;
      shadowGlowSize = 250;
    }

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      decay: number;
      color: string;
      isEmber: boolean;
      angle?: number;
      spin?: number;
    }

    const particles: Particle[] = [];

    const createParticle = (isInitial = false): Particle => {
      const isEmber = Math.random() > 0.6;
      const size = isEmber ? Math.random() * 2 + 1 : Math.random() * 60 + 30;
      const x = Math.random() * width;
      const y = isInitial ? Math.random() * height : height + size + 10;

      let speedX = (Math.random() - 0.5) * 0.4;
      let speedY = isEmber 
        ? -(Math.random() * 0.8 + 0.4) 
        : -(Math.random() * 0.3 + 0.1);

      if (intensity === 'void') {
        speedY *= 1.5;
        speedX *= 1.5;
      }

      const alpha = Math.random() * 0.4 + 0.1;

      // Purple and red glowing embers
      let color = 'rgba(139, 92, 246, 0.4)'; // Violet
      if (isEmber) {
        color = Math.random() > 0.5 
          ? 'rgba(239, 68, 68, 0.6)' // Red
          : 'rgba(167, 139, 250, 0.7)'; // Light purple
      } else {
        // Shadow clumps
        color = Math.random() > 0.5 
          ? 'rgba(10, 8, 14, 0.8)' 
          : 'rgba(20, 16, 28, 0.7)';
      }

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        alpha,
        decay: Math.random() * 0.002 + 0.001,
        color,
        isEmber,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.01,
      };
    };

    // Populate initial particles
    const totalCount = particleCount + emberCount;
    for (let i = 0; i < totalCount; i++) {
      particles.push(createParticle(true));
    }

    // Shadow beast subtle pulsing background vignettes
    let pulseTime = 0;

    const animate = () => {
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, width, height);

      pulseTime += 0.003;
      const pulse = Math.sin(pulseTime) * 0.15 + 0.85;

      // Base mysterious circular glow (ambient light)
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      
      // Dark red and purple glow in center-ish
      gradient.addColorStop(0, `rgba(40, 15, 60, ${0.08 * pulse})`);
      gradient.addColorStop(0.4, `rgba(18, 10, 22, ${0.05 * pulse})`);
      gradient.addColorStop(0.7, `rgba(10, 10, 14, 0.1)`);
      gradient.addColorStop(1, '#050505');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render & Update Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.angle !== undefined && p.spin !== undefined) {
          p.angle += p.spin;
          p.x += Math.sin(p.angle) * 0.15;
        }

        // Draw particle
        ctx.save();
        if (p.isEmber) {
          // Glow effect for embers
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft shadow clump
          const shadowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          shadowGrad.addColorStop(0, p.color);
          shadowGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
          ctx.fillStyle = shadowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Recycle if out of bounds or faded
        if (p.y + p.size < 0 || p.x < -p.size || p.x > width + p.size) {
          particles[i] = createParticle(false);
        }
      }

      // Mysterious vignette shadowing on margins
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 1.0
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      id="shadow-canvas-particles"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
