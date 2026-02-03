import { getPublicApiBaseUrl } from '../lib/api'

export function DownloadButton({ slug }: { slug: string }) {
  const base = getPublicApiBaseUrl()
  const href = `${base}/download/${encodeURIComponent(slug)}`

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 active:translate-y-[1px]"
      rel="nofollow"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Download
    </a>
  )
}
