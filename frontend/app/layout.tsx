import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '../components/AppShell'

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.DOMAIN ?? 'minecrox.ktoxz.id.vn'}`),
  title: {
    default: 'MineCrox — Minecraft File Hosting',
    template: '%s — MineCrox',
  },
  description: 'Upload and share Minecraft resource packs, datapacks, and configuration files with fast downloads.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
