# AI Social Content Generator

A web application that transforms blog articles into engaging social media posts for multiple platforms using AI.

## Features

- **User Authentication**: Email/password authentication using Supabase Auth
- **Multi-Platform Support**: Generate posts for Twitter, LinkedIn, Instagram, and Facebook
- **AI-Powered Generation**: Uses Google Gemini AI to create platform-specific content
- **Usage Tracking**: Daily generation limits (5 for free users, 50 for pro users)
- **Content Management**: Save and manage generated posts
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI
- **Deployment**: Vercel-ready

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-social-generator
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the schema from `supabase-schema.sql`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3.1 Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated API key
4. Add it to your `.env.local` file as `GEMINI_API_KEY`

### 4. Database Setup

The application includes a complete database schema in `supabase-schema.sql`. This creates:

- `posts` table for storing generated social media posts
- `user_profiles` table for user data and usage tracking
- Row Level Security (RLS) policies
- Automatic user profile creation on signup
- Daily generation tracking

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Generate Posts**: 
   - Paste your blog article content or URL
   - Select target platform (Twitter, LinkedIn, Instagram, Facebook)
   - Click "Generate Posts" to create 3-5 variations
3. **Save Posts**: Click "Save Post" on any generated content you like
4. **View Saved Posts**: Switch to the "Saved Posts" tab to manage your saved content

## Features in Detail

### Platform-Specific Generation

- **Twitter**: 280 character limit, hashtags, engaging tone
- **LinkedIn**: Professional content, longer form, business focus
- **Instagram**: Visual-friendly captions, hashtags, engaging hooks
- **Facebook**: Casual tone, shareable content, broad appeal

### Usage Limits

- **Free Users**: 5 generations per day
- **Pro Users**: 50 generations per day
- Limits reset daily automatically

### Content Input

- **Text Input**: Paste blog article content directly
- **URL Input**: Provide a blog article URL (content will be fetched and processed)

## Project Structure

```
src/
├── app/
│   ├── api/generate/         # AI generation API route
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main dashboard
│   └── page.tsx              # Root page (redirects to auth)
├── components/
│   ├── auth/                 # Authentication components
│   └── dashboard/            # Dashboard components
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── types.ts             # TypeScript type definitions
└── middleware.ts            # Authentication middleware
```

## Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Security Features

- Row Level Security (RLS) on all database tables
- Secure API routes with user authentication
- Environment variable protection
- Input validation and sanitization

## Future Enhancements

- Payment integration (Stripe)
- Advanced analytics
- Team collaboration features
- More social media platforms
- Custom AI prompt templates
- Bulk generation capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
