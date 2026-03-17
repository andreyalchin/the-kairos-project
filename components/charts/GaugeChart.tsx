'use client'

interface Props { score: number; label: string; size?: number }

export function GaugeChart({ score, label, size = 120 }: Props) {
  const radius = (size / 2) - 10
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const cx = size / 2
  const cy = size / 2 + 10

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        <path
          d={`M 10,${cy} A ${radius},${radius} 0 0,1 ${size - 10},${cy}`}
          fill="none" stroke="#E2E8F0" strokeWidth={10} strokeLinecap="round"
        />
        <path
          d={`M 10,${cy} A ${radius},${radius} 0 0,1 ${size - 10},${cy}`}
          fill="none" stroke="#3730A3" strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1E293B" fontSize={size * 0.2} fontWeight="bold">
          {score}
        </text>
      </svg>
      <span className="text-xs text-slate-500 text-center">{label}</span>
    </div>
  )
}
