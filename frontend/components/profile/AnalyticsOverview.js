"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Handshake,
  DollarSign,
  Leaf,
  Award,
  Star,
  Eye,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Button from "components/ui/Button";

const AnalyticsOverview = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("activity");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  const fetchAnalytics = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = getAuthToken();
      if (!token) {
        console.warn("No auth token found");
        setAnalytics(null);
        return;
      }

      const response = await fetch(`${API_URL}/api/users/me/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const stats = [
    {
      label: "Total Views",
      value: analytics?.totalViews?.toLocaleString() || "0",
      change: "+12%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    },
    {
      label: "Profile Views",
      value: analytics?.profileViews?.toLocaleString() || "0",
      change: "+8%",
      trend: "up",
      icon: Users,
      color:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    },
    {
      label: "Items Shared",
      value: analytics?.itemsShared?.toLocaleString() || "0",
      change: "+15%",
      trend: "up",
      icon: Package,
      color:
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
    },
    {
      label: "Exchanges",
      value: analytics?.exchanges?.toLocaleString() || "0",
      change: "+23%",
      trend: "up",
      icon: Handshake,
      color:
        "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    },
    {
      label: "Money Saved",
      value: `$${analytics?.moneySaved?.toLocaleString() || "0"}`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color:
        "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
    },
    {
      label: "CO₂ Saved",
      value: `${analytics?.carbonSaved?.toLocaleString() || "0"}kg`,
      change: "+32%",
      trend: "up",
      icon: Leaf,
      color: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30",
    },
    {
      label: "Rating",
      value: analytics?.rating?.toFixed(1) || "0",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color:
        "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
    },
    {
      label: "Response Rate",
      value: `${analytics?.responseRate || 0}%`,
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30",
    },
  ];

  // Mock data for chart (replace with real data from backend when available)
  const weeklyData = [
    { day: "Mon", views: 124, exchanges: 12, newUsers: 3 },
    { day: "Tue", views: 148, exchanges: 15, newUsers: 4 },
    { day: "Wed", views: 167, exchanges: 18, newUsers: 5 },
    { day: "Thu", views: 153, exchanges: 16, newUsers: 4 },
    { day: "Fri", views: 189, exchanges: 22, newUsers: 7 },
    { day: "Sat", views: 210, exchanges: 25, newUsers: 8 },
    { day: "Sun", views: 198, exchanges: 23, newUsers: 6 },
  ];

  const monthlyData = [
    { week: "Week 1", views: 850, exchanges: 95, newUsers: 28 },
    { week: "Week 2", views: 920, exchanges: 108, newUsers: 32 },
    { week: "Week 3", views: 980, exchanges: 115, newUsers: 35 },
    { week: "Week 4", views: 1050, exchanges: 125, newUsers: 40 },
  ];

  const chartData = timeRange === "week" ? weeklyData : monthlyData;

  const getMaxValue = () => {
    if (chartType === "views")
      return Math.max(...chartData.map((d) => d.views));
    if (chartType === "exchanges")
      return Math.max(...chartData.map((d) => d.exchanges));
    return Math.max(...chartData.map((d) => d.newUsers));
  };

  const maxValue = getMaxValue();

  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };

  const getBarColor = () => {
    if (chartType === "views") return "bg-blue-500";
    if (chartType === "exchanges") return "bg-green-500";
    return "bg-purple-500";
  };

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      timeRange,
      analytics,
      chartData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={() => fetchAnalytics()}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your activity and impact over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <div className="flex gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === "week"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === "month"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Month
            </button>
          </div>
          <Button variant="outline" size="small" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {stat.change && (
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("views")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === "views"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Views
          </button>
          <button
            onClick={() => setChartType("exchanges")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === "exchanges"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Handshake className="h-4 w-4 inline mr-1" />
            Exchanges
          </button>
          <button
            onClick={() => setChartType("users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === "users"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Users className="h-4 w-4 inline mr-1" />
            New Users
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {timeRange === "week" ? "Last 7 days" : "Last 4 weeks"}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Activity Overview
        </h4>
        <div className="flex items-end gap-4 h-64">
          {chartData.map((item, idx) => {
            let value;
            if (chartType === "views") value = item.views;
            else if (chartType === "exchanges") value = item.exchanges;
            else value = item.newUsers;

            const height = getBarHeight(value);
            const label = item.day || item.week;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center">
                  <div
                    className={`w-full max-w-[40px] ${getBarColor()} rounded-t-lg transition-all hover:opacity-80`}
                    style={{ height: `${height}px` }}
                  />
                  <div className="absolute -top-6 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {value}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Distribution */}
      {analytics?.categoryDistribution &&
        analytics.categoryDistribution.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-500" />
              Category Distribution
            </h4>
            <div className="space-y-4">
              {analytics.categoryDistribution.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {cat.name}
                    </span>
                    <span className="text-gray-500">
                      {cat.percentage}% ({cat.count} items)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Environmental Impact
            </h4>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.carbonSaved || 0}kg
          </p>
          <p className="text-sm text-gray-600 mt-2">CO₂ emissions saved</p>
          <p className="text-xs text-gray-500 mt-1">
            🌱 Equivalent to planting{" "}
            {Math.floor((analytics?.carbonSaved || 0) / 5)} trees
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Financial Impact
            </h4>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${analytics?.moneySaved || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">Money saved by sharing</p>
          <p className="text-xs text-gray-500 mt-1">
            💰 ~${Math.floor((analytics?.moneySaved || 0) / 10)} saved on
            average per exchange
          </p>
        </div>
      </div>

      {/* Community Impact */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Community Impact
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics?.peopleHelped || 0}
            </p>
            <p className="text-xs text-gray-600">People Helped</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics?.communityRank || "Top 10%"}
            </p>
            <p className="text-xs text-gray-600">Community Rank</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics?.positiveImpact || 0}
            </p>
            <p className="text-xs text-gray-600">Positive Impact Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
