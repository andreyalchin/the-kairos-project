'use client'

interface Props {
  title: string
  body: string
}

export function InfoTip({ title, body }: Props) {
  return (
    <span className="relative group inline-flex items-center">
      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold inline-flex items-center justify-center cursor-default select-none hover:bg-slate-200 transition-colors">
        i
      </span>
      <span className="absolute left-5 top-1/2 -translate-y-1/2 z-20 hidden group-hover:block w-64 bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 leading-relaxed shadow-xl pointer-events-none">
        <span className="block font-semibold mb-1">{title}</span>
        {body}
      </span>
    </span>
  )
}
