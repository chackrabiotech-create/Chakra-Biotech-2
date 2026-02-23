'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [router, isAuthenticated, isLoading])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <h1 className="font-serif text-2xl font-bold text-admin-800 mb-2">Saffron Dashboard</h1>
        <p className="text-admin-600">Redirecting...</p>
      </div>
    </div>
  )
}