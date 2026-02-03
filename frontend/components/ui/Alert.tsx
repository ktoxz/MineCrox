'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'

type Tone = 'success' | 'warning' | 'error' | 'info'

const toneClasses: Record<Tone, { container: string; icon: string; title: string }> = {
  success: {
    container: 'border-emerald-300 bg-emerald-50/80 text-emerald-950',
    icon: 'text-emerald-700',
    title: 'text-emerald-950',
  },
  warning: {
    container: 'border-amber-300 bg-amber-50/80 text-amber-950',
    icon: 'text-amber-700',
    title: 'text-amber-950',
  },
  error: {
    container: 'border-rose-300 bg-rose-50/80 text-rose-950',
    icon: 'text-rose-700',
    title: 'text-rose-950',
  },
  info: {
    container: 'border-emerald-200 bg-emerald-50/60 text-emerald-950',
    icon: 'text-emerald-700',
    title: 'text-emerald-950',
  },
}

const toneIcon: Record<Tone, (props: { className?: string }) => ReactNode> = {
  success: (props) => <CheckCircle2 className={props.className} aria-hidden="true" />,
  warning: (props) => <AlertTriangle className={props.className} aria-hidden="true" />,
  error: (props) => <XCircle className={props.className} aria-hidden="true" />,
  info: (props) => <Info className={props.className} aria-hidden="true" />,
}

export function Alert({
  tone = 'info',
  title,
  children,
  className = '',
  compact = false,
}: {
  tone?: Tone
  title?: ReactNode
  children: ReactNode
  className?: string
  compact?: boolean
}) {
  const c = toneClasses[tone]
  const Icon = toneIcon[tone]

  return (
    <div
      className={`rounded-2xl border ${c.container} ${compact ? 'px-3 py-2' : 'px-4 py-3'} shadow-sm ${className}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${c.icon}`}>{Icon({ className: compact ? 'h-4 w-4' : 'h-5 w-5' })}</div>
        <div className="min-w-0">
          {title ? <div className={`text-sm font-semibold ${c.title}`}>{title}</div> : null}
          <div className={compact ? 'text-xs' : 'text-sm'}>{children}</div>
        </div>
      </div>
    </div>
  )
}
