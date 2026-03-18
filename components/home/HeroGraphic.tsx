'use client';

import { useEffect, useRef } from 'react';

// --- CONSTANTS ---

const DIMENSIONS = [
  'Strategic Orientation',
  'Cognitive Agility',
  'Emotional Stability',
  'Leadership Drive',
  'Openness',
  'Growth Mindset',
  'Purpose',
  'Adaptability',
];

const BASE_VALUES = [0.91, 0.85, 0.75, 0.87, 0.88, 0.88, 0.88, 0.80];

const COLORS = {
  primary: '#3730A3',
  secondary: '#0F766E',
  axisLabels: '#94A3B8',
  labelActive: '#3730A3',
};

const OPACITIES = {
  polygonFill: 0.15,
  polygonFillClick: 0.45,
  brainStroke: 0.06,
  gridLines: 0.08,
  nodesDefault: 0.6,
  labelsDefault: 0.4,
  labelsDimmed: 0.2,
  cursorRing: 0.4,
  cursorRingNearVertex: 0.8,
  rippleStroke: 0.6,
};

const VIEWBOX_SIZE = 500;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RADIUS = 160;
const NUM_AXES = DIMENSIONS.length;
const ANGLE_STEP = (2 * Math.PI) / NUM_AXES;
const START_ANGLE = -Math.PI / 2;

const DRAW_IN_DURATION = 1200;
const BREATHING_DURATION = 4000;
const BREATHING_RANGE = 0.08;
const BASE_ROTATION_RATE = 0.07;
const VELOCITY_MULTIPLIER = 0.03;
const VELOCITY_DECAY = 0.92;
const LERP_FACTOR = 0.12;
const SPRING_BACK_FACTOR = 0.04;
const ATTRACTION_K = 6000;
const CAP_PULL = 40;
const GLOW_DISTANCE = 80;
const GLOW_RADIUS_MIN = 4;
const GLOW_RADIUS_MAX = 8;
const CURSOR_RING_RADIUS_DEFAULT = 18;
const CURSOR_RING_RADIUS_NEAR = 10;
const CURSOR_RING_DIST_NEAR = 60;
const LABEL_HOVER_DIST = 60;
const LABEL_TRANSITION_MS = 150;
const NODE_PULSE_INTERVAL = 3000;
const CLICK_PULSE_UP = 120;
const CLICK_PULSE_DOWN = 400;
const RIPPLE_DURATION = 500;
const RIPPLE_RADIUS_MAX = 80;

const BRAIN_PATH = 'M250,170 C210,170 170,190 170,230 C170,270 190,300 210,320 C230,340 250,340 250,340 C250,340 270,340 290,320 C310,300 330,270 330,230 C330,190 290,170 250,170 Z M250,170 C270,170 300,180 300,210 C300,240 270,250 250,250 M250,170 C230,170 200,180 200,210 C200,240 230,250 250,250 M250,250 L250,340';

const polarToCartesian = (r: number, theta: number) => ({
  x: CENTER + r * Math.cos(theta),
  y: CENTER + r * Math.sin(theta),
});

const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

