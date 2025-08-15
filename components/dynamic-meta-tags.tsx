"use client"

import { usePathname } from "next/navigation"
import Head from "next/head"

interface DynamicMetaTagsProps {
  title?: string
  description?: string
  imageUrl?: string
  type?: "website" | "article" | "story"
}

export default function DynamicMetaTags({
  title = "utopai.blog - AI Stories and Design Inspiration",
  description = "Discover the best AI-generated stories and creative inspiration on utopai.blog",
  imageUrl,
  type = "website",
}: DynamicMetaTagsProps) {
  const pathname = usePathname()
  const baseUrl = "https://utopai.blog"
  const url = `${baseUrl}${pathname}`

  // Generate dynamic OG image URL if not provided
  const ogImageUrl =
    imageUrl ||
    `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${type === "story" ? "story" : type === "article" ? "article" : "default"}`

  return (
    <Head>
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="utopai.blog" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  )
}
