'use client'

interface BarItem { label: string; score: number; percentile?: number }
interface Props { items: BarItem[]; colorClass?: string }

export function HorizontalBarChart({ items, colorClass = 'bg-indigo' }: Props) {
  return (
    <div className="space-y-3">
      {items.map(({ label, score, percentile }) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-text">{label}</span>
            <span className="text-slate-500">{score}{percentile !== undefined ? ` · p${percentile}` : ''}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass} rounded-full transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
