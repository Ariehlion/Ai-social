'use client'

import { useState } from 'react'

interface WixIntegrationProps {
  title?: string
  content?: string
  platform?: string
}

export default function WixIntegration({ title, content, platform }: WixIntegrationProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [wixConnected, setWixConnected] = useState<boolean | null>(null)

  const checkWixConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/wix')
      const data = await response.json()
      setWixConnected(data.wixConnected)
      
      if (data.wixConnected) {
        setStatus('✅ Connected to Wix via OAuth!')
      } else {
        setStatus(data.message || `❌ Wix OAuth connection failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setStatus('❌ Error: Failed to test Wix connection. Check console for details.')
      setWixConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const publishToWixBlog = async () => {
    if (!title || !content || !platform) {
      setStatus('Please generate content first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/wix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'publishToBlog',
          title,
          content,
          platform
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setStatus('Successfully published to Wix blog!')
      } else {
        setStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setStatus('Failed to publish to Wix blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-white shadow-lg border border-gray-200">
      <div className="card-body">
        <h3 className="card-title text-xl mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Wix Integration
        </h3>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Wix Connection</span>
            <div className="flex items-center gap-2">
              {wixConnected === null ? (
                <span className="text-gray-500">Unknown</span>
              ) : wixConnected ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 text-sm">Disconnected</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={checkWixConnection}
              disabled={loading}
              className="btn btn-outline btn-sm"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                'Test Connection'
              )}
            </button>

            {title && content && (
              <button
                onClick={publishToWixBlog}
                disabled={loading || !wixConnected}
                className="btn bg-black text-white hover:bg-gray-800 btn-sm"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish to Wix Blog
                  </>
                )}
              </button>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div className={`alert ${
              status.includes('Success') || status.includes('Connected') 
                ? 'alert-success' 
                : 'alert-error'
            }`}>
              <span className="text-sm">{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}