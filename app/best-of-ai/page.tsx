"use client"

import Image from "next/image"
import ReplitModal from "@/components/replit-modal"
import { useState } from "react"

const tools = [
  {
    title: "Replit - Code Anywhere, Anytime",
    description:
      "Zero setup required! Code in 50+ languages, collaborate in real-time, and deploy instantly. Perfect for learning and building projects.",
    category: "Development",
    image: "/placeholder.svg?height=450&width=600",
    features: ["Zero Setup", "Real-time Collaboration", "Instant Deployment"],
    featured: true,
  },
  {
    title: "ChatGPT - Your AI Assistant",
    description:
      "Engage in natural language conversations with an AI that understands and responds contextually. Perfect for brainstorming, writing assistance, and learning new topics.",
    category: "AI Chatbot",
    image: "/placeholder.svg?height=450&width=600",
    features: ["Natural Language", "Contextual Understanding", "Versatile Applications"],
    featured: true,
  },
  {
    title: "Midjourney - AI Image Generation",
    description:
      "Create stunning and unique images from text prompts. Explore your creativity and bring your imagination to life with AI-powered art generation.",
    category: "AI Image Generation",
    image: "/placeholder.svg?height=450&width=600",
    features: ["Text-to-Image", "Creative Exploration", "High-Quality Output"],
    featured: true,
  },
  {
    title: "GitHub Copilot - Your AI Pair Programmer",
    description:
      "Write code more efficiently with AI-powered suggestions and autocompletion. Integrate seamlessly with your existing development environment and boost your productivity.",
    category: "AI Code Assistant",
    image: "/placeholder.svg?height=450&width=600",
    features: ["Code Completion", "Contextual Suggestions", "Productivity Boost"],
    featured: true,
  },
  {
    title: "DALL-E 2 - Create Realistic Images and Art",
    description:
      "Generate original, realistic images and art from a text description. DALL-E 2 can create everything from photorealistic edits to original creative concepts.",
    category: "AI Image Generation",
    image: "/placeholder.svg?height=450&width=600",
    features: ["Realistic Image Generation", "Art Creation", "Text-to-Image"],
    featured: false,
  },
  {
    title: "Synthesia - AI Video Generation",
    description:
      "Create professional-looking videos without the need for cameras, actors, or studios. Simply type in your script and let AI generate a video for you.",
    category: "AI Video Generation",
    image: "/placeholder.svg?height=450&width=600",
    features: ["AI Video Creation", "No Actors Needed", "Professional Quality"],
    featured: false,
  },
  {
    title: "Jasper - AI Copywriting Assistant",
    description:
      "Write high-quality marketing copy, blog posts, and social media content with the help of AI. Jasper can help you overcome writer's block and create engaging content faster.",
    category: "AI Copywriting",
    image: "/placeholder.svg?height=450&width=600",
    features: ["AI Copywriting", "Content Generation", "Marketing Copy"],
    featured: false,
  },
]

export default function BestOfAI() {
  const [replitModalOpen, setReplitModalOpen] = useState(false)

  return (
    <main className="flex flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Best AI Tools Collection </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={tool.image || "/placeholder.svg"}
              alt={tool.title}
              width={600}
              height={450}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
              <p className="text-gray-700 text-base mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.features.map((feature, index) => (
                  <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    if (i === 0) {
                      window.open("https://replit.com/refer/panappworld", "_blank")
                    } else {
                      alert(`"${tool.title}" will be available soon!`)
                    }
                  }}
                >
                  Try Free
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    if (i === 0) {
                      setReplitModalOpen(true)
                    } else {
                      alert(`"${tool.title}" will be available soon!`)
                    }
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ReplitModal isOpen={replitModalOpen} onClose={() => setReplitModalOpen(false)} />
    </main>
  )
}
