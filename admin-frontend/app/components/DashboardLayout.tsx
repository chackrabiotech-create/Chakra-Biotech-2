'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const sidebarWidth = isMobile ? '' : isDesktopCollapsed ? 'lg:ml-20' : 'lg:ml-56'

  return (
    <div className="min-h-screen bg-admin-50 overflow-x-hidden">
      <Sidebar
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktop={() => setIsDesktopCollapsed(v => !v)}
      />

      <div className={`flex flex-col transition-all duration-300 ${sidebarWidth}`}>
        <Header title={title} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-80px)] w-full">
          <div className="max-w-full mx-auto w-full">
            <div className="w-full overflow-x-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
