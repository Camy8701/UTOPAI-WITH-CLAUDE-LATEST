export interface ShareData {
  title: string
  text?: string
  url: string
}

// Social media sharing functions
export function shareOnFacebook(url: string, title?: string) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

export function shareOnTwitter(title: string, url: string) {
  const tweetText = encodeURIComponent(`${title} ${url}`)
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=600,height=400')
}

export function shareOnLinkedIn(title: string, url: string) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  window.open(linkedInUrl, '_blank', 'width=600,height=400')
}

export function shareOnWhatsApp(title: string, url: string) {
  const text = encodeURIComponent(`${title} ${url}`)
  const whatsappUrl = `https://wa.me/?text=${text}`
  window.open(whatsappUrl, '_blank')
}

export function shareOnTelegram(title: string, url: string) {
  const text = encodeURIComponent(`${title} ${url}`)
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`
  window.open(telegramUrl, '_blank', 'width=600,height=400')
}

export function shareOnReddit(title: string, url: string) {
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  window.open(redditUrl, '_blank', 'width=600,height=400')
}

export function copyToClipboard(title: string, url: string) {
  const shareText = `${title}\n${url}`
  
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(shareText)
  } else {
    // Legacy fallback
    const textArea = document.createElement('textarea')
    textArea.value = shareText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}

export function sharePost(data: ShareData) {
  // Check if Web Share API is supported
  if (navigator.share) {
    return navigator.share(data)
  } else {
    // Fallback: copy to clipboard
    return copyToClipboard(data.title, data.url)
  }
}

