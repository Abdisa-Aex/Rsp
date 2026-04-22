"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { Save } from "lucide-react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Settings,
  Mail,
  Smartphone,
  Globe,
  MessageCircle,
  Heart,
  Package,
  Handshake,
  Star,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  BellOff,
  BellRing,
  Zap,
  Sparkles,
  Gift,
  Award,
  Trophy,
  Crown,
  Gem,
  Flame,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Lock,
  Unlock,
  CreditCard,
  DollarSign,
  Download,
  Upload,
  RefreshCw,
  Settings as SettingsIcon,
  MoreVertical,
  MoreHorizontal,
  Copy,
  Share2,
  Bookmark,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Flag,
  AlertTriangle,
  HelpCircle,
  Info as InfoIcon,
  Check as CheckIcon,
  X as XIcon,
  ChevronRight,
  ChevronLeft,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Menu,
  Search,
  Filter as FilterIcon,
  Sliders,
  Grid3x3,
  List,
  Map,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Phone,
  Camera,
  Image,
  Video,
  FileText,
  Link as LinkIcon,
  AtSign,
  Hash,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Notification Item Component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onMarkAllRead,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "request":
        return <Handshake className="h-5 w-5 text-green-500" />;
      case "return":
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "system":
        return <Info className="h-5 w-5 text-gray-500" />;
      case "promotion":
        return <Gift className="h-5 w-5 text-pink-500" />;
      case "achievement":
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-50";
      case "request":
        return "bg-green-50";
      case "return":
        return "bg-purple-50";
      case "review":
        return "bg-yellow-50";
      case "system":
        return "bg-gray-50";
      case "promotion":
        return "bg-pink-50";
      case "achievement":
        return "bg-orange-50";
      default:
        return "bg-gray-50";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(notification.id);
    setIsDeleting(false);
  };

  const handleMarkRead = async () => {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`relative group ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}`}
    >
      <div
        className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-2 rounded-full ${getBgColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`font-semibold ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                      New
                    </span>
                  )}
                  {notification.priority === "high" && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${!notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(notification.time)}
                  </span>
                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                      onClick={handleMarkRead}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <button
                    onClick={handleMarkRead}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4 text-gray-500" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Notification Filters Component
const NotificationFilters = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { id: "all", label: "All", icon: Bell, count: counts.all },
    { id: "unread", label: "Unread", icon: BellRing, count: counts.unread },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      count: counts.messages,
    },
    {
      id: "requests",
      label: "Requests",
      icon: Handshake,
      count: counts.requests,
    },
    { id: "reviews", label: "Reviews", icon: Star, count: counts.reviews },
    { id: "system", label: "System", icon: Info, count: counts.system },
    {
      id: "achievements",
      label: "Achievements",
      icon: Award,
      count: counts.achievements,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isActive
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {filter.label}
            {filter.count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Notification Preferences Component
const NotificationPreferences = ({ preferences, onUpdate }) => {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(localPrefs);
    setSaving(false);
  };

  const preferenceGroups = [
    {
      title: "Communication",
      items: [
        {
          key: "email",
          label: "Email Notifications",
          icon: Mail,
          description: "Receive notifications via email",
        },
        {
          key: "push",
          label: "Push Notifications",
          icon: Smartphone,
          description: "Receive push notifications on your device",
        },
        {
          key: "sms",
          label: "SMS Notifications",
          icon: Phone,
          description: "Receive SMS notifications",
        },
      ],
    },
    {
      title: "Activity",
      items: [
        {
          key: "messages",
          label: "New Messages",
          icon: MessageCircle,
          description: "When you receive a new message",
        },
        {
          key: "requests",
          label: "Item Requests",
          icon: Handshake,
          description: "When someone requests your item",
        },
        {
          key: "returns",
          label: "Returns",
          icon: RefreshCw,
          description: "When an item is due for return",
        },
        {
          key: "reviews",
          label: "Reviews",
          icon: Star,
          description: "When you receive a review",
        },
      ],
    },
    {
      title: "Updates",
      items: [
        {
          key: "system",
          label: "System Updates",
          icon: Info,
          description: "Important system announcements",
        },
        {
          key: "promotions",
          label: "Promotions",
          icon: Gift,
          description: "Special offers and promotions",
        },
        {
          key: "achievements",
          label: "Achievements",
          icon: Award,
          description: "When you earn achievements",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {preferenceGroups.map((group) => (
        <div key={group.title}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            {group.title}
          </h4>
          <div className="space-y-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPrefs[item.key]}
                      onChange={(e) =>
                        setLocalPrefs({
                          ...localPrefs,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

// Main Notifications Page Component
export default function NotificationsPage() {
  const router = useRouter();
  const { user, apiCall } = useAuth();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    messages: true,
    requests: true,
    returns: true,
    reviews: true,
    system: true,
    promotions: false,
    achievements: true,
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreRef = useRef(null);

  // Load notifications
  const loadNotifications = async (reset = true) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await apiCall(
        `/notifications?page=${reset ? 1 : page + 1}&limit=20`,
      );
      if (data.success) {
        if (reset) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }
        setPage(data.page);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Load notifications error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load preferences
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

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  // Socket event for new notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification:new");
    };
  }, [socket]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadNotifications(false);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  // Counts for filters
  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    messages: notifications.filter((n) => n.type === "message").length,
    requests: notifications.filter((n) => n.type === "request").length,
    reviews: notifications.filter((n) => n.type === "review").length,
    system: notifications.filter((n) => n.type === "system").length,
    achievements: notifications.filter((n) => n.type === "achievement").length,
  };

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await apiCall(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiCall("/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      await apiCall(`/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  // Delete selected notifications
  const handleDeleteSelected = async () => {
    for (const id of selectedNotifications) {
      await handleDelete(id);
    }
    setSelectedNotifications([]);
    setIsBulkMode(false);
  };

  // Update preferences
  const handleUpdatePreferences = async (newPrefs) => {
    try {
      const data = await apiCall("/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify({ preferences: newPrefs }),
      });
      if (data.success) {
        setPreferences(newPrefs);
      }
    } catch (error) {
      console.error("Update preferences error:", error);
    }
  };

  // Toggle notification selection
  const toggleSelect = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Select all
  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map((n) => n.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedNotifications([]);
    setIsBulkMode(false);
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Stay updated with your latest activity
                </p>
              </div>
              <div className="flex gap-2">
                {!showPreferences && (
                  <>
                    {counts.unread > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                      </button>
                    )}
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Preferences
                    </button>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setIsBulkMode(!isBulkMode)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors flex items-center gap-2 ${
                          isBulkMode
                            ? "bg-green-500 text-white border-green-500"
                            : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        Select
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {isBulkMode && selectedNotifications.length > 0 && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Select all
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Preferences Panel */}
          {showPreferences && (
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Notification Preferences
                </h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <NotificationPreferences
                preferences={preferences}
                onUpdate={handleUpdatePreferences}
              />
            </div>
          )}

          {/* Filters */}
          {!showPreferences && (
            <div className="mb-6">
              <NotificationFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>
          )}

          {/* Notifications List */}
          {!showPreferences && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeFilter === "all"
                      ? "You don't have any notifications yet"
                      : `No ${activeFilter} notifications to show`}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative ${isBulkMode ? "pl-12" : ""}`}
                    >
                      {isBulkMode && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(
                              notification.id,
                            )}
                            onChange={() => toggleSelect(notification.id)}
                            className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                          />
                        </div>
                      )}
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              )}

              {/* Load More Trigger */}
              {hasMore && !loading && !showPreferences && (
                <div ref={loadMoreRef} className="p-4 text-center">
                  {loadingMore && (
                    <Loader2 className="h-6 w-6 animate-spin text-green-500 mx-auto" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
