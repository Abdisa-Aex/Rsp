"use client";

import {
  Clock,
  Heart,
  MoreVertical,
  Package,
  Handshake,
  Star,
  Users,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

const ActivityItem = ({ activity }) => {
  // Map backend 'action' to component 'type'
  const getIcon = () => {
    switch (
      activity.action // ← FIXED: use 'action' not 'type'
    ) {
      case "shared":
        return Package;
      case "borrowed":
        return Heart; // ← Heart for borrowed items
      case "returned":
        return RotateCcw;
      case "reviewed":
        return Star;
      case "joined":
        return Users;
      case "messaged":
        return MessageCircle;
      default:
        return Package;
    }
  };

  const getColor = () => {
    switch (
      activity.action // ← FIXED: use 'action' not 'type'
    ) {
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
      case "messaged":
        return "from-sky-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getActionText = () => {
    switch (activity.action) {
      case "shared":
        return "shared";
      case "borrowed":
        return "borrowed";
      case "returned":
        return "returned";
      case "reviewed":
        return "reviewed";
      case "joined":
        return "joined";
      case "messaged":
        return "messaged";
      default:
        return activity.action || "interacted with";
    }
  };

  const Icon = getIcon();

  // Handle different field names from backend
  const userName = activity.user || activity.otherUser || "Someone";
  const actionText = getActionText();
  const itemName = activity.item || "an item";
  const timeDisplay = activity.time || activity.timeAgo || "recently";

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all group">
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-r ${getColor()} flex items-center justify-center text-white shadow-sm shrink-0`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-semibold">{userName}</span>
          <span className="text-gray-600 dark:text-gray-400">
            {" "}
            {actionText}{" "}
          </span>
          <span className="font-medium">{itemName}</span>
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
