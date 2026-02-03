'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset?: (widgetId?: string) => void
      remove?: (widgetId: string) => void
    }
  }
}

type Props = {
  siteKey: string
  onToken: (token: string) => void
  className?: string
}

export function TurnstileWidget({ siteKey, onToken, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  // Stabilize callback reference used by Turnstile.
  const onTokenRef = useRef(onToken)
  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  const scriptSrc = useMemo(() => {
    // Explicit render mode: we call window.turnstile.render manually.
    return 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  }, [])

  useEffect(() => {
    if (!scriptReady) return
    if (!siteKey) return
    if (!containerRef.current) return
    if (!window.turnstile) return
    if (widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: unknown) => onTokenRef.current(String(token ?? '')),
      'expired-callback': () => onTokenRef.current(''),
      'error-callback': () => onTokenRef.current(''),
    })

    return () => {
      const widgetId = widgetIdRef.current
      widgetIdRef.current = null
      try {
        if (widgetId && window.turnstile?.remove) window.turnstile.remove(widgetId)
      } catch {
        // ignore
      }
    }
  }, [scriptReady, siteKey])

  return (
    <div className={className}>
      <Script src={scriptSrc} onLoad={() => setScriptReady(true)} strategy="afterInteractive" />
      <div ref={containerRef} />
    </div>
  )
}
