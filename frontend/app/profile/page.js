

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Edit,
  Shield,
  Award,
  Zap,
  Users,
  Camera,
  X,
  Check,
  Share2,
  MoreVertical,
  BarChart3,
  Package,
  Heart,
  Clock,
  TrendingUp,
  Target,
  Leaf,
  DollarSign,
  MessageCircle,
  Bookmark,
  Settings,
  LogOut,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  Sun,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Search,
  Handshake,
  RotateCcw,
  Activity,
  ThumbsUp,
} from "lucide-react";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import AnnouncementBar from "components/layout/AnnouncementBar";
import ProfileHeader from "components/profile/ProfileHeader";
import ProfileStats from "components/profile/ProfileStats";
import ItemsGrid from "components/profile/ItemsGrid";
import ExchangesList from "components/profile/ExchangesList";
import ReviewList from "components/profile/ReviewList";
import SettingsPanel from "components/profile/SettingsPanel";
import WishlistGrid from "components/profile/WishlistGrid";
import NotificationsList from "components/profile/NotificationsList";
import AnalyticsOverview from "components/profile/AnalyticsOverview";
import LogoutModal from "components/modals/LogoutModal";
import ShareProfileModal from "components/modals/ShareProfileModal";
import AddItemModal from "components/modals/AddItemModal";
import DeleteAccountModal from "components/modals/DeleteAccountModal";
import { useToast } from "hooks/useToast";
import toast, { Toaster } from "react-hot-toast";

// Helper function
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </button>
  );
};

// Badge Component
const Badge = ({ name, icon: Icon, color, earned }) => {
  return (
    <div
      className={`relative p-3 rounded-xl text-center transition-all ${
        earned ? "bg-gray-50 hover:scale-105" : "bg-gray-100 opacity-50"
      }`}
    >
      <div
        className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2 shadow-md`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="text-xs font-medium text-gray-700">{name}</div>
      {!earned && (
        <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout, apiCall, isAuthenticated } = useAuth();

  // State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
const [exchangeFilter, setExchangeFilter] = useState("all");
  // Search and filter states for items
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsFilter, setItemsFilter] = useState("all");

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data states
  const [stats, setStats] = useState({
    itemsShared: 0,
    itemsBorrowed: 0,
    successfulExchanges: 0,
    responseRate: 0,
    trustScore: 0,
    points: 0,
    totalSavings: 0,
    carbonSaved: 0,
  });
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    resourceViews: 0,
    totalLikes: 0,
    totalShares: 0,
    monthlyViews: [],
    categoryDistribution: [],
  });
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, router]);

  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Use Promise.allSettled instead of Promise.all to handle individual failures
      const results = await Promise.allSettled([
        apiCall("/users/me").catch(() => ({ success: false, user: null })),
        apiCall("/users/me/stats").catch(() => ({ success: false, stats: {} })),
        apiCall("/users/me/badges").catch(() => ({
          success: false,
          badges: [],
        })),
        apiCall("/users/me/activities?limit=10").catch(() => ({
          success: false,
          activities: [],
        })),
        apiCall("/users/me/items").catch(() => ({ success: false, items: [] })),
        apiCall("/users/me/exchanges").catch(() => ({
          success: false,
          exchanges: [],
        })),
        apiCall("/users/me/reviews").catch(() => ({
          success: false,
          reviews: [],
        })),
        apiCall("/wishlist").catch(() => ({ success: false, wishlist: [] })),
        apiCall("/notifications?limit=20").catch(() => ({
          success: false,
          notifications: [],
        })),
        apiCall("/users/me/analytics").catch(() => ({
          success: false,
          analytics: {},
        })),
      ]);

      // Extract results with fallbacks
      const [
        profileRes,
        statsRes,
        badgesRes,
        activitiesRes,
        itemsRes,
        exchangesRes,
        reviewsRes,
        wishlistRes,
        notificationsRes,
        analyticsRes,
      ] = results;

      if (profileRes.status === "fulfilled" && profileRes.value?.success) {
        setProfile(profileRes.value.user);
      } else {
        console.warn("Profile fetch failed, using fallback");
        setProfile(user); // Fallback to auth user
      }

      if (statsRes.status === "fulfilled" && statsRes.value?.success) {
        setStats(statsRes.value.stats);
      }

      if (badgesRes.status === "fulfilled" && badgesRes.value?.success) {
        setBadges(badgesRes.value.badges);
      }

      if (
        activitiesRes.status === "fulfilled" &&
        activitiesRes.value?.success
      ) {
        setActivities(activitiesRes.value.activities);
      }

      if (itemsRes.status === "fulfilled" && itemsRes.value?.success) {
        setMyItems(itemsRes.value.items);
      }

      if (exchangesRes.status === "fulfilled" && exchangesRes.value?.success) {
        setExchanges(exchangesRes.value.exchanges);
      }

      if (reviewsRes.status === "fulfilled" && reviewsRes.value?.success) {
        setReviews(reviewsRes.value.reviews);
      }

      if (wishlistRes.status === "fulfilled" && wishlistRes.value?.success) {
        setWishlist(wishlistRes.value.wishlist || []);
      }

      if (
        notificationsRes.status === "fulfilled" &&
        notificationsRes.value?.success
      ) {
        setNotifications(notificationsRes.value.notifications || []);
      }

      if (analyticsRes.status === "fulfilled" && analyticsRes.value?.success) {
        setAnalytics(analyticsRes.value.analytics);
      }
    } catch (error) {
      console.error("Load profile error:", error);
      toast.error("Failed to load some profile data");
    } finally {
      setLoading(false);
    }
  };
const handleApprove = async (exchange) => {
  try {
    const response = await apiCall(`/exchanges/${exchange.id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });
    if (response.success) {
      toast.success("Exchange approved");
      loadProfileData();
    }
  } catch (error) {
    toast.error("Failed to approve");
  }
};

