"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Package,
  Heart,
  Star,
  Users,
  RotateCcw,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
    // fetchSavedSearches(); // Commented out - endpoint not implemented
  }, [filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found");
        setActivities([]);
        return;
      }

      // Build URL with filter
      let url = "http://localhost:5000/api/users/me/activities";
      if (filter !== "all") {
        url += `?action=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          "x-auth-token": token, // ← Use only this header
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.activities) {
        // Transform backend data to match component expectations
        const transformedActivities = data.activities.map((activity) => ({
          id: activity.id || activity._id,
          action: activity.type, // ← Map 'type' to 'action'
          item: activity.title, // ← Map 'title' to 'item'
          user: activity.user,
          userId: activity.userId,
          time: activity.timeAgo || getTimeAgo(activity.createdAt),
          timestamp: activity.createdAt,
          status: activity.status,
          startDate: activity.startDate,
          endDate: activity.endDate,
        }));
        setActivities(transformedActivities);
      } else {
        setError(data.message || "Failed to fetch activities");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time
  const getTimeAgo = (date) => {
    if (!date) return "recently";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(date).toLocaleDateString();
  };

  // fetchSavedSearches temporarily disabled
  // const fetchSavedSearches = async () => { ... };

  const getActivityIcon = (action) => {
    switch (action) {
      case "borrowed":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "shared":
        return <Package className="h-4 w-4 text-green-500" />;
      case "reviewed":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "joined":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "returned":
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
      case "messaged":
        return <MessageCircle className="h-4 w-4 text-indigo-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "borrowed":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "shared":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "reviewed":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "joined":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "returned":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "messaged":
        return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "shared", label: "Shared" },
    { id: "borrowed", label: "Borrowed" },
    { id: "returned", label: "Returned" },
    { id: "reviewed", label: "Reviewed" },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchActivities}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Recent Activity
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
              expandedId === activity.id ? "bg-gray-50 dark:bg-gray-800/50" : ""
            }`}
            onClick={() =>
              setExpandedId(expandedId === activity.id ? null : activity.id)
            }
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.action)}`}
              >
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {activity.action === "borrowed" &&
                    `Borrowed ${activity.item} from ${activity.user}`}
                  {activity.action === "shared" && `Shared ${activity.item}`}
                  {activity.action === "reviewed" &&
                    `Reviewed ${activity.item}`}
                  {activity.action === "joined" && `Joined ${activity.group}`}
                  {activity.action === "returned" &&
                    `Returned ${activity.item}`}
                  {activity.action === "messaged" &&
                    `Messaged ${activity.user}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.time}
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${expandedId === activity.id ? "rotate-180" : ""}`}
              />
            </div>

            {/* Expanded Details */}
            {expandedId === activity.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {activity.item && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Item</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {activity.item}
                      </p>
                    </div>
                  )}
                  {activity.user && activity.action !== "shared" && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">User</p>
                      <p className="text-gray-900 dark:text-white">
                        {activity.user}
                      </p>
                    </div>
                  )}
                  {activity.status && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {activity.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Saved Searches - Temporarily disabled */}
      {savedSearches.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Saved Searches
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {savedSearches.map((search) => (
              <div
                key={search._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {search.query}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {search.count} items found
                </div>
                <button className="mt-2 text-sm text-green-600 hover:text-green-700">
                  Search Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
