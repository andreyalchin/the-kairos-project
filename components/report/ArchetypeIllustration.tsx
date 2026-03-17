import type { ArchetypeDefinition } from '@/lib/types'

// Each team role maps to a distinct geometric motif.
// The archetype's top-weighted signature dimension influences scale/density.
// All rendered in white/transparent to sit on the dark indigo hero card.

function getComplexity(archetype: ArchetypeDefinition): number {
  const maxWeight = Math.max(...archetype.signature.map(s => s.weight))
  return Math.min(1, maxWeight / 1.5)
}

function ArchitectMotif({ cx }: { cx: number }) {
  // Structural grid of nodes connected by lines
  const nodes = [
    [cx, 40], [cx - 50, 90], [cx + 50, 90],
    [cx - 90, 150], [cx, 145], [cx + 90, 150],
    [cx - 50, 200], [cx + 50, 200],
  ]
  const edges = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5],
    [3, 6], [4, 6], [4, 7], [5, 7],
  ]
  return (
    <g opacity="0.18">
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="white" strokeWidth="1.5"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4} fill="white" />
      ))}
    </g>
  )
}

function CatalystMotif({ cx }: { cx: number }) {
  // Radiating burst lines from center
  const count = 16
  const len1 = 60, len2 = 110
  return (
    <g opacity="0.18">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const inner = i % 2 === 0 ? 20 : 30
        const outer = i % 2 === 0 ? len1 : len2
        return (
          <line key={i}
            x1={cx + Math.cos(angle) * inner} y1={120 + Math.sin(angle) * inner}
            x2={cx + Math.cos(angle) * outer} y2={120 + Math.sin(angle) * outer}
            stroke="white" strokeWidth={i % 4 === 0 ? 2 : 1}
          />
        )
      })}
      <circle cx={cx} cy={120} r={14} fill="none" stroke="white" strokeWidth="2" />
      <circle cx={cx} cy={120} r={5} fill="white" />
    </g>
  )
}

function ExecutorMotif({ cx }: { cx: number }) {
  // Stacked forward chevrons showing momentum
  const chevrons = [0, 35, 70, 105]
  return (
    <g opacity="0.18">
      {chevrons.map((offset, i) => {
        const y = 55 + offset
        const w = 60 - i * 8
        const opacity = 1 - i * 0.18
        return (
          <g key={i} opacity={opacity}>
            <polyline
              points={`${cx - w},${y} ${cx},${y - 22} ${cx + w},${y}`}
              fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"
            />
          </g>
        )
      })}
      <line x1={cx} y1={200} x2={cx} y2={50} stroke="white" strokeWidth="1" opacity="0.3" strokeDasharray="4 6" />
    </g>
  )
}

function HarmonizerMotif({ cx }: { cx: number }) {
  // Concentric ripple rings
  const radii = [18, 42, 68, 95, 122]
  return (
    <g opacity="0.18">
      {radii.map((r, i) => (
        <circle key={i} cx={cx} cy={120} r={r}
          fill="none" stroke="white"
          strokeWidth={i === 0 ? 3 : 1.5}
          opacity={1 - i * 0.15}
        />
      ))}
      <circle cx={cx} cy={120} r={7} fill="white" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line key={i}
            x1={cx + Math.cos(rad) * 18} y1={120 + Math.sin(rad) * 18}
            x2={cx + Math.cos(rad) * 95} y2={120 + Math.sin(rad) * 95}
            stroke="white" strokeWidth="0.8" opacity="0.5"
          />
        )
      })}
    </g>
  )
}

function ChallengerMotif({ cx }: { cx: number }) {
  // Overlapping angular polygons — disruption / tension
  const poly1 = `${cx},30 ${cx + 80},130 ${cx + 30},210 ${cx - 50},195 ${cx - 70},100`
  const poly2 = `${cx + 10},55 ${cx + 90},145 ${cx + 20},215 ${cx - 45},180 ${cx - 55},90`
  return (
    <g opacity="0.15">
      <polygon points={poly1} fill="none" stroke="white" strokeWidth="1.5" />
      <polygon points={poly2} fill="white" opacity="0.06" stroke="white" strokeWidth="1" />
      {/* accent lines */}
      <line x1={cx} y1={30} x2={cx - 70} y2={100} stroke="white" strokeWidth="2.5" opacity="0.6" />
      <line x1={cx + 80} y1={130} x2={cx - 50} y2={195} stroke="white" strokeWidth="1.5" opacity="0.4" />
      <circle cx={cx} cy={30} r={5} fill="white" opacity="0.7" />
    </g>
  )
}

function NavigatorMotif({ cx }: { cx: number }) {
  // Compass rose with directional paths
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <g opacity="0.18">
      {/* outer ring */}
      <circle cx={cx} cy={120} r={100} fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
      <circle cx={cx} cy={120} r={60} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {spokes.map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const inner = i % 2 === 0 ? 18 : 30
        const outer = i % 2 === 0 ? 100 : 60
        return (
          <line key={i}
            x1={cx + Math.cos(rad) * inner} y1={120 + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * outer} y2={120 + Math.sin(rad) * outer}
            stroke="white" strokeWidth={i % 2 === 0 ? 2 : 1}
          />
        )
      })}
      {/* North pointer */}
      <polygon
        points={`${cx},20 ${cx - 10},110 ${cx},95 ${cx + 10},110`}
        fill="white" opacity="0.7"
      />
      <circle cx={cx} cy={120} r={8} fill="white" />
    </g>
  )
}

const MOTIFS: Record<string, React.ComponentType<{ cx: number }>> = {
  Architect: ArchitectMotif,
  Catalyst: CatalystMotif,
  Executor: ExecutorMotif,
  Harmonizer: HarmonizerMotif,
  Challenger: ChallengerMotif,
  Navigator: NavigatorMotif,
}

export function ArchetypeIllustration({ archetype }: { archetype: ArchetypeDefinition }) {
  const Motif = MOTIFS[archetype.team_role] ?? HarmonizerMotif
  const complexity = getComplexity(archetype)
  return (
    <svg
      viewBox="0 0 240 240"
      width="200"
      height="200"
      aria-hidden="true"
      style={{ opacity: 0.85 + complexity * 0.1 }}
      className="shrink-0"
    >
      <Motif cx={120} />
    </svg>
  )
}
