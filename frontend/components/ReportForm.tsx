'use client'

import { useState } from 'react'
import { Alert } from './ui/Alert'
import { TurnstileWidget } from './TurnstileWidget'

export function ReportForm() {
  const [slug, setSlug] = useState('')
  const [reason, setReason] = useState('')
  const [email, setEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  async function submit() {
    setStatus('sending')
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'
      const res = await fetch(`${base}/api/v1/reports`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, reason, email: email || null, captcha_token: captchaToken || null }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="text-slate-700">File slug</span>
          <input
            className="rounded-lg border px-3 py-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="example-pack-1"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-700">Reason</span>
          <textarea
            className="min-h-[90px] rounded-lg border px-3 py-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-700">Email (optional)</span>
          <input
            className="rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <div className="grid gap-1 text-sm">
          <span className="text-slate-700">Anti-bot verification</span>
          {turnstileSiteKey ? (
            <div className="mt-1">
              <TurnstileWidget siteKey={turnstileSiteKey} onToken={setCaptchaToken} />
            </div>
          ) : (
            <div className="mt-1">
              <Alert tone="warning" compact>
                Turnstile is not configured on the frontend. If the backend requires captcha, reports will fail.
              </Alert>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={status === 'sending' || (!!turnstileSiteKey && !captchaToken)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Submit report'}
        </button>
        {status === 'sent' ? (
          <Alert tone="success" compact>
            Report submitted.
          </Alert>
        ) : null}
        {status === 'error' ? (
          <Alert tone="error" compact>
            Failed to submit.
          </Alert>
        ) : null}
      </div>
    </div>
  )
}
