import Link from 'next/link'
import type { FilePublic } from '../lib/types'
import { Badge } from './ui/Badge'
import { formatBytes, formatShortDate } from '../lib/format'

export function FileCard({ file }: { file: FilePublic }) {
  return (
    <Link
      href={`/files/${file.slug}`}
      className="group block rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold tracking-tight text-slate-900 group-hover:text-brand-700">
            {file.filename}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-slate-600">
            {file.description ?? 'No description'}
          </div>
        </div>

        <Badge tone="brand" className="shrink-0">
          {file.file_type}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{file.download_count}</span>
        <span>downloads</span>
        <span className="text-slate-300">•</span>
        <span>{formatBytes(file.file_size)}</span>
        <span className="text-slate-300">•</span>
        <span>Uploaded {formatShortDate(file.created_at)}</span>
      </div>
    </Link>
  )
}
