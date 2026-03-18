'use client';

import React, { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════

type RGB = { r: number; g: number; b: number };

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseRadius: number;
  activeRadius: number;
  color: RGB;
  targetColor: RGB;
  colorT: number; // 0 (rest) to 1 (awakened)
  colorSpeed: number;
  archetypeColor: RGB;
  hueIndex: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  startTime: number;
  active: boolean;
}

const PARTICLE_COUNT = 1800;
// Tailwind indigo-800: #3730A3
const REST_COLOR: RGB = { r: 55, g: 48, b: 163 };
const REST_OPACITY = 0.35;
const AWAKENED_OPACITY = 0.9;
// Tailwind slate-50 with low opacity for trails: #F8FAFC
const CANVAS_CLEAR_COLOR = 'rgba(248, 250, 252, 0.18)';

// Archetype Palette
const ARCHETYPE_COLORS: RGB[] = [
  { r: 79, g: 70, b: 229 },  // 0: #4F46E5 (indigo-600)
  { r: 236, g: 72, b: 153 }, // 1: #EC4899 (pink-500)
  { r: 16, g: 185, b: 129 }, // 2: #10B981 (emerald-500)
  { r: 245, g: 158, b: 11 }, // 3: #F59E0B (amber-500)
  { r: 6, g: 182, b: 212 },  // 4: #06B6D4 (cyan-500)
  { r: 139, g: 92, b: 246 }, // 5: #8B5CF6 (violet-500)
  { r: 249, g: 115, b: 22 }, // 6: #F97316 (orange-500)
  { r: 20, g: 184, b: 166 }, // 7: #14B8A6 (teal-500)
];

// Interaction Constants
const HOVER_ACTIVATION_RADIUS = 130;
const IMMEDIATE_ACTIVATION_RADIUS = 40;
const DIFFUSION_RADIUS = 90;
const DIFFUSION_RADIUS_SQ = DIFFUSION_RADIUS * DIFFUSION_RADIUS;
const CLICK_BURST_RADIUS = 280;
const DRAG_RADIUS = 80;
const SHOCKWAVE_MAX_RADIUS = 300;
const SHOCKWAVE_DURATION = 600; // ms

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  const clampedT = Math.min(1, Math.max(0, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * clampedT),
    g: Math.round(a.g + (b.g - a.g) * clampedT),
    b: Math.round(a.b + (b.b - a.b) * clampedT),
  };
}