const handleDecline = async (exchange) => {
  try {
    const response = await apiCall(`/exchanges/${exchange.id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "canceled" }),
    });
    if (response.success) {
      toast.success("Exchange declined");
      loadProfileData();
    }
  } catch (error) {
    toast.error("Failed to decline");
  }
};
  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await apiCall("/upload/avatar", {
        method: "POST",
        body: formData,
        headers: {},
      });

      if (response.success) {
        setProfile({ ...profile, avatar: response.url });
        toast.success("Avatar updated successfully");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (updates) => {
    const result = await updateProfile(updates);
    if (result.success) {
      setProfile(result.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
    return result;
  };

  // ============ ADD MISSING handleAddItem FUNCTION ============
  const handleAddItem = async (itemData) => {
    setIsSubmitting(true);
    try {
      const response = await apiCall("/resources", {
        method: "POST",
        body: itemData,
        headers: {},
      });
      if (response.success) {
        toast.success("Item added successfully!");
        loadProfileData();
        setShowAddItemModal(false);
      } else {
        toast.error(response.message || "Failed to add item");
      }
    } catch (error) {
      console.error("Add item error:", error);
      toast.error(error.message || "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };
  // ============================================================

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.push("/");
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiCall("/users/me", { method: "DELETE" });
      toast.success("Account deleted successfully");
      logout();
      router.push("/");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle export data
  const handleExportData = async (format = "json") => {
    try {
      const response = await apiCall(`/users/me/export?format=${format}`);
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `profile-data-${new Date().toISOString()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (item) => {
    try {
      await apiCall(`/wishlist/${item.id}`, { method: "DELETE" });
      setWishlist(wishlist.filter((i) => i.id !== item.id));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  // Handle move to request
  const handleMoveToRequest = (item) => {
    router.push(`/resources/${item.id}?request=true`);
  };

  // Handle return item
  const handleReturn = (exchange) => {
    router.push(`/return/${exchange.id}`);
  };

  // Handle rate exchange
  const handleRate = (exchange) => {
    router.push(`/rate/${exchange.id}`);
  };

  // Handle notification actions
  const handleMarkAsRead = async (id) => {
    try {
      await apiCall(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiCall("/notifications/read-all", { method: "PUT" });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await apiCall(`/notifications/${id}`, { method: "DELETE" });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await apiCall("/notifications", { method: "DELETE" });
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Clear notifications error:", error);
    }
  };

  // Handle quick action from settings
  const handleQuickAction = (action) => {
    if (action === "backup") {
      handleExportData();
    } else if (action === "help") {
      router.push("/help");
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "items", label: "My Items", icon: Package, count: myItems.length },
    {
      id: "exchanges",
      label: "Exchanges",
      icon: Handshake,
      count: exchanges.length,
    },
    { id: "reviews", label: "Reviews", icon: Star, count: reviews.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      count: notifications.filter((n) => !n.read).length,
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium text-gray-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">
                {profile?.email}
              </span>
            </div>
            {profile?.phone && (
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium text-gray-900">
                  {profile.phone}
                </span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900">
                  {profile.location}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Trust Score</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    style={{ width: `${stats.trustScore}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900">
                  {stats.trustScore}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Interests</span>
              <div className="flex flex-wrap gap-2 justify-end">
                {profile?.interests?.map((interest, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                )) || <span className="text-gray-400">None</span>}
              </div>
            </div>
          </div>
        );

      case "items":
        return (
          <ItemsGrid
            filteredItems={myItems} // ← Correct prop name
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemsFilter={itemsFilter}
            setItemsFilter={setItemsFilter}
            setShowAddItemModal={setShowAddItemModal}
            onEdit={(item) => router.push(`/resources/${item._id}/edit`)}
            onDelete={async (item) => {
              if (confirm(`Delete "${item.title}"?`)) {
                try {
                  const response = await apiCall(`/resources/${item._id}`, {
                    method: "DELETE",
                  });

                  if (response && response.success === true) {
                    toast.success("Item deleted successfully");
                    // ONLY update local state - NO loadProfileData()
                    setMyItems((prevItems) =>
                      prevItems.filter((i) => i._id !== item._id),
                    );
                    // Also update stats
                    setStats((prev) => ({
                      ...prev,
                      itemsShared: Math.max(0, (prev.itemsShared || 0) - 1),
                    }));
                  } else {
                    toast.error(response?.message || "Failed to delete item");
                  }
                } catch (error) {
                  toast.error(error.message || "Failed to delete item");
                }
              }
            }}
            onView={(item) => router.push(`/resources/${item._id}`)}
          />
        );

      case "exchanges":
        return (
          <ExchangesList
            exchanges={exchanges}
            filter={exchangeFilter}
            onFilterChange={setExchangeFilter}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onReturn={handleReturn}
            onRate={handleRate}
          />
        );

      case "reviews":
        return (
          <ReviewList
            reviews={reviews}
            onHelpful={async (reviewId) => {
              await apiCall(`/reviews/${reviewId}/helpful`, { method: "POST" });
              loadProfileData();
            }}
          />
        );

      case "wishlist":
        return (
          <WishlistGrid
            wishlist={wishlist}
            onRemove={handleRemoveFromWishlist}
            onMoveToRequest={handleMoveToRequest}
          />
        );

      case "notifications":
        return (
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllRead={handleMarkAllRead}
            onDelete={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
          />
        );

      case "analytics":
        return <AnalyticsOverview analytics={analytics} />;

      case "settings":
        return (
          <SettingsPanel
            user={profile}
            onUpdate={handleProfileUpdate}
            onLogout={() => setShowLogoutModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Profile Header */}
          <ProfileHeader
            userData={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdateUser={handleProfileUpdate}
            onAvatarUpload={handleAvatarUpload}
            uploadingAvatar={uploadingAvatar}
            onShare={() => setShowShareModal(true)}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
            <StatCard
              icon={Package}
              label="Items Shared"
              value={stats.itemsShared}
              trend={12}
              color="green"
            />
            <StatCard
              icon={Handshake}
              label="Exchanges"
              value={stats.successfulExchanges}
              trend={8}
              color="blue"
            />
            <StatCard
              icon={Star}
              label="Trust Score"
              value={`${stats.trustScore}%`}
              trend={5}
              color="amber"
            />
            <StatCard
              icon={Award}
              label="Points"
              value={stats.points}
              trend={15}
              color="purple"
            />
            <StatCard
              icon={DollarSign}
              label="Money Saved"
              value={`$${stats.totalSavings}`}
              trend={20}
              color="emerald"
            />
            <StatCard
              icon={Leaf}
              label="CO₂ Saved"
              value={`${stats.carbonSaved}kg`}
              trend={10}
              color="green"
            />
            <StatCard
              icon={Eye}
              label="Profile Views"
              value={analytics.profileViews || 0}
              color="gray"
            />
            <StatCard
              icon={TrendingUp}
              label="Response Rate"
              value={`${stats.responseRate}%`}
              trend={3}
              color="cyan"
            />
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {badges.map((badge, i) => (
                  <Badge
                    key={i}
                    name={badge.name}
                    icon={badge.icon}
                    color={badge.color}
                    earned={badge.earned}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-6">{renderTabContent()}</div>
          </div>

          {/* Activity Feed */}
          {activities.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                      {activity.type === "share" ? (
                        <Package className="h-4 w-4" />
                      ) : (
                        <Handshake className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{activity.user}</span>
                        <span className="text-gray-600">
                          {" "}
                          {activity.action}{" "}
                        </span>
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        profileUrl={`${window.location.origin}/profile/${user?.id}`}
        userName={user?.fullName}
      />

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAdd={handleAddItem}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </>
  );
}
