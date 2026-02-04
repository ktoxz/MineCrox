import Link from 'next/link'
import type { Metadata } from 'next'
import { AdContainer } from '../components/AdContainer'
import { ButtonLink } from '../components/ui/Button'

export const metadata: Metadata = {
  title: 'MineCrox — Minecraft file hosting & fast downloads',
  description:
    'Upload Minecraft packs (.zip). MineCrox validates resource packs and datapacks, then gives you a private-by-link landing page and a signed download link.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MineCrox — Minecraft file hosting',
    description:
      'Private-by-link hosting for Minecraft resource packs and datapacks. Safe zip validation + signed downloads.',
    type: 'website',
    url: '/',
  },
}

export default async function HomePage() {
  const domain = process.env.DOMAIN ?? 'minecrox.ktoxz.id.vn'
  const siteUrl = `https://${domain}`
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'MineCrox',
        url: siteUrl,
      },
      {
        '@type': 'WebSite',
        name: 'MineCrox',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/files/{search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What files can I upload?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MineCrox accepts .zip uploads that validate as a Minecraft resource pack or datapack. Zip contents are inspected for safety before we generate a share link.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are files public or private?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Files are private-by-link. We do not provide a public listing. Anyone with the link can access the file page and download redirect.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the download link work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The landing page provides a permanent URL. When someone clicks download, MineCrox redirects to a time-limited signed URL so storage credentials remain private.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you keep files forever?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Files may expire automatically after a retention period. This helps control storage costs and abuse. The exact retention can change over time.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur animate-fade-in-up">
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
            Upload Minecraft packs (.zip). MineCrox validates the zip contents (resource pack / datapack) and gives you a clean landing page plus a signed download link.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Files are <span className="font-medium text-slate-800">private-by-link</span> and are not listed publicly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/upload" variant="primary" size="lg">
              Upload a file
            </ButtonLink>
            <a
              href={`${apiBase}/docs`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              API Docs
            </a>
            <Link
              href="#faq"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <AdContainer placement="home-top" />
      </div>

      <section aria-labelledby="what" className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <h2 id="what" className="text-2xl font-semibold tracking-tight text-slate-900">
          Host Minecraft resource packs and datapacks
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          MineCrox is a lightweight file hosting service for Minecraft creators. Upload a single .zip, get a private share page, and let players download through a
          signed link.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Resource packs</div>
            <p className="mt-2 text-sm text-slate-600">Textures, sounds, fonts, shaders (as supported). Share a single link with your community.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Datapacks</div>
            <p className="mt-2 text-sm text-slate-600">Gameplay tweaks and custom mechanics. Let servers fetch the pack with a stable URL.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Private-by-link</div>
            <p className="mt-2 text-sm text-slate-600">No public listing. Pages are designed to be shareable without exposing your storage.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
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

      <section aria-labelledby="why" className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm">
          <h2 id="why" className="text-2xl font-semibold tracking-tight text-slate-900">
            Why creators use MineCrox
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              <span className="font-semibold text-slate-900">Zip validation:</span> rejects invalid or suspicious archives.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Signed downloads:</span> your storage stays private; users get time-limited URLs.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Share page:</span> clean landing page for your community with copy-ready details.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Abuse controls:</span> rate limiting and anti-bot verification help reduce spam.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Quick links</div>
          <div className="mt-4 grid gap-2 text-sm">
            <Link className="text-brand-700 hover:underline" href="/upload">
              Upload a Minecraft pack
            </Link>
            <Link className="text-brand-700 hover:underline" href="/report">
              Report an abusive file
            </Link>
            <Link className="text-brand-700 hover:underline" href="/terms">
              Terms
            </Link>
            <Link className="text-brand-700 hover:underline" href="/dmca">
              DMCA
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        <h2 id="faq-title" className="text-2xl font-semibold tracking-tight text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-6 grid gap-3">
          <details className="group rounded-2xl border border-slate-200/70 bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">What Minecraft files can I upload?</summary>
            <p className="mt-3 text-sm text-slate-600">
              Upload a single <span className="font-medium text-slate-800">.zip</span> that validates as a Minecraft resource pack or datapack. MineCrox inspects the
              archive and rejects suspicious zip structures.
            </p>
          </details>
          <details className="group rounded-2xl border border-slate-200/70 bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">Is MineCrox a public file list?</summary>
            <p className="mt-3 text-sm text-slate-600">No. MineCrox is private-by-link. Files are not listed publicly and pages are designed for sharing.</p>
          </details>
          <details className="group rounded-2xl border border-slate-200/70 bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">How do signed download links help?</summary>
            <p className="mt-3 text-sm text-slate-600">
              The download button redirects to a time-limited signed URL. This protects the storage origin and prevents exposing storage credentials.
            </p>
          </details>
          <details className="group rounded-2xl border border-slate-200/70 bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">Can I use it for my Minecraft server?</summary>
            <p className="mt-3 text-sm text-slate-600">
              Yes. After upload, you get a stable landing page and a permanent download endpoint that generates signed URLs on-demand.
            </p>
          </details>
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '280ms' }}>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-semibold text-slate-900">Ready to share your pack?</div>
            <p className="mt-1 text-sm text-slate-600">Upload a .zip and get a link in seconds.</p>
          </div>
          <ButtonLink href="/upload" variant="primary" size="lg">
            Upload now
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
