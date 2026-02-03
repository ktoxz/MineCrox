'use client'

import { useMemo, useState } from 'react'
import { AdContainer } from '../../components/AdContainer'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { getPublicApiBaseUrl } from '../../lib/api'
import type { FileCreateResponse } from '../../lib/types'

const allowedExt = ['.zip']

export default function UploadPage() {
  const base = getPublicApiBaseUrl()

  const [file, setFile] = useState<File | null>(null)
  const [captchaToken, setCaptchaToken] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileHint = useMemo(() => {
    if (!file) return null
    const name = file.name.toLowerCase()
    const ok = allowedExt.some((ext) => name.endsWith(ext))
    return ok ? null : `Only .zip is accepted.`
  }, [file])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Upload a file</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Upload a Minecraft pack (.zip). We validate the zip contents and only accept resource packs or datapacks.
            </p>
          </div>

          <Card>
            <CardHeader title="Upload details" subtitle="No accounts required. Files are private-by-link." />
            <CardBody>
              <form
                className="space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)

                  if (!file) {
                    setError('Please choose a file.')
                    return
                  }

                  setSubmitting(true)
                  try {
                    const form = new FormData()
                    form.append('upload', file)
                    if (captchaToken.trim()) form.append('captcha_token', captchaToken.trim())

                    const res = await fetch(`${base}/api/v1/uploads`, {
                      method: 'POST',
                      body: form,
                    })

                    if (!res.ok) {
                      const text = await res.text().catch(() => '')
                      throw new Error(text || `Upload failed (${res.status})`)
                    }

                    const json = (await res.json()) as FileCreateResponse
                    // Navigate directly to the landing page.
                    window.location.assign(`/files/${encodeURIComponent(json.slug)}`)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed')
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="upload">File</Label>
                    <input
                      id="upload"
                      type="file"
                      className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 hover:file:bg-slate-200"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    {fileHint ? (
                      <div className="mt-2">
                        <Alert tone="warning" compact>
                          {fileHint}
                        </Alert>
                      </div>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="captcha">CAPTCHA (placeholder)</Label>
                    <Input
                      id="captcha"
                      placeholder="captcha-token"
                      value={captchaToken}
                      onChange={(e) => setCaptchaToken(e.target.value)}
                      className="mt-2"
                    />
                    <div className="mt-2">
                      <Alert tone="info" compact>
                        This is a placeholder field for future integration.
                      </Alert>
                    </div>
                  </div>
                </div>

                {error ? (
                  <Alert tone="error" title="Upload failed">
                    {error}
                  </Alert>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Uploading…' : 'Upload'}
                  </Button>
                  <ButtonLink href={`${base}/docs`} variant="secondary">
                    API Docs
                  </ButtonLink>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-4">
          <AdContainer placement="upload-sidebar" />
          <Card>
            <CardBody className="pt-6">
              <div className="text-sm font-semibold text-slate-900">Upload rules</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Only .zip files are accepted</li>
                <li>Must be a resource pack or datapack</li>
                <li>Zip contents are inspected for safety</li>
              </ul>
            </CardBody>
          </Card>
          <AdContainer placement="upload-below-rules" />
        </aside>
      </div>
    </div>
  )
}
