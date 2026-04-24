
"use client";

import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Lock,
  Download,
  LogOut,
  HelpCircle,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Shield,
  Save,
  X,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Button from "components/ui/Button";
import toast from "react-hot-toast";

const SettingsPanel = ({
  user,
  onUpdate,
  onLogout,
  onDelete,
  // Props from ProfilePage
  notifications: initialNotifications,
  setNotifications,
  handleNotificationToggle,
  privacy: initialPrivacy,
  setPrivacy,
  showPassword,
  setShowPassword,
  handleQuickAction,
}) => {
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(false);

  // Local state for settings that don't need immediate API calls
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Africa/Addis_Ababa");
  const [theme, setTheme] = useState(user?.preferences?.theme || "system");
  const [fontSize, setFontSize] = useState("medium");
  const [compactView, setCompactView] = useState(false);

  // Use props from ProfilePage
  const [notifications, setNotificationsLocal] = useState(
    initialNotifications || {
      messages: true,
      requests: true,
      returns: true,
      reviews: true,
      promotions: false,
      system: true,
    },
  );

  const [privacy, setPrivacyLocal] = useState({
    showEmail: user?.preferences?.privacy?.showEmail ?? true,
    showPhone: user?.preferences?.privacy?.showPhone ?? false,
    showLocation: user?.preferences?.privacy?.showLocation ?? true,
    showLastSeen: user?.preferences?.privacy?.showLastSeen ?? true,
    showPoints: user?.preferences?.privacy?.showPoints ?? true,
    profileVisibility: initialPrivacy || "public",
  });

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Data Management
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [autoDownloadMedia, setAutoDownloadMedia] = useState(false);

  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorQR, setTwoFactorQR] = useState("");

  // Active Sessions
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (initialNotifications) {
      setNotificationsLocal(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    if (initialPrivacy) {
      setPrivacyLocal((prev) => ({
        ...prev,
        profileVisibility: initialPrivacy,
      }));
    }
  }, [initialPrivacy]);

  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
      applyTheme(user.preferences.theme);
    }
  }, [user]);

  // Apply theme to document
  const applyTheme = (themeValue) => {
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeValue === "light") {
      document.documentElement.classList.remove("dark");
    } else if (themeValue === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Wrapper for notification toggle that uses the prop function
  const onNotificationToggle = (key) => {
    setNotificationsLocal((prev) => ({ ...prev, [key]: !prev[key] }));
    if (handleNotificationToggle) {
      handleNotificationToggle(key);
    }
  };

  // Wrapper for privacy update
  const onPrivacyUpdate = (key, value) => {
    setPrivacyLocal((prev) => ({ ...prev, [key]: value }));
    if (setPrivacy) {
      setPrivacy(value);
    }
  };

  // Update theme with API call
  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    if (onUpdate) {
      await onUpdate({
        preferences: { ...user?.preferences, theme: newTheme },
      });
    }
    toast.success("Theme updated");
  };

  // Change password
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      // This would need to be passed from ProfilePage or use direct fetch
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 3000);

        setTimeout(() => {
          if (confirm("Password changed. Log in again?")) {
            onLogout();
          }
        }, 2000);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (error) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Enable 2FA
  const enable2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/enable-2fa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setTwoFactorSecret(data.secret);
        setTwoFactorQR(data.qrCode);
        setShow2FAModal(true);
      }
    } catch (error) {
      toast.error("Failed to enable 2FA");
    }
  };

  // Verify and enable 2FA
  const verify2FA = async () => {
    if (!twoFactorCode) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-2fa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ code: twoFactorCode }),
        },
      );
      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(true);
        setShow2FAModal(false);
        setTwoFactorCode("");
        toast.success("2FA enabled successfully");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to verify 2FA");
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    const code = prompt("Enter your 2FA code to disable:");
    if (!code) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/disable-2fa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ code }),
        },
      );
      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(false);
        toast.success("2FA disabled successfully");
      } else {
        toast.error("Invalid code");
      }
    } catch (error) {
      toast.error("Failed to disable 2FA");
    }
  };

  // Fetch active sessions
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/sessions", {
        headers: { "x-auth-token": token },
      });
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Revoke session
  const revokeSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/auth/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: { "x-auth-token": token },
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Session revoked successfully");
        fetchSessions();
      }
    } catch (error) {
      toast.error("Failed to revoke session");
    }
  };

  // Revoke all sessions
  const revokeAllSessions = async () => {
    if (!confirm("Are you sure you want to log out from all devices?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/sessions", {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Logged out from all devices");
        setTimeout(() => {
          onLogout();
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to revoke all sessions");
    }
  };

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data", icon: Download },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id
                  ? "bg-green-500 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Account Settings */}
      {activeSection === "account" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <User className="h-5 w-5" />
            Account Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user?.fullName || ""}
                onChange={(e) => onUpdate?.({ fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ""}
                onChange={(e) => onUpdate?.({ username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={user?.phone || ""}
                onChange={(e) => onUpdate?.({ phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={user?.location || ""}
                onChange={(e) => onUpdate?.({ location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={user?.bio || ""}
                onChange={(e) => onUpdate?.({ bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === "notifications" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell className="h-5 w-5" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === "messages" && "When you receive a new message"}
                    {key === "requests" && "When someone requests your items"}
                    {key === "returns" && "Return reminders and updates"}
                    {key === "reviews" && "When you receive a new review"}
                    {key === "promotions" && "Special offers and promotions"}
                    {key === "system" && "System updates and announcements"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => onNotificationToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeSection === "privacy" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Lock className="h-5 w-5" />
            Privacy & Security
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={privacy.profileVisibility || "public"}
                onChange={(e) =>
                  onPrivacyUpdate("profileVisibility", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              >
                <option value="public">
                  Public - Everyone can see your profile
                </option>
                <option value="community">
                  Community - Only community members
                </option>
                <option value="private">
                  Private - Only you and connections
                </option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Email on Profile
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) =>
                      onPrivacyUpdate("showEmail", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Phone Number
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showPhone}
                    onChange={(e) =>
                      onPrivacyUpdate("showPhone", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Location
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showLocation}
                    onChange={(e) =>
                      onPrivacyUpdate("showLocation", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeSection === "appearance" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Sun className="h-5 w-5" />
            Appearance
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "light",
                    label: "Light",
                    icon: Sun,
                    color: "text-yellow-500",
                  },
                  {
                    id: "dark",
                    label: "Dark",
                    icon: Moon,
                    color: "text-blue-500",
                  },
                  {
                    id: "system",
                    label: "System",
                    icon: Monitor,
                    color: "text-gray-500",
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => updateTheme(option.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        theme === option.id
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 mx-auto mb-1 ${option.color}`}
                      />
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      fontSize === size
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span
                      className={`${
                        size === "small"
                          ? "text-xs"
                          : size === "large"
                            ? "text-lg"
                            : "text-base"
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 dark:text-gray-300">
                  Compact View
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show more items per page
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={compactView}
                  onChange={(e) => setCompactView(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeSection === "security" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="h-5 w-5" />
            Security
          </h3>

          {/* Change Password */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="text-green-500 text-sm flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  {passwordSuccess}
                </div>
              )}
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                variant="primary"
              >
                {changingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Change Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Two-Factor Authentication
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    2FA Status: {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {twoFactorEnabled
                      ? "Your account is protected with 2FA"
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
                {twoFactorEnabled ? (
                  <Button variant="outline" onClick={disable2FA}>
                    Disable 2FA
                  </Button>
                ) : (
                  <Button variant="outline" onClick={enable2FA}>
                    Enable 2FA
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Active Sessions
            </h4>
            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No active sessions
              </p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {session.device?.toLowerCase().includes("mobile") ? (
                        <Smartphone className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Monitor className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.device || "Unknown Device"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.ip || "Unknown IP"} •{" "}
                          {session.isCurrent ? (
                            <span className="text-green-500">
                              Current session
                            </span>
                          ) : (
                            `Last active ${new Date(session.createdAt).toLocaleDateString()}`
                          )}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="mt-4"
              onClick={revokeAllSessions}
            >
              Log Out All Devices
            </Button>
          </div>
        </div>
      )}

      {/* Data Settings */}
      {activeSection === "data" && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Download className="h-5 w-5" />
            Data Management
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Export My Data
                </p>
                <p className="text-sm text-gray-500">
                  Download all your personal data
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleQuickAction?.bind(null, "backup")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={onLogout}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleQuickAction?.("help")}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Get Help & Support
                </span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
              Danger Zone
            </h4>
            <Button variant="danger" onClick={onDelete} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account Permanently
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Warning: This action cannot be undone. All your data will be
              permanently deleted.
            </p>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Enable Two-Factor Authentication
              </h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {twoFactorQR && (
              <div className="mb-4 text-center">
                <img src={twoFactorQR} alt="2FA QR Code" className="mx-auto" />
                <p className="text-sm text-gray-500 mt-2">
                  Scan this QR code with Google Authenticator or similar app
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Secret: {twoFactorSecret}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={verify2FA}>
                Verify & Enable
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShow2FAModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;