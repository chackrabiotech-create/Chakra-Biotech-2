'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import Modal from '../../components/Modal'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  Upload, 
  Camera,
  Award,
  Clock,
  Activity,
  TrendingUp,
  Package,
  FileText,
  Users,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@saffronshop.com',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    avatar: '',
    bio: 'Passionate about bringing the finest quality saffron from Kashmir to customers worldwide. Managing operations with dedication to quality and customer satisfaction.',
    location: 'Kashmir, India',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    timezone: 'Asia/Kolkata',
    language: 'English',
    department: 'Administration',
    employeeId: 'EMP001',
    website: 'https://goldenbloomsaffron.com',
    linkedin: 'https://linkedin.com/in/admin-user',
    twitter: '@saffronadmin'
  })

  const [activityStats] = useState({
    totalLogins: 1247,
    productsManaged: 45,
    ordersProcessed: 892,
    blogPostsWritten: 28,
    customersHelped: 156,
    averageRating: 4.9
  })

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'product',
      action: 'Created new product',
      item: 'Premium Kashmiri Saffron 2g',
      timestamp: '2024-01-20T09:15:00Z',
      icon: Package
    },
    {
      id: 2,
      type: 'order',
      action: 'Processed order',
      item: 'Order #1234',
      timestamp: '2024-01-20T08:30:00Z',
      icon: TrendingUp
    },
    {
      id: 3,
      type: 'blog',
      action: 'Published blog post',
      item: 'Health Benefits of Saffron',
      timestamp: '2024-01-19T16:45:00Z',
      icon: FileText
    },
    {
      id: 4,
      type: 'customer',
      action: 'Responded to inquiry',
      item: 'Customer support ticket',
      timestamp: '2024-01-19T14:20:00Z',
      icon: Users
    },
    {
      id: 5,
      type: 'system',
      action: 'Updated settings',
      item: 'Notification preferences',
      timestamp: '2024-01-19T11:10:00Z',
      icon: Activity
    }
  ])

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleAvatarUpload = () => {
    toast.success('Avatar updated successfully!')
    setShowAvatarModal(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityColor = (type: string) => {
    const colors = {
      product: 'bg-saffron-100 text-saffron-700',
      order: 'bg-green-100 text-green-700',
      blog: 'bg-blue-100 text-blue-700',
      customer: 'bg-purple-100 text-purple-700',
      system: 'bg-gray-100 text-gray-700'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <DashboardLayout title="Profile">
      <div className="space-responsive">
        {/* Header */}
        <div className="flex-responsive-between gap-4">
          <div>
            <h2 className="heading-responsive-xl text-admin-800">My Profile</h2>
            <p className="text-responsive-sm text-admin-600">Manage your personal information and account details</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? (
              <>
                <Save className="icon-responsive-sm mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="icon-responsive-sm mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid-responsive-3 gap-responsive">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-admin-200">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
                    )}
                  </div>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute -bottom-1 -right-1 p-2 bg-saffron-500 text-white rounded-full hover:bg-saffron-600 transition-colors touch-target"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-responsive-xl font-bold text-admin-800">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-responsive-sm text-admin-600 mb-1">{profileData.role}</p>
                  <p className="text-responsive-xs text-admin-500">{profileData.department}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-responsive-xs font-medium">{activityStats.averageRating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-admin-400" />
                      <span className="text-responsive-xs text-admin-500">
                        Joined {formatDate(profileData.joinDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-responsive">
                <div>
                  <h4 className="heading-responsive-sm text-admin-800 mb-4">Personal Information</h4>
                  <div className="form-grid gap-responsive">
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-responsive-sm text-admin-800">{profileData.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-responsive-sm text-admin-800">{profileData.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="icon-responsive-sm text-admin-400" />
                        {isEditing ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="input-field"
                          />
                        ) : (
                          <p className="text-responsive-sm text-admin-800">{profileData.email}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">Phone</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="icon-responsive-sm text-admin-400" />
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="input-field"
                          />
                        ) : (
                          <p className="text-responsive-sm text-admin-800">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">Location</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="icon-responsive-sm text-admin-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="input-field"
                          />
                        ) : (
                          <p className="text-responsive-sm text-admin-800">{profileData.location}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-2">Employee ID</label>
                      <p className="text-responsive-sm text-admin-800">{profileData.employeeId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="textarea-field"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-responsive-sm text-admin-700 leading-relaxed">{profileData.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4 border-t border-admin-200">
                    <div className="flex-responsive gap-responsive-sm">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn-ghost btn-mobile"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary btn-mobile"
                      >
                        <Save className="icon-responsive-sm mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Activity Sidebar */}
          <div className="space-responsive">
            {/* Activity Stats */}
            <div className="card">
              <h4 className="heading-responsive-sm text-admin-800 mb-4">Activity Overview</h4>
              <div className="space-responsive-sm">
                <div className="flex items-center justify-between">
                  <span className="text-responsive-xs text-admin-600">Total Logins</span>
                  <span className="text-responsive-sm font-semibold text-admin-800">{activityStats.totalLogins.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-responsive-xs text-admin-600">Products Managed</span>
                  <span className="text-responsive-sm font-semibold text-admin-800">{activityStats.productsManaged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-responsive-xs text-admin-600">Orders Processed</span>
                  <span className="text-responsive-sm font-semibold text-admin-800">{activityStats.ordersProcessed.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-responsive-xs text-admin-600">Blog Posts</span>
                  <span className="text-responsive-sm font-semibold text-admin-800">{activityStats.blogPostsWritten}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-responsive-xs text-admin-600">Customers Helped</span>
                  <span className="text-responsive-sm font-semibold text-admin-800">{activityStats.customersHelped}</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card">
              <h4 className="heading-responsive-sm text-admin-800 mb-4">Account Information</h4>
              <div className="space-responsive-sm">
                <div>
                  <span className="text-responsive-xs text-admin-600">Last Login</span>
                  <p className="text-responsive-sm text-admin-800">{formatDateTime(profileData.lastLogin)}</p>
                </div>
                <div>
                  <span className="text-responsive-xs text-admin-600">Timezone</span>
                  <p className="text-responsive-sm text-admin-800">{profileData.timezone}</p>
                </div>
                <div>
                  <span className="text-responsive-xs text-admin-600">Language</span>
                  <p className="text-responsive-sm text-admin-800">{profileData.language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex-responsive-between gap-4 mb-6">
            <h3 className="heading-responsive-md text-admin-800">Recent Activity</h3>
            <button className="text-saffron-600 hover:text-saffron-700 text-responsive-xs font-medium">
              View All
            </button>
          </div>
          <div className="space-responsive-sm">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-admin-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <Icon className="icon-responsive-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-responsive-sm text-admin-800">
                      <span className="font-medium">{activity.action}</span>
                      {activity.item && (
                        <span className="text-admin-600"> • {activity.item}</span>
                      )}
                    </p>
                    <p className="text-responsive-xs text-admin-500 mt-1">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Avatar Upload Modal */}
        <Modal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          title="Update Profile Picture"
          size="md"
        >
          <div className="padding-responsive space-responsive">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <p className="text-responsive-sm text-admin-600 mb-4">
                Upload a new profile picture. Recommended size: 200x200px
              </p>
            </div>

            <div className="border-2 border-dashed border-admin-300 rounded-lg p-6 text-center hover:border-saffron-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-admin-400 mx-auto mb-2" />
              <p className="text-responsive-sm text-admin-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-responsive-xs text-admin-500">PNG, JPG up to 5MB</p>
            </div>

            <div className="flex-responsive justify-end gap-responsive-sm pt-4 border-t border-admin-200">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="btn-ghost btn-mobile"
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarUpload}
                className="btn-primary btn-mobile"
              >
                <Upload className="icon-responsive-sm mr-2" />
                Upload Picture
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage