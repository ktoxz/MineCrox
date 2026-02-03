import Link from 'next/link'
import { ButtonLink } from './ui/Button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm">
            M
          </span>
          <span>
            <span className="text-brand-700">Mine</span>
            <span className="text-slate-900">Crox</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/upload" className="text-slate-600 hover:text-slate-900">
            Upload
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-slate-900">
            Terms
          </Link>
          <Link href="/dmca" className="text-slate-600 hover:text-slate-900">
            DMCA
          </Link>
          <Link href="/report" className="text-slate-600 hover:text-slate-900">
            Report
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/upload" variant="primary" size="sm">
            Upload
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}
