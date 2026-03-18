'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'kairos_announcement_dismissed'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative bg-teal text-white text-sm text-center py-2 px-10">
      Early access — full reports free while we grow. No credit card required.
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
