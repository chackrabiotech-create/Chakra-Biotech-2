"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import { Save, Globe, Phone, Mail, MapPin, Users, Award } from "lucide-react";
import toast from "react-hot-toast";
import { companyApi } from "@/lib/api";

interface CompanyDetails {
  companyName: string;
  email: string;
  secondaryEmail?: string;
  phone: string;
  alternatePhone?: string;
  whatsappNumber: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  aboutUs?: string;
  mission?: string;
  vision?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const CompanyInformation = () => {
  const [companyData, setCompanyData] = useState<CompanyDetails>({
    companyName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    businessHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    aboutUs: "",
    mission: "",
    vision: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Globe },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "social", label: "Social Media", icon: Users },
    { id: "about", label: "About Us", icon: Award },
  ];

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyApi.get();

      // Merge with defaults to ensure all properties exist
      setCompanyData({
        companyName: response.data.companyName || "",
        email: response.data.email || "",
        secondaryEmail: response.data.secondaryEmail || "",
        phone: response.data.phone || "",
        whatsappNumber: response.data.whatsappNumber || "",
        alternatePhone: response.data.alternatePhone || "",
        address: {
          street: response.data.address?.street || "",
          city: response.data.address?.city || "",
          state: response.data.address?.state || "",
          country: response.data.address?.country || "",
          zipCode: response.data.address?.zipCode || "",
        },
        socialMedia: {
          facebook: response.data.socialMedia?.facebook || "",
          instagram: response.data.socialMedia?.instagram || "",
          twitter: response.data.socialMedia?.twitter || "",
          linkedin: response.data.socialMedia?.linkedin || "",
          youtube: response.data.socialMedia?.youtube || "",
        },
        businessHours: {
          monday: response.data.businessHours?.monday || "",
          tuesday: response.data.businessHours?.tuesday || "",
          wednesday: response.data.businessHours?.wednesday || "",
          thursday: response.data.businessHours?.thursday || "",
          friday: response.data.businessHours?.friday || "",
          saturday: response.data.businessHours?.saturday || "",
          sunday: response.data.businessHours?.sunday || "",
        },
        aboutUs: response.data.aboutUs || "",
        mission: response.data.mission || "",
        vision: response.data.vision || "",
        metaTitle: response.data.metaTitle || "",
        metaDescription: response.data.metaDescription || "",
        metaKeywords: response.data.metaKeywords || [],
      });
    } catch (error) {
      toast.error("Failed to load company data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await companyApi.update(companyData);
      toast.success("Company information updated successfully!");
      setIsEditing(false);
      loadCompanyData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update company information");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === "root") {
      setCompanyData((prev) => ({ ...prev, [field]: value }));
    } else {
      setCompanyData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof CompanyDetails] as any),
          [field]: value,
        },
      }));
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={companyData.companyName}
            onChange={(e) =>
              handleInputChange("root", "companyName", e.target.value)
            }
            disabled={!isEditing}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={companyData.email}
            onChange={(e) => handleInputChange("root", "email", e.target.value)}
            disabled={!isEditing}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            Secondary Email
          </label>
          <input
            type="email"
            value={companyData.secondaryEmail || ""}
            onChange={(e) => handleInputChange("root", "secondaryEmail", e.target.value)}
            disabled={!isEditing}
            className="input-field"
            placeholder="Optional second email for footer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-admin-700 mb-2">
          About Us
        </label>
        <textarea
          rows={4}
          value={companyData.aboutUs || ""}
          onChange={(e) => handleInputChange("root", "aboutUs", e.target.value)}
          disabled={!isEditing}
          className="input-field"
          placeholder="Tell us about your company..."
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            value={companyData.phone}
            onChange={(e) => handleInputChange("root", "phone", e.target.value)}
            disabled={!isEditing}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            Alternate Phone
          </label>
          <input
            type="tel"
            value={companyData.alternatePhone || ""}
            onChange={(e) =>
              handleInputChange("root", "alternatePhone", e.target.value)
            }
            disabled={!isEditing}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-admin-700 mb-2">
            WhatsApp Number *
          </label>
          <input
            type="tel"
            value={companyData.whatsappNumber}
            onChange={(e) =>
              handleInputChange("root", "whatsappNumber", e.target.value)
            }
            disabled={!isEditing}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-admin-800 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-admin-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={companyData.address.street || ""}
              onChange={(e) =>
                handleInputChange("address", "street", e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={companyData.address.city || ""}
              onChange={(e) =>
                handleInputChange("address", "city", e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={companyData.address.state || ""}
              onChange={(e) =>
                handleInputChange("address", "state", e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={companyData.address.zipCode || ""}
              onChange={(e) =>
                handleInputChange("address", "zipCode", e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={companyData.address.country || ""}
              onChange={(e) =>
                handleInputChange("address", "country", e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(companyData.socialMedia).map(([platform, url]) => (
          <div key={platform}>
            <label className="block text-sm font-medium text-admin-700 mb-2 capitalize">
              {platform}
            </label>
            <input
              type="url"
              value={url || ""}
              onChange={(e) =>
                handleInputChange("socialMedia", platform, e.target.value)
              }
              disabled={!isEditing}
              className="input-field"
              placeholder={`https://${platform}.com/yourcompany`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAboutUs = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-admin-700 mb-2">
          Mission
        </label>
        <textarea
          rows={3}
          value={companyData.mission || ""}
          onChange={(e) => handleInputChange("root", "mission", e.target.value)}
          disabled={!isEditing}
          className="input-field"
          placeholder="Your company mission..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-admin-700 mb-2">
          Vision
        </label>
        <textarea
          rows={3}
          value={companyData.vision || ""}
          onChange={(e) => handleInputChange("root", "vision", e.target.value)}
          disabled={!isEditing}
          className="input-field"
          placeholder="Your company vision..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-admin-700 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={companyData.metaTitle || ""}
          onChange={(e) =>
            handleInputChange("root", "metaTitle", e.target.value)
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="SEO meta title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-admin-700 mb-2">
          Meta Description
        </label>
        <textarea
          rows={2}
          value={companyData.metaDescription || ""}
          onChange={(e) =>
            handleInputChange("root", "metaDescription", e.target.value)
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="SEO meta description"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInfo();
      case "contact":
        return renderContactInfo();
      case "social":
        return renderSocialMedia();
      case "about":
        return renderAboutUs();
      default:
        return renderBasicInfo();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Company Information">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Company Information">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Company Information
            </h2>
            <p className="text-admin-600">
              Manage your company details and settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    loadCompanyData();
                  }}
                  className="px-4 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                  disabled={submitting}
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Information
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-admin-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-saffron-500 text-saffron-600"
                        : "border-transparent text-admin-500 hover:text-admin-700 hover:border-admin-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyInformation;
