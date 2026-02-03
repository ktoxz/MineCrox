import Link from 'next/link'
import { ButtonLink } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'

export default function NotFoundPage() {
  return (
    <Card>
      <CardBody className="pt-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
          404
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The link may be wrong or the file might have expired.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Go home
          </ButtonLink>
          <Link href="/upload" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Upload a file
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
