"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import {
  Save,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Link as LinkIcon,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../../lib/api/admin";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Profile Settings - will be loaded from database
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    bio: "",
    location: "",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newOrders: true,
      orderUpdates: true,
      lowStock: true,
      newMessages: true,
      systemUpdates: false,
      marketing: false,
    },
    pushNotifications: {
      newOrders: true,
      orderUpdates: false,
      lowStock: true,
      newMessages: true,
      systemUpdates: true,
      marketing: false,
    },
    smsNotifications: {
      newOrders: false,
      orderUpdates: false,
      lowStock: true,
      newMessages: false,
      systemUpdates: false,
      marketing: false,
    },
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    allowMultipleSessions: false,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    animations: true,
    colorScheme: "saffron",
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    maintenanceMode: false,
    debugMode: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Footer Settings
  const [footerSettings, setFooterSettings] = useState({
    description: "",
    offerings: [""],
    quickLinks: [{ name: "", href: "" }],
    copyrightText: "",
  });

  const [isLoadingFooter, setIsLoadingFooter] = useState(false);

  // Fetch admin profile data on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await adminApi.getProfile();
        if (response.success && response.data) {
          const admin = response.data;
          // Split name into first and last name
          const nameParts = admin.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setProfileData({
            firstName,
            lastName,
            email: admin.email,
            phone: "",
            role: admin.role,
            avatar: "",
            bio: "",
            location: "",
            timezone: "Asia/Kolkata",
            language: "English",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchAdminProfile();
  }, []);

  // Fetch company/footer data on mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoadingFooter(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/company-details",
        );
        const data = await response.json();
        if (data.success && data.data) {
          const company = data.data;
          setFooterSettings({
            description: company.footer?.description || "",
            offerings:
              company.footer?.offerings?.length > 0
                ? company.footer.offerings
                : [""],
            quickLinks:
              company.footer?.quickLinks?.length > 0
                ? company.footer.quickLinks
                : [{ name: "", href: "" }],
            copyrightText: company.footer?.copyrightText || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        toast.error("Failed to load footer settings");
      } finally {
        setIsLoadingFooter(false);
      }
    };

    fetchCompanyData();
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "footer", label: "Footer Settings", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "system", label: "System", icon: Database },
  ];

  const handleSaveProfile = async () => {
    try {
      const fullName =
        profileData.firstName +
        (profileData.lastName ? ` ${profileData.lastName}` : "");

      const response = await adminApi.updateProfile({
        email: profileData.email,
        name: fullName,
      });

      if (response.success) {
        toast.success("Profile updated successfully!");
        // Update local state with the response data
        if (response.data) {
          const nameParts = response.data.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setProfileData((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: response.data.email,
            role: response.data.role,
          }));
        }
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleSaveFooter = async () => {
    setIsLoadingFooter(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/company-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            footer: {
              description: footerSettings.description,
              offerings: footerSettings.offerings.filter(
                (o) => o.trim() !== "",
              ),
              quickLinks: footerSettings.quickLinks.filter(
                (l) => l.name.trim() !== "" && l.href.trim() !== "",
              ),
              copyrightText: footerSettings.copyrightText,
            },
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Footer settings updated successfully!");
      } else {
        toast.error(data.message || "Failed to update footer settings");
      }
    } catch (error) {
      console.error("Failed to save footer settings:", error);
      toast.error("Failed to save footer settings");
    } finally {
      setIsLoadingFooter(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated!");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings updated!");
  };

  const handleSaveAppearance = () => {
    toast.success("Appearance settings updated!");
  };

  const handleSaveSystem = () => {
    toast.success("System settings updated!");
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await adminApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    }
  };

  const handleDeleteAccount = () => {
    toast.success("Account deletion request submitted!");
    setShowDeleteModal(false);
  };

  // Footer Settings Helpers
  const addOffering = () => {
    setFooterSettings({
      ...footerSettings,
      offerings: [...footerSettings.offerings, ""],
    });
  };

  const removeOffering = (index: number) => {
    setFooterSettings({
      ...footerSettings,
      offerings: footerSettings.offerings.filter((_, i) => i !== index),
    });
  };

  const updateOffering = (index: number, value: string) => {
    const newOfferings = [...footerSettings.offerings];
    newOfferings[index] = value;
    setFooterSettings({
      ...footerSettings,
      offerings: newOfferings,
    });
  };

  const addQuickLink = () => {
    setFooterSettings({
      ...footerSettings,
      quickLinks: [...footerSettings.quickLinks, { name: "", href: "" }],
    });
  };

  const removeQuickLink = (index: number) => {
    setFooterSettings({
      ...footerSettings,
      quickLinks: footerSettings.quickLinks.filter((_, i) => i !== index),
    });
  };

  const updateQuickLink = (
    index: number,
    field: "name" | "href",
    value: string,
  ) => {
    const newLinks = [...footerSettings.quickLinks];
    newLinks[index][field] = value;
    setFooterSettings({
      ...footerSettings,
      quickLinks: newLinks,
    });
  };

  const renderProfileTab = () => (
    <div className="space-responsive">
      <div className="card">
        <h3 className="heading-responsive-md text-admin-800 mb-4">
          Profile Information
        </h3>

        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
              <p className="text-admin-500">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-full flex items-center justify-center">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 p-2 bg-saffron-500 text-white rounded-full hover:bg-saffron-600 transition-colors">
                  <Upload className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <h4 className="text-responsive-lg font-semibold text-admin-800">
                  {profileData.firstName} {profileData.lastName}
                </h4>
                <p className="text-responsive-sm text-admin-600">
                  {profileData.role}
                </p>
                <p className="text-responsive-xs text-admin-500">
                  {profileData.email}
                </p>
              </div>
            </div>

            <div className="form-grid gap-responsive">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="input-field"
                />
                <p className="text-xs text-admin-500 mt-1">
                  You can change your login email here
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, timezone: e.target.value })
                  }
                  className="select-field"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Bio
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                className="textarea-field"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleSaveProfile} className="btn-primary">
                <Save className="icon-responsive-sm mr-2" />
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-responsive">
      {["emailNotifications", "pushNotifications", "smsNotifications"].map(
        (type) => (
          <div key={type} className="card">
            <h3 className="heading-responsive-md text-admin-800 mb-4 capitalize">
              {type.replace("Notifications", " Notifications")}
            </h3>
            <div className="space-y-4">
              {Object.entries(
                notificationSettings[type as keyof typeof notificationSettings],
              ).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-responsive-sm font-medium text-admin-800 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-responsive-xs text-admin-500">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [type]: {
                            ...notificationSettings[
                              type as keyof typeof notificationSettings
                            ],
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saffron-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-600"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveNotifications} className="btn-primary">
                <Save className="icon-responsive-sm mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-responsive">
      <div className="card">
        <h3 className="heading-responsive-md text-admin-800 mb-4">
          Password & Authentication
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-between w-full p-4 bg-admin-50 rounded-lg hover:bg-admin-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Lock className="icon-responsive-md text-admin-600" />
              <div className="text-left">
                <h4 className="text-responsive-sm font-medium text-admin-800">
                  Change Password
                </h4>
                <p className="text-responsive-xs text-admin-500">
                  Update your account password
                </p>
              </div>
            </div>
            <span className="text-admin-400">→</span>
          </button>

          <div className="flex items-center justify-between p-4 bg-admin-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="icon-responsive-md text-admin-600" />
              <div>
                <h4 className="text-responsive-sm font-medium text-admin-800">
                  Two-Factor Authentication
                </h4>
                <p className="text-responsive-xs text-admin-500">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) =>
                  setSecuritySettings({
                    ...securitySettings,
                    twoFactorAuth: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saffron-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-responsive-sm font-medium text-admin-800 mb-4">
            Security Preferences
          </h4>
          <div className="form-grid gap-responsive">
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Session Timeout (minutes)
              </label>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value),
                  })
                }
                className="select-field"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Password Expiry (days)
              </label>
              <select
                value={securitySettings.passwordExpiry}
                onChange={(e) =>
                  setSecuritySettings({
                    ...securitySettings,
                    passwordExpiry: parseInt(e.target.value),
                  })
                }
                className="select-field"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={handleSaveSecurity} className="btn-primary">
            <Save className="icon-responsive-sm mr-2" />
            Save Security Settings
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="heading-responsive-md text-red-600 mb-4">Danger Zone</h3>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h4 className="text-responsive-sm font-medium text-red-800 mb-2">
            Delete Account
          </h4>
          <p className="text-responsive-xs text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-danger"
          >
            <Trash2 className="icon-responsive-sm mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderFooterTab = () => (
    <div className="space-responsive">
      {isLoadingFooter ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
              <p className="text-admin-500">Loading footer settings...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <h3 className="heading-responsive-md text-admin-800 mb-4">
              Footer Content
            </h3>

            {/* Footer Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Footer Description
              </label>
              <textarea
                rows={4}
                value={footerSettings.description}
                onChange={(e) =>
                  setFooterSettings({
                    ...footerSettings,
                    description: e.target.value,
                  })
                }
                className="textarea-field"
                placeholder="Brief description about your company for the footer..."
              />
            </div>

            {/* Quick Links */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-admin-700">
                  Quick Links
                </label>
                <button
                  onClick={addQuickLink}
                  className="flex items-center gap-2 text-sm text-saffron-600 hover:text-saffron-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {footerSettings.quickLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) =>
                          updateQuickLink(index, "name", e.target.value)
                        }
                        placeholder="Link Name"
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) =>
                          updateQuickLink(index, "href", e.target.value)
                        }
                        placeholder="/path or https://..."
                        className="input-field"
                      />
                    </div>
                    {footerSettings.quickLinks.length > 1 && (
                      <button
                        onClick={() => removeQuickLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Offerings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-admin-700">
                  Offerings
                </label>
                <button
                  onClick={addOffering}
                  className="flex items-center gap-2 text-sm text-saffron-600 hover:text-saffron-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Offering
                </button>
              </div>
              <div className="space-y-3">
                {footerSettings.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={offering}
                      onChange={(e) => updateOffering(index, e.target.value)}
                      placeholder="Offering name..."
                      className="input-field flex-1"
                    />
                    {footerSettings.offerings.length > 1 && (
                      <button
                        onClick={() => removeOffering(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={footerSettings.copyrightText}
                onChange={(e) =>
                  setFooterSettings({
                    ...footerSettings,
                    copyrightText: e.target.value,
                  })
                }
                className="input-field"
                placeholder="Chakra Biotech LLP. All rights reserved."
              />
              <p className="text-xs text-admin-500 mt-1">
                The year will be automatically added before this text.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveFooter}
                disabled={isLoadingFooter}
                className="btn-primary"
              >
                <Save className="icon-responsive-sm mr-2" />
                {isLoadingFooter ? "Saving..." : "Save Footer Settings"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const getNotificationDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      newOrders: "Get notified when new orders are placed",
      orderUpdates: "Receive updates on order status changes",
      lowStock: "Alert when product inventory is running low",
      newMessages: "Notifications for new customer messages",
      systemUpdates: "Important system and security updates",
      marketing: "Marketing and promotional notifications",
    };
    return descriptions[key] || "Notification setting";
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-responsive">
        {/* Header */}
        <div className="flex-responsive-between gap-4">
          <div>
            <h2 className="heading-responsive-xl text-admin-800">Settings</h2>
            <p className="text-responsive-sm text-admin-600">
              Manage your account and application preferences
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-admin-200">
            <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-thin">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-responsive-xs sm:text-responsive-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-saffron-500 text-saffron-600"
                        : "border-transparent text-admin-500 hover:text-admin-700 hover:border-admin-300"
                    }`}
                  >
                    <Icon className="icon-responsive-sm" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="padding-responsive">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "footer" && renderFooterTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "appearance" && (
              <div className="text-center py-8">
                <Palette className="w-12 h-12 text-admin-400 mx-auto mb-4" />
                <p className="text-admin-500">
                  Appearance settings coming soon...
                </p>
              </div>
            )}
            {activeTab === "system" && (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-admin-400 mx-auto mb-4" />
                <p className="text-admin-500">System settings coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="padding-responsive space-responsive">
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-admin-400 hover:text-admin-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>

            <div className="flex-responsive justify-end gap-responsive-sm pt-4 border-t border-admin-200">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-ghost btn-mobile"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="btn-primary btn-mobile"
              >
                Change Password
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          size="md"
        >
          <div className="padding-responsive space-responsive">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="heading-responsive-md text-red-800 mb-2">
                Are you absolutely sure?
              </h3>
              <p className="text-responsive-sm text-admin-600 mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-responsive-xs text-red-700">
                  <strong>Warning:</strong> All your data including products,
                  orders, and settings will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="flex-responsive justify-end gap-responsive-sm pt-4 border-t border-admin-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-ghost btn-mobile"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn-danger btn-mobile"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
