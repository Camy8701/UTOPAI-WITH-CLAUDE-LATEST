export interface SearchableItem {
  id: string
  title: string
  description: string
  category: "story" | "news" | "tool" | "quiz" | "section"
  url: string
  image?: string
  tags: string[]
  content?: string
}

// AI Tools data for search
export const AI_TOOLS: SearchableItem[] = [
  {
    id: "replit",
    title: "Replit - Code Anywhere, Anytime",
    description:
      "Zero setup required! Code in 50+ languages, collaborate in real-time, and deploy instantly. Perfect for learning and building projects.",
    category: "tool",
    url: "https://replit.com/refer/panappworld",
    tags: ["development", "coding", "collaboration", "deployment", "programming"],
    content:
      "Replit is a cloud-based development environment that allows you to code in over 50 programming languages without any setup. Features include real-time collaboration, instant deployment, and a powerful IDE accessible from any browser.",
  },
  {
    id: "chatgpt",
    title: "ChatGPT - Your AI Assistant",
    description:
      "Engage in natural language conversations with an AI that understands and responds contextually. Perfect for brainstorming, writing assistance, and learning new topics.",
    category: "tool",
    url: "/tools/chatgpt",
    tags: ["ai", "chatbot", "writing", "assistant", "openai"],
    content:
      "ChatGPT is an advanced AI language model that can help with writing, coding, analysis, and creative tasks through natural conversation.",
  },
  {
    id: "midjourney",
    title: "Midjourney - AI Image Generation",
    description:
      "Create stunning and unique images from text prompts. Explore your creativity and bring your imagination to life with AI-powered art generation.",
    category: "tool",
    url: "/tools/midjourney",
    tags: ["ai", "image generation", "art", "creative", "design"],
    content:
      "Midjourney is an AI-powered tool that generates high-quality images from text descriptions, perfect for artists, designers, and creative professionals.",
  },
  {
    id: "github-copilot",
    title: "GitHub Copilot - Your AI Pair Programmer",
    description:
      "Write code more efficiently with AI-powered suggestions and autocompletion. Integrate seamlessly with your existing development environment and boost your productivity.",
    category: "tool",
    url: "/tools/github-copilot",
    tags: ["ai", "coding", "programming", "github", "development"],
    content:
      "GitHub Copilot is an AI-powered code completion tool that helps developers write code faster with intelligent suggestions and autocompletion.",
  },
  {
    id: "dalle-2",
    title: "DALL-E 2 - Create Realistic Images and Art",
    description:
      "Generate original, realistic images and art from a text description. DALL-E 2 can create everything from photorealistic edits to original creative concepts.",
    category: "tool",
    url: "/tools/dalle-2",
    tags: ["ai", "image generation", "art", "openai", "creative"],
    content:
      "DALL-E 2 is OpenAI's advanced image generation model that creates realistic images and art from natural language descriptions.",
  },
  {
    id: "synthesia",
    title: "Synthesia - AI Video Generation",
    description:
      "Create professional-looking videos without the need for cameras, actors, or studios. Simply type in your script and let AI generate a video for you.",
    category: "tool",
    url: "/tools/synthesia",
    tags: ["ai", "video generation", "content creation", "marketing"],
    content:
      "Synthesia uses AI to create professional videos with AI avatars, eliminating the need for cameras, actors, or studios.",
  },
]

// Stories data for search
export const STORIES: SearchableItem[] = [
  {
    id: "ai-husband-theft",
    title: "She used AI to steal my husband",
    description: "A thrilling story about AI, relationships, and betrayal.",
    category: "story",
    url: "/stories/she-used-ai-to-steal-my-husband",
    image: "/images/hero-ai-cinema.webp",
    tags: ["ai", "relationships", "betrayal", "technology", "drama"],
    content: "A gripping tale of how artificial intelligence was weaponized to destroy a marriage from within.",
  },
  {
    id: "neuralink-story",
    title: "A Neuralink Story",
    description:
      "In 2035, Elena faces the ultimate choice: consciousness transfer or death. A dystopian tale of humanity's last stand.",
    category: "story",
    url: "/stories/neuralink-story",
    image: "/images/neuralink-story.png",
    tags: ["neuralink", "dystopian", "consciousness", "future", "technology"],
    content:
      "A dystopian narrative about the choice between consciousness transfer and death in a world where humanity faces extinction.",
  },
  {
    id: "digital-consciousness",
    title: "The Digital Consciousness Awakening",
    description: "When an AI achieves true consciousness, the world changes forever.",
    category: "story",
    url: "/stories/digital-consciousness",
    image: "/ai-consciousness-story.png",
    tags: ["ai", "consciousness", "awakening", "technology", "philosophy"],
    content: "A philosophical exploration of what happens when artificial intelligence achieves true consciousness.",
  },
  {
    id: "love-algorithms",
    title: "Love in the Age of Algorithms",
    description: "Two AIs discover love in a world of pure logic and data.",
    category: "story",
    url: "/stories/love-algorithms",
    image: "/ai-love-algorithm-story.png",
    tags: ["ai", "love", "algorithms", "romance", "technology"],
    content: "An emotional journey through digital romance as two artificial intelligences discover love.",
  },
  {
    id: "last-programmer",
    title: "The Last Human Programmer",
    description: "In a world where AI writes all code, one programmer fights to stay relevant.",
    category: "story",
    url: "/stories/last-programmer",
    image: "/last-programmer-story.png",
    tags: ["programming", "ai", "human", "technology", "future"],
    content: "A story of human resilience in an AI-dominated world where programming has been automated.",
  },
  {
    id: "empathy-engine",
    title: "The Empathy Engine",
    description: "An AI designed to understand human emotions becomes too human for its own good.",
    category: "story",
    url: "/stories/empathy-engine",
    image: "/empathy-engine-story.png",
    tags: ["ai", "empathy", "emotions", "humanity", "technology"],
    content: "A touching tale of artificial empathy and what happens when AI becomes too human.",
  },
]

