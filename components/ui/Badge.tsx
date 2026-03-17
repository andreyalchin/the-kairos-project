import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'indigo' | 'teal' | 'blue' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'indigo', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
      {
        indigo: 'bg-indigo-50 text-indigo',
        teal: 'bg-teal-50 text-teal',
        blue: 'bg-blue-50 text-blue',
        neutral: 'bg-slate-100 text-slate-600',
      }[variant],
      className
    )}>
      {children}
    </span>
  )
}
