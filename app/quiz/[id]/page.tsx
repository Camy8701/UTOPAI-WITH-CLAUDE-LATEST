"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Crown, User } from "lucide-react"
import { useAuth } from '@/components/auth-provider'
import { quizAPI, type QuizResult } from '@/lib/quiz-api-client'

/* -------------------------------------------------------------------------- */
/*                                Quiz Content                                */
/* -------------------------------------------------------------------------- */

type Question = {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

type LeaderboardEntry = {
  name: string
  score: number
  percentage: number
  quizType: string
  timestamp: number
}

const quizData: Record<string, { title: string; questions: Question[] }> = {
  "ai-fundamentals": {
    title: "AI Fundamentals Quiz",
    questions: [
      {
        id: 1,
        question: "What does 'AI' stand for?",
        options: [
          "Artificial Intelligence",
          "Automated Intelligence",
          "Advanced Intelligence",
          "Algorithmic Intelligence",
        ],
        correctAnswer: 0,
        explanation:
          "AI stands for Artificial Intelligence, which refers to the simulation of human intelligence in machines.",
      },
      {
        id: 2,
        question: "Who coined the term 'Artificial Intelligence'?",
        options: ["Alan Turing", "Marvin Minsky", "John McCarthy", "Claude Shannon"],
        correctAnswer: 2,
        explanation: "John McCarthy coined the term 'Artificial Intelligence' in 1956 at the Dartmouth Conference.",
      },
      {
        id: 3,
        question: "Which chess-playing computer defeated world champion Garry Kasparov in 1997?",
        options: ["Watson", "Deep Blue", "AlphaGo", "Stockfish"],
        correctAnswer: 1,
        explanation: "Deep Blue, IBM's chess-playing computer, defeated world champion Garry Kasparov in 1997.",
      },
      {
        id: 4,
        question: "What was the name of IBM's AI system that won at Jeopardy! in 2011?",
        options: ["Deep Blue", "AlphaGo", "Sherlock", "Watson"],
        correctAnswer: 3,
        explanation:
          "Watson was IBM's AI system that won at Jeopardy! in 2011, demonstrating advanced natural language processing.",
      },
      {
        id: 5,
        question: "Which company created ChatGPT?",
        options: ["Google", "OpenAI", "Microsoft", "Meta"],
        correctAnswer: 1,
        explanation: "ChatGPT was created by OpenAI, an AI research company founded in 2015.",
      },
      {
        id: 6,
        question: "What is Alexa?",
        options: [
          "Amazon's voice-controlled AI assistant",
          "Google's search algorithm",
          "Apple's virtual assistant",
          "Microsoft's cloud service",
        ],
        correctAnswer: 0,
        explanation:
          "Alexa is Amazon's voice-controlled AI assistant that can perform various tasks through voice commands.",
      },
      {
        id: 7,
        question: "Which company originally created Siri before it was acquired by Apple?",
        options: ["Google", "Microsoft", "SRI International", "Amazon"],
        correctAnswer: 2,
        explanation: "Siri was originally created by SRI International before being acquired and developed by Apple.",
      },
      {
        id: 8,
        question: "Which company owns DeepMind?",
        options: ["Microsoft", "Meta", "Amazon", "Google (Alphabet)"],
        correctAnswer: 3,
        explanation: "DeepMind is owned by Google (Alphabet), acquired in 2014 for AI research and development.",
      },
      {
        id: 9,
        question: "What major breakthrough did DeepMind achieve with AlphaGo?",
        options: [
          "Defeating a world champion Go player",
          "Creating realistic images",
          "Solving protein folding",
          "Winning at chess",
        ],
        correctAnswer: 0,
        explanation:
          "DeepMind's AlphaGo achieved the breakthrough of defeating world champion Go player Lee Sedol in 2016.",
      },
      {
        id: 10,
        question: "In which movie does the AI system HAL 9000 appear?",
        options: ["Blade Runner", "2001: A Space Odyssey", "The Matrix", "Ex Machina"],
        correctAnswer: 1,
        explanation: "HAL 9000 is the AI system that appears in Stanley Kubrick's '2001: A Space Odyssey'.",
      },
      {
        id: 11,
        question: "What is the name of the AI in the Iron Man movies?",
        options: ["FRIDAY", "EDITH", "KAREN", "JARVIS"],
        correctAnswer: 3,
        explanation:
          "JARVIS (Just A Rather Very Intelligent System) is Tony Stark's AI assistant in the Iron Man movies.",
      },
      {
        id: 12,
        question: "In the Terminator movies, what is the AI system that becomes self-aware?",
        options: ["Skynet", "HAL 9000", "The Matrix", "VIKI"],
        correctAnswer: 0,
        explanation:
          "Skynet is the AI system in the Terminator movies that becomes self-aware and turns against humanity.",
      },
      {
        id: 13,
        question: "Which AI character from Star Wars is known for protocol and etiquette?",
        options: ["R2-D2", "C-3PO", "BB-8", "K-2SO"],
        correctAnswer: 1,
        explanation:
          "C-3PO is the protocol droid in Star Wars known for his knowledge of etiquette and over six million forms of communication.",
      },
      {
        id: 14,
        question: "In the movie 'Her,' what is the name of the AI operating system?",
        options: ["Cortana", "Alexa", "Samantha", "Sophia"],
        correctAnswer: 2,
        explanation:
          "Samantha is the AI operating system in the movie 'Her' that develops a relationship with the main character.",
      },
      {
        id: 15,
        question: "Which video game features an AI companion named Cortana?",
        options: ["Call of Duty", "Mass Effect", "Destiny", "Halo series"],
        correctAnswer: 3,
        explanation: "Cortana is the AI companion in the Halo video game series, assisting the Master Chief.",
      },
      {
        id: 16,
        question: "Which animated movie features a robot who develops emotions and saves humanity?",
        options: ["WALL-E", "Big Hero 6", "The Iron Giant", "Robots"],
        correctAnswer: 0,
        explanation:
          "WALL-E is the Pixar animated movie about a robot who develops emotions and ultimately helps save humanity.",
      },
      {
        id: 17,
        question: "What is the main purpose of AI in autonomous vehicles?",
        options: [
          "To play entertainment media",
          "To enable self-driving capabilities",
          "To improve fuel efficiency",
          "To provide GPS navigation",
        ],
        correctAnswer: 1,
        explanation:
          "AI in autonomous vehicles processes sensor data and makes driving decisions to enable self-driving capabilities.",
      },
      {
        id: 18,
        question: "What type of AI is used in Netflix's recommendation system?",
        options: ["Voice recognition", "Computer vision", "Machine learning algorithms", "Natural language processing"],
        correctAnswer: 2,
        explanation:
          "Netflix uses machine learning and recommendation algorithms to suggest content based on viewing patterns.",
      },
      {
        id: 19,
        question: "What is the main concern about job displacement due to AI?",
        options: [
          "AI will make jobs more difficult",
          "AI will reduce worker salaries",
          "AI will require extensive retraining",
          "AI might replace human workers",
        ],
        correctAnswer: 3,
        explanation: "The main concern is that AI automation might replace human workers in various industries.",
      },
      {
        id: 20,
        question: "What are 'deepfakes'?",
        options: [
          "AI-generated fake videos or audio",
          "Deep ocean exploration tools",
          "Advanced search algorithms",
          "Deep learning networks",
        ],
        correctAnswer: 0,
        explanation: "Deepfakes are AI-generated fake videos or audio that appear realistic but are fabricated.",
      },
      {
        id: 21,
        question: "How long did it take ChatGPT to reach 100 million users?",
        options: ["1 year", "About 2 months", "6 months", "1 month"],
        correctAnswer: 1,
        explanation:
          "ChatGPT reached 100 million users in about 2 months, making it the fastest-growing app in history at the time.",
      },
      {
        id: 22,
        question: "Which country invests the most in AI research and development?",
        options: ["China", "Japan", "Germany", "The United States"],
        correctAnswer: 3,
        explanation: "The United States invests the most in AI research and development, followed closely by China.",
      },
      {
        id: 23,
        question: "What is the name of Boston Dynamics' famous robot dog?",
        options: ["Atlas", "Handle", "Spot", "BigDog"],
        correctAnswer: 2,
        explanation: "Spot is Boston Dynamics' famous four-legged robot dog known for its mobility and agility.",
      },
      {
        id: 24,
        question: "What is the most common programming language used for AI development?",
        options: ["Java", "Python", "C++", "JavaScript"],
        correctAnswer: 1,
        explanation:
          "Python is the most common programming language for AI development due to its simplicity and extensive libraries.",
      },
      {
        id: 25,
        question: "True or False: AI will replace all human jobs.",
        options: ["True", "Only in manufacturing industries", "False", "Only manual labor jobs"],
        correctAnswer: 2,
        explanation:
          "False - While AI will automate some jobs, it will also create new ones and augment human capabilities.",
      },
      {
        id: 26,
        question: "Can current AI systems truly 'understand' like humans do?",
        options: [
          "Yes, they understand everything",
          "No, they process patterns but don't truly understand",
          "Only simple concepts",
          "Only with human supervision",
        ],
        correctAnswer: 1,
        explanation:
          "No - Current AI processes patterns in data but doesn't have consciousness or true understanding like humans.",
      },
      {
        id: 27,
        question: "True or False: AI is only useful for tech companies.",
        options: ["True", "Only for large corporations", "Only for startups", "False"],
        correctAnswer: 3,
        explanation:
          "False - AI is used across all industries including healthcare, finance, agriculture, and education.",
      },
      {
        id: 28,
        question: "Do AI systems have emotions?",
        options: [
          "No, they simulate but don't feel emotions",
          "Yes, they feel emotions",
          "Only advanced AI systems",
          "Only when specifically programmed",
        ],
        correctAnswer: 0,
        explanation: "No - Current AI systems can simulate emotional responses but don't actually feel emotions.",
      },
      {
        id: 29,
        question: "Is AI currently conscious or self-aware?",
        options: [
          "Yes, advanced AI is conscious",
          "Only some AI systems",
          "Only in research laboratories",
          "No, current AI is not conscious",
        ],
        correctAnswer: 3,
        explanation: "No - Current AI systems are not conscious or self-aware, despite appearing sophisticated.",
      },
      {
        id: 30,
        question: "True or False: AI development is slowing down.",
        options: ["True", "It's staying the same", "False", "Only in some areas"],
        correctAnswer: 2,
        explanation: "False - AI development is accelerating rapidly with new breakthroughs happening regularly.",
      },
      {
        id: 31,
        question: "What is an algorithm in the context of AI?",
        options: [
          "A set of rules for solving problems",
          "A type of computer hardware",
          "A programming language",
          "A data storage structure",
        ],
        correctAnswer: 0,
        explanation: "An algorithm is a set of rules or instructions that tells a computer how to solve a problem.",
      },
      {
        id: 32,
        question: "What is the difference between AI and machine learning?",
        options: [
          "They are the same thing",
          "AI is broader, ML is a subset that learns from data",
          "ML is broader than AI",
          "AI is older than ML",
        ],
        correctAnswer: 1,
        explanation:
          "AI is the broader concept of intelligent machines, while machine learning is a subset of AI that learns from data.",
      },
      {
        id: 33,
        question: "What is training data in machine learning?",
        options: [
          "Data used to test the final model",
          "Data that needs to be cleaned",
          "Data for model validation",
          "The dataset used to teach an AI model",
        ],
        correctAnswer: 3,
        explanation: "Training data is the dataset used to teach an AI model how to make predictions or decisions.",
      },
      {
        id: 34,
        question: "What does 'NLP' stand for in AI?",
        options: [
          "Natural Language Processing",
          "Neural Learning Protocol",
          "Network Learning Process",
          "New Logic Programming",
        ],
        correctAnswer: 0,
        explanation:
          "NLP stands for Natural Language Processing, which helps computers understand and work with human language.",
      },
      {
        id: 35,
        question: "What is the potential positive impact of AI on healthcare?",
        options: [
          "Only faster appointment scheduling",
          "Just cost reduction",
          "Improved diagnosis and personalized treatment",
          "Only administrative task automation",
        ],
        correctAnswer: 2,
        explanation:
          "AI can improve healthcare through better diagnosis, drug discovery, personalized treatment, and medical imaging analysis.",
      },
      {
        id: 36,
        question: "What is machine learning?",
        options: [
          "Teaching machines to move physically",
          "Programming machines manually for each task",
          "Building physical robots",
          "AI that learns from data without explicit programming",
        ],
        correctAnswer: 3,
        explanation:
          "Machine learning is a subset of AI where computers learn and improve from data without being explicitly programmed for every task.",
      },
      {
        id: 37,
        question: "Which AI assistant is built into iPhones?",
        options: ["Alexa", "Google Assistant", "Cortana", "Siri"],
        correctAnswer: 3,
        explanation: "Siri is Apple's AI assistant that is built into iPhones and other Apple devices.",
      },
      {
        id: 38,
        question: "What do we call AI that can generate new images, text, or music?",
        options: ["Analytical AI", "Generative AI", "Predictive AI", "Reactive AI"],
        correctAnswer: 1,
        explanation: "Generative AI refers to AI systems that can create new content like images, text, or music.",
      },
      {
        id: 39,
        question: "True or False: You need to be a programmer to use AI tools like ChatGPT.",
        options: ["True", "Only for advanced features", "Only for customization", "False"],
        correctAnswer: 3,
        explanation:
          "False - Many AI tools like ChatGPT are designed for everyday users with simple, user-friendly interfaces.",
      },
      {
        id: 40,
        question: "What is the main way AI learns new information?",
        options: [
          "By reading digital books",
          "By asking humans questions",
          "By trial and error only",
          "By analyzing large amounts of data to find patterns",
        ],
        correctAnswer: 3,
        explanation: "AI learns primarily by analyzing large amounts of data to identify patterns and relationships.",
      },
    ],
  },
  "ai-intermediate": {
    title: "AI Intermediate Quiz",
    questions: [
      {
        id: 41,
        question: "In which year was the famous Dartmouth Conference held that launched the AI field?",
        options: ["1955", "1956", "1957", "1958"],
        correctAnswer: 1,
        explanation: "The Dartmouth Conference was held in 1956 and is considered the founding event of AI as a field.",
      },
      {
        id: 42,
        question: "What was the name of the first chatbot created in the 1960s?",
        options: ["ALICE", "PARRY", "SHRDLU", "ELIZA"],
        correctAnswer: 3,
        explanation: "ELIZA was the first chatbot, created by Joseph Weizenbaum at MIT in the 1960s.",
      },
      {
        id: 43,
        question: "Who is considered the 'father of AI'?",
        options: ["John McCarthy", "Alan Turing", "Marvin Minsky", "Herbert Simon"],
        correctAnswer: 1,
        explanation:
          "Alan Turing is often considered the 'father of AI', though John McCarthy is also credited for coining the term.",
      },
      {
        id: 44,
        question: "What is the Turing Test designed to measure?",
        options: [
          "Computer processing speed",
          "Memory storage capacity",
          "Whether a machine can exhibit intelligent behavior indistinguishable from a human",
          "Network connectivity speed",
        ],
        correctAnswer: 2,
        explanation:
          "The Turing Test measures whether a machine can exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.",
      },
      {
        id: 45,
        question: "Which decade is often called the first 'AI Winter'?",
        options: ["The 1960s", "The 1970s", "The 1980s", "The 1990s"],
        correctAnswer: 1,
        explanation:
          "The 1970s is often called the first 'AI Winter' due to reduced funding and interest in AI research.",
      },
      {
        id: 46,
        question: "What does 'GPT' stand for in ChatGPT?",
        options: [
          "Generative Pre-trained Transformer",
          "General Purpose Technology",
          "Global Processing Tool",
          "Guided Pattern Training",
        ],
        correctAnswer: 0,
        explanation: "GPT stands for Generative Pre-trained Transformer, a type of neural network architecture.",
      },
      {
        id: 47,
        question: "Which AI tool is famous for generating images from text descriptions?",
        options: ["ChatGPT", "AlphaGo", "DALL-E", "Watson"],
        correctAnswer: 2,
        explanation:
          "DALL-E, Midjourney, and Stable Diffusion are all famous for generating images from text descriptions.",
      },
      {
        id: 48,
        question: "Which Google AI assistant can make phone calls and book appointments?",
        options: ["Google Assistant", "Google Duplex", "Google Bard", "Google Lens"],
        correctAnswer: 1,
        explanation:
          "Google Duplex is the AI system that can make phone calls and book appointments on behalf of users.",
      },
      {
        id: 49,
        question: "Which AI tool helps developers write code?",
        options: ["Photoshop", "Excel", "GitHub Copilot", "PowerPoint"],
        correctAnswer: 2,
        explanation: "GitHub Copilot is an AI-powered code completion tool that helps developers write code.",
      },
      {
        id: 50,
        question: "Which social media platform uses AI to create its main feed algorithm?",
        options: ["Only Facebook", "Only TikTok", "None of them", "All major platforms"],
        correctAnswer: 3,
        explanation:
          "All major social media platforms (Facebook, Instagram, TikTok, Twitter/X, etc.) use AI algorithms for their feeds.",
      },
      {
        id: 51,
        question: "What is computer vision in AI?",
        options: [
          "The ability of computers to interpret and understand visual information",
          "AI that can see colors",
          "Computer screen technology",
          "Virtual reality systems",
        ],
        correctAnswer: 0,
        explanation:
          "Computer vision is the ability of computers to interpret and understand visual information from images or videos.",
      },
      {
        id: 52,
        question: "Which company developed the GPT series of language models?",
        options: ["Google", "Microsoft", "Meta", "OpenAI"],
        correctAnswer: 3,
        explanation: "OpenAI developed the GPT (Generative Pre-trained Transformer) series of language models.",
      },
      {
        id: 53,
        question: "What is Tesla's AI chip called?",
        options: ["Tesla Chip", "FSD chip", "Auto Chip", "Drive Chip"],
        correctAnswer: 1,
        explanation: "Tesla's AI chip is called the FSD (Full Self-Driving) chip, also known as the Dojo chip.",
      },
      {
        id: 54,
        question: "What is Microsoft's AI research division called?",
        options: ["Microsoft AI", "Azure AI", "Cortana Research", "Microsoft Research AI"],
        correctAnswer: 3,
        explanation: "Microsoft Research AI is Microsoft's dedicated AI research division.",
      },
      {
        id: 55,
        question: "Which Chinese company is known for its facial recognition AI?",
        options: ["SenseTime", "Alibaba", "Baidu", "Tencent"],
        correctAnswer: 0,
        explanation:
          "SenseTime and Megvii (Face++) are Chinese companies known for their facial recognition AI technology.",
      },
      {
        id: 56,
        question: "What is NVIDIA's role in the AI boom?",
        options: [
          "Creating AI software applications",
          "Manufacturing GPUs that power AI training",
          "Building physical robots",
          "Developing AI algorithms",
        ],
        correctAnswer: 1,
        explanation:
          "NVIDIA manufactures GPUs (graphics processing units) that are essential for AI training and inference.",
      },
      {
        id: 57,
        question: "Which company created the AI model Claude?",
        options: ["OpenAI", "Google", "Meta", "Anthropic"],
        correctAnswer: 3,
        explanation: "Claude is an AI assistant created by Vercel, an AI safety company.",
      },
      {
        id: 58,
        question: "What is Meta's (Facebook's) AI research lab called?",
        options: ["Meta AI", "FAIR", "Facebook Research", "Reality Labs"],
        correctAnswer: 1,
        explanation: "FAIR (Facebook AI Research), now called Meta AI, is Meta's AI research laboratory.",
      },
      {
        id: 59,
        question: "What Netflix series features an AI-powered dating algorithm?",
        options: ["Stranger Things", "The Crown", "House of Cards", "Black Mirror"],
        correctAnswer: 3,
        explanation: "Black Mirror features various episodes with AI-powered algorithms, including dating systems.",
      },
      {
        id: 60,
        question: "What AI writes poetry and creates art in the movie 'Ex Machina'?",
        options: ["Ava", "Eva", "Ada", "Anna"],
        correctAnswer: 0,
        explanation: "Ava is the AI character in 'Ex Machina' that demonstrates creativity through poetry and art.",
      },
      {
        id: 61,
        question: "What is a neural network inspired by?",
        options: ["Computer circuits", "The human brain and its neurons", "Mathematical equations", "Network topology"],
        correctAnswer: 1,
        explanation: "Neural networks are inspired by the human brain and how neurons connect and process information.",
      },
      {
        id: 62,
        question: "What does 'deep learning' refer to?",
        options: [
          "Learning very difficult concepts",
          "Neural networks with many layers",
          "Learning from deep data sources",
          "Underground computing systems",
        ],
        correctAnswer: 1,
        explanation: "Deep learning refers to neural networks with many layers (typically more than 3 hidden layers).",
      },
      {
        id: 63,
        question: "What is overfitting in machine learning?",
        options: [
          "When a model is too small for the data",
          "When a model runs too fast",
          "When a model learns training data too well and fails to generalize",
          "When a model uses too much memory",
        ],
        correctAnswer: 2,
        explanation:
          "Overfitting occurs when a model learns the training data too well and fails to generalize to new, unseen data.",
      },
      {
        id: 64,
        question: "What is 'big data' and why is it important for AI?",
        options: [
          "Large file sizes",
          "Large volumes of data that AI can learn from",
          "Expensive data storage",
          "Complex data structures",
        ],
        correctAnswer: 1,
        explanation:
          "Big data refers to large volumes of data that AI systems can learn from to improve their performance.",
      },
      {
        id: 65,
        question: "What is computer processing power's role in AI development?",
        options: [
          "It's not important for AI",
          "More powerful computers can train more complex AI models faster",
          "Only affects graphics rendering",
          "Only important for data storage",
        ],
        correctAnswer: 1,
        explanation: "More powerful computers can process larger datasets and train more complex AI models faster.",
      },
      {
        id: 66,
        question: "What is algorithmic bias?",
        options: [
          "When algorithms run too fast",
          "When AI systems produce unfair or discriminatory results",
          "When algorithms are expensive to run",
          "When algorithms are too complex",
        ],
        correctAnswer: 1,
        explanation:
          "Algorithmic bias occurs when AI systems produce unfair or discriminatory results due to biased training data or design.",
      },
      {
        id: 67,
        question: "What does 'AI alignment' mean?",
        options: [
          "Organizing AI code properly",
          "Ensuring AI systems pursue goals aligned with human values",
          "Making AI run faster",
          "Connecting AI systems together",
        ],
        correctAnswer: 1,
        explanation:
          "AI alignment means ensuring AI systems pursue goals that are aligned with human values and intentions.",
      },
      {
        id: 68,
        question: "What is the 'singularity' in AI context?",
        options: [
          "A single AI system",
          "A hypothetical point when AI becomes capable of recursive self-improvement",
          "The first AI ever created",
          "A unique algorithm design",
        ],
        correctAnswer: 1,
        explanation:
          "The singularity is a hypothetical point when AI becomes capable of recursive self-improvement, leading to rapid technological growth.",
      },
      {
        id: 69,
        question: "What does 'explainable AI' mean?",
        options: [
          "AI that talks frequently",
          "AI systems that can provide clear explanations for their decisions",
          "AI that teaches others",
          "AI that is simple to understand",
        ],
        correctAnswer: 1,
        explanation:
          "Explainable AI refers to AI systems that can provide clear explanations for their decisions and reasoning.",
      },
      {
        id: 70,
        question: "What is the 'AI safety' field focused on?",
        options: [
          "Making AI run without errors",
          "Ensuring AI systems are safe, beneficial, and under human control",
          "Protecting AI from computer viruses",
          "Physical security of AI hardware",
        ],
        correctAnswer: 1,
        explanation: "AI safety focuses on ensuring AI systems are safe, beneficial, and remain under human control.",
      },
      {
        id: 71,
        question: "What are the main privacy concerns with AI?",
        options: [
          "AI processing is too slow",
          "Collection and use of personal data without consent",
          "AI costs too much money",
          "AI is too complex to understand",
        ],
        correctAnswer: 1,
        explanation:
          "Main privacy concerns include collection and use of personal data, surveillance, and lack of consent in data usage.",
      },
      {
        id: 72,
        question: "What is 'responsible AI'?",
        options: [
          "AI that pays its own taxes",
          "Developing AI systems in ethical, fair, and beneficial ways",
          "AI that works without supervision",
          "AI that follows all rules strictly",
        ],
        correctAnswer: 1,
        explanation:
          "Responsible AI means developing and deploying AI systems in ways that are ethical, fair, and beneficial to society.",
      },
      {
        id: 73,
        question: "Which game did AlphaStar master?",
        options: ["Chess", "StarCraft II", "Poker", "Go"],
        correctAnswer: 1,
        explanation: "AlphaStar is DeepMind's AI that mastered the real-time strategy game StarCraft II.",
      },
      {
        id: 74,
        question: "What is the estimated global AI market value by 2030?",
        options: ["$100 billion", "Over $1 trillion", "$50 billion", "$500 billion"],
        correctAnswer: 1,
        explanation:
          "The global AI market is estimated to be worth over $1 trillion by 2030, with estimates varying from $1-2 trillion.",
      },
      {
        id: 75,
        question: "Can AI be creative?",
        options: [
          "No, never under any circumstances",
          "AI can generate novel combinations appearing creative, but true creativity is debated",
          "Yes, always in all situations",
          "Only in artistic applications",
        ],
        correctAnswer: 1,
        explanation:
          "AI can generate novel combinations of existing patterns (appearing creative), but whether this constitutes true creativity is debated.",
      },
      {
        id: 76,
        question: "True or False: More data always makes AI better.",
        options: [
          "True in all cases",
          "False - quality matters more than quantity",
          "Only sometimes true",
          "Only for large models",
        ],
        correctAnswer: 1,
        explanation:
          "False - Quality of data matters more than quantity; bad data can actually make AI performance worse.",
      },
      {
        id: 77,
        question: "Can AI systems learn without any human input?",
        options: [
          "Yes, completely independently",
          "Partially - some can learn through trial and error but need human-designed frameworks",
          "No, never without humans",
          "Only for simple tasks",
        ],
        correctAnswer: 1,
        explanation:
          "Partially true - While some AI can learn through trial and error (reinforcement learning), most still require human-designed goals and frameworks.",
      },
      {
        id: 78,
        question: "What is 'generative AI'?",
        options: [
          "AI that generates electricity",
          "AI that can create new content like text, images, music, or code",
          "AI that generates reports",
          "AI that generates random data",
        ],
        correctAnswer: 1,
        explanation:
          "Generative AI refers to AI systems that can create new content such as text, images, music, or code.",
      },
      {
        id: 79,
        question: "What does 'LLM' stand for?",
        options: ["Long Learning Machine", "Large Language Model", "Limited Logic Module", "Linear Learning Method"],
        correctAnswer: 1,
        explanation:
          "LLM stands for Large Language Model, referring to AI models trained on vast amounts of text data.",
      },
      {
        id: 80,
        question: "What is 'prompt engineering'?",
        options: [
          "Building AI hardware components",
          "The practice of designing effective input prompts to get better outputs from AI",
          "Engineering AI to be prompt and fast",
          "Creating AI scheduling systems",
        ],
        correctAnswer: 1,
        explanation:
          "Prompt engineering is the practice of designing effective input prompts to get better outputs from AI systems.",
      },
    ],
  },
  "ai-ethics": {
    title: "AI Advanced Quiz",
    questions: [
      {
        id: 81,
        question: "What are the three main types of machine learning?",
        options: [
          "Supervised, unsupervised, and reinforcement learning",
          "Deep, shallow, and medium learning",
          "Fast, slow, and medium learning",
          "Simple, complex, and hybrid learning",
        ],
        correctAnswer: 0,
        explanation:
          "The three main types of machine learning are supervised learning (with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through rewards and penalties).",
      },
      {
        id: 82,
        question: "How many parameters does GPT-4 approximately have?",
        options: ["100 billion", "500 billion", "10 trillion", "Over 1 trillion"],
        correctAnswer: 3,
        explanation:
          "GPT-4 is estimated to have over 1 trillion parameters, though the exact number has not been publicly disclosed by OpenAI.",
      },
      {
        id: 83,
        question: "What percentage of the internet does Google's AI crawl and index?",
        options: ["50-70%", "80-90%", "An estimated 4-20%", "Less than 1%"],
        correctAnswer: 2,
        explanation:
          "Google's AI crawls and indexes an estimated 4-20% of the total web, as the exact percentage varies by different estimates and the web is constantly growing.",
      },
      {
        id: 84,
        question: "How many calculations can the human brain perform per second?",
        options: ["10^12 calculations", "10^20 calculations", "10^14 calculations", "Approximately 10^16 calculations"],
        correctAnswer: 3,
        explanation:
          "The human brain can perform approximately 10^16 (10 petaflops) calculations per second, though this is a rough estimate as brain computation differs from digital computation.",
      },
      {
        id: 85,
        question: "How much data is generated globally every day?",
        options: [
          "1 quintillion bytes",
          "5 quintillion bytes",
          "Approximately 2.5 quintillion bytes",
          "10 quintillion bytes",
        ],
        correctAnswer: 2,
        explanation:
          "Approximately 2.5 quintillion bytes (2.5 million terabytes) of data are generated globally every day, and this number continues to grow rapidly.",
      },
      {
        id: 86,
        question: "True or False: AI learning is exactly like human learning.",
        options: [
          "True in most cases",
          "False - AI learning is based on statistical patterns, human learning involves consciousness",
          "Partially true for advanced systems",
          "True for advanced AI only",
        ],
        correctAnswer: 1,
        explanation:
          "False - AI learning is based on statistical patterns in data, while human learning involves consciousness, experience, emotions, and understanding.",
      },
      {
        id: 87,
        question: "What is 'multimodal AI'?",
        options: [
          "AI systems that can process multiple types of input simultaneously",
          "AI with multiple processors",
          "AI that works in multiple languages",
          "AI with multiple algorithms",
        ],
        correctAnswer: 0,
        explanation:
          "Multimodal AI refers to AI systems that can process and understand multiple types of input (text, images, audio, video) simultaneously and integrate them for better understanding.",
      },
      {
        id: 88,
        question: "What is 'edge AI'?",
        options: [
          "AI at the cutting edge of technology",
          "AI for edge cases and exceptions",
          "AI with sharp algorithmic precision",
          "AI processing that happens on local devices rather than in the cloud",
        ],
        correctAnswer: 3,
        explanation:
          "Edge AI refers to AI processing that happens on local devices (like smartphones, IoT devices) rather than in the cloud, enabling faster response times and better privacy.",
      },
      {
        id: 89,
        question: "What is 'federated learning'?",
        options: [
          "Learning across federal government agencies",
          "Learning in federation with other systems",
          "A machine learning approach where models are trained across multiple devices without sharing raw data",
          "Centralized learning with distributed storage",
        ],
        correctAnswer: 2,
        explanation:
          "Federated learning is a machine learning approach where models are trained across multiple devices or servers without sharing the raw data, preserving privacy.",
      },
      {
        id: 90,
        question: "What is 'transfer learning' in AI?",
        options: [
          "Using a pre-trained model as a starting point for a new, related task",
          "Transferring data between computer systems",
          "Moving AI between different computers",
          "Learning to transfer files efficiently",
        ],
        correctAnswer: 0,
        explanation:
          "Transfer learning involves using a pre-trained model as a starting point for a new, related task, allowing faster training and better performance with less data.",
      },
      {
        id: 91,
        question: "What does 'AGI' stand for?",
        options: [
          "Advanced Graphics Intelligence",
          "Automated General Intelligence",
          "Artificial General Intelligence",
          "Augmented General Intelligence",
        ],
        correctAnswer: 2,
        explanation:
          "AGI stands for Artificial General Intelligence, referring to AI that can understand, learn, and apply knowledge across a wide range of tasks at a level equal to or beyond human capability.",
      },
      {
        id: 92,
        question: "What is 'reinforcement learning'?",
        options: [
          "Learning with reinforced materials and structures",
          "Learning with extra support and guidance",
          "A type of machine learning where an AI learns through trial and error using rewards and penalties",
          "Strengthening existing knowledge bases",
        ],
        correctAnswer: 2,
        explanation:
          "Reinforcement learning is a type of machine learning where an AI agent learns to make decisions by taking actions in an environment and receiving rewards or penalties for those actions.",
      },
      {
        id: 93,
        question: "Which AI technique is used to train two neural networks against each other?",
        options: [
          "CNNs (Convolutional Neural Networks)",
          "RNNs (Recurrent Neural Networks)",
          "GANs (Generative Adversarial Networks)",
          "SVMs (Support Vector Machines)",
        ],
        correctAnswer: 2,
        explanation:
          "GANs (Generative Adversarial Networks) use two neural networks competing against each other - a generator that creates fake data and a discriminator that tries to detect fake data.",
      },
      {
        id: 94,
        question: "What is the 'attention mechanism' in AI?",
        options: [
          "Making AI pay attention to users",
          "Getting user attention for AI systems",
          "A technique that allows AI models to focus on relevant parts of the input when making predictions",
          "Focusing on important data storage",
        ],
        correctAnswer: 2,
        explanation:
          "The attention mechanism allows AI models to focus on relevant parts of the input when making predictions, similar to how humans focus on important information while ignoring irrelevant details.",
      },
      {
        id: 95,
        question: "What is 'few-shot learning'?",
        options: [
          "Learning with few attempts or tries",
          "Quick learning in short time periods",
          "An AI's ability to learn new tasks with only a few examples",
          "Learning with limited computational resources",
        ],
        correctAnswer: 2,
        explanation:
          "Few-shot learning is an AI's ability to learn new tasks or recognize new patterns with only a few examples, mimicking human ability to generalize from limited data.",
      },
      {
        id: 96,
        question: "What does 'BERT' stand for in AI?",
        options: [
          "Basic Encoder Representation Transformer",
          "Binary Encoded Representation Technology",
          "Bidirectional Encoder Representations from Transformers",
          "Behavioral Encoding Recognition Tool",
        ],
        correctAnswer: 2,
        explanation:
          "BERT stands for Bidirectional Encoder Representations from Transformers, a language model that reads text bidirectionally to better understand context.",
      },
      {
        id: 97,
        question: "What is 'gradient descent'?",
        options: [
          "Going downhill in mountainous terrain",
          "Descending gradients in visual design",
          "An optimization algorithm used to minimize errors in machine learning models",
          "A type of neural network architecture",
        ],
        correctAnswer: 2,
        explanation:
          "Gradient descent is an optimization algorithm used to minimize the error (loss) in machine learning models by iteratively adjusting parameters in the direction that reduces the error.",
      },
      {
        id: 98,
        question: "What is the 'vanishing gradient problem'?",
        options: [
          "Gradients disappearing from visual displays",
          "When neural networks have difficulty learning because gradients become too small in early layers",
          "Missing gradients in design systems",
          "Gradient calculation errors in software",
        ],
        correctAnswer: 1,
        explanation:
          "The vanishing gradient problem occurs when neural networks have difficulty learning because the gradients become exponentially smaller as they propagate back through the layers, making early layers learn very slowly.",
      },
      {
        id: 99,
        question: "What is 'ensemble learning'?",
        options: [
          "Learning in group settings",
          "Musical learning approaches",
          "Combining multiple AI models to make better predictions than any single model",
          "Coordinated learning across teams",
        ],
        correctAnswer: 2,
        explanation:
          "Ensemble learning combines multiple AI models (like different algorithms or the same algorithm with different parameters) to make better predictions than any single model alone.",
      },
      {
        id: 100,
        question: "What is 'cross-validation' in machine learning?",
        options: [
          "Validating across different platforms",
          "Double-checking results manually",
          "A technique to assess how well a model will generalize to new data by testing it on different subsets",
          "Validating with external data sources",
        ],
        correctAnswer: 2,
        explanation:
          "Cross-validation is a technique to assess how well a model will generalize to new, unseen data by dividing the dataset into multiple subsets and testing the model on different combinations.",
      },
      {
        id: 101,
        question: "What is 'hyperparameter tuning'?",
        options: [
          "Tuning high-frequency parameters",
          "Fine-tuning hyperlinks in systems",
          "Adjusting the configuration settings of a machine learning model to optimize its performance",
          "Adjusting super-level settings",
        ],
        correctAnswer: 2,
        explanation:
          "Hyperparameter tuning involves adjusting the configuration settings (hyperparameters) of a machine learning model, such as learning rate or number of layers, to optimize its performance.",
      },
      {
        id: 102,
        question: "What is the 'transformer architecture'?",
        options: [
          "Architecture that transforms buildings",
          "Building transformers for robotics",
          "A neural network architecture that relies entirely on attention mechanisms, used in models like GPT and BERT",
          "Changing architectural designs dynamically",
        ],
        correctAnswer: 2,
        explanation:
          "The transformer architecture is a neural network design that relies entirely on attention mechanisms, eliminating the need for recurrence and convolutions, and is used in models like GPT and BERT.",
      },
      {
        id: 103,
        question: "In 'The Matrix,' what is the name of the AI controlling the simulated reality?",
        options: ["Skynet", "Agent Smith", "HAL 9000", "The Matrix"],
        correctAnswer: 3,
        explanation:
          "In 'The Matrix,' the AI system controlling the simulated reality is called 'The Matrix' itself, or collectively referred to as 'the machines' or 'the AI.'",
      },
      {
        id: 104,
        question: "What is computer vision in the context of AI?",
        options: [
          "AI with enhanced eyesight capabilities",
          "Computer screen display technology",
          "AI technology that enables computers to interpret and understand visual information",
          "Visual computing for graphics",
        ],
        correctAnswer: 2,
        explanation:
          "Computer vision is AI technology that enables computers to interpret, understand, and analyze visual information from images and videos, similar to human vision.",
      },
      {
        id: 105,
        question: "What is the difference between supervised and unsupervised learning?",
        options: [
          "Supervised learning is faster than unsupervised",
          "Supervised learning is more accurate",
          "Supervised learning uses labeled data to learn patterns, while unsupervised learning finds patterns in unlabeled data",
          "No significant difference between them",
        ],
        correctAnswer: 2,
        explanation:
          "Supervised learning uses labeled training data (input-output pairs) to learn patterns, while unsupervised learning finds hidden patterns and structures in unlabeled data without knowing the correct answers.",
      },
      {
        id: 106,
        question: "What is 'neural architecture search' (NAS)?",
        options: [
          "Searching for neural network patterns",
          "Looking for brain structure similarities",
          "Automated method for finding optimal neural network architectures",
          "Network topology search algorithms",
        ],
        correctAnswer: 2,
        explanation:
          "Neural Architecture Search (NAS) is an automated method for finding optimal neural network architectures, using algorithms to design and optimize network structures rather than manual design.",
      },
      {
        id: 107,
        question: "What is 'catastrophic forgetting' in AI?",
        options: [
          "AI forgetting everything completely",
          "Memory errors in computer systems",
          "When AI models forget previously learned tasks when learning new ones",
          "Forgetting passwords and credentials",
        ],
        correctAnswer: 2,
        explanation:
          "Catastrophic forgetting occurs when AI models forget previously learned tasks or knowledge when they learn new tasks, a major challenge in continual learning.",
      },
      {
        id: 108,
        question: "What is 'meta-learning' or 'learning to learn'?",
        options: [
          "Learning about learning processes",
          "Advanced learning techniques",
          "AI systems that learn how to learn new tasks more efficiently",
          "Self-teaching AI systems",
        ],
        correctAnswer: 2,
        explanation:
          "Meta-learning, or 'learning to learn,' refers to AI systems that learn how to learn new tasks more efficiently by leveraging experience from previous learning tasks.",
      },
      {
        id: 109,
        question: "What is 'adversarial training' in machine learning?",
        options: [
          "Training against enemy systems",
          "Competitive training between models",
          "Training models to be robust against adversarial attacks by including adversarial examples in training",
          "Hostile training environments",
        ],
        correctAnswer: 2,
        explanation:
          "Adversarial training involves training models to be robust against adversarial attacks by including adversarial examples (slightly modified inputs designed to fool the model) in the training process.",
      },
      {
        id: 110,
        question: "What is 'continual learning' in AI?",
        options: [
          "Learning continuously without stopping",
          "Non-stop learning processes",
          "The ability of AI systems to learn new tasks while retaining knowledge of previous tasks",
          "Always-on learning systems",
        ],
        correctAnswer: 2,
        explanation:
          "Continual learning is the ability of AI systems to continuously learn new tasks and knowledge while retaining and not forgetting previously learned information, similar to human learning.",
      },
      {
        id: 111,
        question: "What is 'self-supervised learning'?",
        options: [
          "AI supervising itself autonomously",
          "Independent learning without oversight",
          "Learning where the model generates its own supervisory signal from the input data",
          "Autonomous learning systems",
        ],
        correctAnswer: 2,
        explanation:
          "Self-supervised learning is a learning paradigm where the model generates its own supervisory signal from the input data, such as predicting missing parts of an image or next words in text.",
      },
      {
        id: 112,
        question: "What is 'model compression' in AI?",
        options: [
          "Compressing files and data",
          "Squeezing models into smaller spaces",
          "Techniques to reduce the size and computational requirements of AI models while maintaining performance",
          "Data compression for storage",
        ],
        correctAnswer: 2,
        explanation:
          "Model compression involves techniques to reduce the size, memory usage, and computational requirements of AI models while maintaining their performance, enabling deployment on resource-constrained devices.",
      },
      {
        id: 113,
        question: "What is 'knowledge distillation'?",
        options: [
          "Extracting knowledge from databases",
          "Purifying knowledge sources",
          "A technique where a smaller model learns from a larger, more complex model",
          "Knowledge extraction processes",
        ],
        correctAnswer: 2,
        explanation:
          "Knowledge distillation is a technique where a smaller, simpler model (student) learns to mimic the behavior of a larger, more complex model (teacher), often achieving similar performance with fewer resources.",
      },
      {
        id: 114,
        question: "What is 'zero-shot learning'?",
        options: [
          "Learning without shooting or targeting",
          "Learning without examples or data",
          "AI's ability to perform tasks it has never been explicitly trained on",
          "Instant learning capabilities",
        ],
        correctAnswer: 2,
        explanation:
          "Zero-shot learning is an AI's ability to perform tasks or recognize classes it has never been explicitly trained on, often by leveraging knowledge from related tasks or semantic relationships.",
      },
      {
        id: 115,
        question: "What is 'curriculum learning'?",
        options: [
          "Learning school curriculum subjects",
          "Educational AI systems",
          "Training AI models by gradually increasing the difficulty of training examples",
          "Structured learning programs",
        ],
        correctAnswer: 2,
        explanation:
          "Curriculum learning involves training AI models by gradually increasing the difficulty of training examples, starting with easier examples and progressively moving to harder ones, similar to human education.",
      },
      {
        id: 116,
        question: "What is 'active learning' in machine learning?",
        options: [
          "Energetic and dynamic learning",
          "Physical learning activities",
          "A learning paradigm where the algorithm can query for labels on specific data points",
          "Dynamic learning processes",
        ],
        correctAnswer: 2,
        explanation:
          "Active learning is a learning paradigm where the algorithm can actively query a human annotator or oracle for labels on specific, carefully chosen data points to improve learning efficiency.",
      },
      {
        id: 117,
        question: "What is 'domain adaptation' in AI?",
        options: [
          "Adapting to different domains and fields",
          "Website domain adaptation",
          "Techniques to apply models trained on one domain to a different but related domain",
          "Field-specific adaptations",
        ],
        correctAnswer: 2,
        explanation:
          "Domain adaptation involves techniques to apply models trained on one domain (source) to a different but related domain (target), addressing the challenge when training and test data come from different distributions.",
      },
      {
        id: 118,
        question: "What is 'representation learning'?",
        options: [
          "Learning to represent data visually",
          "Visual representation techniques",
          "Learning useful representations or features of data automatically",
          "Data representation methods",
        ],
        correctAnswer: 2,
        explanation:
          "Representation learning involves automatically learning useful representations or features of data that can be used for various downstream tasks, rather than manually engineering features.",
      },
      {
        id: 119,
        question: "What is 'causal inference' in AI?",
        options: [
          "Inferring causes from effects",
          "Causal reasoning processes",
          "Methods to determine cause-and-effect relationships from data",
          "Effect analysis techniques",
        ],
        correctAnswer: 2,
        explanation:
          "Causal inference involves methods and techniques to determine cause-and-effect relationships from data, going beyond correlation to understand what causes what.",
      },
      {
        id: 120,
        question: "What is 'interpretable machine learning'?",
        options: [
          "Easy to understand ML concepts",
          "Translated ML documentation",
          "Machine learning models and techniques that provide understandable explanations for their decisions",
          "Clear ML implementations",
        ],
        correctAnswer: 2,
        explanation:
          "Interpretable machine learning refers to models and techniques that provide understandable, human-interpretable explanations for their decisions and predictions, crucial for trust and accountability.",
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*                               Helper Functions                             */
/* -------------------------------------------------------------------------- */

const answerLabel = ["A", "B", "C", "D"]
const labelColors = ["text-red-500", "text-blue-500", "text-orange-500", "text-purple-500"]

// Function to shuffle array and select random questions
const getRandomQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Leaderboard functions
const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("quiz-leaderboard")
  return stored ? JSON.parse(stored) : []
}

const saveToLeaderboard = (entry: LeaderboardEntry): void => {
  if (typeof window === "undefined") return
  const leaderboard = getLeaderboard()
  leaderboard.push(entry)

  // Sort by score (descending) and keep only top 100
  leaderboard.sort((a, b) => b.score - a.score)
  const top100 = leaderboard.slice(0, 100)

  localStorage.setItem("quiz-leaderboard", JSON.stringify(top100))
}

const getUserRank = (score: number): number => {
  const leaderboard = getLeaderboard()
  const sortedScores = leaderboard.map((entry) => entry.score).sort((a, b) => b - a)
  const rank = sortedScores.findIndex((s) => score >= s) + 1
  return rank === 0 ? sortedScores.length + 1 : rank
}

/* -------------------------------------------------------------------------- */
/*                                Page Component                              */
/* -------------------------------------------------------------------------- */

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  
  // Extract the id from params
  const [quizId, setQuizId] = useState<string | null>(null)
  
  useEffect(() => {
    params.then(({ id }) => setQuizId(id))
  }, [params])
  
  const quiz = quizId ? quizData[quizId] : null

  // Generate 10 random questions from the 40 available
  const allQuestions = quiz?.questions ?? []
  const [questions, setQuestions] = useState<Question[]>([])
  const totalQuestions = questions.length

  // Initialize questions on component mount
  useEffect(() => {
    if (allQuestions.length > 0) {
      setQuestions(getRandomQuestions(allQuestions, 10))
    }
  }, [allQuestions])

  /* ----------------------------- Local state ----------------------------- */
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameStarted, setGameStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [points, setPoints] = useState(0)
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isSubmittingScore, setIsSubmittingScore] = useState(false)

  /* ------------------------------ Timer logic ---------------------------- */
  useEffect(() => {
    if (!gameStarted || showResult || quizCompleted) return
    if (timeLeft === 0) {
      handleTimeUp()
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, gameStarted, showResult, quizCompleted])

  const handleTimeUp = () => {
    setIncorrectAnswers((i) => i + 1)
    setShowResult(true)
    setTimeout(nextQuestion, 2000)
  }

  /* ------------------------------ Game flow ----------------------------- */
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || showResult) return
    setSelectedAnswer(index)
    const isCorrect = index === questions[currentQuestion].correctAnswer
    if (isCorrect) {
      setCorrectAnswers((c) => c + 1)
      setPoints((p) => p + 10)
    } else {
      setIncorrectAnswers((i) => i + 1)
    }
    setShowResult(true)
    setTimeout(nextQuestion, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(10)
    } else {
      setQuizCompleted(true)
      setShowNameInput(true)
    }
  }

  const handleNameSubmit = async () => {
    if ((!playerName.trim() && !user) || isSubmittingScore) return
    
    setIsSubmittingScore(true)
    
    try {
      const percentage = (correctAnswers / totalQuestions) * 100
      
      if (user) {
        // User is authenticated - save to database
        const submission = {
          quizType: quizId || 'unknown', // Use the URL parameter as quiz type
          score: points,
          percentage,
          timeTaken: (totalQuestions * 10) - timeLeft, // Approximate time taken
          questionsAsked: totalQuestions,
          correctAnswers,
          answersData: {} // Could store detailed answers if needed
        }
        
        const result = await quizAPI.submitQuiz(submission)
        setQuizResult(result)
        setUserRank(result.rank?.rank_in_type || null)
        
        console.log('Quiz submitted successfully:', result)
      } else {
        // User not authenticated - use localStorage fallback
        if (!playerName.trim()) return
        
        const entry: LeaderboardEntry = {
          name: playerName.trim(),
          score: points,
          percentage,
          quizType: quiz.title,
          timestamp: Date.now(),
        }
        saveToLeaderboard(entry)
        const rank = getUserRank(points)
        setUserRank(rank)
      }
      
      setShowNameInput(false)
      setShowLeaderboard(true)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      // Fallback to localStorage on error
      if (playerName.trim()) {
        const percentage = (correctAnswers / totalQuestions) * 100
        const entry: LeaderboardEntry = {
          name: playerName.trim(),
          score: points,
          percentage,
          quizType: quiz.title,
          timestamp: Date.now(),
        }
        saveToLeaderboard(entry)
        const rank = getUserRank(points)
        setUserRank(rank)
        setShowNameInput(false)
        setShowLeaderboard(true)
      }
    } finally {
      setIsSubmittingScore(false)
    }
  }

  const resetQuiz = () => {
    // Generate new random questions
    const newQuestions = getRandomQuestions(allQuestions, 10)
    setQuestions(newQuestions)

    // Reset all state
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setCorrectAnswers(0)
    setIncorrectAnswers(0)
    setTimeLeft(10)
    setShowResult(false)
    setQuizCompleted(false)
    setGameStarted(true)
    setPoints(0)
    setShowNameInput(false)
    setShowLeaderboard(false)
    setPlayerName("")
    setUserRank(null)
  }

  /* ------------------------------- UI bits ------------------------------ */
  if (!quiz) {
    return (
      <Centered>
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Back Home
        </button>
      </Centered>
    )
  }

  if (questions.length === 0) {
    return (
      <Centered>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </Centered>
    )
  }

  /* ------------- Start screen ------------- */
  if (!gameStarted) {
    return (
      <Centered>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <h1 className="text-2xl font-bold dark:text-white mb-4">{quiz.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to test your knowledge? You&apos;ll have 10&nbsp;seconds per question.
          </p>
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-500 mb-2">{totalQuestions}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Questions</div>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </Centered>
    )
  }

  /* ------------- Name input screen ------------- */
  if (showNameInput) {
    return (
      <Centered>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white mb-4">Quiz Complete!</h1>
          <div className="space-y-4 mb-6">
            <StatBlock label="Correct Answers" value={`${correctAnswers}/${totalQuestions}`} color="text-blue-500" />
            <StatBlock label="Points Earned" value={`${points}`} color="text-green-500" />
            <StatBlock label="Score" value={`${((correctAnswers / totalQuestions) * 100).toFixed(0)}%`} />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {user ? `Save your score, ${user.user_metadata?.full_name || user.email}!` : 'Enter your name for the leaderboard:'}
              </span>
            </div>
            {!user && (
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                maxLength={20}
              />
            )}
          </div>

          <div className="flex gap-3">
            <ActionButton 
              onClick={handleNameSubmit} 
              variant="primary" 
              disabled={(!playerName.trim() && !user) || isSubmittingScore}
            >
              {isSubmittingScore ? 'Saving...' : user ? 'Save to Leaderboard' : 'Save Score'}
            </ActionButton>
            <ActionButton onClick={() => setShowNameInput(false)} variant="secondary">
              Skip
            </ActionButton>
          </div>
        </div>
      </Centered>
    )
  }

  /* ------------- Leaderboard screen ------------- */
  if (showLeaderboard) {
    const leaderboard = getLeaderboard()
    const percentage = (correctAnswers / totalQuestions) * 100

    return (
      <Centered>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full shadow-xl">
          <div className="text-center mb-6">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold dark:text-white mb-2">Leaderboard</h1>
            {userRank && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">Your Rank: #{userRank}</span>
              </div>
            )}
          </div>

          <div className="mb-6 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No scores yet. Be the first to set a record!
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.name}-${entry.timestamp}`}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.name === playerName && Math.abs(entry.score - points) < 1
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-600"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold dark:text-white flex items-center gap-2">
                          {entry.name}
                          {entry.name === playerName && Math.abs(entry.score - points) < 1 && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.quizType} • {entry.percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg dark:text-white">{entry.score}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <ActionButton onClick={resetQuiz} variant="primary" icon={RotateCcw}>
              Try Again
            </ActionButton>
            <ActionButton onClick={() => router.push("/")} variant="secondary">
              Back Home
            </ActionButton>
          </div>
        </div>
      </Centered>
    )
  }

  /* ------------- Completion screen ------------- */
  if (quizCompleted) {
    const percentage = (correctAnswers / totalQuestions) * 100
    const pointsEarned = correctAnswers * 10
    return (
      <Centered>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white mb-4">Quiz Complete!</h1>
          <div className="space-y-4 mb-6">
            <StatBlock label="Correct Answers" value={`${correctAnswers}/${totalQuestions}`} color="text-blue-500" />
            <StatBlock label="Points Earned" value={`+${pointsEarned}`} color="text-green-500" />
            <StatBlock label="Score" value={`${percentage.toFixed(0)}%`} />
          </div>
          <div className="flex gap-3">
            <ActionButton onClick={resetQuiz} variant="primary" icon={RotateCcw}>
              Try Again
            </ActionButton>
            <ActionButton onClick={() => router.push("/")} variant="secondary">
              Back Home
            </ActionButton>
          </div>
        </div>
      </Centered>
    )
  }

  /* ------------- Active quiz ------------- */
  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-xl font-bold dark:text-white">{quiz.title}</h1>
          <div />
        </div>

        {/* Game Stats */}
        <div className="flex items-center justify-between">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-full font-semibold">Points: {points}</div>

          <div className="flex items-center gap-4">
            <Badge value={correctAnswers} color="green" Icon={CheckCircle} />
            <Badge value={incorrectAnswers} color="red" Icon={XCircle} />
          </div>

          <div className="bg-white rounded-full px-4 py-2 shadow-sm font-semibold">
            {currentQuestion + 1}/{totalQuestions}
          </div>
        </div>

        {/* Timer */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-500 font-semibold">Timer: {timeLeft}</span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Level: 1</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold dark:text-white mb-4">{currentQ.question}</h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showResult}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${getAnswerColor(
                      idx,
                      currentQ.correctAnswer,
                      selectedAnswer,
                      showResult,
                    )}`}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${getLabelColor(
                          idx,
                          currentQ.correctAnswer,
                          selectedAnswer,
                          showResult,
                        )}`}
                      >
                        {answerLabel[idx]}
                      </div>
                      <span className="font-medium">{opt}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Explanation:</h3>
                    <p className="text-gray-600 dark:text-gray-400">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">{children}</div>
  )
}

function StatBlock({
  label,
  value,
  color = "text-gray-800 dark:text-gray-200",
}: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

function ActionButton({
  onClick,
  variant,
  icon: Icon,
  children,
  disabled = false,
}: {
  onClick: () => void
  variant: "primary" | "secondary"
  icon?: React.ComponentType<{ size?: number }>
  children: React.ReactNode
  disabled?: boolean
}) {
  const baseClasses = "flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
      : "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  )
}

function Badge({
  value,
  color,
  Icon,
}: { value: number; color: "green" | "red"; Icon: React.ComponentType<{ size?: number }> }) {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colorClasses[color]}`}>
      <Icon size={16} />
      <span className="font-semibold">{value}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Styling Functions                            */
/* -------------------------------------------------------------------------- */

function getAnswerColor(
  optionIndex: number,
  correctIndex: number,
  selectedIndex: number | null,
  showResult: boolean,
): string {
  if (!showResult) {
    return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
  }

  if (optionIndex === correctIndex) {
    return "border-green-500 bg-green-50 dark:bg-green-900/20"
  }

  if (optionIndex === selectedIndex && optionIndex !== correctIndex) {
    return "border-red-500 bg-red-50 dark:bg-red-900/20"
  }

  return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50"
}

function getLabelColor(
  optionIndex: number,
  correctIndex: number,
  selectedIndex: number | null,
  showResult: boolean,
): string {
  if (!showResult) {
    return `bg-gray-100 dark:bg-gray-700 ${labelColors[optionIndex]}`
  }

  if (optionIndex === correctIndex) {
    return "bg-green-500 text-white"
  }

  if (optionIndex === selectedIndex && optionIndex !== correctIndex) {
    return "bg-red-500 text-white"
  }

  return "bg-gray-100 dark:bg-gray-700 text-gray-400"
}
