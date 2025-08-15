# UTOP-AI Blog

A modern AI-focused blog platform built with Next.js, featuring AI stories, news, and interactive content.

## Features

- 🤖 AI-generated stories and content
- 📰 Latest AI news and updates
- 🎯 Interactive quizzes and activities
- 📱 Responsive design with dark mode
- 🔐 Admin dashboard for content management
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials (see GOOGLE_OAUTH_SETUP.md)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd utop-ai-blog
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# ElevenLabs (for text-to-speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── ai-stories/        # AI stories section
│   ├── news/              # News section
│   ├── collections/       # Content collections
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── public/                # Static assets
\`\`\`

## Key Features

### AI Stories
- Interactive AI-generated narratives
- Story categories and collections
- Reading progress tracking

### News Section
- Latest AI industry news
- Categorized articles
- Search and filtering

### Admin Dashboard
- Content management system
- User management
- Analytics and reporting
- Media library

### Interactive Elements
- AI quizzes and assessments
- Activity tracking
- User profiles and progress

## Development

### Adding New Components

1. Create component in `components/` directory
2. Export from appropriate index file
3. Add to Storybook if needed

### Database Schema

The application uses Supabase with the following main tables:
- `posts` - Blog posts and articles
- `users` - User profiles and authentication
- `activities` - User activity tracking
- `media` - File uploads and media management

### API Routes

- `/api/auth/*` - NextAuth.js authentication
- `/api/posts/*` - Post management
- `/api/users/*` - User management
- `/api/media/*` - Media upload and management

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Environment Variables

See `.env.example` for all required environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: support@utopai.blog

## Roadmap

- [ ] Advanced AI content generation
- [ ] Multi-language support
- [ ] Enhanced analytics dashboard
- [ ] Mobile app development
- [ ] API for third-party integrations
