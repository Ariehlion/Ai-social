// Quick test script to verify Wix OAuth
import axios from 'axios';

const WIX_APP_ID = 'ad892b2c-32d2-41e2-b033-204ebcb64822';
const WIX_APP_SECRET = 'e98ec5b5-437c-4f85-a68b-524d853bfe5d';
const WIX_INSTANCE_ID = 'ad892b2c-32d2-41e2-b033-204ebcb64822';

async function testWixOAuth() {
  try {
    console.log('🔄 Testing Wix OAuth...');
    console.log('App ID:', WIX_APP_ID);
    console.log('Instance ID:', WIX_INSTANCE_ID);
    console.log('App Secret exists:', !!WIX_APP_SECRET);
    
    console.log('\n--- Testing WITHOUT Instance ID ---');
    const response = await axios.post('https://www.wixapis.com/oauth2/token', {
      grant_type: 'client_credentials',
      client_id: WIX_APP_ID,
      client_secret: WIX_APP_SECRET
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ OAuth Success!');
    console.log('Access Token (first 50 chars):', response.data.access_token.substring(0, 50) + '...');
    console.log('Token Type:', response.data.token_type);
    console.log('Expires In:', response.data.expires_in, 'seconds');
    
  } catch (error) {
    console.log('❌ OAuth Failed:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testWixOAuth();