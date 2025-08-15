import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"

import { Providers } from "@/components/providers"
import { SearchProvider } from "@/components/search-context"

export const metadata: Metadata = {
  title: "UTOPAI Blog",
  description: "Stories, news & tools at the frontier of AI",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Providers → UserProvider → ✨ the rest of your app
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchProvider>
            <Providers>{children}</Providers>
          </SearchProvider>
        </Suspense>
      </body>
    </html>
  )
}
