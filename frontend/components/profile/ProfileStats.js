"use client";

import {
  Package,
  Heart,
  Star,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Leaf,
  Users,
  Award,
  Shield,
} from "lucide-react";

const ProfileStats = ({ userData, analytics }) => {
  const stats = [
    {
      label: "Items Shared",
      value: userData.stats?.itemsShared || 0,
      icon: Package,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      trend: "+2 this month",
    },
    {
      label: "Items Borrowed",
      value: userData.stats?.itemsBorrowed || 0,
      icon: Heart,
      color:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      trend: "+1 this month",
    },
    {
      label: "Positive Reviews",
      value: `${userData.stats?.positiveReviews || 0}/${userData.reviews || 0}`,
      icon: Star,
      color:
        "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
      trend: "98% positive",
    },
    {
      label: "Response Rate",
      value: `${userData.stats?.responseRate || 0}%`,
      icon: Clock,
      color:
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
      trend: "Avg 2.3h",
    },
    {
      label: "Total Savings",
      value: `$${userData.stats?.totalSavings || 0}`,
      icon: DollarSign,
      color:
        "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
      trend: "vs buying new",
    },
    {
      label: "CO₂ Reduced",
      value: `${userData.stats?.carbonReduction || 0}kg`,
      icon: Leaf,
      color: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30",
      trend: "Environmental impact",
    },
    {
      label: "Community Rank",
      value: `#${userData.stats?.communityRank || 0}`,
      icon: Users,
      color:
        "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30",
      trend: "Top 10%",
    },
    {
      label: "Trust Score",
      value: `${userData.stats?.trustScore || 0}%`,
      icon: Shield,
      color: "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30",
      trend: "High trust",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.color} mb-2 md:mb-3`}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 hidden md:block">
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Overview */}
      <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <BarChart3 className="h-5 w-5" />
          Profile Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {Object.entries(analytics || {}).map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 md:p-4"
            >
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
