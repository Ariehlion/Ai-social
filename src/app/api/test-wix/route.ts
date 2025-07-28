import { NextRequest, NextResponse } from 'next/server'
import { wixService } from '@/lib/wix'

export async function GET(request: NextRequest) {
  console.log('🧪 Testing Wix API connection...')
  
  try {
    // First try account-level API to list sites
    console.log('🔍 Trying to list sites in your account...')
    
    const sitesResponse = await fetch('https://www.wixapis.com/site-list/v2/sites', {
      headers: {
        'Authorization': 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjdjNmJiOTRjLTRiODItNGY0OC05ZmRiLTViMWQzMDg1NGRlNVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU2NDA2NmRhLWE4NmUtNDhmYS05MDVhLWVlM2JmOTEyYjk4N1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIxZmRmOGY3Zi04NDVlLTRkZWMtYmU1My1iYTk4MWZjOWM2OTFcIn19IiwiaWF0IjoxNzUzMzU4ODQ4fQ.V9kFxJB_-0J1pPuRq2FFJWNiKrJOQFAxA06x3kRXSRRaGkpO2wve1wSFZKQBhAaO-AhGIeQ2uNJwtbRatqfNLlGDg46VvsJByK6G823vZKoZ-nnALhTfxZ8MbcQHwcRfQ3IBExUo7P84O4OO1HG80Wk8TFHmZpy7_j44yaCPstFlfimVAyrlM_2aamsfYO9Uf88zf1c7hlabfPFsTstqUczNYjNydngJGzjhaNv21ioHSAIfR13UwPgcMHBPwpD_ZymLGLsW6jVmKQ1LGK6eUyqsUHqvq_1QV450aN1fgI5MrwiOsDNkr3czETt-Ock1Q7s7OClh_rypLWBIPnO-tQ',
        'wix-account-id': '1fdf8f7f-845e-4dec-be53-ba981fc9c691',
        'Content-Type': 'application/json'
      }
    })

    const sitesText = await sitesResponse.text()
    console.log('Sites response status:', sitesResponse.status)
    console.log('Sites response:', sitesText)

    if (sitesResponse.ok) {
      const sitesData = JSON.parse(sitesText)
      const sites = sitesData.sites || []
      
      return NextResponse.json({
        success: true,
        connected: true,
        message: `API key works! Found ${sites.length} sites in your account`,
        accountId: '1fdf8f7f-845e-4dec-be53-ba981fc9c691',
        sitesCount: sites.length,
        sites: sites.map(site => ({
          id: site.id,
          displayName: site.displayName,
          url: site.url,
          status: site.status
        }))
      })
    } else {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Failed to authenticate with Wix API',
        status: sitesResponse.status,
        statusText: sitesResponse.statusText,
        response: sitesText,
        hint: 'You might need to create a Wix site first'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Wix test error:', error)
    return NextResponse.json({
      success: false,
      connected: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}