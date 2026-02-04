'use client'

import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AdContainer } from './AdContainer'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell({ children }: { children: ReactNode }) {
  // Avoid hydration mismatches by not depending on routing state during SSR.
  // We enable file-page spacing only after the app has mounted.
  const [isFilePage, setIsFilePage] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState<number>(72)

  useEffect(() => {
    try {
      setIsFilePage(window.location.pathname.startsWith('/files/'))
    } catch {
      setIsFilePage(false)
    }
  }, [])

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return

    const update = () => {
      const h = el.offsetHeight
      if (h && h !== headerHeight) setHeaderHeight(h)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [headerHeight])

  return (
    <div style={{ ['--app-header-h' as any]: `${headerHeight}px` }}>
      <div ref={headerRef as any}>
        <SiteHeader />
      </div>

      <main
        className={
          isFilePage
            ? 'mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-6'
            : 'mx-auto max-w-6xl px-4 py-10'
        }
      >
        {children}
      </main>

      <SiteFooter />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <AdContainer placement="site-below-footer" />
      </div>
    </div>
  )
}
