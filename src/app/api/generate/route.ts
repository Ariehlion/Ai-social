import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Platform, GenerateRequest } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const platformPrompts = {
  twitter: `Create 3-5 engaging Twitter posts based on the following content. Each post should:
- Be under 280 characters
- Include relevant hashtags (2-3 max)
- Be engaging and encourage interaction
- Maintain a conversational tone
- Each post should offer a different angle or highlight different aspects of the content`,

  linkedin: `Create 3-5 professional LinkedIn posts based on the following content. Each post should:
- Be professional yet engaging
- Include relevant hashtags (3-5 max)
- Encourage professional discussion
- Be 1-3 paragraphs long
- Each post should target different professional audiences or angles`,

  instagram: `Create 3-5 Instagram captions based on the following content. Each caption should:
- Be engaging and visual-friendly
- Include relevant hashtags (5-10 max)
- Encourage engagement (likes, comments, shares)
- Be 1-2 paragraphs with line breaks for readability
- Each caption should have a different tone or focus`,

  facebook: `Create 3-5 Facebook posts based on the following content. Each post should:
- Be casual and conversational
- Encourage shares and comments
- Include relevant hashtags (2-4 max)
- Be engaging for a broad audience
- Each post should appeal to different demographics or interests`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient(request)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, platform }: GenerateRequest = await request.json()

    if (!content || !platform) {
      return NextResponse.json({ error: 'Content and platform are required' }, { status: 400 })
    }

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const maxGenerations = userProfile.is_pro ? 50 : 5
    const today = new Date().toISOString().split('T')[0]
    
    if (userProfile.last_generation_date !== today) {
      await supabase
        .from('user_profiles')
        .update({ 
          daily_generations: 0, 
          last_generation_date: today 
        })
        .eq('id', user.id)
      userProfile.daily_generations = 0
    }

    if (userProfile.daily_generations >= maxGenerations) {
      const remainingGenerations = maxGenerations - userProfile.daily_generations
      return NextResponse.json({ 
        error: 'Daily generation limit reached',
        remainingGenerations 
      }, { status: 429 })
    }

    const isUrl = content.trim().startsWith('http://') || content.trim().startsWith('https://')
    let contentToProcess = content

    if (isUrl) {
      try {
        const response = await fetch(content)
        const html = await response.text()
        contentToProcess = html.replace(/<[^>]*>/g, '').substring(0, 3000)
      } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content from URL' }, { status: 400 })
      }
    }

    const prompt = `${platformPrompts[platform]}

Content to transform:
${contentToProcess}

Please provide exactly 3-5 different posts, each on a new line, without numbering or bullet points. Each post should be complete and ready to publish.`

    // Initialize the Gemini model
    console.log('Initializing Gemini model...')
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY)
    console.log('Full API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10))
    console.log('Environment:', process.env.NODE_ENV)
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!')
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }
    
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Generate content using Gemini
    const fullPrompt = `You are a social media expert who creates engaging posts for different platforms. Always return posts separated by double newlines, without any numbering or formatting.\n\n${prompt}`
    
    console.log('Sending request to Gemini...')
    const result = await model.generateContent(fullPrompt)
    console.log('Received response from Gemini')

    const response = await result.response
    const generatedContent = response.text()
    const posts = generatedContent.split('\n\n').filter(post => post.trim().length > 0)

    await supabase
      .from('user_profiles')
      .update({ 
        daily_generations: userProfile.daily_generations + 1 
      })
      .eq('id', user.id)

    const remainingGenerations = maxGenerations - (userProfile.daily_generations + 1)

    return NextResponse.json({
      posts,
      remainingGenerations
    })

  } catch (error) {
    console.error('===== FULL ERROR DETAILS =====')
    console.error('Error generating content:', error)
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    console.error('===== END ERROR DETAILS =====')
    
    // More specific error handling for Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('API_KEY')) {
        return NextResponse.json({ error: 'Invalid Gemini API key' }, { status: 401 })
      }
      if (error.message.includes('quota') || error.message.includes('QUOTA')) {
        return NextResponse.json({ error: 'Gemini API quota exceeded' }, { status: 429 })
      }
      if (error.message.includes('model') || error.message.includes('MODEL')) {
        return NextResponse.json({ error: 'Invalid model or model access denied' }, { status: 400 })
      }
      console.error('Returning generic error message:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}