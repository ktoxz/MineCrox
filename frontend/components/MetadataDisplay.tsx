 'use client'

import type { FilePublic } from '../lib/types'
import { Card, CardBody } from './ui/Card'
import { formatBytes, formatShortDate } from '../lib/format'
import { useCallback, useMemo, useState } from 'react'
import {
  BarChart3,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  FileText,
  Hash,
  HardDrive,
  Info,
  Link2,
} from 'lucide-react'

export function MetadataDisplay({
  file,
  downloadUrl,
}: {
  file: FilePublic
  downloadUrl: string
}) {
  const expiresHelp =
    'Expiration is refreshed when the file is downloaded. If it gets at least one download per day, the expiry keeps moving forward.'

  const serverPropertiesSnippet = useMemo(
    () => `resource-pack=${downloadUrl}\nresource-pack-sha1=${file.sha1_hash}`,
    [downloadUrl, file.sha1_hash]
  )

  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'copy' | 'stats' | 'safety'>('copy')

  const copyToClipboard = useCallback(async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1100)
      return
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('readonly', 'true')
      ta.style.position = 'fixed'
      ta.style.top = '0'
      ta.style.left = '0'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1100)
    }
  }, [])

  function CopyButton({ k, value }: { k: string; value: string }) {
    const isCopied = copiedKey === k
    return (
      <button
        type="button"
        onClick={() => copyToClipboard(k, value)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        aria-label={isCopied ? 'Copied' : 'Copy'}
      >
        {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    )
  }

  function Field({
    label,
    icon,
    k,
    value,
  }: {
    label: string
    icon: React.ReactNode
    k: string
    value: string
  }) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="text-slate-500">{icon}</span>
              <span>{label}</span>
            </div>
            <div className="mt-2">
              <input
                readOnly
                value={value}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800"
              />
            </div>
          </div>
          <CopyButton k={k} value={value} />
        </div>
      </div>
    )
  }

  function TextareaField({
    label,
    icon,
    k,
    value,
    rows = 3,
  }: {
    label: string
    icon: React.ReactNode
    k: string
    value: string
    rows?: number
  }) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="text-slate-500">{icon}</span>
              <span>{label}</span>
            </div>
            <div className="mt-2">
              <textarea
                readOnly
                value={value}
                rows={rows}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800"
              />
            </div>
          </div>
          <CopyButton k={k} value={value} />
        </div>
      </div>
    )
  }

  function MobileTabButton({
    id,
    label,
    icon,
  }: {
    id: 'copy' | 'stats' | 'safety'
    label: string
    icon: React.ReactNode
  }) {
    const active = mobileTab === id
    const activeClass =
      id === 'copy'
        ? 'bg-amber-500 text-amber-950'
        : id === 'stats'
          ? 'bg-emerald-600 text-white'
          : 'bg-rose-600 text-white'
    return (
      <button
        type="button"
        onClick={() => setMobileTab(id)}
        className={
          active
            ? `flex-1 rounded-xl px-3 py-2 text-xs font-semibold ${activeClass}`
            : 'flex-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200'
        }
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
          <span>{label}</span>
        </span>
      </button>
    )
  }

  return (
    <Card>
      <CardBody className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Download & copy</div>
            <div className="mt-1 text-sm text-slate-600">
              Copy to your Minecraft server <span className="font-mono">server.properties</span> or share the direct link.
            </div>
          </div>

          <a
            href={downloadUrl}
            rel="nofollow"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 active:translate-y-[1px]"
          >
            <Download className="h-5 w-5" />
            Download
          </a>
        </div>

        {file.description ? (
          <div
            className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-sm text-slate-700"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {file.description}
          </div>
        ) : null}

        {/* Mobile: strict single-screen UI (no page scroll) */}
        <div className="mt-4 sm:hidden">
          <div className="flex items-center gap-2">
            <MobileTabButton id="copy" label="Copy" icon={<Copy className="h-4 w-4" />} />
            <MobileTabButton id="stats" label="Stats" icon={<BarChart3 className="h-4 w-4" />} />
            <MobileTabButton id="safety" label="Safety" icon={<ShieldIcon />} />
          </div>

          <div className="mt-3">
            {mobileTab === 'copy' ? (
              <div className="grid grid-cols-1 gap-3">
                <Field label="Download URL" icon={<Link2 className="h-4 w-4" />} k="downloadUrl" value={downloadUrl} />
                <Field label="SHA-1 Hash" icon={<Hash className="h-4 w-4" />} k="sha1" value={file.sha1_hash} />
                <TextareaField
                  label="server.properties"
                  icon={<FileText className="h-4 w-4" />}
                  k="serverProps"
                  value={serverPropertiesSnippet}
                  rows={2}
                />
              </div>
            ) : null}

            {mobileTab === 'stats' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                    Downloads
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{file.download_count}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <HardDrive className="h-4 w-4 text-slate-500" />
                    Size
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{formatBytes(file.file_size)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Uploaded
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{formatShortDate(file.created_at)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span
                      className="decoration-slate-300 underline decoration-dotted underline-offset-4"
                      title={expiresHelp}
                    >
                      Expires
                    </span>
                    <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{formatShortDate(file.expire_at)}</div>
                </div>
              </div>
            ) : null}

            {mobileTab === 'safety' ? (
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-700 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <ShieldIcon className="h-4 w-4 text-slate-500" />
                  Safety
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Files are validated on upload. Zip contents are scanned for unsafe paths.
                </div>
                <div className="mt-3 text-xs text-slate-500">Signed redirect • No direct S3 keys exposed</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop/tablet: richer layout */}
        <div className="mt-5 hidden grid-cols-1 gap-4 sm:grid lg:grid-cols-2">
          <Field label="Download URL" icon={<Link2 className="h-4 w-4" />} k="downloadUrl" value={downloadUrl} />
          <Field label="SHA-1 Hash" icon={<Hash className="h-4 w-4" />} k="sha1" value={file.sha1_hash} />
          <div className="lg:col-span-2">
            <TextareaField
              label="Paste into server.properties"
              icon={<FileText className="h-4 w-4" />}
              k="serverProps"
              value={serverPropertiesSnippet}
              rows={2}
            />
          </div>
        </div>

        <div className="mt-5 hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <BarChart3 className="h-4 w-4 text-emerald-700" />
              Downloads
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900">{file.download_count}</div>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <HardDrive className="h-4 w-4 text-amber-700" />
              Size
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900">{formatBytes(file.file_size)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              Uploaded
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900">{formatShortDate(file.created_at)}</div>
          </div>
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Clock className="h-4 w-4 text-rose-700" />
              <span
                className="decoration-rose-300 underline decoration-dotted underline-offset-4"
                title={expiresHelp}
              >
                Expires
              </span>
              <Info className="h-3.5 w-3.5 text-rose-700/70" aria-hidden="true" />
            </div>
            <div className="mt-1 text-base font-semibold text-slate-900">{formatShortDate(file.expire_at)}</div>
          </div>
        </div>

        {file.tags ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {file.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 8)
              .map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                  {tag}
                </span>
              ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}

function ShieldIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className ?? ''}
    >
      <path
        d="M12 3.2 19 6.4v6.2c0 4.3-2.9 8-7 9.2-4.1-1.2-7-4.9-7-9.2V6.4l7-3.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
