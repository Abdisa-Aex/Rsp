"use client";

import {
  User,
  Package,
  Heart,
  Clock,
  Star,
  BarChart3,
  Settings,
  Bookmark,
  Handshake,
  MessageCircle,
  Bell,
  Shield,
} from "lucide-react";

const ProfileTabs = ({ activeTab, setActiveTab, renderTabContent }) => {
  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "items", label: "My Items", icon: Package },
    { id: "borrowed", label: "Borrowed", icon: Heart },
    { id: "activity", label: "Activity", icon: Clock },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "wishlist", label: "Wishlist", icon: Bookmark },
    { id: "exchanges", label: "Exchanges", icon: Handshake },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">{renderTabContent()}</div>
    </div>
  );
};

export default ProfileTabs;
