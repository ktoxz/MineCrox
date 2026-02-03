import { ReportForm } from '../../components/ReportForm'

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <h1>Report content</h1>
        <p>Use this form to report a file for review (placeholder workflow).</p>
      </div>
      <ReportForm />
    </div>
  )
}
