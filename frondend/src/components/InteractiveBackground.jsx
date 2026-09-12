import React, { useEffect, useRef } from 'react';
import { playGlimmerSound } from '../services/soundEngine';

/**
 * Interactive Multi-Colored Cloud Background (Light Theme)
 * Features:
 * - Fluffy multi-colored clouds (light blue, peach, rose, pastel red, mint green, sunny cream, lavender)
 *   continuously moving from LEFT to RIGHT across the entire screen behind all elements.
 * - Interactive: when the mouse pointer moves over/near a cloud, the cloud physically moves,
 *   accelerates away, and softly expands accordingly.
 * - Gentle recovery physics: clouds smoothly restore their steady left-to-right drift and vertical lane.
 * - Mouse movement produces delicate glimpling sparkle elements with a very soft music-box / crystal chime.
 * - STRICT RULE: When mouse is INSIDE the calculator chassis, NO sound or sparkles are produced.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    let mouse = { x: -1000, y: -1000 };

    // Glimmering sparkle particles array
    const glimmers = [];

    // Helper: checks if (x, y) is inside the physical calculator chassis
    const isInsideCalculator = (x, y) => {
      const calcElem = document.querySelector('.calc-chassis');
      if (!calcElem) return false;
      const rect = calcElem.getBoundingClientRect();
      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    };

    // Spawns delicate glimpling / sparkle particles at (x, y)
    const spawnGlimmers = (x, y) => {
      playGlimmerSound();

      const numParticles = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.2;
        const colors = [
          '#fb923c', // Peach
          '#f472b6', // Rose
          '#fbbf24', // Amber/cream
          '#38bdf8', // Light blue
          '#4ade80', // Mint green
          '#f87171', // Soft red
          '#ffffff'  // Crystal white
        ];

        glimmers.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          size: 1.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.025 + Math.random() * 0.025
        });
      }
    };

    let lastMovePos = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // RULE 1: If mouse position is INSIDE the calculator chassis, DO NOT make sounds or spawn sparkles!
      if (isInsideCalculator(e.clientX, e.clientY)) {
        return;
      }

      // Outside calculator: spawn soft glimpling particles and gentle glimpling sound
      const dx = e.clientX - lastMovePos.x;
      const dy = e.clientY - lastMovePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 12) {
        spawnGlimmers(e.clientX, e.clientY);
        lastMovePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Multi-Colored Fluffy Clouds (light blue, peach, rose, red, green, cream, lavender)
    // All moving continuously from LEFT TO RIGHT across the screen (baseVx > 0)
    const cloudPalettes = [
      {
        name: 'light blue',
        core: 'rgba(186, 230, 253, 0.78)',
        glow: 'rgba(224, 242, 254, 0.45)',
        highlight: 'rgba(240, 249, 255, 0.85)'
      },
      {
        name: 'peach',
        core: 'rgba(254, 215, 170, 0.80)',
        glow: 'rgba(255, 237, 213, 0.48)',
        highlight: 'rgba(255, 247, 237, 0.85)'
      },
      {
        name: 'rose',
        core: 'rgba(251, 207, 232, 0.78)',
        glow: 'rgba(252, 231, 243, 0.45)',
        highlight: 'rgba(253, 242, 248, 0.85)'
      },
      {
        name: 'red', // soft pastel coral red
        core: 'rgba(254, 205, 211, 0.74)',
        glow: 'rgba(255, 228, 230, 0.42)',
        highlight: 'rgba(255, 241, 242, 0.85)'
      },
      {
        name: 'green', // soft pastel mint green
        core: 'rgba(187, 247, 208, 0.74)',
        glow: 'rgba(220, 252, 231, 0.42)',
        highlight: 'rgba(240, 253, 244, 0.85)'
      },
      {
        name: 'cream',
        core: 'rgba(254, 240, 138, 0.76)',
        glow: 'rgba(254, 249, 195, 0.44)',
        highlight: 'rgba(254, 252, 232, 0.85)'
      },
      {
        name: 'lavender',
        core: 'rgba(233, 213, 255, 0.74)',
        glow: 'rgba(243, 232, 255, 0.42)',
        highlight: 'rgba(250, 245, 255, 0.85)'
      }
    ];

    // Build 8 distinct fluffy clouds moving from LEFT to RIGHT
    const clouds = [
      {
        x: width * 0.05,
        baseY: height * 0.12,
        y: height * 0.12,
        w: 290,
        h: 150,
        baseVx: 0.65, // moving left to right
        vx: 0.65,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[0], // light blue
        phase: 0.2
      },
      {
        x: width * 0.35,
        baseY: height * 0.22,
        y: height * 0.22,
        w: 320,
        h: 160,
        baseVx: 0.55,
        vx: 0.55,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[1], // peach
        phase: 1.5
      },
      {
        x: width * 0.7,
        baseY: height * 0.14,
        y: height * 0.14,
        w: 280,
        h: 145,
        baseVx: 0.75,
        vx: 0.75,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[2], // rose
        phase: 2.8
      },
      {
        x: width * 0.15,
        baseY: height * 0.48,
        y: height * 0.48,
        w: 330,
        h: 170,
        baseVx: 0.5,
        vx: 0.5,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[3], // soft red
        phase: 4.1
      },
      {
        x: width * 0.82,
        baseY: height * 0.45,
        y: height * 0.45,
        w: 300,
        h: 155,
        baseVx: 0.6,
        vx: 0.6,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[4], // mint green
        phase: 5.3
      },
      {
        x: width * 0.48,
        baseY: height * 0.72,
        y: height * 0.72,
        w: 310,
        h: 160,
        baseVx: 0.58,
        vx: 0.58,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[5], // cream
        phase: 3.4
      },
      {
        x: width * 0.08,
        baseY: height * 0.82,
        y: height * 0.82,
        w: 290,
        h: 150,
        baseVx: 0.68,
        vx: 0.68,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[6], // lavender
        phase: 0.9
      },
      {
        x: width * 0.75,
        baseY: height * 0.80,
        y: height * 0.80,
        w: 320,
        h: 165,
        baseVx: 0.52,
        vx: 0.52,
        vy: 0,
        scale: 1,
        targetScale: 1,
        palette: cloudPalettes[0], // light blue
        phase: 2.1
      }
    ];

    // Mathematical symbols that drift gently alongside the clouds
    const symbols = ['∫', '∑', 'π', '√', 'Δ', 'λ', '∞', '∂', '∇', '∮', '⊗', 'ψ'];
    const floatingSymbols = [];
    for (let i = 0; i < 14; i++) {
      floatingSymbols.push({
        char: symbols[i % symbols.length],
        x: Math.random() * width,
        y: Math.random() * height,
        size: 18 + Math.random() * 22,
        vx: 0.3 + Math.random() * 0.4, // gentle drift from left to right
        vy: (Math.random() - 0.5) * 0.2,
        opacity: 0.12 + Math.random() * 0.15,
        color: ['#ea580c', '#7c3aed', '#0284c7', '#059669'][i % 4],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006
      });
    }

    let time = 0;

    /**
     * Draw a fluffy multi-lobed cloud with rich organic volume
     */
    const drawFluffyCloud = (c) => {
      const cx = c.x;
      const cy = c.y;
      const w = c.w * c.scale;
      const h = c.h * c.scale;
      const pal = c.palette;

      // 7 interconnected puffy lobes forming a realistic cumulus cloud shape
      const lobes = [
        { ox: 0, oy: -h * 0.05, r: h * 0.46 },            // Center main dome
        { ox: -w * 0.18, oy: -h * 0.24, r: h * 0.40 },    // Top-left crest
        { ox: w * 0.16, oy: -h * 0.20, r: h * 0.38 },     // Top-right crest
        { ox: -w * 0.32, oy: h * 0.06, r: h * 0.34 },     // Left shoulder
        { ox: w * 0.34, oy: h * 0.08, r: h * 0.33 },      // Right shoulder
        { ox: -w * 0.45, oy: h * 0.18, r: h * 0.25 },     // Far left puff
        { ox: w * 0.46, oy: h * 0.19, r: h * 0.24 },      // Far right puff
        { ox: 0, oy: h * 0.20, r: h * 0.35 }              // Bottom base puff
      ];

      ctx.save();

      // Outer soft colored haze / glow
      lobes.forEach((lobe) => {
        const lx = cx + lobe.ox;
        const ly = cy + lobe.oy;
        const lr = lobe.r * 1.25;

        const glowGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
        glowGrad.addColorStop(0, pal.glow);
        glowGrad.addColorStop(0.7, pal.glow);
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.fill();
      });

      // Inner dense cloud body with rich pastel core
      lobes.forEach((lobe) => {
        const lx = cx + lobe.ox;
        const ly = cy + lobe.oy;
        const lr = lobe.r;

        const bodyGrad = ctx.createRadialGradient(
          lx - lr * 0.2,
          ly - lr * 0.25,
          lr * 0.05,
          lx,
          ly,
          lr
        );
        bodyGrad.addColorStop(0, pal.highlight);
        bodyGrad.addColorStop(0.4, pal.core);
        bodyGrad.addColorStop(0.85, pal.glow);
        bodyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    const render = () => {
      time += 0.008;

      // Base porcelain canvas clear
      ctx.clearRect(0, 0, width, height);

      // 1. UPDATE & DRAW INTERACTIVE MULTI-COLORED CLOUDS (LEFT TO RIGHT)
      clouds.forEach((cloud) => {
        // MOUSE INTERACTION PHYSICS:
        // When mouse pointer enters or approaches the cloud, the cloud reacts and moves accordingly!
        const dx = cloud.x - mouse.x;
        const dy = cloud.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactRadius = Math.max(cloud.w, cloud.h) * 0.65;

        if (dist < interactRadius && mouse.x > -100) {
          // Cloud physically moves away from the mouse pointer!
          const nx = (dx / (dist || 1));
          const ny = (dy / (dist || 1));
          const intensity = Math.pow(1 - dist / interactRadius, 1.4);
          const pushForce = intensity * 4.2;

          cloud.vx += nx * pushForce * 0.3;
          cloud.vy += ny * pushForce * 0.3;

          // Reactive puff expansion on interaction
          cloud.targetScale = 1.12 + intensity * 0.16;
        }

        // Velocity damping & continuous left-to-right drift restoration
        cloud.vx = cloud.vx * 0.94 + cloud.baseVx * 0.06;
        cloud.vy = cloud.vy * 0.92 + (cloud.baseY - cloud.y) * 0.01 + Math.sin(time + cloud.phase) * 0.12;
        cloud.scale = cloud.scale * 0.88 + cloud.targetScale * 0.12;
        cloud.targetScale = 1.0;

        // Position progression: continuous movement from left to right
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;

        // Wrap around smoothly when exiting the right edge
        if (cloud.x - cloud.w * 0.6 > width) {
          cloud.x = -cloud.w * 0.6 - 30 - Math.random() * 80;
          cloud.baseY = Math.random() * (height - 140) + 70;
          cloud.y = cloud.baseY;
          cloud.vx = cloud.baseVx;
          cloud.vy = 0;
        }

        // Draw the cloud
        drawFluffyCloud(cloud);
      });

      // 2. Subtle central geometric harmonic rings
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(time * 0.03);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;

      for (let r = 100; r <= 360; r += 90) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Floating mathematical symbols drifting left to right
      floatingSymbols.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.rotSpeed;

        if (s.x > width + 40) s.x = -40;
        if (s.y < -40) s.y = height + 40;
        if (s.y > height + 40) s.y = -40;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.font = `${s.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.char, 0, 0);
        ctx.restore();
      });

      // 4. Render & update interactive glimpling sparkle particles
      for (let i = glimmers.length - 1; i >= 0; i--) {
        const p = glimmers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          glimmers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Shimmering glow starlet
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // White twinkling center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
