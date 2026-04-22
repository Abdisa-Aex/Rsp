"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  Smartphone,
  Globe,
  Mail,
  CheckCircle,
  Loader2,
  Save,
  RefreshCw,
} from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "context/AuthContext";

// import pushService from "@/lib1/pushNotifications";
import pushService from "../../lib/pushNotifications"
// import { toast } from "react-hot-toast";
import { ToastBar } from "react-hot-toast";

const NotificationSettings = () => {
  const { user, apiCall } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    messages: true,
    requests: true,
    returns: true,
    reviews: true,
    promotions: false,
    system: true,
  });

  useEffect(() => {
    loadPreferences();
    checkPushStatus();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await apiCall("/notifications/preferences");
      if (data.success && data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Load preferences error:", error);
    }
  };

  const checkPushStatus = async () => {
    try {
      const subscribed = await pushService.isSubscribed();
      setPushEnabled(subscribed);
    } catch (error) {
      console.error("Check push status error:", error);
    }
  };

  const togglePush = async () => {
    setLoading(true);
    try {
      if (pushEnabled) {
        await pushService.unsubscribe();
        setPushEnabled(false);
        toast.success("Push notifications disabled");
      } else {
        await pushService.requestPermission();
        await pushService.subscribe();
        setPushEnabled(true);
        toast.success("Push notifications enabled");
      }
    } catch (error) {
      toast.error(error.message || "Failed to toggle push notifications");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const data = await apiCall("/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify({ preferences }),
      });
      if (data.success) {
        toast.success("Notification preferences saved");
      }
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const sendTestNotification = async () => {
    try {
      await pushService.sendTest();
      toast.success("Test notification sent! Check your device.");
    } catch (error) {
      toast.error(error.message || "Failed to send test notification");
    }
  };

  const preferenceOptions = [
    {
      key: "messages",
      label: "Messages",
      description: "Get notified when you receive a new message",
    },
    {
      key: "requests",
      label: "Requests",
      description: "Get notified when someone requests your item",
    },
    {
      key: "returns",
      label: "Returns",
      description: "Get notified when an item is due for return",
    },
    {
      key: "reviews",
      label: "Reviews",
      description: "Get notified when you receive a review",
    },
    {
      key: "promotions",
      label: "Promotions",
      description: "Get notified about special offers and updates",
    },
    {
      key: "system",
      label: "System",
      description: "Get notified about system updates and announcements",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Push Notifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Push Notifications
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  pushEnabled
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {pushEnabled ? (
                  <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <BellOff className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </p>
                <p className="text-sm text-gray-500">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <button
              onClick={togglePush}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pushEnabled
                  ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              } disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : pushEnabled ? (
                "Disable"
              ) : (
                "Enable"
              )}
            </button>
          </div>

          {pushEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Push notifications enabled on this device
                  </span>
                </div>
                <button
                  onClick={sendTestNotification}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Send test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Notifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Email Notifications
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Email Updates
              </p>
              <p className="text-sm text-gray-500">
                Receive notifications via email at {user?.email}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {preferenceOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[option.key]}
                    onChange={(e) =>
                      handlePreferenceChange(option.key, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              About Notifications
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              You will also receive important notifications via email. Update your
              email preferences in your profile settings. Push notifications
              require browser permission and may vary by device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
