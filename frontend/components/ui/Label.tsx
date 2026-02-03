import type { ComponentProps } from 'react'

export function Label({ className = '', ...props }: ComponentProps<'label'>) {
  return <label className={`text-sm font-medium text-slate-900 ${className}`} {...props} />
}