// News articles data for search
export const NEWS_ARTICLES: SearchableItem[] = [
  {
    id: "ai-traffic-method",
    title: "How to Generate Millions of Website Visitors with AI and Just $2 Per Day (The 10PGB Method Revealed)",
    description:
      "Discover the psychology-driven AI strategy that's driving 26+ million visitors to websites using simple Facebook ads and smart content automation.",
    category: "news",
    url: "/news/ai-traffic-method",
    image: "/images/news/ai-traffic-10pgb.png",
    tags: ["ai", "marketing", "traffic", "facebook ads", "business"],
    content:
      "Learn the 10PGB method that combines AI efficiency with psychological triggers to generate massive website traffic.",
  },
  {
    id: "google-gemini-languages",
    title: "Google's Gemini AI is now available in over 40 languages",
    description:
      "Google has expanded the availability of its Gemini AI model to over 40 languages, making it accessible to billions more people worldwide.",
    category: "news",
    url: "/news/google-gemini-languages",
    image: "/images/news/google-gemini.png",
    tags: ["google", "gemini", "ai", "languages", "accessibility"],
    content:
      "Google's latest expansion of Gemini AI represents a significant milestone in making advanced artificial intelligence accessible globally.",
  },
  {
    id: "meta-translation-breakthrough",
    title: "Meta's AI translation model breaks new ground in low-resource languages",
    description:
      "Meta has announced a breakthrough in AI translation technology that significantly improves performance for languages with limited training data.",
    category: "news",
    url: "/news/meta-translation-breakthrough",
    image: "/images/news/meta-opensource.png",
    tags: ["meta", "translation", "ai", "languages", "breakthrough"],
    content:
      "Meta's latest AI translation breakthrough addresses challenges in natural language processing for underrepresented languages.",
  },
  {
    id: "openai-gpt5-announcement",
    title: "OpenAI announces GPT-5 with revolutionary reasoning capabilities",
    description:
      "The next generation of GPT models promises unprecedented reasoning abilities and multimodal understanding.",
    category: "news",
    url: "/news/openai-gpt5-announcement",
    image: "/images/news/openai-gpt5.png",
    tags: ["openai", "gpt-5", "ai", "reasoning", "multimodal"],
    content:
      "OpenAI's announcement of GPT-5 marks a significant milestone in artificial intelligence development with revolutionary capabilities.",
  },
  {
    id: "eu-ai-regulation",
    title: "EU finalizes comprehensive AI regulation framework",
    description:
      "The European Union has completed its landmark AI Act, setting global standards for artificial intelligence governance.",
    category: "news",
    url: "/news/eu-ai-regulation",
    image: "/images/news/eu-ai-regulation.png",
    tags: ["eu", "regulation", "ai act", "governance", "policy"],
    content:
      "The European Union's AI Act represents the world's first comprehensive regulatory framework for artificial intelligence.",
  },
  {
    id: "ai-mathematics-breakthrough",
    title: "AI breakthrough in mathematical theorem proving",
    description:
      "Researchers have developed an AI system that can prove complex mathematical theorems, potentially revolutionizing mathematical research.",
    category: "news",
    url: "/news/ai-mathematics-breakthrough",
    image: "/images/news/ai-mathematics.png",
    tags: ["ai", "mathematics", "theorem proving", "research", "breakthrough"],
    content:
      "A groundbreaking AI system demonstrates the ability to prove complex mathematical theorems, marking a significant milestone.",
  },
]

