"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Code, Users, Zap } from "lucide-react"

interface ReplitModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReplitModal({ isOpen, onClose }: ReplitModalProps) {
  const [isReading, setIsReading] = useState(false)

  const handleTryReplit = () => {
    window.open("https://replit.com/refer/panappworld", "_blank")
  }

  const replitContent = `🚀 Discover Replit - Code Anywhere, Anytime!

Hey! I've been using this amazing platform called Replit and I had to share it with you. It's honestly a game-changer for anyone who codes or wants to learn programming.

What makes Replit incredible:

Zero Setup Required ⚡
Forget about installing compilers, setting up environments, or dealing with configuration headaches. Just open your browser and start coding in 50+ programming languages instantly.

Code Collaboratively 👥
Work on projects with friends or teammates in real-time. It's like Google Docs but for coding - you can see each other's cursors, chat, and build together seamlessly.

Deploy in Seconds 🌐
Built something cool? Deploy it to the web with literally one click. No complex hosting setups, no deployment pipelines - just instant, live projects you can share with the world.

Perfect for Learning 📚
Whether you're a complete beginner or seasoned developer, Replit makes experimenting with new languages and frameworks effortless. Try Python, JavaScript, React, Node.js, or even AI/ML projects without any barriers.

Your Code, Everywhere ☁️
Access your projects from any device, anywhere. Started coding on your laptop? Continue on your phone during your commute.

Why I love it:

I use Replit for quick prototypes, learning new technologies, collaborating on side projects, and even building full applications. It's saved me countless hours of setup time and made coding so much more enjoyable and accessible.

The community is amazing too - you can explore millions of public projects, fork interesting code, and get inspired by what others are building.

Ready to try it?

Click this link to get started: https://replit.com/refer/panappworld

Trust me, once you experience coding without friction, you'll wonder how you ever lived without it. Give it a shot - it's free to start, and I guarantee you'll be impressed within minutes!

What will you build first? 🎯`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Code size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Replit - Code Anywhere, Anytime</h2>
                  <p className="text-blue-100">Revolutionary cloud-based development environment</p>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Zap className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Zero Setup</div>
                </div>
                <div className="text-center">
                  <Users className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Real-time Collaboration</div>
                </div>
                <div className="text-center">
                  <ExternalLink className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Instant Deployment</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {replitContent.split("\n\n").map((paragraph, index) => {
                  if (
                    paragraph.includes("🚀") ||
                    paragraph.includes("What makes Replit incredible:") ||
                    paragraph.includes("Why I love it:") ||
                    paragraph.includes("Ready to try it?")
                  ) {
                    return (
                      <h3 key={index} className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-6 mb-3">
                        {paragraph}
                      </h3>
                    )
                  }

                  if (
                    paragraph.includes("⚡") ||
                    paragraph.includes("👥") ||
                    paragraph.includes("🌐") ||
                    paragraph.includes("📚") ||
                    paragraph.includes("☁️")
                  ) {
                    const [title, ...content] = paragraph.split("\n")
                    return (
                      <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">{title}</h4>
                        <p className="text-gray-700 dark:text-gray-300">{content.join("\n")}</p>
                      </div>
                    )
                  }

                  if (paragraph.includes("https://replit.com/refer/panappworld")) {
                    return (
                      <div key={index} className="text-center my-6">
                        <button
                          onClick={handleTryReplit}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                          <ExternalLink size={20} />
                          Try Replit Now
                        </button>
                      </div>
                    )
                  }

                  return (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex gap-4 justify-center">
                <motion.button
                  className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTryReplit}
                >
                  Get Started with Replit
                </motion.button>
                <motion.button
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
