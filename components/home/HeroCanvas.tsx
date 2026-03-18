'use client';

import React, { useEffect, useRef } from 'react';

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

const PARTICLE_COUNT = 1800;
const REST_COLOR: RGB = { r: 55, g: 48, b: 163 };
const REST_OPACITY = 0.18;
const AWAKENED_OPACITY = 0.88;
const CANVAS_CLEAR_COLOR = 'rgba(248, 250, 252, 0.2)';

// Text zone: only the narrow center band is sparse — sides are fully populated
const TEXT_ZONE_X0 = 0.28;
const TEXT_ZONE_X1 = 0.72;
const TEXT_ZONE_Y0 = 0.2;
const TEXT_ZONE_Y1 = 0.8;
const TEXT_ZONE_DENSITY = 0.1;

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

// Small radius — only particles directly in the cursor's path bloom
const HOVER_ACTIVATION_RADIUS = 55;
const IMMEDIATE_ACTIVATION_RADIUS = 22;
// Velocity push radius — slightly larger than color radius for a leading-edge feel
const PUSH_RADIUS = 75;
// Click burst — velocity only, no color change
const CLICK_BURST_RADIUS = 200;

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

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const dprRef = useRef<number>(1);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    smoothX: -1000,
    smoothY: -1000,
    active: false,
    prevX: -1000,
    prevY: -1000,
  });

  const initParticles = (width: number, height: number) => {
    let hueIndices: number[] = [];
    while (hueIndices.length < PARTICLE_COUNT) {
      hueIndices = [...hueIndices, ...shuffleArray([0, 1, 2, 3, 4, 5, 6, 7])];
    }
    hueIndices = hueIndices.slice(0, PARTICLE_COUNT);

    const newParticles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x: number, y: number;
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
        x, y, baseX: x, baseY: y,
        vx: randomInRange(-0.15, 0.15),
        vy: randomInRange(-0.15, 0.15),
        baseRadius, radius: baseRadius, activeRadius: baseRadius,
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

  const animate = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { width, height } = dimensionsRef.current;
    const mouse = mouseRef.current;
    const particles = particlesRef.current;
    const dpr = dprRef.current;

    ctx.fillStyle = CANVAS_CLEAR_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smooth mouse position
    if (mouse.active) {
      if (mouse.smoothX === -1000) {
        mouse.smoothX = mouse.x;
        mouse.smoothY = mouse.y;
      } else {
        mouse.smoothX += (mouse.x - mouse.smoothX) * 0.18;
        mouse.smoothY += (mouse.y - mouse.smoothY) * 0.18;
      }
    }

    // Velocity delta from mouse movement (always active, not just on drag)
    let moveDX = 0;
    let moveDY = 0;
    if (mouse.active && mouse.prevX !== -1000) {
      moveDX = mouse.x - mouse.prevX;
      moveDY = mouse.y - mouse.prevY;
    }
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    const scaledSmoothX = mouse.smoothX * dpr;
    const scaledSmoothY = mouse.smoothY * dpr;
    const scaledActRadius = HOVER_ACTIVATION_RADIUS * dpr;
    const scaledImmRadius = IMMEDIATE_ACTIVATION_RADIUS * dpr;
    const scaledPushRadius = PUSH_RADIUS * dpr;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (mouse.active) {
        const dx = p.x - scaledSmoothX;
        const dy = p.y - scaledSmoothY;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // ── Velocity push on every mouse move (default "drag") ──
        if (distSq < scaledPushRadius * scaledPushRadius) {
          const pushStrength = (1 - dist / scaledPushRadius) * 0.055 * dpr;
          p.vx += moveDX * pushStrength;
          p.vy += moveDY * pushStrength;
        }

        // ── Color: only particles directly in the cursor's path ──
        if (dist < scaledActRadius) {
          p.targetColor = p.archetypeColor;
          p.colorSpeed = dist < scaledImmRadius
            ? randomInRange(0.04, 0.07)
            : randomInRange(0.02, 0.045);
          const proximity = 1 - dist / scaledActRadius;
          p.activeRadius = p.baseRadius * (1 + 0.5 * proximity);
        } else {
          p.activeRadius = p.baseRadius;
        }
      } else {
        p.activeRadius = p.baseRadius;
      }

      // Physics
      p.vx += (p.baseX - p.x) * 0.0008;
      p.vy += (p.baseY - p.y) * 0.0008;
      p.vx += randomInRange(-0.015, 0.015);
      p.vy += randomInRange(-0.015, 0.015);
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;

      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > height) { p.y = height; p.vy *= -1; }

      // Color state
      const isResting =
        p.targetColor.r === REST_COLOR.r && p.targetColor.b === REST_COLOR.b;
      p.colorT = isResting
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

    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Canvas setup + ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const ro = new ResizeObserver((entries) => {
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
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animationFrameId.current);
      else animationFrameId.current = requestAnimationFrame(animate);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Mouse events on window — bypasses text overlay that would block canvas events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const inCanvas = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return (
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom
      );
    };

    const canvasPos = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      if (inCanvas(e)) {
        const { x, y } = canvasPos(e);
        if (!mouse.active) {
          mouse.smoothX = x; mouse.smoothY = y;
          mouse.prevX = x; mouse.prevY = y;
        }
        mouse.x = x; mouse.y = y;
        mouse.active = true;
      } else if (mouse.active) {
        mouse.active = false;
        // Fade all active particles back to rest
        particlesRef.current.forEach((p) => {
          p.targetColor = { ...REST_COLOR };
          p.colorSpeed = randomInRange(0.003, 0.007);
        });
      }
    };

    // Click: velocity burst only — no color, no shockwave
    const onClick = (e: MouseEvent) => {
      if (!inCanvas(e)) return;
      const { x, y } = canvasPos(e);
      const dpr = dprRef.current;
      const sx = x * dpr;
      const sy = y * dpr;
      const sr = CLICK_BURST_RADIUS * dpr;
      particlesRef.current.forEach((p) => {
        const dx = p.x - sx;
        const dy = p.y - sy;
        const distSq = dx * dx + dy * dy;
        if (distSq < sr * sr) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / sr) * 4 * dpr;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
