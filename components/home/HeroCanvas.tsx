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
  colorT: number;
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
const REST_COLOR: RGB = { r: 55, g: 48, b: 163 };
const REST_OPACITY = 0.15;
const AWAKENED_OPACITY = 0.9;
const CANVAS_CLEAR_COLOR = 'rgba(248, 250, 252, 0.18)';

// Fraction of the canvas (centered) where particles are sparse — keeps text readable
const TEXT_ZONE_X0 = 0.15;
const TEXT_ZONE_X1 = 0.85;
const TEXT_ZONE_Y0 = 0.1;
const TEXT_ZONE_Y1 = 0.9;
const TEXT_ZONE_DENSITY = 0.08; // only 8% of particles land in the text zone

const ARCHETYPE_COLORS: RGB[] = [
  { r: 79, g: 70, b: 229 },
  { r: 236, g: 72, b: 153 },
  { r: 16, g: 185, b: 129 },
  { r: 245, g: 158, b: 11 },
  { r: 6, g: 182, b: 212 },
  { r: 139, g: 92, b: 246 },
  { r: 249, g: 115, b: 22 },
  { r: 20, g: 184, b: 166 },
];

const HOVER_ACTIVATION_RADIUS = 130;
const IMMEDIATE_ACTIVATION_RADIUS = 40;
const DIFFUSION_RADIUS = 90;
const DIFFUSION_RADIUS_SQ = DIFFUSION_RADIUS * DIFFUSION_RADIUS;
const CLICK_BURST_RADIUS = 280;
const DRAG_RADIUS = 80;
const SHOCKWAVE_MAX_RADIUS = 300;
const SHOCKWAVE_DURATION = 600;

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  const ct = Math.min(1, Math.max(0, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * ct),
    g: Math.round(a.g + (b.g - a.g) * ct),
    b: Math.round(a.b + (b.b - a.b) * ct),
  };
}

function alterColor(color: RGB, variation: number): RGB {
  const channels: (keyof RGB)[] = ['r', 'g', 'b'];
  const ch = channels[Math.floor(Math.random() * 3)];
  const shift = (Math.random() - 0.5) * 2 * variation;
  return {
    ...color,
    [ch]: Math.max(0, Math.min(255, Math.round(color[ch] + shift))),
  };
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    x: 0, y: 0, radius: 0, startTime: 0, active: false,
  });

  // ─── Init ───────────────────────────────────────────────────────────
  const initParticles = (width: number, height: number) => {
    const newParticles: Particle[] = [];

    let hueIndices: number[] = [];
    while (hueIndices.length < PARTICLE_COUNT) {
      hueIndices = [...hueIndices, ...shuffleArray([0, 1, 2, 3, 4, 5, 6, 7])];
    }
    hueIndices = hueIndices.slice(0, PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x: number, y: number;

      // Keep retrying until the particle lands in an acceptable spot.
      // Text zone accepts only TEXT_ZONE_DENSITY fraction of attempts.
      do {
        x = Math.random() * width;
        y = Math.random() * height;
        const inTextZone =
          x > width * TEXT_ZONE_X0 && x < width * TEXT_ZONE_X1 &&
          y > height * TEXT_ZONE_Y0 && y < height * TEXT_ZONE_Y1;
        if (!inTextZone) break;
      } while (Math.random() > TEXT_ZONE_DENSITY);

      const baseRadius = randomInRange(1.2, 2.8);
      const hueIndex = hueIndices[i];

      newParticles.push({
        x, y,
        baseX: x, baseY: y,
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

  // ─── Render loop ────────────────────────────────────────────────────
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

    // Diffusion pass every 3rd frame
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
              if (dx * dx + dy * dy < DIFFUSION_RADIUS_SQ) {
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
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      let targetRadius = p.baseRadius;

      if (mouse.active) {
        if (isDragging) {
          const dxRaw = p.x - scaledMouseX;
          const dyRaw = p.y - scaledMouseY;
          const scaledDragRadius = DRAG_RADIUS * dprRef.current;
          if (dxRaw * dxRaw + dyRaw * dyRaw < scaledDragRadius * scaledDragRadius) {
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
            p.colorSpeed = distMouse < scaledImmRadius
              ? randomInRange(0.03, 0.05)
              : randomInRange(0.015, 0.04);
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

      const isHeadingToRest =
        p.targetColor.r === REST_COLOR.r && p.targetColor.b === REST_COLOR.b;

      p.colorT = isHeadingToRest
        ? Math.max(0, p.colorT - p.colorSpeed)
        : Math.min(1, p.colorT + p.colorSpeed);

      const renderColor = lerpColor(REST_COLOR, p.targetColor, p.colorT);
      const opacity = lerp(REST_OPACITY, AWAKENED_OPACITY, p.colorT);
      const drawRadius = lerp(p.baseRadius, p.activeRadius, p.colorT);

      ctx.beginPath();
      ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${renderColor.r}, ${renderColor.g}, ${renderColor.b}, ${opacity})`;
      ctx.fill();
    }

    // Shockwave
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
        const colorOffset = Math.floor(frameCounter.current / 10) % 8;
        ctx.lineWidth = 2 * dpr;
        for (let i = 0; i < 4; i++) {
          const c = ARCHETYPE_COLORS[(colorOffset + i * 2) % 8];
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(sw.x * dpr, sw.y * dpr, currentRadius, (i * Math.PI) / 2, ((i + 1) * Math.PI) / 2);
          ctx.stroke();
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  // ─── Canvas setup + ResizeObserver ──────────────────────────────────
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
        if (width <= 0 || height <= 0) return;
        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;
        dimensionsRef.current = { width: width * dpr, height: height * dpr };
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        initParticles(width * dpr, height * dpr);
      }
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ─── Animation loop ─────────────────────────────────────────────────
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId.current);
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ─── Mouse events — listen on window so text overlay doesn't block ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        inBounds:
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y, inBounds } = getCanvasPos(e);
      const mouse = mouseRef.current;

      if (inBounds) {
        if (!mouse.active) {
          // Snap smooth on first entry to avoid slide-in from off-screen
          mouse.smoothX = x;
          mouse.smoothY = y;
          mouse.prevX = x;
          mouse.prevY = y;
        }
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
      } else if (mouse.active) {
        mouse.active = false;
        mouse.isDown = false;
        particlesRef.current.forEach((p) => {
          p.targetColor = { ...REST_COLOR };
          p.colorSpeed = randomInRange(0.003, 0.008);
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { inBounds } = getCanvasPos(e);
      if (inBounds) mouseRef.current.isDown = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleClick = (e: MouseEvent) => {
      const { x, y, inBounds } = getCanvasPos(e);
      if (!inBounds) return;

      const dpr = dprRef.current;
      const scaledClickX = x * dpr;
      const scaledClickY = y * dpr;
      const scaledBurstRadius = CLICK_BURST_RADIUS * dpr;

      shockwaveRef.current = {
        x, y, radius: 0, startTime: performance.now(), active: true,
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ cursor: 'default' }}
      />
    </div>
  );
}
