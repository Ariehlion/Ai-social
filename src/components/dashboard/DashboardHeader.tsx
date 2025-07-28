'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { UserProfile } from '@/lib/types'

interface DashboardHeaderProps {
  userProfile: UserProfile | null
}

export default function DashboardHeader({ userProfile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">
              SocialAI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-sm font-bold">
                    {userProfile.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <ul tabIndex={0} className="menu dropdown-content bg-white rounded-lg z-[1] mt-3 w-64 p-2 shadow-lg border border-gray-200">
                  <li className="px-4 py-2 border-b border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-black">{userProfile.email}</span>
                      <div className="flex items-center gap-2 mt-1">
                        {userProfile.is_pro ? (
                          <span className="px-2 py-1 bg-black text-white text-xs rounded-full">Pro</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Free</span>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <button 
                      onClick={() => router.push('/profile')}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 w-full text-left p-2 rounded-lg"
                    >
                      Profile Settings
                    </button>
                  </li>
                  {!userProfile.is_pro && (
                    <li>
                      <button 
                        onClick={() => router.push('/upgrade')}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 w-full text-left p-2 rounded-lg"
                      >
                        Upgrade to Pro
                      </button>
                    </li>
                  )}
                  <li className="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left p-2 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}