'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import Modal from '../../components/Modal'
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Search,
  Package,
  FileText,
  Users,
  AlertTriangle,
  Info,
  TrendingUp,
  MessageSquare,
  Settings,
  Calendar,
  Clock,
  Eye,
  Archive,
  Star,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'order' | 'product' | 'blog' | 'customer' | 'system' | 'training' | 'message'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  timestamp: string
  read: boolean
  starred: boolean
  actionUrl?: string
  metadata?: {
    orderId?: string
    productId?: string
    customerId?: string
    amount?: number
  }
}

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null)

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      priority: 'high',
      title: 'New Order Received',
      message: 'Order #1234 for Premium Kashmiri Saffron 5g has been placed by John Doe',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      starred: false,
      actionUrl: '/dashboard/orders/1234',
      metadata: { orderId: '1234', amount: 2500 }
    },
    {
      id: '2',
      type: 'product',
      priority: 'medium',
      title: 'Low Stock Alert',
      message: 'Premium Kashmiri Saffron 2g is running low (5 units remaining)',
      timestamp: '2024-01-20T09:15:00Z',
      read: false,
      starred: true,
      actionUrl: '/dashboard/products',
      metadata: { productId: 'saffron-2g' }
    },
    {
      id: '3',
      type: 'blog',
      priority: 'low',
      title: 'Blog Post Published',
      message: 'Your blog post "Health Benefits of Saffron" has been published successfully',
      timestamp: '2024-01-20T08:45:00Z',
      read: true,
      starred: false,
      actionUrl: '/dashboard/blog'
    },
    {
      id: '4',
      type: 'customer',
      priority: 'medium',
      title: 'New Customer Inquiry',
      message: 'Sarah Wilson has sent a message about bulk saffron pricing',
      timestamp: '2024-01-19T16:20:00Z',
      read: false,
      starred: false,
      actionUrl: '/dashboard/contact',
      metadata: { customerId: 'customer-456' }
    },
    {
      id: '5',
      type: 'system',
      priority: 'urgent',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin at 2:00 AM tomorrow. Expected duration: 2 hours',
      timestamp: '2024-01-19T14:00:00Z',
      read: true,
      starred: true
    },
    {
      id: '6',
      type: 'training',
      priority: 'medium',
      title: 'New Training Enrollment',
      message: 'Michael Chen has enrolled in "Saffron Quality Assessment" course',
      timestamp: '2024-01-19T11:30:00Z',
      read: false,
      starred: false,
      actionUrl: '/dashboard/training'
    },
    {
      id: '7',
      type: 'message',
      priority: 'low',
      title: 'WhatsApp Message',
      message: 'New message received via WhatsApp business account',
      timestamp: '2024-01-19T10:15:00Z',
      read: true,
      starred: false
    },
    {
      id: '8',
      type: 'order',
      priority: 'high',
      title: 'Payment Confirmed',
      message: 'Payment for Order #1233 has been confirmed. Ready for processing.',
      timestamp: '2024-01-18T15:45:00Z',
      read: true,
      starred: false,
      actionUrl: '/dashboard/orders/1233',
      metadata: { orderId: '1233', amount: 1800 }
    }
  ])

  const [filterSettings, setFilterSettings] = useState({
    types: [] as string[],
    priorities: [] as string[],
    readStatus: 'all' as 'all' | 'read' | 'unread',
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month'
  })

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'starred', label: 'Starred', count: notifications.filter(n => n.starred).length },
    { id: 'orders', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ]

  const getNotificationIcon = (type: string) => {
    const icons = {
      order: Package,
      product: Package,
      blog: FileText,
      customer: Users,
      system: Settings,
      training: Users,
      message: MessageSquare
    }
    return icons[type as keyof typeof icons] || Bell
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500 bg-gray-100',
      medium: 'text-blue-600 bg-blue-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-500 bg-gray-100'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} min ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'unread' && notification.read) return false
    if (activeTab === 'starred' && !notification.starred) return false
    if (activeTab === 'orders' && notification.type !== 'order') return false
    if (activeTab === 'system' && notification.type !== 'system') return false

    // Search filter
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    toast.success('Marked as read')
  }

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: false } : n
    ))
    toast.success('Marked as unread')
  }

  const handleToggleStar = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ))
    const notification = notifications.find(n => n.id === id)
    toast.success(notification?.starred ? 'Removed from starred' : 'Added to starred')
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
    setShowDeleteModal(false)
    setNotificationToDelete(null)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const handleBulkAction = (action: string) => {
    if (selectedNotifications.length === 0) {
      toast.error('Please select notifications first')
      return
    }

    switch (action) {
      case 'read':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, read: true } : n
        ))
        toast.success(`${selectedNotifications.length} notifications marked as read`)
        break
      case 'unread':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, read: false } : n
        ))
        toast.success(`${selectedNotifications.length} notifications marked as unread`)
        break
      case 'star':
        setNotifications(prev => prev.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, starred: true } : n
        ))
        toast.success(`${selectedNotifications.length} notifications starred`)
        break
      case 'delete':
        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
        toast.success(`${selectedNotifications.length} notifications deleted`)
        break
    }
    setSelectedNotifications([])
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  return (
    <DashboardLayout title="Notifications">
      <div className="space-responsive">
        {/* Header */}
        <div className="flex-responsive-between gap-4">
          <div>
            <h2 className="heading-responsive-xl text-admin-800">Notifications</h2>
            <p className="text-responsive-sm text-admin-600">
              Stay updated with your business activities and system alerts
            </p>
          </div>
          <div className="flex-responsive gap-responsive-sm">
            <button
              onClick={handleMarkAllAsRead}
              className="btn-ghost"
            >
              <CheckCheck className="icon-responsive-sm mr-2" />
              Mark All Read
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost"
            >
              <Filter className="icon-responsive-sm mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-responsive-xs text-admin-600">Total</p>
                <p className="text-responsive-lg font-bold text-admin-800">{notifications.length}</p>
              </div>
              <Bell className="icon-responsive-md text-saffron-600" />
            </div>
          </div>
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-responsive-xs text-admin-600">Unread</p>
                <p className="text-responsive-lg font-bold text-red-600">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <BellOff className="icon-responsive-md text-red-600" />
            </div>
          </div>
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-responsive-xs text-admin-600">Starred</p>
                <p className="text-responsive-lg font-bold text-yellow-600">
                  {notifications.filter(n => n.starred).length}
                </p>
              </div>
              <Star className="icon-responsive-md text-yellow-600" />
            </div>
          </div>
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-responsive-xs text-admin-600">High Priority</p>
                <p className="text-responsive-lg font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="icon-responsive-md text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card">
          {/* Search and Tabs */}
          <div className="space-responsive-sm">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 icon-responsive-sm" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-admin-200">
              <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-thin">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-responsive-xs sm:text-responsive-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-saffron-500 text-saffron-600'
                        : 'border-transparent text-admin-500 hover:text-admin-700 hover:border-admin-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-saffron-100 text-saffron-700' 
                        : 'bg-admin-100 text-admin-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="flex-responsive-between gap-4 p-3 bg-saffron-50 rounded-lg border border-saffron-200">
                <div className="flex items-center space-x-2">
                  <span className="text-responsive-sm text-saffron-700 font-medium">
                    {selectedNotifications.length} selected
                  </span>
                </div>
                <div className="flex-responsive gap-responsive-sm">
                  <button
                    onClick={() => handleBulkAction('read')}
                    className="btn-ghost text-xs"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleBulkAction('unread')}
                    className="btn-ghost text-xs"
                  >
                    Mark Unread
                  </button>
                  <button
                    onClick={() => handleBulkAction('star')}
                    className="btn-ghost text-xs"
                  >
                    Star
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="btn-danger text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-responsive-sm">
            {/* Select All */}
            <div className="flex items-center justify-between py-2 border-b border-admin-100">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-saffron-600 bg-gray-100 border-gray-300 rounded focus:ring-saffron-500 focus:ring-2"
                />
                <span className="text-responsive-xs text-admin-600">Select all</span>
              </label>
              <span className="text-responsive-xs text-admin-500">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Notifications */}
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-admin-300 mx-auto mb-4" />
                <h3 className="heading-responsive-sm text-admin-500 mb-2">No notifications found</h3>
                <p className="text-responsive-xs text-admin-400">
                  {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        notification.read 
                          ? 'bg-white border-admin-100' 
                          : 'bg-saffron-50 border-saffron-200'
                      } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-saffron-300' : ''}`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications(prev => [...prev, notification.id])
                          } else {
                            setSelectedNotifications(prev => prev.filter(id => id !== notification.id))
                          }
                        }}
                        className="w-4 h-4 text-saffron-600 bg-gray-100 border-gray-300 rounded focus:ring-saffron-500 focus:ring-2 mt-1"
                      />

                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                        <Icon className="icon-responsive-sm" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-responsive-sm font-medium truncate ${
                              notification.read ? 'text-admin-700' : 'text-admin-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-responsive-xs mt-1 ${
                              notification.read ? 'text-admin-500' : 'text-admin-600'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-responsive-xs text-admin-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <span className={`status-badge ${
                                notification.priority === 'urgent' ? 'status-active' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => handleToggleStar(notification.id)}
                              className={`p-1 rounded hover:bg-admin-100 transition-colors ${
                                notification.starred ? 'text-yellow-500' : 'text-admin-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${notification.starred ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => notification.read ? handleMarkAsUnread(notification.id) : handleMarkAsRead(notification.id)}
                              className="p-1 rounded hover:bg-admin-100 transition-colors text-admin-400"
                            >
                              {notification.read ? <Eye className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setNotificationToDelete(notification.id)
                                setShowDeleteModal(true)
                              }}
                              className="p-1 rounded hover:bg-admin-100 transition-colors text-admin-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Notification"
          size="md"
        >
          <div className="padding-responsive space-responsive">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="heading-responsive-md text-admin-800 mb-2">Delete Notification</h3>
              <p className="text-responsive-sm text-admin-600">
                Are you sure you want to delete this notification? This action cannot be undone.
              </p>
            </div>

            <div className="flex-responsive justify-end gap-responsive-sm pt-4 border-t border-admin-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-ghost btn-mobile"
              >
                Cancel
              </button>
              <button
                onClick={() => notificationToDelete && handleDeleteNotification(notificationToDelete)}
                className="btn-danger btn-mobile"
              >
                <Trash2 className="icon-responsive-sm mr-2" />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default NotificationsPage