'use client'

import { useEffect, useRef, useState } from 'react'

export function AdContainer({ placement }: { placement: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true)
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur"
    >
      {visible ? (
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Ad placeholder: <span className="font-mono">{placement}</span>
          </div>
          <div className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">Sponsored</div>
        </div>
      ) : (
        <div className="h-6" />
      )}
    </div>
  )
}
