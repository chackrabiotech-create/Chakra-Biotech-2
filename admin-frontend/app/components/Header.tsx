"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const notifications = [
    { id: 1, title: "New order received", time: "2 min ago", type: "order" },
    {
      id: 2,
      title: "Blog post published",
      time: "1 hour ago",
      type: "content",
    },
    {
      id: 3,
      title: "Training enrollment",
      time: "3 hours ago",
      type: "training",
    },
  ];

  return (
    <header className="bg-white border-b border-admin-200 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-2">
        {/* Title Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          {/* Mobile spacing for hamburger menu */}
          <div className="w-10 lg:hidden flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-serif font-bold text-admin-800 truncate">
              {title}
            </h1>
            <p className="text-[10px] sm:text-sm text-admin-500 hidden md:block truncate">
              Welcome back, manage your agri-tech business
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-admin-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-admin-200 z-50"
                >
                  <div className="p-4 border-b border-admin-200">
                    <h3 className="font-semibold text-admin-800">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href="/dashboard/notifications"
                      >
                        <div className="p-4 border-b border-admin-100 hover:bg-admin-50 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-admin-800">
                            {notification.title}
                          </p>
                          <p className="text-xs text-admin-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-4">
                    <Link href="/dashboard/notifications">
                      <button className="w-full text-center text-sm text-saffron-600 hover:text-saffron-700 font-medium">
                        View all notifications
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-admin-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-admin-800">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-admin-500">
                  {user?.role || "Super Admin"}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-admin-200 z-50"
                >
                  <div className="p-4 border-b border-admin-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-admin-800">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-sm text-admin-500">
                          {user?.email || "admin@chakrabiotech.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href="/dashboard/settings">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-admin-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-admin-500" />
                        <span className="text-sm text-admin-700">Settings</span>
                      </button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-admin-50 rounded-lg transition-colors">
                        <User className="w-4 h-4 text-admin-500" />
                        <span className="text-sm text-admin-700">Profile</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-admin-50 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-admin-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
