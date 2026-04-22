"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  CreditCard,
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
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Shield,
  Key,
  Fingerprint,
  QrCode,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock as ClockIcon,
  Save,
  X,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";

const SettingsPanel = ({
  notifications,
  setNotifications,
  handleNotificationToggle,
  privacy,
  setPrivacy,
  showPassword,
  setShowPassword,
  setShowDeleteModal,
  setShowLogoutModal,
  handleQuickAction,
}) => {
  const [activeSection, setActiveSection] = useState("account");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState("medium");
  const [compactView, setCompactView] = useState(false);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [autoDownloadMedia, setAutoDownloadMedia] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
const [timezone, setTimezone] = useState("Africa/Addis_Ababa");
  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data", icon: Download },
  ];

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      setPasswordError("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

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
                Language Preference
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              >
                <option value="en">English</option>
                <option value="am">Amharic</option>
                <option value="om">Oromo</option>
                <option value="so">Somali</option>
                <option value="ti">Tigrinya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              >
                <option value="Africa/Addis_Ababa">Addis Ababa (EAT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
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
                    {key === "newRequests" &&
                      "When someone requests your items"}
                    {key === "messages" && "When you receive a new message"}
                    {key === "updates" && "Platform updates and announcements"}
                    {key === "promotions" && "Special offers and promotions"}
                    {key === "reminders" &&
                      "Return reminders and upcoming events"}
                    {key === "communityDigest" &&
                      "Weekly community activity digest"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationToggle(key)}
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
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              >
                <option value="public">
                  Public - Everyone can see your profile
                </option>
                <option value="community">
                  Community - Only Jigjiga University members
                </option>
                <option value="private">
                  Private - Only you and your connections
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Sharing
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 dark:text-gray-300">
                    Share activity with community
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 dark:text-gray-300">
                    Allow search engines to index profile
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </label>
              </div>
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
                <button
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme === "light"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Sun className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme === "dark"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Moon className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme === "system"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Monitor className="h-6 w-6 mx-auto mb-1 text-gray-500" />
                  <span className="text-sm">System</span>
                </button>
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
                      className={`text-sm ${
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
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
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
                  Minimum 8 characters
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
                    2FA Status
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Active Sessions
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Chrome on Windows
                    </p>
                    <p className="text-xs text-gray-500">
                      Active now • Jigjiga, Ethiopia
                    </p>
                  </div>
                </div>
                <button className="text-sm text-red-500 hover:text-red-600">
                  Revoke
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Safari on iPhone
                    </p>
                    <p className="text-xs text-gray-500">
                      Last active 2 hours ago • Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
                <button className="text-sm text-red-500 hover:text-red-600">
                  Revoke
                </button>
              </div>
            </div>
            <Button variant="outline" className="mt-4">
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
                  Auto-save Drafts
                </p>
                <p className="text-sm text-gray-500">
                  Automatically save your message drafts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveDrafts}
                  onChange={(e) => setAutoSaveDrafts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Auto-download Media
                </p>
                <p className="text-sm text-gray-500">
                  Automatically download images and videos in messages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDownloadMedia}
                  onChange={(e) => setAutoDownloadMedia(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleQuickAction("backup")}
              >
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Backup All Data
                </span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowLogoutModal(true)}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout All Devices
                </span>
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleQuickAction("help")}
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
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="w-full"
            >
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
    </div>
  );
};

export default SettingsPanel;
