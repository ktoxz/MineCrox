'use client'

import { useState } from 'react'
import { Button } from './Button'

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 900)
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}
