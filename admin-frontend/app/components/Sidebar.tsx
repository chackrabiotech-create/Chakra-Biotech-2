"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Image,
  FileText,
  FolderOpen,
  Package,
  Grid3X3,
  GraduationCap,
  UserPlus,
  Users as UsersIcon,
  MessageSquare,
  Building2,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  User,
  ShoppingBag,
  BookOpen,
  ImagePlus,
} from "lucide-react";

interface SidebarProps {
  isDesktopCollapsed: boolean
  onToggleDesktop: () => void
}

const Sidebar = ({ isDesktopCollapsed, onToggleDesktop }: SidebarProps) => {
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Auto-open section based on current path
  useEffect(() => {
    const sections: Record<string, string[]> = {
      training: ["/dashboard/training", "/dashboard/enrollments", "/dashboard/students"],
      blog: ["/dashboard/blog", "/dashboard/blog-categories", "/dashboard/comments"],
      products: ["/dashboard/products", "/dashboard/product-categories"],
      gallery: ["/dashboard/gallery", "/dashboard/gallery-categories"],
    };
    for (const [key, paths] of Object.entries(sections)) {
      if (paths.some((p) => pathname === p || pathname?.startsWith(p + "/"))) {
        setOpenSections((prev) => ({ ...prev, [key]: true }));
      }
    }
  }, [pathname]);

  interface MenuItem {
    name: string;
    href: string;
    icon: any;
  }

  interface MenuSection {
    label: string;
    icon: any;
    key: string;
    items: MenuItem[];
  }

  type MenuEntry = MenuItem | MenuSection;

  const isSection = (entry: MenuEntry): entry is MenuSection => "items" in entry;

  const menuEntries: MenuEntry[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Carousel", href: "/dashboard/carousel", icon: Image },
    {
      label: "Training",
      icon: GraduationCap,
      key: "training",
      items: [
        { name: "Programs", href: "/dashboard/training", icon: BookOpen },
        { name: "Enrollments", href: "/dashboard/enrollments", icon: UserPlus },
        { name: "Students", href: "/dashboard/students", icon: UsersIcon },
      ],
    },
    {
      label: "Blog",
      icon: FileText,
      key: "blog",
      items: [
        { name: "Posts", href: "/dashboard/blog", icon: FileText },
        { name: "Categories", href: "/dashboard/blog-categories", icon: FolderOpen },
        { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
      ],
    },
    {
      label: "Products",
      icon: ShoppingBag,
      key: "products",
      items: [
        { name: "All Products", href: "/dashboard/products", icon: Package },
        { name: "Categories", href: "/dashboard/product-categories", icon: Grid3X3 },
      ],
    },
    {
      label: "Gallery",
      icon: ImagePlus,
      key: "gallery",
      items: [
        { name: "Images", href: "/dashboard/gallery", icon: Image },
        { name: "Categories", href: "/dashboard/gallery-categories", icon: FolderOpen },
      ],
    },
    { name: "Contact", href: "/dashboard/contact", icon: MessageSquare },
    { name: "Company Info", href: "/dashboard/company", icon: Building2 },
  ];

  const bottomMenuItems = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Logout", href: "#", icon: LogOut, action: "logout" },
  ];

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-admin-200 hover:bg-admin-50 transition-colors"
        aria-label="Toggle mobile menu"
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-admin-700" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6 text-admin-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Desktop Collapse Button */}
      <button
        onClick={onToggleDesktop}
        className={`hidden lg:block fixed top-4 z-40 p-2 bg-white rounded-lg shadow-md border border-admin-200 hover:bg-admin-50 transition-all duration-300 ${isDesktopCollapsed ? "left-24" : "left-60"
          }`}
        aria-label="Toggle sidebar"
      >
        {isDesktopCollapsed ? (
          <ChevronRight className="w-5 h-5 text-admin-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-admin-600" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: isMobile ? -320 : 0 }}
          animate={{
            x: isMobile ? (isMobileOpen ? 0 : -320) : 0,
          }}
          exit={{ x: -320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-40 border-r border-admin-200 transition-[width] duration-300 ease-in-out ${isMobile ? "w-80" : isDesktopCollapsed ? "w-20" : "w-56"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div
              className={`border-b border-admin-200 ${isDesktopCollapsed && !isMobile ? "p-4" : "p-6"
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <AnimatePresence>
                  {(!isDesktopCollapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h1 className="font-serif text-xl font-bold text-admin-800 whitespace-nowrap">
                        Chakra Biotech
                      </h1>
                      <p className="text-sm text-admin-500 whitespace-nowrap">
                        Admin Dashboard
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuEntries.map((entry, index) => {
                if (isSection(entry)) {
                  const sectionOpen = openSections[entry.key] ?? false;
                  const hasActiveChild = entry.items.some((item) => pathname === item.href);
                  return (
                    <div key={entry.key}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => toggleSection(entry.key)}
                          className={`group relative flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-300 hover:bg-admin-50 cursor-pointer ${hasActiveChild
                            ? "text-saffron-700 bg-saffron-50/50"
                            : "text-admin-600 hover:text-admin-800"
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <entry.icon
                              className={`w-5 h-5 flex-shrink-0 transition-colors ${hasActiveChild
                                ? "text-saffron-600"
                                : "text-admin-500 group-hover:text-admin-700"
                                }`}
                            />
                            <AnimatePresence>
                              {(!isDesktopCollapsed || isMobile) && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="font-medium whitespace-nowrap"
                                >
                                  {entry.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          {(!isDesktopCollapsed || isMobile) && (
                            <ChevronDown
                              className={`w-4 h-4 text-admin-400 transition-transform duration-200 ${sectionOpen ? "rotate-180" : ""
                                }`}
                            />
                          )}

                          {/* Tooltip for collapsed state */}
                          {isDesktopCollapsed && !isMobile && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-admin-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              {entry.label}
                              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-admin-800 rotate-45"></div>
                            </div>
                          )}
                        </button>
                      </motion.div>

                      {/* Sub-items */}
                      <AnimatePresence>
                        {(sectionOpen || (isDesktopCollapsed && !isMobile)) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`overflow-hidden ${isDesktopCollapsed && !isMobile ? "" : "ml-4 border-l border-admin-200"
                              }`}
                          >
                            {entry.items.map((item) => {
                              const isActive = pathname === item.href;
                              return (
                                <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                                  <div
                                    className={`group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-admin-50 cursor-pointer ${isActive
                                      ? "bg-gradient-to-r from-saffron-50 to-saffron-100 text-saffron-700 shadow-sm"
                                      : "text-admin-600 hover:text-admin-800"
                                      }`}
                                  >
                                    <item.icon
                                      className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive
                                        ? "text-saffron-600"
                                        : "text-admin-400 group-hover:text-admin-600"
                                        }`}
                                    />
                                    <AnimatePresence>
                                      {(!isDesktopCollapsed || isMobile) && (
                                        <motion.span
                                          initial={{ opacity: 0, width: 0 }}
                                          animate={{ opacity: 1, width: "auto" }}
                                          exit={{ opacity: 0, width: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="text-sm font-medium whitespace-nowrap"
                                        >
                                          {item.name}
                                        </motion.span>
                                      )}
                                    </AnimatePresence>

                                    {/* Tooltip for collapsed state */}
                                    {isDesktopCollapsed && !isMobile && (
                                      <div className="absolute left-full ml-2 px-3 py-2 bg-admin-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        {item.name}
                                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-admin-800 rotate-45"></div>
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Regular menu item (not a section)
                const isActive = pathname === entry.href;
                return (
                  <motion.div
                    key={entry.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={entry.href} onClick={closeMobileMenu}>
                      <div
                        className={`group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-admin-50 cursor-pointer ${isActive
                          ? "bg-gradient-to-r from-saffron-50 to-saffron-100 text-saffron-700 shadow-sm border-l-4 border-saffron-500"
                          : "text-admin-600 hover:text-admin-800"
                          }`}
                      >
                        <entry.icon
                          className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive
                            ? "text-saffron-600"
                            : "text-admin-500 group-hover:text-admin-700"
                            }`}
                        />
                        <AnimatePresence>
                          {(!isDesktopCollapsed || isMobile) && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="font-medium whitespace-nowrap"
                            >
                              {entry.name}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isDesktopCollapsed && !isMobile && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-admin-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {entry.name}
                            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-admin-800 rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Menu */}
            <div className="p-4 border-t border-admin-200 space-y-1">
              {bottomMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.name}>
                    {item.action === "logout" ? (
                      <button
                        onClick={handleLogout}
                        className="group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-red-50 cursor-pointer text-admin-600 hover:text-red-700 w-full text-left"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0 text-admin-500 group-hover:text-red-600" />
                        <AnimatePresence>
                          {(!isDesktopCollapsed || isMobile) && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="font-medium whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isDesktopCollapsed && !isMobile && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-admin-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.name}
                            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-admin-800 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link href={item.href} onClick={closeMobileMenu}>
                        <div
                          className={`group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-admin-50 cursor-pointer ${isActive
                            ? "bg-gradient-to-r from-saffron-50 to-saffron-100 text-saffron-700 shadow-sm border-l-4 border-saffron-500"
                            : "text-admin-600 hover:text-admin-800"
                            }`}
                        >
                          <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive
                              ? "text-saffron-600"
                              : "text-admin-500 group-hover:text-admin-700"
                              }`}
                          />
                          <AnimatePresence>
                            {(!isDesktopCollapsed || isMobile) && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-medium whitespace-nowrap"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {/* Tooltip for collapsed state */}
                          {isDesktopCollapsed && !isMobile && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-admin-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              {item.name}
                              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-admin-800 rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
