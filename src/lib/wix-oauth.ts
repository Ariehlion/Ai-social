import axios from 'axios'

const WIX_APP_ID = process.env.WIX_APP_ID
const WIX_APP_SECRET = process.env.WIX_APP_SECRET  
const WIX_INSTANCE_ID = process.env.WIX_INSTANCE_ID

interface WixTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export class WixOAuthService {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  async getAccessToken(): Promise<string> {
    // For now, return a mock token since we don't have a real Wix site
    console.log('🔄 Mock Wix authentication (no real site needed)')
    console.log('📱 App ID:', WIX_APP_ID)
    console.log('🚫 No Wix site found - using mock authentication')
    
    // Simulate a token for development
    this.accessToken = 'mock-wix-token-for-development'
    this.tokenExpiry = Date.now() + 3600000 // 1 hour
    
    return this.accessToken
  }

  async makeAuthenticatedRequest(endpoint: string, options: any = {}) {
    const token = await this.getAccessToken()
    
    return axios({
      ...options,
      url: endpoint,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }
}

export const wixOAuth = new WixOAuthService()