"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Mail,
  Smartphone,
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
  Settings,
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
} from "lucide-react";
import Button from "components/ui/Button";

const NotificationsList = ({
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
}) => {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getNotificationIcon = (type) => {
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

  const getNotificationBg = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "request":
        return "bg-green-50 dark:bg-green-900/20";
      case "return":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "review":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case "system":
        return "bg-gray-50 dark:bg-gray-800";
      case "promotion":
        return "bg-pink-50 dark:bg-pink-900/20";
      case "achievement":
        return "bg-orange-50 dark:bg-orange-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-800";
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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return n.type === filter;
  });

  const filters = [
    { id: "all", label: "All", icon: Bell, count: notifications.length },
    {
      id: "unread",
      label: "Unread",
      icon: BellRing,
      count: notifications.filter((n) => !n.read).length,
    },
    {
      id: "message",
      label: "Messages",
      icon: MessageCircle,
      count: notifications.filter((n) => n.type === "message").length,
    },
    {
      id: "request",
      label: "Requests",
      icon: Handshake,
      count: notifications.filter((n) => n.type === "request").length,
    },
    {
      id: "review",
      label: "Reviews",
      icon: Star,
      count: notifications.filter((n) => n.type === "review").length,
    },
    {
      id: "system",
      label: "System",
      icon: Info,
      count: notifications.filter((n) => n.type === "system").length,
    },
    {
      id: "achievement",
      label: "Achievements",
      icon: Award,
      count: notifications.filter((n) => n.type === "achievement").length,
    },
  ];

  const handleDelete = async (id) => {
    setIsDeleting(id);
    await onDelete(id);
    setIsDeleting(null);
  };

  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No notifications
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          When you receive notifications, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Icon className="h-3 w-3" />
                {f.label}
                {f.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      filter === f.id
                        ? "bg-white/20"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {notifications.filter((n) => !n.read).length > 0 && (
            <Button variant="outline" size="small" onClick={onMarkAllRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
              !notification.read ? "ring-1 ring-green-500" : ""
            }`}
          >
            <div className={`p-4 ${getNotificationBg(notification.type)}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-semibold ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                            New
                          </span>
                        )}
                        {notification.priority === "high" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${!notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(notification.time)}
                        </span>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            View Details
                            <ChevronRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        disabled={isDeleting === notification.id}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        {isDeleting === notification.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === notification.id
                              ? null
                              : notification.id,
                          )
                        }
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {expandedId === notification.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === notification.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {new Date(notification.time).toLocaleDateString()} at{" "}
                      {new Date(notification.time).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Notification ID</p>
                    <p className="text-gray-700 dark:text-gray-300 font-mono text-xs mt-1">
                      {notification.id}
                    </p>
                  </div>
                  {notification.data &&
                    Object.keys(notification.data).length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Additional Data
                        </p>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-lg overflow-x-auto">
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No {filter} notifications
          </p>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Clear All Notifications
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete all notifications? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