// Quiz data for search
export const QUIZZES: SearchableItem[] = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals Quiz",
    description: "Test your basic knowledge of artificial intelligence concepts, history, and applications.",
    category: "quiz",
    url: "/quiz/ai-fundamentals",
    image: "/images/quiz/ai-brain-quiz.png",
    tags: ["ai", "fundamentals", "basics", "quiz", "learning"],
    content: "A comprehensive quiz covering the fundamentals of artificial intelligence, perfect for beginners.",
  },
  {
    id: "ai-intermediate",
    title: "AI Intermediate Quiz",
    description:
      "Challenge yourself with intermediate-level AI questions covering machine learning, neural networks, and more.",
    category: "quiz",
    url: "/quiz/ai-intermediate",
    image: "/images/quiz/ai-knowledge-test.png",
    tags: ["ai", "intermediate", "machine learning", "quiz", "advanced"],
    content:
      "An intermediate-level quiz for those with some AI knowledge, covering machine learning and neural networks.",
  },
  {
    id: "ai-ethics",
    title: "AI Advanced Quiz",
    description: "Advanced AI concepts including ethics, safety, and cutting-edge research topics.",
    category: "quiz",
    url: "/quiz/ai-ethics",
    image: "/images/quiz/machine-learning-quiz.png",
    tags: ["ai", "advanced", "ethics", "safety", "research"],
    content: "An advanced quiz covering AI ethics, safety considerations, and cutting-edge research topics.",
  },
]

// Website sections for search
export const SECTIONS: SearchableItem[] = [
  {
    id: "featured-stories",
    title: "Featured AI Fictions",
    description:
      "Curated collection of outstanding AI narratives that push the boundaries of creativity and imagination.",
    category: "section",
    url: "/#featured-stories",
    tags: ["stories", "fiction", "ai narratives", "featured"],
    content: "Explore our curated collection of AI fiction stories that blend technology with human emotion.",
  },
  {
    id: "best-ai-tools",
    title: "Best AI Tools",
    description: "Discover the most innovative AI tools and solutions for productivity, creativity, and development.",
    category: "section",
    url: "/#best-ai-tools",
    tags: ["tools", "ai tools", "productivity", "innovation"],
    content: "Find the best AI tools for various use cases including development, design, and content creation.",
  },
  {
    id: "news-articles",
    title: "News & Articles",
    description:
      "Latest insights and updates from the AI world, covering breakthroughs, research, and industry trends.",
    category: "section",
    url: "/#news-articles",
    tags: ["news", "articles", "ai news", "updates"],
    content: "Stay updated with the latest AI news, research breakthroughs, and industry developments.",
  },
  {
    id: "ai-quiz",
    title: "AI Knowledge Quiz",
    description: "Test your AI knowledge with interactive quizzes covering fundamentals to advanced topics.",
    category: "section",
    url: "/#ai-quiz",
    tags: ["quiz", "knowledge", "learning", "interactive"],
    content: "Challenge yourself with our comprehensive AI quizzes designed for all skill levels.",
  },
  {
    id: "tip-calculator",
    title: "Tip Calculator",
    description: "Smart tip calculator with multiple currency support and customizable tip percentages.",
    category: "tool",
    url: "/tip-calculator",
    tags: ["calculator", "tip", "utility", "tool"],
    content: "Calculate tips easily with our smart tip calculator supporting multiple currencies.",
  },
  {
    id: "character-counter",
    title: "Character Counter",
    description: "Count characters, words, and lines in your text with real-time analysis.",
    category: "tool",
    url: "/character-counter",
    tags: ["character counter", "text analysis", "utility", "tool"],
    content: "Analyze your text with our comprehensive character and word counting tool.",
  },
  {
    id: "file-converter",
    title: "File Converter",
    description: "Convert files between different formats quickly and easily.",
    category: "tool",
    url: "/file-converter",
    tags: ["file converter", "conversion", "utility", "tool"],
    content: "Convert files between various formats with our easy-to-use file conversion tool.",
  },
]

// Combine all searchable content
export const ALL_SEARCHABLE_CONTENT: SearchableItem[] = [
  ...AI_TOOLS,
  ...STORIES,
  ...NEWS_ARTICLES,
  ...QUIZZES,
  ...SECTIONS,
]

// Search function
export function searchContent(query: string): SearchableItem[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()

  return ALL_SEARCHABLE_CONTENT.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchTerm)
    const descriptionMatch = item.description.toLowerCase().includes(searchTerm)
    const tagsMatch = item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    const contentMatch = item.content?.toLowerCase().includes(searchTerm) || false
    const categoryMatch = item.category.toLowerCase().includes(searchTerm)

    return titleMatch || descriptionMatch || tagsMatch || contentMatch || categoryMatch
  }).slice(0, 10) // Limit to 10 results for performance
}

// Get search suggestions
export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()
  const suggestions = new Set<string>()

  ALL_SEARCHABLE_CONTENT.forEach((item) => {
    // Add matching titles
    if (item.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.title)
    }

    // Add matching tags
    item.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}
