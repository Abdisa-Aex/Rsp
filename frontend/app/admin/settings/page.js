"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Save,
  Settings,
  Globe,
  Mail,
  Shield,
  Download,
  Loader2,
  Database,
  RefreshCw,
  Bell,
  Palette,
  Lock,
  Users,
  DollarSign,
  Share2,
  MessageSquare,
  Image,
  Code,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Smartphone,
  CreditCard,
  MapPin,
  Clock,
  FileText,
  Zap,
  Heart,
  Award,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState(null);

  // Complete settings state
  const [settings, setSettings] = useState({
    // General
    siteName: "ResourceHub",
    siteDescription: "Share resources, build community",
    siteLogo: "",
    siteFavicon: "",
    siteKeywords: "resource sharing, community, lending, borrowing",

    // Contact
    contactEmail: "",
    supportEmail: "",
    contactPhone: "",
    contactAddress: "",

    // Social Links
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      github: "",
    },

    // Feature Flags
    features: {
      userRegistration: true,
      resourceSharing: true,
      messaging: true,
      payments: false,
      pushNotifications: true,
      emailNotifications: true,
      socialLogin: false,
      twoFactorAuth: false,
    },

    // Moderation
    moderation: {
      autoApproveResources: false,
      requireEmailVerification: true,
      requirePhoneVerification: false,
      maxReportsBeforeAction: 5,
      autoBanAfterReports: 10,
      moderationQueue: "manual",
    },

    // Pricing & Payments
    pricing: {
      commissionRate: 0,
      minimumDeposit: 0,
      maximumPrice: 1000,
      freeListingLimit: 10,
      premiumPrice: 29.99,
      currency: "USD",
    },

    // Email Templates
    emailTemplates: {
      welcome: "",
      verification: "",
      passwordReset: "",
      resourceApproved: "",
      resourceRejected: "",
      bookingConfirmed: "",
      returnReminder: "",
    },

    // Security
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPassword: true,
      ipWhitelist: [],
      allowedDomains: [],
    },

    // Appearance
    appearance: {
      theme: "light",
      primaryColor: "#10b981",
      secondaryColor: "#3b82f6",
      darkModeEnabled: true,
      customCSS: "",
      headerLayout: "default",
    },

    // Analytics
    analytics: {
      googleAnalyticsId: "",
      facebookPixelId: "",
      enableTracking: true,
      anonymizeIp: true,
    },

    // Maintenance
    maintenanceMode: {
      enabled: false,
      message:
        "We're currently undergoing maintenance. Please check back soon!",
      allowAdmins: true,
      allowedIPs: [],
    },

    // Integrations
    integrations: {
      cloudinaryEnabled: true,
      mapboxApiKey: "",
      recaptchaEnabled: true,
      recaptchaSiteKey: "",
      recaptchaSecretKey: "",
    },

    // Limits
    limits: {
      maxImageSize: 5,
      maxResourcesPerUser: 50,
      maxImagesPerResource: 5,
      maxBorrowDays: 30,
      maxActiveBorrows: 3,
    },

    // Notifications
    notifications: {
      adminEmail: "",
      reportAlertEmail: "",
      dailyDigest: true,
      weeklyReport: true,
      alertOnNewUser: false,
      alertOnNewResource: true,
      alertOnReport: true,
    },
  });

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "features", label: "Features", icon: Zap },
    { id: "moderation", label: "Moderation", icon: Shield },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "limits", label: "Limits", icon: Activity },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "integrations", label: "Integrations", icon: Server },
    { id: "maintenance", label: "Maintenance", icon: AlertTriangle },
    { id: "backup", label: "Backup", icon: Database },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/settings");
      return;
    }
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    loadSettings();
  }, [isAuthenticated, isAdmin]);

  const loadSettings = async () => {
    try {
      const data = await apiCall("/admin/settings");
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error("Load settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await apiCall("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      if (data.success) {
        setMessage({
          type: "success",
          text: "All settings saved successfully!",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const data = await apiCall("/admin/settings/backup");
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resourcehub-backup-${new Date().toISOString().slice(0, 19)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Backup downloaded successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create backup" });
    } finally {
      setBackupLoading(false);
    }
  };

  const updateNested = (path, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Message Toast */}
          {message && (
            <div
              className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-gray-500">
                  Configure every aspect of your platform
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadSettings}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 flex items-center gap-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-800 text-green-600 border-b-2 border-green-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            {/* GENERAL SETTINGS */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Site Keywords (SEO)
                    </label>
                    <input
                      type="text"
                      value={settings.siteKeywords}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteKeywords: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="keywords, separated, by commas"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Contact Address
                    </label>
                    <textarea
                      value={settings.contactAddress}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactAddress: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Appearance Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Theme
                    </label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) =>
                        updateNested("appearance.theme", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) =>
                          updateNested(
                            "appearance.primaryColor",
                            e.target.value,
                          )
                        }
                        className="w-12 h-10 border rounded"
                      />
                      <input
                        type="text"
                        value={settings.appearance.primaryColor}
                        onChange={(e) =>
                          updateNested(
                            "appearance.primaryColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) =>
                          updateNested(
                            "appearance.secondaryColor",
                            e.target.value,
                          )
                        }
                        className="w-12 h-10 border rounded"
                      />
                      <input
                        type="text"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) =>
                          updateNested(
                            "appearance.secondaryColor",
                            e.target.value,
                          )
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.appearance.darkModeEnabled}
                        onChange={(e) =>
                          updateNested(
                            "appearance.darkModeEnabled",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4"
                      />
                      <span>Enable Dark Mode Toggle</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Custom CSS
                    </label>
                    <textarea
                      value={settings.appearance.customCSS}
                      onChange={(e) =>
                        updateNested("appearance.customCSS", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      rows="4"
                      placeholder="/* Add your custom CSS here */"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Feature Toggles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          updateNested(`features.${key}`, e.target.checked)
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* MODERATION */}
            {activeTab === "moderation" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Moderation Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <span>Auto-approve Resources</span>
                      <input
                        type="checkbox"
                        checked={settings.moderation.autoApproveResources}
                        onChange={(e) =>
                          updateNested(
                            "moderation.autoApproveResources",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <span>Require Email Verification</span>
                      <input
                        type="checkbox"
                        checked={settings.moderation.requireEmailVerification}
                        onChange={(e) =>
                          updateNested(
                            "moderation.requireEmailVerification",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Reports Before Review
                    </label>
                    <input
                      type="number"
                      value={settings.moderation.maxReportsBeforeAction}
                      onChange={(e) =>
                        updateNested(
                          "moderation.maxReportsBeforeAction",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Auto-ban After Reports
                    </label>
                    <input
                      type="number"
                      value={settings.moderation.autoBanAfterReports}
                      onChange={(e) =>
                        updateNested(
                          "moderation.autoBanAfterReports",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Moderation Queue
                    </label>
                    <select
                      value={settings.moderation.moderationQueue}
                      onChange={(e) =>
                        updateNested(
                          "moderation.moderationQueue",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="manual">Manual Review</option>
                      <option value="priority">Priority Queue</option>
                      <option value="automated">Automated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PRICING */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Pricing & Payments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.pricing.commissionRate}
                      onChange={(e) =>
                        updateNested(
                          "pricing.commissionRate",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Minimum Deposit ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.pricing.minimumDeposit}
                      onChange={(e) =>
                        updateNested(
                          "pricing.minimumDeposit",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Maximum Price ($)
                    </label>
                    <input
                      type="number"
                      value={settings.pricing.maximumPrice}
                      onChange={(e) =>
                        updateNested(
                          "pricing.maximumPrice",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Free Listing Limit
                    </label>
                    <input
                      type="number"
                      value={settings.pricing.freeListingLimit}
                      onChange={(e) =>
                        updateNested(
                          "pricing.freeListingLimit",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Premium Price ($/month)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.pricing.premiumPrice}
                      onChange={(e) =>
                        updateNested(
                          "pricing.premiumPrice",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Currency
                    </label>
                    <select
                      value={settings.pricing.currency}
                      onChange={(e) =>
                        updateNested("pricing.currency", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Security Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        updateNested(
                          "security.sessionTimeout",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        updateNested(
                          "security.maxLoginAttempts",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        updateNested(
                          "security.passwordMinLength",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Require Strong Password</span>
                      <input
                        type="checkbox"
                        checked={settings.security.requireStrongPassword}
                        onChange={(e) =>
                          updateNested(
                            "security.requireStrongPassword",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      IP Whitelist (one per line)
                    </label>
                    <textarea
                      value={settings.security.ipWhitelist.join("\n")}
                      onChange={(e) =>
                        updateNested(
                          "security.ipWhitelist",
                          e.target.value.split("\n").filter((i) => i.trim()),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      rows="3"
                      placeholder="192.168.1.1&#10;10.0.0.1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SOCIAL LINKS */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Social Media Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      value={settings.socialLinks.facebook}
                      onChange={(e) =>
                        updateNested("socialLinks.facebook", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={settings.socialLinks.twitter}
                      onChange={(e) =>
                        updateNested("socialLinks.twitter", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={settings.socialLinks.instagram}
                      onChange={(e) =>
                        updateNested("socialLinks.instagram", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={settings.socialLinks.linkedin}
                      onChange={(e) =>
                        updateNested("socialLinks.linkedin", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      value={settings.socialLinks.youtube}
                      onChange={(e) =>
                        updateNested("socialLinks.youtube", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-gray-800" />
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={settings.socialLinks.github}
                      onChange={(e) =>
                        updateNested("socialLinks.github", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LIMITS */}
            {activeTab === "limits" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">System Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Image Size (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.limits.maxImageSize}
                      onChange={(e) =>
                        updateNested(
                          "limits.maxImageSize",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Resources Per User
                    </label>
                    <input
                      type="number"
                      value={settings.limits.maxResourcesPerUser}
                      onChange={(e) =>
                        updateNested(
                          "limits.maxResourcesPerUser",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Images Per Resource
                    </label>
                    <input
                      type="number"
                      value={settings.limits.maxImagesPerResource}
                      onChange={(e) =>
                        updateNested(
                          "limits.maxImagesPerResource",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Borrow Days
                    </label>
                    <input
                      type="number"
                      value={settings.limits.maxBorrowDays}
                      onChange={(e) =>
                        updateNested(
                          "limits.maxBorrowDays",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Active Borrows Per User
                    </label>
                    <input
                      type="number"
                      value={settings.limits.maxActiveBorrows}
                      onChange={(e) =>
                        updateNested(
                          "limits.maxActiveBorrows",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Analytics & Tracking
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      value={settings.analytics.googleAnalyticsId}
                      onChange={(e) =>
                        updateNested(
                          "analytics.googleAnalyticsId",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXXXXXXX"
                      value={settings.analytics.facebookPixelId}
                      onChange={(e) =>
                        updateNested(
                          "analytics.facebookPixelId",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Enable Analytics Tracking</span>
                      <input
                        type="checkbox"
                        checked={settings.analytics.enableTracking}
                        onChange={(e) =>
                          updateNested(
                            "analytics.enableTracking",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Anonymize IP Addresses</span>
                      <input
                        type="checkbox"
                        checked={settings.analytics.anonymizeIp}
                        onChange={(e) =>
                          updateNested(
                            "analytics.anonymizeIp",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRATIONS */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Third-party Integrations
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Cloudinary Enabled</span>
                      <input
                        type="checkbox"
                        checked={settings.integrations.cloudinaryEnabled}
                        onChange={(e) =>
                          updateNested(
                            "integrations.cloudinaryEnabled",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mapbox API Key
                    </label>
                    <input
                      type="text"
                      value={settings.integrations.mapboxApiKey}
                      onChange={(e) =>
                        updateNested(
                          "integrations.mapboxApiKey",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="pk.xxxxxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>reCAPTCHA Enabled</span>
                      <input
                        type="checkbox"
                        checked={settings.integrations.recaptchaEnabled}
                        onChange={(e) =>
                          updateNested(
                            "integrations.recaptchaEnabled",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  {settings.integrations.recaptchaEnabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          reCAPTCHA Site Key
                        </label>
                        <input
                          type="text"
                          value={settings.integrations.recaptchaSiteKey}
                          onChange={(e) =>
                            updateNested(
                              "integrations.recaptchaSiteKey",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          reCAPTCHA Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.integrations.recaptchaSecretKey}
                          onChange={(e) =>
                            updateNested(
                              "integrations.recaptchaSecretKey",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* MAINTENANCE */}
            {activeTab === "maintenance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Enable Maintenance Mode</span>
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode.enabled}
                        onChange={(e) =>
                          updateNested(
                            "maintenanceMode.enabled",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  {settings.maintenanceMode.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Maintenance Message
                        </label>
                        <textarea
                          value={settings.maintenanceMode.message}
                          onChange={(e) =>
                            updateNested(
                              "maintenanceMode.message",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span>Allow Admin Access</span>
                          <input
                            type="checkbox"
                            checked={settings.maintenanceMode.allowAdmins}
                            onChange={(e) =>
                              updateNested(
                                "maintenanceMode.allowAdmins",
                                e.target.checked,
                              )
                            }
                            className="h-5 w-5"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Allowed IPs (one per line)
                        </label>
                        <textarea
                          value={settings.maintenanceMode.allowedIPs.join("\n")}
                          onChange={(e) =>
                            updateNested(
                              "maintenanceMode.allowedIPs",
                              e.target.value
                                .split("\n")
                                .filter((i) => i.trim()),
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                          rows="3"
                          placeholder="192.168.1.1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* BACKUP */}
            {activeTab === "backup" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Database Backup</h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Database className="h-12 w-12 text-purple-500" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        Complete Database Backup
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Download a complete backup of your database including
                        users, resources, exchanges, reports, and all settings.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={handleBackup}
                          disabled={backupLoading}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        >
                          {backupLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {backupLoading ? "Creating..." : "Download Backup"}
                        </button>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Last backup: {new Date().toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                        Keep this file secure. It contains sensitive user data.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Notification Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Admin Notification Email
                    </label>
                    <input
                      type="email"
                      value={settings.notifications.adminEmail}
                      onChange={(e) =>
                        updateNested("notifications.adminEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Report Alert Email
                    </label>
                    <input
                      type="email"
                      value={settings.notifications.reportAlertEmail}
                      onChange={(e) =>
                        updateNested(
                          "notifications.reportAlertEmail",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Send Daily Digest</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.dailyDigest}
                        onChange={(e) =>
                          updateNested(
                            "notifications.dailyDigest",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Send Weekly Report</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReport}
                        onChange={(e) =>
                          updateNested(
                            "notifications.weeklyReport",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Alert on New User</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.alertOnNewUser}
                        onChange={(e) =>
                          updateNested(
                            "notifications.alertOnNewUser",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Alert on New Resource</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.alertOnNewResource}
                        onChange={(e) =>
                          updateNested(
                            "notifications.alertOnNewResource",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Alert on New Report</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.alertOnReport}
                        onChange={(e) =>
                          updateNested(
                            "notifications.alertOnReport",
                            e.target.checked,
                          )
                        }
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
