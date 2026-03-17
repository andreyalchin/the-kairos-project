import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-6',
      glass ? 'glass' : 'bg-white shadow-sm border border-slate-100',
      className
    )}>
      {children}
    </div>
  )
}
