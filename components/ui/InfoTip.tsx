'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  title: string
  body: string
}

export function InfoTip({ title, body }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const btnRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle() {
    if (!btnRef.current) return
    if (open) { setOpen(false); return }
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ x: rect.left + rect.width / 2, y: rect.bottom + 6 })
    setOpen(true)
  }

  return (
    <span ref={btnRef} className="relative inline-flex items-center" style={{ verticalAlign: 'middle' }}>
      <span
        onClick={toggle}
        className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold inline-flex items-center justify-center cursor-pointer select-none hover:bg-slate-200 transition-colors"
      >
        i
      </span>
      {open && pos && createPortal(
        <span
          style={{
            position: 'fixed',
            left: Math.min(Math.max(pos.x - 128, 8), window.innerWidth - 272),
            top: pos.y,
            zIndex: 9999,
          }}
          className="w-64 bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 leading-relaxed shadow-xl pointer-events-none"
        >
          <span className="block font-semibold mb-1">{title}</span>
          {body}
        </span>,
        document.body
      )}
    </span>
  )
}
