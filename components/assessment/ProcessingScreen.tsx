export function ProcessingScreen() {
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute w-32 h-32 rounded-full border-4 border-indigo ring-animate opacity-60" />
        <div className="absolute w-24 h-24 rounded-full border-4 border-teal ring-animate-delay-1 opacity-50" />
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue ring-animate-delay-2 opacity-40" />
        <div className="w-10 h-10 rounded-full bg-indigo" />
      </div>
      <h2 className="mt-10 text-2xl font-bold text-text">Kairos is mapping your potential</h2>
      <p className="mt-2 text-slate-500 text-base">Analyzing 29 dimensions across 6 layers<span className="animate-pulse">…</span></p>
    </div>
  )
}
