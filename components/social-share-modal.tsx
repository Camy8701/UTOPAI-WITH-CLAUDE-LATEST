"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Send, 
  Copy, 
  X,
  Share2,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  shareOnFacebook,
  shareOnTwitter,
  shareOnLinkedIn,
  shareOnWhatsApp,
  shareOnTelegram,
  shareOnReddit,
  copyToClipboard
} from '@/lib/share-utils'
import { toast } from 'sonner'

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  description?: string
}

export function SocialShareModal({
  isOpen,
  onClose,
  title,
  url,
  description = ''
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = async () => {
    try {
      await copyToClipboard(title, url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      action: () => shareOnFacebook(url, title)
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1991DB]',
      action: () => shareOnTwitter(title, url)
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#095BAE]',
      action: () => shareOnLinkedIn(title, url)
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#22C55E]',
      action: () => shareOnWhatsApp(title, url)
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088CC] hover:bg-[#007AB8]',
      action: () => shareOnTelegram(title, url)
    },
    {
      name: 'Reddit',
      icon: Share2,
      color: 'bg-[#FF4500] hover:bg-[#E73E00]',
      action: () => shareOnReddit(title, url)
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share this post
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Post Preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
              {url}
            </p>
          </div>

          {/* Social Media Platforms */}
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => (
              <motion.div
                key={platform.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className={`w-full h-20 flex flex-col items-center justify-center gap-2 ${platform.color} text-white border-0 transition-colors`}
                  onClick={() => {
                    platform.action()
                    toast.success(`Shared to ${platform.name}!`)
                  }}
                >
                  <platform.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{platform.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Copy Link */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2"
              onClick={handleCopyToClipboard}
            >
              <Copy className={`h-4 w-4 ${copied ? 'text-green-600' : ''}`} />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </Button>
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: title,
                    text: description,
                    url: url
                  })
                  toast.success('Shared successfully!')
                } catch (error) {
                  // User cancelled sharing
                }
              }}
            >
              <Smartphone className="h-4 w-4" />
              <span>More Options</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}