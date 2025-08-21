export interface ShareData {
  title: string
  text?: string
  url: string
}

export function sharePost(data: ShareData) {
  // Check if Web Share API is supported
  if (navigator.share) {
    return navigator.share(data)
  } else {
    // Fallback: copy to clipboard
    const shareText = `${data.title}\n${data.text || ''}\n${data.url}`
    
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
}

export function shareOnTwitter(title: string, url: string) {
  const tweetText = encodeURIComponent(`${title} ${url}`)
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
}

export function shareOnLinkedIn(title: string, url: string) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedInUrl, '_blank')
}

export function shareOnFacebook(url: string) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank')
}