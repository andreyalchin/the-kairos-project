import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo disabled:opacity-50',
        {
          primary: 'bg-indigo text-white hover:bg-indigo-600',
          secondary: 'bg-teal text-white hover:bg-teal-600',
          ghost: 'text-text hover:bg-indigo-50',
          outline: 'border border-indigo text-indigo hover:bg-indigo-50',
        }[variant],
        { sm: 'h-8 px-3 text-sm', md: 'h-10 px-5 text-base', lg: 'h-12 px-8 text-lg' }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
