'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { 
  Package, 
  FileText, 
  Eye,
  MessageSquare
} from 'lucide-react'
import { statsApi, DashboardStats } from '@/lib/api'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils/formatters'

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await statsApi.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'from-saffron-400 to-saffron-600'
    },
    {
      title: 'Total Blogs',
      value: stats?.totalBlogs || 0,
      icon: FileText,
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Gallery Images',
      value: stats?.totalGalleryImages || 0,
      icon: Eye,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Contact Messages',
      value: stats?.totalContacts || 0,
      change: `${stats?.unreadContacts || 0} unread`,
      icon: MessageSquare,
      color: 'from-green-400 to-green-600'
    },
  ]

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-responsive">
        {/* Stats Cards */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-compact"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-admin-500 text-responsive-xs font-medium truncate-responsive">{stat.title}</p>
                  <p className="text-responsive-lg font-bold text-admin-800 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-green-600 text-responsive-xs font-medium mt-1">{stat.change}</p>
                  )}
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="icon-responsive-md text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-compact"
          >
            <h3 className="text-responsive-base font-semibold text-admin-800 mb-3">Pending Comments</h3>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-saffron-600">{stats?.pendingComments || 0}</p>
              <p className="text-admin-500 text-sm mt-1">Awaiting approval</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card-compact"
          >
            <h3 className="text-responsive-base font-semibold text-admin-800 mb-3">Pending Reviews</h3>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-saffron-600">{stats?.pendingReviews || 0}</p>
              <p className="text-admin-500 text-sm mt-1">Awaiting approval</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card-compact"
          >
            <h3 className="text-responsive-base font-semibold text-admin-800 mb-3">Unread Contacts</h3>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-saffron-600">{stats?.unreadContacts || 0}</p>
              <p className="text-admin-500 text-sm mt-1">New messages</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive">
          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="card-compact"
          >
            <h3 className="text-responsive-base font-semibold text-admin-800 mb-4">Recent Contacts</h3>
            <div className="space-y-3">
              {stats?.recentActivity.contacts.map((contact) => (
                <div key={contact._id} className="flex items-center justify-between p-3 bg-admin-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-admin-800 truncate">{contact.name}</p>
                    <p className="text-sm text-admin-500 truncate">{contact.subject}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contact.isRead ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contact.isRead ? 'Read' : 'New'}
                  </span>
                </div>
              ))}
              {(!stats?.recentActivity.contacts || stats.recentActivity.contacts.length === 0) && (
                <p className="text-center text-admin-500 py-4">No recent contacts</p>
              )}
            </div>
          </motion.div>

          {/* Recent Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card-compact"
          >
            <h3 className="text-responsive-base font-semibold text-admin-800 mb-4">Recent Blogs</h3>
            <div className="space-y-3">
              {stats?.recentActivity.blogs.map((blog) => (
                <div key={blog._id} className="flex items-center justify-between p-3 bg-admin-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-admin-800 truncate">{blog.title}</p>
                    <p className="text-sm text-admin-500">
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
              {(!stats?.recentActivity.blogs || stats.recentActivity.blogs.length === 0) && (
                <p className="text-center text-admin-500 py-4">No recent blogs</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="card"
        >
          <h3 className="heading-responsive-md text-admin-800 mb-4">Quick Actions</h3>
          <div className="grid-responsive-4 gap-responsive">
            <a href="/dashboard/products" className="flex flex-col items-center padding-responsive-sm bg-saffron-50 hover:bg-saffron-100 rounded-responsive transition-colors touch-target">
              <Package className="icon-responsive-lg text-saffron-600 mb-2" />
              <span className="text-responsive-xs font-medium text-admin-800 text-center">Add Product</span>
            </a>
            <a href="/dashboard/blog" className="flex flex-col items-center padding-responsive-sm bg-blue-50 hover:bg-blue-100 rounded-responsive transition-colors touch-target">
              <FileText className="icon-responsive-lg text-blue-600 mb-2" />
              <span className="text-responsive-xs font-medium text-admin-800 text-center">New Blog Post</span>
            </a>
            <a href="/dashboard/gallery" className="flex flex-col items-center padding-responsive-sm bg-green-50 hover:bg-green-100 rounded-responsive transition-colors touch-target">
              <Eye className="icon-responsive-lg text-green-600 mb-2" />
              <span className="text-responsive-xs font-medium text-admin-800 text-center">Gallery</span>
            </a>
            <a href="/dashboard/contact" className="flex flex-col items-center padding-responsive-sm bg-purple-50 hover:bg-purple-100 rounded-responsive transition-colors touch-target">
              <MessageSquare className="icon-responsive-lg text-purple-600 mb-2" />
              <span className="text-responsive-xs font-medium text-admin-800 text-center">Messages</span>
            </a>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard