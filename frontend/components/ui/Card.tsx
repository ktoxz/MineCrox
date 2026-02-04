import type { ComponentProps, ReactNode } from 'react'

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur transition-transform duration-200 will-change-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ title, subtitle, className = '' }: { title: ReactNode; subtitle?: ReactNode; className?: string }) {
  return (
    <div className={`px-6 pt-6 ${className}`}>
      <div className="text-lg font-semibold tracking-tight text-slate-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </div>
  )
}

export function CardBody({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`px-6 pb-6 ${className}`} {...props} />
}
