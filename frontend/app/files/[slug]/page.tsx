import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdContainer } from '../../../components/AdContainer'
import { MetadataDisplay } from '../../../components/MetadataDisplay'
import { getFileBySlug } from '../../../services/files'
import { Badge } from '../../../components/ui/Badge'
import { Card, CardBody } from '../../../components/ui/Card'
import { getPublicApiBaseUrl } from '../../../lib/api'

type PageProps = { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const file = await getFileBySlug(params.slug).catch(() => null)
  if (!file) return { title: 'File not found' }

  const title = `${file.filename}`
  const description = file.description ?? `Download ${file.filename} on MineCrox.`

  const robots = 'noindex,nofollow'

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/files/${file.slug}`,
    },
  }
}

export default async function FilePage({ params }: PageProps) {
  const file = await getFileBySlug(params.slug).catch(() => null)
  if (!file) notFound()

  const publicBase = getPublicApiBaseUrl()
  const downloadUrl = `${publicBase}/download/${encodeURIComponent(file.slug)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: file.filename,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Minecraft',
    softwareVersion: file.minecraft_version ?? undefined,
    description: file.description ?? undefined,
    downloadUrl,
  }

  return (
    <div className="h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid h-full gap-4 lg:grid-cols-[1fr,360px] lg:gap-6">
        <div className="flex h-full flex-col gap-3 lg:gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{file.file_type}</Badge>
            {file.minecraft_version ? <Badge tone="slate">MC {file.minecraft_version}</Badge> : null}
            {file.loader ? <Badge tone="slate">{file.loader}</Badge> : null}
          </div>

          <h1 className="line-clamp-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {file.filename}
          </h1>

          <div className="min-h-0 flex-1">
            <MetadataDisplay file={file} downloadUrl={downloadUrl} />
          </div>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <AdContainer placement="file-sidebar" />
          <Card>
            <CardBody className="pt-6">
              <div className="text-sm font-semibold text-slate-900">Safety</div>
              <div className="mt-2 text-sm text-slate-600">
                Files are validated on upload. Zip contents are scanned for unsafe paths.
              </div>
            </CardBody>
          </Card>

          <AdContainer placement="file-under-safety" />
        </aside>
      </div>
    </div>
  )
}
