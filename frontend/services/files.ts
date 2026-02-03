import type { FilePublic } from '../lib/types'
import { getServerApiBaseUrl } from '../lib/api'

export async function getFileBySlug(slug: string): Promise<FilePublic> {
  const base = getServerApiBaseUrl()
  const res = await fetch(`${base}/api/v1/files/${encodeURIComponent(slug)}`, {
    // SSR: always fresh so counters/expire_at are accurate.
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Not found')
  return (await res.json()) as FilePublic
}
