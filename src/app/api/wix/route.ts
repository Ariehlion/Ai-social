import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { wixService } from '@/lib/wix'
import { wixOAuth } from '@/lib/wix-oauth'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient(request)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, title, content, platform } = await request.json()

    switch (action) {
      case 'publishToBlog':
        if (!title || !content || !platform) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const result = await wixService.publishToWixBlog(title, content, platform)
        
        // Save to database for tracking
        const { error: dbError } = await supabase
          .from('posts')
          .insert([
            {
              user_id: user.id,
              original_content: title,
              platform: 'wix-blog',
              generated_text: content,
              metadata: { wix_post_id: result.post?.id }
            },
          ])

        if (dbError) {
          console.error('Database error:', dbError)
        }

        return NextResponse.json({ 
          success: true, 
          wixPost: result,
          message: 'Content published to Wix blog successfully!'
        })

      case 'listCollections':
        const collections = await wixService.listCollections()
        return NextResponse.json({ collections })

      case 'ping':
        const isConnected = await wixService.ping()
        return NextResponse.json({ 
          connected: isConnected,
          message: isConnected ? 'Wix API connected successfully' : 'Failed to connect to Wix API'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Wix API error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient(request)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Checking Wix OAuth credentials...')
    console.log('App ID exists:', !!process.env.WIX_APP_ID)
    console.log('App Secret exists:', !!process.env.WIX_APP_SECRET)  
    console.log('Instance ID exists:', !!process.env.WIX_INSTANCE_ID)

    // Check if we have the required OAuth credentials
    if (!process.env.WIX_APP_ID || !process.env.WIX_APP_SECRET || !process.env.WIX_INSTANCE_ID) {
      return NextResponse.json({
        wixConnected: false,
        hasApiKey: false,
        message: 'Missing Wix OAuth credentials. Check WIX_APP_ID, WIX_APP_SECRET, and WIX_INSTANCE_ID in .env.local'
      })
    }

    // Test the OAuth connection
    try {
      const isConnected = await wixService.ping()
      
      return NextResponse.json({
        wixConnected: isConnected,
        siteId: process.env.WIX_SITE_ID,
        hasApiKey: true,
        message: isConnected ? 'Successfully connected to Wix via OAuth!' : 'OAuth credentials valid but connection failed'
      })
    } catch (oauthError: any) {
      console.error('OAuth connection error:', oauthError.message)
      
      return NextResponse.json({
        wixConnected: false,
        hasApiKey: true,
        message: `OAuth failed: ${oauthError.message}`,
        error: oauthError.message
      })
    }

  } catch (error) {
    console.error('Wix status check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check Wix connection' 
    }, { status: 500 })
  }
}