export function HeroGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number>();
  const startTimeRef = useRef<number>(performance.now());
  const previousTimeRef = useRef<number>(performance.now());

  const boundingClientRectRef = useRef<DOMRect | null>(null);
  const mouseStateRef = useRef({
    targetX: CENTER,
    targetY: CENTER,
    x: CENTER,
    y: CENTER,
    lastRawX: CENTER,
    lastRawY: CENTER,
    speed: 0,
    active: false,
    clickTime: -1,
    clickCoords: { x: 0, y: 0 },
  });

  const rotationAngleRef = useRef(0);
  const rotationBoostRef = useRef(0);
  const isDrawnInRef = useRef(false);
  const currentVertexOffsetsRef = useRef<number[]>(new Array(NUM_AXES).fill(0));

  const polygonRef = useRef<SVGPolygonElement>(null);
  const nodesRefs = useRef<SVGCircleElement[]>([]);
  const labelsRefs = useRef<SVGTextElement[]>([]);
  const rotationGroupRef = useRef<SVGGElement>(null);
  const cursorRingRef = useRef<SVGCircleElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      boundingClientRectRef.current = entries[0].target.getBoundingClientRect();
    });
    observer.observe(containerRef.current);
    boundingClientRectRef.current = containerRef.current.getBoundingClientRect();
    return () => observer.disconnect();
  }, []);

  // Event Listeners and Animation Loop
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const getSVGCoordinates = (clientX: number, clientY: number) => {
      const rect = boundingClientRectRef.current;
      if (!rect) return { x: 0, y: 0 };
      return {
        x: ((clientX - rect.left) / rect.width) * VIEWBOX_SIZE,
        y: ((clientY - rect.top) / rect.height) * VIEWBOX_SIZE,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getSVGCoordinates(e.clientX, e.clientY);
      const ms = mouseStateRef.current;
      ms.targetX = x;
      ms.targetY = y;
      ms.active = true;
      const now = performance.now();
      const dt = now - previousTimeRef.current;
      if (dt > 0) {
        const dx = x - ms.lastRawX;
        const dy = y - ms.lastRawY;
        ms.speed = Math.sqrt(dx * dx + dy * dy) / (dt / 16.67);
      }
      ms.lastRawX = x;
      ms.lastRawY = y;
    };

    const handleMouseLeave = () => {
      mouseStateRef.current.active = false;
      mouseStateRef.current.speed = 0;
    };

    const handleClick = (e: MouseEvent) => {
      const { x, y } = getSVGCoordinates(e.clientX, e.clientY);
      const ms = mouseStateRef.current;
      ms.clickTime = performance.now();
      ms.clickCoords = { x, y };
    };

    svgEl.addEventListener('mousemove', handleMouseMove);
    svgEl.addEventListener('mouseleave', handleMouseLeave);
    svgEl.addEventListener('click', handleClick);

    const animate = (time: number) => {
      previousTimeRef.current = time;
      const ms = mouseStateRef.current;
      const curOffsets = currentVertexOffsetsRef.current;

      if (!isDrawnInRef.current && time - startTimeRef.current >= DRAW_IN_DURATION) {
        isDrawnInRef.current = true;
        polygonRef.current?.setAttribute('stroke-dasharray', 'none');
      }

      ms.x += (ms.targetX - ms.x) * LERP_FACTOR;
      ms.y += (ms.targetY - ms.y) * LERP_FACTOR;

      rotationBoostRef.current = (rotationBoostRef.current + ms.speed * VELOCITY_MULTIPLIER) * VELOCITY_DECAY;
      rotationAngleRef.current += BASE_ROTATION_RATE + rotationBoostRef.current;

      if (rotationGroupRef.current) {
        rotationGroupRef.current.setAttribute('transform', `rotate(${rotationAngleRef.current}, ${CENTER}, ${CENTER})`);
      }

      const getRotatedCoords = (initialAngle: number, radius: number) => {
        const finalAngle = initialAngle + (rotationAngleRef.current * Math.PI) / 180;
        return polarToCartesian(radius, finalAngle);
      };

      const breathingPhase = (time % BREATHING_DURATION) / BREATHING_DURATION;
      const breathingSin = Math.sin(breathingPhase * 2 * Math.PI);

      const vertexPoints: { x: number; y: number }[] = [];
      let closestVertexDist = Infinity;
      let closestLabelIndex = -1;
      let minLabelDist = Infinity;

      const timeSinceClick = time - ms.clickTime;
      const isFillPulseActive = timeSinceClick > 0 && timeSinceClick < CLICK_PULSE_UP + CLICK_PULSE_DOWN;
      let polygonFillOpacity = OPACITIES.polygonFill;

      if (isFillPulseActive) {
        if (timeSinceClick <= CLICK_PULSE_UP) {
          const t = timeSinceClick / CLICK_PULSE_UP;
          polygonFillOpacity = OPACITIES.polygonFill + t * (OPACITIES.polygonFillClick - OPACITIES.polygonFill);
        } else {
          const t = (timeSinceClick - CLICK_PULSE_UP) / CLICK_PULSE_DOWN;
          polygonFillOpacity = OPACITIES.polygonFillClick - t * (OPACITIES.polygonFillClick - OPACITIES.polygonFill);
        }
      }

      for (let i = 0; i < NUM_AXES; i++) {
        const angle = START_ANGLE + i * ANGLE_STEP;
        const breathBase = BASE_VALUES[i] + breathingSin * BREATHING_RANGE;
        const basePos = getRotatedCoords(angle, breathBase * MAX_RADIUS);

        if (ms.active) {
          const dx = ms.x - basePos.x;
          const dy = ms.y - basePos.y;
          const distSq = dx * dx + dy * dy;
          const force = ATTRACTION_K / (distSq + 80);
          const axisVectorX = Math.cos(angle + (rotationAngleRef.current * Math.PI / 180));
          const axisVectorY = Math.sin(angle + (rotationAngleRef.current * Math.PI / 180));
          const projectionDist = (ms.x - basePos.x) * axisVectorX + (ms.y - basePos.y) * axisVectorY;
          let currentPull = force * projectionDist / Math.sqrt(distSq + 0.1);
          currentPull = Math.max(-CAP_PULL, Math.min(CAP_PULL, currentPull));
          const targetOffset = breathBase + currentPull / MAX_RADIUS;
          curOffsets[i] += (targetOffset - curOffsets[i]) * 0.1;
        } else {
          curOffsets[i] += (breathBase - curOffsets[i]) * SPRING_BACK_FACTOR;
        }

        const point = getRotatedCoords(angle, curOffsets[i] * MAX_RADIUS);
        vertexPoints.push(point);

        const dToPoint = getDistance(ms.x, ms.y, point.x, point.y);
        if (dToPoint < closestVertexDist) closestVertexDist = dToPoint;

        const labelBasePos = getRotatedCoords(angle, MAX_RADIUS + 15);
        const dToLabel = getDistance(ms.x, ms.y, labelBasePos.x, labelBasePos.y);
        if (dToLabel < LABEL_HOVER_DIST && dToLabel < minLabelDist) {
          minLabelDist = dToLabel;
          closestLabelIndex = i;
        }
      }

      if (polygonRef.current && isDrawnInRef.current) {
        polygonRef.current.setAttribute('points', vertexPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
        polygonRef.current.style.fillOpacity = polygonFillOpacity.toString();
      }

      const randomPulseNodeIndex = Math.floor(time / NODE_PULSE_INTERVAL) % NUM_AXES;
      const nodePulseT = (time % NODE_PULSE_INTERVAL) < 600 ? 1 - (time % NODE_PULSE_INTERVAL) / 600 : 0;

      for (let i = 0; i < NUM_AXES; i++) {
        const node = nodesRefs.current[i];
        if (!node) continue;
        const p = vertexPoints[i];
        node.setAttribute('cx', p.x.toFixed(1));
        node.setAttribute('cy', p.y.toFixed(1));

        let currentGlow = OPACITIES.nodesDefault;
        let currentR = 4;
        let currentColor = COLORS.primary;

        if (ms.active) {
          const d = getDistance(ms.x, ms.y, p.x, p.y);
          if (d <= GLOW_DISTANCE) {
            const intensity = 1 - d / GLOW_DISTANCE;
            currentGlow = Math.max(0.6, intensity);
            currentR = GLOW_RADIUS_MIN + intensity * (GLOW_RADIUS_MAX - GLOW_RADIUS_MIN);
            if (intensity > 0.5) currentColor = COLORS.secondary;
          }
        }

        if (isFillPulseActive) {
          currentColor = COLORS.secondary;
          const pulseT = timeSinceClick <= CLICK_PULSE_UP
            ? timeSinceClick / CLICK_PULSE_UP
            : 1 - (timeSinceClick - CLICK_PULSE_UP) / CLICK_PULSE_DOWN;
          currentGlow = Math.max(currentGlow, pulseT);
          currentR = Math.max(currentR, GLOW_RADIUS_MAX * pulseT);
        } else if (i === randomPulseNodeIndex && nodePulseT > 0) {
          currentColor = COLORS.secondary;
          currentGlow = Math.max(currentGlow, nodePulseT);
          currentR = Math.max(currentR, GLOW_RADIUS_MAX * nodePulseT);
        }

        node.style.fillOpacity = currentGlow.toFixed(3);
        node.style.stroke = currentColor;
        node.setAttribute('r', currentR.toFixed(1));
        node.style.filter = currentGlow > 0.7 ? `drop-shadow(0 0 2px ${COLORS.secondary})` : 'none';
      }

      const labelsGroup = labelsRefs.current[0]?.parentElement as HTMLElement | null;
      if (labelsGroup) {
        labelsGroup.style.opacity = closestLabelIndex !== -1 ? '0.8' : '1';
      }

      for (let i = 0; i < NUM_AXES; i++) {
        const label = labelsRefs.current[i];
        if (!label) continue;
        let targetOpacity = OPACITIES.labelsDefault;
        let targetColor = COLORS.axisLabels;
        let targetWeight = '400';
        if (closestLabelIndex !== -1) {
          if (i === closestLabelIndex) {
            targetOpacity = 1;
            targetColor = COLORS.labelActive;
            targetWeight = '600';
          } else {
            targetOpacity = OPACITIES.labelsDimmed;
          }
        }
        label.style.transition = `opacity ${LABEL_TRANSITION_MS}ms ease, fill ${LABEL_TRANSITION_MS}ms ease`;
        label.style.opacity = targetOpacity.toFixed(2);
        label.style.fill = targetColor;
        label.style.fontWeight = targetWeight;
      }

      if (cursorRingRef.current) {
        if (ms.active) {
          cursorRingRef.current.setAttribute('cx', ms.x.toFixed(1));
          cursorRingRef.current.setAttribute('cy', ms.y.toFixed(1));
          cursorRingRef.current.style.opacity = '1';
          const nearVertex = closestVertexDist < CURSOR_RING_DIST_NEAR;
          const targetR = nearVertex ? CURSOR_RING_RADIUS_NEAR : CURSOR_RING_RADIUS_DEFAULT;
          const targetOpacity = nearVertex ? OPACITIES.cursorRingNearVertex : OPACITIES.cursorRing;
          const currentR = parseFloat(cursorRingRef.current.getAttribute('r') || String(targetR));
          cursorRingRef.current.setAttribute('r', (currentR + (targetR - currentR) * 0.2).toFixed(1));
          cursorRingRef.current.style.strokeOpacity = targetOpacity.toString();
          const scaleX = Math.min(1.4, 1 + ms.speed * 0.015);
          const scaleY = 1 - ms.speed * 0.008;
          const angle = ms.speed > 0
            ? Math.atan2(ms.lastRawY - ms.y, ms.lastRawX - ms.x) * 180 / Math.PI
            : rotationAngleRef.current;
          cursorRingRef.current.setAttribute('transform', `rotate(${angle}, ${ms.x}, ${ms.y}) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`);
        } else {
          cursorRingRef.current.style.opacity = '0';
        }
      }

      if (rippleRef.current) {
        if (timeSinceClick > 0 && timeSinceClick < RIPPLE_DURATION) {
          const t = timeSinceClick / RIPPLE_DURATION;
          rippleRef.current.setAttribute('cx', ms.clickCoords.x.toFixed(1));
          rippleRef.current.setAttribute('cy', ms.clickCoords.y.toFixed(1));
          rippleRef.current.setAttribute('r', (t * RIPPLE_RADIUS_MAX).toFixed(1));
          rippleRef.current.style.strokeOpacity = (OPACITIES.rippleStroke * (1 - t)).toFixed(3);
          rippleRef.current.style.visibility = 'visible';
        } else {
          rippleRef.current.style.visibility = 'hidden';
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      svgEl.removeEventListener('mousemove', handleMouseMove);
      svgEl.removeEventListener('mouseleave', handleMouseLeave);
      svgEl.removeEventListener('click', handleClick);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  const axisGrid = Array.from({ length: NUM_AXES }).map((_, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    const end = polarToCartesian(MAX_RADIUS, angle);
    const labelPos = polarToCartesian(MAX_RADIUS + 25, angle);
    return { x2: end.x, y2: end.y, labelX: labelPos.x, labelY: labelPos.y };
  });

  const rings = [0.33, 0.66, 1].map(r => MAX_RADIUS * r);

  const initialPoints = axisGrid.map((_, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    const p = polarToCartesian(BASE_VALUES[i] * MAX_RADIUS, angle);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');

  return (
    <div
      ref={containerRef}
      className="w-full aspect-square max-w-[320px] md:max-w-[480px] select-none cursor-crosshair overflow-visible bg-transparent mx-auto lg:mx-0"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="w-full h-full overflow-visible"
      >
        {/* Brain silhouette */}
        <path
          d={BRAIN_PATH}
          stroke={COLORS.primary}
          strokeWidth={1}
          fill="none"
          strokeOpacity={OPACITIES.brainStroke}
        />

        {/* Rotating group: axes, rings, labels */}
        <g ref={rotationGroupRef}>
          <g stroke={COLORS.primary} strokeWidth={1} strokeOpacity={0.1}>
            {axisGrid.map((axis, i) => (
              <line key={i} x1={CENTER} y1={CENTER} x2={axis.x2} y2={axis.y2} />
            ))}
          </g>
          <g stroke={COLORS.primary} strokeWidth={1} strokeOpacity={OPACITIES.gridLines} fill="none">
            {rings.map((r, i) => (
              <circle key={i} cx={CENTER} cy={CENTER} r={r} />
            ))}
          </g>
          <g id="axis-labels">
            {axisGrid.map((axis, i) => (
              <text
                key={i}
                ref={el => { if (el) labelsRefs.current[i] = el; }}
                x={axis.labelX}
                y={axis.labelY}
                fontFamily="sans-serif"
                fontSize="11px"
                fontWeight="400"
                fill={COLORS.axisLabels}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ opacity: OPACITIES.labelsDefault }}
              >
                {DIMENSIONS[i]}
              </text>
            ))}
          </g>
        </g>

        {/* Radar polygon */}
        <polygon
          ref={polygonRef}
          fill={COLORS.primary}
          fillOpacity={OPACITIES.polygonFill}
          stroke={COLORS.primary}
          strokeWidth={2}
          strokeLinejoin="round"
          points={initialPoints}
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: `drawIn ${DRAW_IN_DURATION}ms ease-out forwards`,
          }}
        />

        {/* Axis nodes */}
        <g>
          {axisGrid.map((_, i) => (
            <circle
              key={i}
              ref={el => { if (el) nodesRefs.current[i] = el; }}
              r={4}
              stroke={COLORS.primary}
              strokeWidth={1.5}
              fill="#FFFFFF"
              style={{ fillOpacity: OPACITIES.nodesDefault }}
            />
          ))}
        </g>

        {/* Cursor ring */}
        <circle
          ref={cursorRingRef}
          r={CURSOR_RING_RADIUS_DEFAULT}
          stroke={COLORS.secondary}
          strokeOpacity={OPACITIES.cursorRing}
          strokeWidth={1.5}
          fill="none"
          style={{ opacity: 0, pointerEvents: 'none' }}
        />

        {/* Ripple ring */}
        <circle
          ref={rippleRef}
          r={0}
          stroke={COLORS.secondary}
          strokeOpacity={0}
          strokeWidth={1.5}
          fill="none"
          style={{ visibility: 'hidden', pointerEvents: 'none' }}
        />
      </svg>
    </div>
  );
}
