import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">MineCrox</div>
          <div className="mt-2 text-sm text-slate-600">
            Fast, safe hosting for Minecraft resource packs, datapacks, and configs.
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Links</div>
          <div className="mt-2 grid gap-2 text-sm">
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
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Notes</div>
          <div className="mt-2 text-sm text-slate-600">
            Ads and CAPTCHA are placeholders. Files may be deleted after inactivity.
          </div>
          <div className="mt-3 text-xs text-slate-500">© {new Date().getFullYear()} MineCrox</div>
        </div>
      </div>
    </footer>
  )
}
