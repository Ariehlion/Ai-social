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
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="flex items-center">
          <div className="avatar placeholder mr-3">
            <div className="bg-primary text-primary-content w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Social Generator
            </h1>
            <p className="text-xs opacity-60">Transform content into social posts</p>
          </div>
        </div>
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-4">
          {userProfile && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {userProfile.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-2 shadow-lg border">
                <li className="menu-title">
                  <span>Account Info</span>
                </li>
                <li>
                  <div className="flex flex-col py-2">
                    <span className="font-medium text-sm">{userProfile.email}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {userProfile.is_pro ? (
                        <div className="badge badge-warning badge-sm gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Pro
                        </div>
                      ) : (
                        <div className="badge badge-ghost badge-sm">Free</div>
                      )}
                    </div>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 text-sm hover:bg-base-200 cursor-pointer w-full text-left p-2 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/preferences')}
                    className="flex items-center gap-2 text-sm hover:bg-base-200 cursor-pointer w-full text-left p-2 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferences
                  </button>
                </li>
                {!userProfile.is_pro && (
                  <li>
                    <button 
                      onClick={() => router.push('/upgrade')}
                      className="flex items-center gap-2 text-sm text-warning hover:bg-base-200 cursor-pointer w-full text-left p-2 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Upgrade to Pro
                    </button>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-error hover:bg-error hover:text-error-content w-full text-left p-2 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}