function alterColor(color: RGB, variation: number): RGB {
  const channels: (keyof RGB)[] = ['r', 'g', 'b'];
  const channelToChange = channels[Math.floor(Math.random() * 3)];
  const shift = (Math.random() - 0.5) * 2 * variation;

  return {
    ...color,
    [channelToChange]: Math.max(0, Math.min(255, Math.round(color[channelToChange] + shift))),
  };
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const frameCounter = useRef<number>(0);
  const dprRef = useRef<number>(1);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    smoothX: -1000,
    smoothY: -1000,
    active: false,
    isDown: false,
    prevX: -1000,
    prevY: -1000,
  });

  const shockwaveRef = useRef<Shockwave>({
    x: 0,
    y: 0,
    radius: 0,
    startTime: 0,
    active: false,
  });

  const initParticles = (width: number, height: number) => {
    const newParticles: Particle[] = [];

    let hueIndices: number[] = [];
    while (hueIndices.length < PARTICLE_COUNT) {
      hueIndices = [...hueIndices, ...shuffleArray([0, 1, 2, 3, 4, 5, 6, 7])];
    }
    hueIndices = hueIndices.slice(0, PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseRadius = randomInRange(1.2, 2.8);
      const hueIndex = hueIndices[i];

      newParticles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: randomInRange(-0.15, 0.15),
        vy: randomInRange(-0.15, 0.15),
        baseRadius,
        radius: baseRadius,
        activeRadius: baseRadius,
        color: { ...REST_COLOR },
        targetColor: { ...REST_COLOR },
        colorT: 0,
        colorSpeed: randomInRange(0.008, 0.025),
        archetypeColor: ARCHETYPE_COLORS[hueIndex],
        hueIndex,
      });
    }
    particlesRef.current = newParticles;
  };

  const animate = (timestamp: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    frameCounter.current++;
    const { width, height } = dimensionsRef.current;
    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    ctx.fillStyle = CANVAS_CLEAR_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mouse.active) {
      if (mouse.smoothX === -1000) {
        mouse.smoothX = mouse.x;
        mouse.smoothY = mouse.y;
      } else {
        mouse.smoothX += (mouse.x - mouse.smoothX) * 0.15;
        mouse.smoothY += (mouse.y - mouse.smoothY) * 0.15;
      }
    }

    let dragDX = 0;
    let dragDY = 0;
    if (mouse.active && mouse.isDown && mouse.prevX !== -1000) {
      dragDX = mouse.x - mouse.prevX;
      dragDY = mouse.y - mouse.prevY;
    }
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    if (frameCounter.current % 3 === 0) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.colorT > 0.5) {
          for (let j = 0; j < particles.length; j++) {
            if (i === j) continue;
            const n = particles[j];
            if (n.colorT < 0.3) {
              const dx = p.x - n.x;
              const dy = p.y - n.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < DIFFUSION_RADIUS_SQ) {
                n.targetColor = alterColor(p.archetypeColor, 10);
                n.colorSpeed = randomInRange(0.005, 0.012);
              }
            }
          }
        }
      }
    }

    const scaledSmoothX = mouse.smoothX * dprRef.current;
    const scaledSmoothY = mouse.smoothY * dprRef.current;
    const scaledMouseX = mouse.x * dprRef.current;
    const scaledMouseY = mouse.y * dprRef.current;
    const isDragging = mouse.active && mouse.isDown;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dxMouse = p.x - scaledSmoothX;
      const dyMouse = p.y - scaledSmoothY;
      const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
      const distMouse = Math.sqrt(distMouseSq);

      let targetRadius = p.baseRadius;

      if (mouse.active) {
        if (isDragging) {
          const dxRaw = p.x - scaledMouseX;
          const dyRaw = p.y - scaledMouseY;
          const distRawSq = dxRaw * dxRaw + dyRaw * dyRaw;
          const scaledDragRadius = DRAG_RADIUS * dprRef.current;

          if (distRawSq < scaledDragRadius * scaledDragRadius) {
            p.targetColor = p.archetypeColor;
            p.colorSpeed = 0.06;
            p.vx += dragDX * 0.08 * dprRef.current;
            p.vy += dragDY * 0.08 * dprRef.current;
          }
        } else {
          const scaledActRadius = HOVER_ACTIVATION_RADIUS * dprRef.current;
          const scaledImmRadius = IMMEDIATE_ACTIVATION_RADIUS * dprRef.current;

          if (distMouse < scaledActRadius) {
            p.targetColor = p.archetypeColor;

            if (distMouse < scaledImmRadius) {
              p.colorSpeed = randomInRange(0.03, 0.05);
            } else {
              p.colorSpeed = randomInRange(0.015, 0.04);
            }

            const proximityFactor = 1 - distMouse / scaledActRadius;
            targetRadius = p.baseRadius * (1 + 0.6 * proximityFactor);
          }
        }
      }

      p.activeRadius = targetRadius;

      p.vx += (p.baseX - p.x) * 0.0008;
      p.vy += (p.baseY - p.y) * 0.0008;

      p.vx += randomInRange(-0.02, 0.02);
      p.vy += randomInRange(-0.02, 0.02);

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= 0.98;
      p.vy *= 0.98;

      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > height) { p.y = height; p.vy *= -1; }

      const isHeadingToRest = p.targetColor.r === REST_COLOR.r && p.targetColor.b === REST_COLOR.b;

      if (isHeadingToRest) {
        p.colorT = Math.max(0, p.colorT - p.colorSpeed);
      } else {
        p.colorT = Math.min(1, p.colorT + p.colorSpeed);
      }

      const renderColor = lerpColor(REST_COLOR, p.targetColor, p.colorT);

      const opacity = lerp(REST_OPACITY, AWAKENED_OPACITY, p.colorT);
      const drawRadius = lerp(p.baseRadius, p.activeRadius, p.colorT);

      ctx.beginPath();
      ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${renderColor.r}, ${renderColor.g}, ${renderColor.b}, ${opacity})`;
      ctx.fill();
    }

    const sw = shockwaveRef.current;
    if (sw.active) {
      const elapsed = timestamp - sw.startTime;
      const progress = Math.min(1, elapsed / SHOCKWAVE_DURATION);

      if (progress >= 1) {
        sw.active = false;
      } else {
        const dpr = dprRef.current;
        const currentRadius = lerp(0, SHOCKWAVE_MAX_RADIUS * dpr, progress);
        const opacity = lerp(0.8, 0, progress);

        ctx.lineWidth = 2 * dpr;
        const centerX = sw.x * dpr;
        const centerY = sw.y * dpr;

        const colorOffset = Math.floor(frameCounter.current / 10) % 8;

        for (let i = 0; i < 4; i++) {
          const colorIndex = (colorOffset + i * 2) % 8;
          const c = ARCHETYPE_COLORS[colorIndex];
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;

          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            currentRadius,
            (i * Math.PI) / 2,
            ((i + 1) * Math.PI) / 2
          );
          ctx.stroke();
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;

        if (width <= 0 || height <= 0) return;

        dimensionsRef.current = {
          width: width * dpr,
          height: height * dpr,
        };

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        initParticles(width * dpr, height * dpr);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId.current);
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.active = true;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const pos = getMousePos(e);
      mouseRef.current.smoothX = pos.x;
      mouseRef.current.smoothY = pos.y;
      mouseRef.current.prevX = pos.x;
      mouseRef.current.prevY = pos.y;
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.isDown = false;

      particlesRef.current.forEach((p) => {
        p.targetColor = { ...REST_COLOR };
        p.colorSpeed = randomInRange(0.003, 0.008);
      });
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleClick = (e: MouseEvent) => {
      const pos = getMousePos(e);
      const dpr = dprRef.current;
      const scaledClickX = pos.x * dpr;
      const scaledClickY = pos.y * dpr;
      const scaledBurstRadius = CLICK_BURST_RADIUS * dpr;

      shockwaveRef.current = {
        x: pos.x,
        y: pos.y,
        radius: 0,
        startTime: performance.now(),
        active: true,
      };

      particlesRef.current.forEach((p) => {
        const dx = p.x - scaledClickX;
        const dy = p.y - scaledClickY;
        const distSq = dx * dx + dy * dy;

        if (distSq < scaledBurstRadius * scaledBurstRadius) {
          const dist = Math.sqrt(distSq);
          const proximityFactor = 1 - dist / scaledBurstRadius;

          p.targetColor = p.archetypeColor;
          p.colorSpeed = randomInRange(0.04, 0.08);

          const angle = Math.atan2(dy, dx);
          const speed = proximityFactor * 3.5 * dpr;
          p.vx += Math.cos(angle) * speed;
          p.vy += Math.sin(angle) * speed;
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
        style={{ cursor: 'default' }}
      />
    </div>
  );
}
