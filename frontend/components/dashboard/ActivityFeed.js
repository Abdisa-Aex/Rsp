"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Heart,
  Share2,
  MoreVertical,
  Package,
  Handshake,
  RotateCcw,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

const ActivityFeed = ({
  activities,
  onLike,
  onShare,
  showAll,
  onToggleShowAll,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const getActivityIcon = (action) => {
    switch (action) {
      case "shared":
        return <Package className="h-4 w-4 text-green-500" />;
      case "borrowed":
        return <Handshake className="h-4 w-4 text-blue-500" />;
      case "returned":
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
      case "reviewed":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "joined":
        return <Users className="h-4 w-4 text-indigo-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "shared":
        return "from-green-500 to-emerald-600";
      case "borrowed":
        return "from-blue-500 to-cyan-600";
      case "returned":
        return "from-purple-500 to-pink-600";
      case "reviewed":
        return "from-yellow-500 to-orange-600";
      case "joined":
        return "from-indigo-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
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

  const displayedActivities = showAll ? activities : activities?.slice(0, 5);

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No activity yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Share items to start the activity feed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activity Feed</h3>
        {activities.length > 5 && (
          <button
            onClick={onToggleShowAll}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showAll ? "Show Less" : `View ${activities.length - 5} More`}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayedActivities?.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div
                className={`flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all cursor-pointer ${
                  expandedId === activity.id
                    ? "bg-gray-50 dark:bg-gray-700/50"
                    : ""
                }`}
                onClick={() =>
                  setExpandedId(expandedId === activity.id ? null : activity.id)
                }
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getActivityColor(activity.action)} flex items-center justify-center text-white shadow-sm flex-shrink-0`}
                >
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{activity.user}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {" "}
                      {activity.action}{" "}
                    </span>
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(activity.time)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike?.(activity);
                      }}
                      className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-3 w-3 transition-colors ${
                          activity.liked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                      <span className="text-gray-500">
                        {activity.likes || 0}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(activity);
                      }}
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {getActivityIcon(activity.action)}
              </div>

              {/* Expanded Details */}
              {expandedId === activity.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-13 pl-13 mt-2 mb-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Resource</p>
                      <Link
                        href={`/resources/${activity.resourceId}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {activity.item}
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {activity.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {activity.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAll && activities.length > 5 && (
        <button
          onClick={onToggleShowAll}
          className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium w-full text-center py-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
