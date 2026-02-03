import Link from 'next/link'
import { AdContainer } from '../components/AdContainer'
import { ButtonLink } from '../components/ui/Button'

export default async function HomePage() {
  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/70 via-white to-white" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            Fast • Safe • Private-by-link
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Minecraft file hosting
            <span className="text-brand-700"> built for sharing</span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Upload Minecraft packs (.zip). We validate zip contents (resource pack / datapack) and give you a clean landing page plus a signed download link.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Files are <span className="font-medium text-slate-800">private-by-link</span> and are not listed publicly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/upload" variant="primary" size="lg">
              Upload a file
            </ButtonLink>
            <a
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'}/docs`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>

      <AdContainer placement="home-top" />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">1) Upload</div>
          <div className="mt-2 text-sm text-slate-600">Choose a .zip resource pack or datapack. We validate contents for safety.</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">2) Get link</div>
          <div className="mt-2 text-sm text-slate-600">You get a landing page URL and a signed download redirect. No S3 keys exposed.</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">3) Share privately</div>
          <div className="mt-2 text-sm text-slate-600">There is no public listing. Anyone with the link can access the file.</div>
        </div>
      </section>
    </div>
  )
}
