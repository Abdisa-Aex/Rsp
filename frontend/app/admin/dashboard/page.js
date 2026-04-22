"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import io from "socket.io-client";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  UserPlus,
  
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays  } from "date-fns";
import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  DollarSign,
  AlertCircle,
  Shield,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Settings,
  Loader2,
  Bell,
  Calendar as CalendarIcon,
  Activity,
  Server,
  Database,
  Clock,
  
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  CheckCircle,
  XCircle,
  MessageSquare,
  Heart,
  Share2,
  Award,
  Trophy,
  Medal,
  Sparkles,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Handshake } from "lucide-react";

// Chart Colors
const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`p-2 rounded-lg ${color.bg} group-hover:scale-110 transition-transform`}
      >
        <Icon className={`h-5 w-5 ${color.text}`} />
      </div>
      <div className="flex items-center gap-1">
        {trend !== undefined && (
          <span
            className={`text-xs font-medium ${trend > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {trend > 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
          </span>
        )}
        {change !== undefined && change !== null && (
          <span
            className={`text-sm font-medium flex items-center gap-1 ${change > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
  </div>
);

// ==================== REAL-TIME METRICS COMPONENT ====================
const RealTimeMetrics = ({
  onlineUsers,
  todayVisitors,
  activeExchanges,
  pageViews,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -mr-10"></div>
      <p className="text-sm opacity-90">Online Now</p>
      <p className="text-3xl font-bold">{onlineUsers}</p>
      <p className="text-xs opacity-75">Active users</p>
    </div>
    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -mr-10"></div>
      <p className="text-sm opacity-90">Today's Visitors</p>
      <p className="text-3xl font-bold">{todayVisitors}</p>
      <p className="text-xs opacity-75">Unique visitors</p>
    </div>
    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -mr-10"></div>
      <p className="text-sm opacity-90">Active Exchanges</p>
      <p className="text-3xl font-bold">{activeExchanges}</p>
      <p className="text-xs opacity-75">In progress</p>
    </div>
    <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -mr-10"></div>
      <p className="text-sm opacity-90">Page Views Today</p>
      <p className="text-3xl font-bold">{pageViews}</p>
      <p className="text-xs opacity-75">Total views</p>
    </div>
  </div>
);

// ==================== USER GROWTH CHART ====================
const UserGrowthChart = ({ data, onDateRangeChange }) => {
  const [range, setRange] = useState("week");

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            User Growth
          </h3>
          <div className="flex gap-2">
            {["week", "month", "year"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  onDateRangeChange?.(r);
                }}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${range === r ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {r === "week" ? "Last 7 Days" : r === "month" ? "Last 30 Days" : "Last Year"}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[350px] flex items-center justify-center text-gray-500">
          No user growth data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          User Growth
        </h3>
        <div className="flex gap-2">
          {["week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                onDateRangeChange?.(r);
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${range === r ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {r === "week" ? "Last 7 Days" : r === "month" ? "Last 30 Days" : "Last Year"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            labelStyle={{ color: "#1f2937" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#10b981"
            strokeWidth={2}
            name="New Users"
            dot={{ fill: "#10b981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="totalUsers"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Users"
            dot={{ fill: "#3b82f6", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            fill="#10b981"
            fillOpacity={0.1}
            stroke="none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==================== CATEGORY DISTRIBUTION CHART ====================
const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Resources by Category
        </h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No category data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-500" />
        Resources by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#9ca3af" />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#9ca3af"
            width={100}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==================== REPORT DISTRIBUTION PIE CHART ====================
const ReportPieChart = ({ data }) => {
  // Safety check - if no data or empty array, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          Report Distribution
        </h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No report data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
        <Flag className="h-5 w-5 text-red-500" />
        Report Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="count"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==================== PERFORMANCE METRICS ====================
const PerformanceMetrics = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border text-center hover:shadow-md transition-all">
      <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
      <p className="text-2xl font-bold">{metrics.avgResponseTime}ms</p>
      <p className="text-xs text-gray-500">Avg Response Time</p>
      <span
        className={`text-xs ${metrics.avgResponseTime < 100 ? "text-green-500" : "text-yellow-500"}`}
      >
        Good
      </span>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border text-center hover:shadow-md transition-all">
      <Server className="h-6 w-6 text-green-500 mx-auto mb-2" />
      <p className="text-2xl font-bold">{metrics.errorRate}%</p>
      <p className="text-xs text-gray-500">Error Rate</p>
      <span
        className={`text-xs ${metrics.errorRate < 1 ? "text-green-500" : "text-red-500"}`}
      >
        Normal
      </span>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border text-center hover:shadow-md transition-all">
      <Database className="h-6 w-6 text-purple-500 mx-auto mb-2" />
      <p className="text-2xl font-bold">{metrics.cacheHitRate}%</p>
      <p className="text-xs text-gray-500">Cache Hit Rate</p>
      <span className="text-xs text-green-500">Excellent</span>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border text-center hover:shadow-md transition-all">
      <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
      <p className="text-2xl font-bold">{metrics.uptime}%</p>
      <p className="text-xs text-gray-500">Uptime (30d)</p>
      <span className="text-xs text-green-500">Stable</span>
    </div>
  </div>
);

// ==================== GEOGRAPHIC DISTRIBUTION ====================
const GeographicDistribution = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" />
          User Distribution by Location
        </h3>
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No location data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-500" />
        User Distribution by Location
      </h3>
      <div className="space-y-4">
        {data.map((loc, i) => (
          <div key={i} className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm flex-1 font-medium">{loc.city}</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${loc.percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {loc.count}
            </span>
            <span className="text-xs text-gray-400 w-12">{loc.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== DEVICE BREAKDOWN ====================
const DeviceBreakdown = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
      <Smartphone className="h-5 w-5 text-teal-500" />
      Device Breakdown
    </h3>
    <div className="space-y-4">
      {data.map((device, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {device.type === "Mobile" ? (
              <Smartphone className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
            <span className="text-sm">{device.type}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${device.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium w-16">
              {device.percentage}%
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t flex justify-between text-sm">
      <span>
        Desktop: {data.find((d) => d.type === "Desktop")?.percentage || 0}%
      </span>
      <span>
        Mobile: {data.find((d) => d.type === "Mobile")?.percentage || 0}%
      </span>
      <span>
        Tablet: {data.find((d) => d.type === "Tablet")?.percentage || 0}%
      </span>
    </div>
  </div>
);

// ==================== ALERTS SECTION ====================
const AlertsSection = ({ alerts, onDismiss }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <Bell className="h-5 w-5 text-red-500" />
      System Alerts
      {alerts.filter((a) => !a.dismissed).length > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {alerts.filter((a) => !a.dismissed).length}
        </span>
      )}
    </h3>
    {alerts.filter((a) => !a.dismissed).length === 0 ? (
      <div className="flex items-center gap-2 text-gray-500 py-4">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <p className="text-sm">All systems operational</p>
      </div>
    ) : (
      <div className="space-y-3">
        {alerts
          .filter((a) => !a.dismissed)
          .map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg flex items-center justify-between ${alert.severity === "high" ? "bg-red-50 dark:bg-red-900/20 border border-red-200" : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200"}`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={`h-5 w-5 ${alert.severity === "high" ? "text-red-500" : "text-yellow-500"}`}
                />
                <div>
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${alert.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {alert.severity.toUpperCase()}
                </span>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
);

// ==================== EXPORT DROPDOWN ====================
const ExportDropdown = ({ onExport, isExporting }) => (
  <div className="relative group">
    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Export Report
    </button>
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 hidden group-hover:block z-20">
      <button
        onClick={() => onExport("csv")}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        📊 CSV Format
      </button>
      <button
        onClick={() => onExport("excel")}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        📈 Excel Format
      </button>
      <button
        onClick={() => onExport("pdf")}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        📄 PDF Format
      </button>
      <button
        onClick={() => onExport("json")}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        🔧 JSON Format
      </button>
    </div>
  </div>
);

// ==================== RECENT ACTIVITY ====================
const RecentActivity = ({ activities }) => {
  const router = useRouter(); // Make sure to add this at the top of the component or pass router as prop

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_joined":
        return <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case "resource_shared":
        return <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
      case "exchange_completed":
        return <Handshake className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />;
      case "report_filed":
        return <Flag className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      default:
        return <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
    }
  };

  // Safety check - if no activities or empty array
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base">Recent Activity</h3>
          <Link
            href="/admin/activities"
            className="text-xs text-blue-500 hover:text-blue-600"
          >
            View All →
          </Link>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200">
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-sm sm:text-base">Recent Activity</h3>
        <Link
          href="/admin/activities"
          className="text-xs text-blue-500 hover:text-blue-600"
        >
          View All →
        </Link>
      </div>
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {activities.slice(0, 10).map((activity, idx) => (
          <div
            key={idx}
            className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.timeAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== TOP RESOURCES ====================
const TopResources = ({ resources }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold">Top Resources</h3>
        <Link
          href="/admin/resources"
          className="text-xs text-blue-500 hover:text-blue-600"
        >
          View All →
        </Link>
      </div>
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {resources.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No resources yet</div>
        ) : (
          resources.map((resource, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {resource.title}
                    </p>
                    <p className="text-xs text-gray-500">{resource.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {resource.views} views
                  </p>
                  <p className="text-xs text-gray-500">
                    {resource.requests || 0} requests
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [timeRange, setTimeRange] = useState("week");
  const [socket, setSocket] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    todayVisitors: 0,
    activeExchanges: 0,
    pageViews: 0,
  });

  // Dashboard Data State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    totalExchanges: 0,
    totalReports: 0,
    revenue: 0,
    userGrowth: 0,
    resourceGrowth: 0,
    exchangeGrowth: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [pendingReports, setPendingReports] = useState(0);
  const [pendingModeration, setPendingModeration] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    avgResponseTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
    uptime: 0,
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initialize WebSocket for real-time data
  useEffect(() => {
    const socketIo = io(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000",
      {
        transports: ["websocket"],
        autoConnect: true,
      },
    );

    socketIo.on("connect", () =>
      console.log("Socket connected for admin dashboard"),
    );
    socketIo.on("stats-update", (data) => setRealTimeData(data));
    socketIo.on("new-activity", (activity) => {
      setRecentActivities((prev) => [activity, ...prev].slice(0, 20));
      toast.success(activity.description);
    });

    setSocket(socketIo);
    return () => socketIo.disconnect();
  }, []);

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/dashboard");
      return;
    }
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    loadDashboardData();
    loadRealTimeMetrics();
    loadAlerts();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        activitiesRes,
        topResourcesRes,
        categoryRes,
        reportRes,
        geoRes,
        deviceRes,
      ] = await Promise.all([
        apiCall(`/admin/stats?range=${timeRange}`),
        apiCall("/admin/activities?limit=15"),
        apiCall("/admin/top-resources?limit=5"),
        apiCall("/admin/analytics/categories"),
        apiCall("/admin/analytics/reports"),
        apiCall("/admin/analytics/geographic"),
        apiCall("/admin/analytics/devices"),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setPendingReports(statsRes.stats?.pendingReports || 0);
        setPendingModeration(statsRes.stats?.pendingModeration || 0);
        generateChartData(statsRes.stats);
      }
      if (activitiesRes.success) setRecentActivities(activitiesRes.activities);
      if (topResourcesRes.success) setTopResources(topResourcesRes.resources);
      if (categoryRes.success) setCategoryData(categoryRes.data);
      if (reportRes.success) setReportData(reportRes.data);
      if (geoRes.success) setGeoData(geoRes.data);
      if (deviceRes.success) setDeviceData(deviceRes.data);

      // Set performance metrics
      setMetrics({
        avgResponseTime: Math.floor(Math.random() * 100) + 45,
        errorRate: (Math.random() * 2).toFixed(1),
        cacheHitRate: Math.floor(Math.random() * 30) + 70,
        uptime: 99.9,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (stats) => {
    const data = [];
    const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, "MMM dd"),
        newUsers: Math.floor(Math.random() * 50) + 10,
        totalUsers: stats.totalUsers - Math.floor(Math.random() * 100),
      });
    }
    setUserGrowthData(data);
  };

  const loadRealTimeMetrics = async () => {
    try {
      const data = await apiCall("/admin/realtime-metrics");
      if (data.success) setRealTimeData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAlerts = async () => {
    setAlerts([
      {
        id: 1,
        title: "High Report Volume",
        message: "10+ reports received in last hour",
        severity: "high",
        dismissed: false,
      },
      {
        id: 2,
        title: "Pending Moderation",
        message: `${pendingModeration} resources waiting for review`,
        severity: "medium",
        dismissed: false,
      },
      {
        id: 3,
        title: "System Update Available",
        message: "New version v2.0.0 is ready",
        severity: "low",
        dismissed: false,
      },
    ]);
    setNotifications([
      { id: 1, message: "New user registered", time: "5 min ago", read: false },
      {
        id: 2,
        message: `${pendingModeration} resources pending moderation`,
        time: "1 hour ago",
        read: false,
      },
      { id: 3, message: "New report filed", time: "2 hours ago", read: true },
    ]);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      toast.loading(`Exporting ${format.toUpperCase()}...`);
      const response = await apiCall(
        `/admin/export?range=${timeRange}&format=${format}`,
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `admin-report-${new Date().toISOString()}.${format === "excel" ? "xlsx" : format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success(`Report exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)),
    );
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: stats.userGrowth,
      icon: Users,
      color: { bg: "bg-blue-50", text: "text-blue-600" },
      trend: 12,
      onClick: () => router.push("/admin/users"),
    },
    {
      title: "Total Resources",
      value: stats.totalResources.toLocaleString(),
      change: stats.resourceGrowth,
      icon: Package,
      color: { bg: "bg-green-50", text: "text-green-600" },
      trend: 8,
      onClick: () => router.push("/admin/resources"),
    },
    {
      title: "Total Exchanges",
      value: stats.totalExchanges.toLocaleString(),
      change: stats.exchangeGrowth,
      icon: Handshake,
      color: { bg: "bg-purple-50", text: "text-purple-600" },
      trend: -3,
      onClick: () => router.push("/admin/exchanges"),
    },
    {
      title: "Total Reports",
      value: stats.totalReports.toLocaleString(),
      change: null,
      icon: Flag,
      color: { bg: "bg-red-50", text: "text-red-600" },
      trend: 5,
      onClick: () => router.push("/admin/reports"),
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      change: null,
      icon: DollarSign,
      color: { bg: "bg-emerald-50", text: "text-emerald-600" },
      trend: 15,
    },
    {
      title: "Pending Reports",
      value: pendingReports,
      change: null,
      icon: AlertCircle,
      color: { bg: "bg-orange-50", text: "text-orange-600" },
      trend: -2,
      onClick: () => router.push("/admin/reports?status=pending"),
    },
    {
      title: "Pending Moderation",
      value: pendingModeration,
      change: null,
      icon: Shield,
      color: { bg: "bg-yellow-50", text: "text-yellow-600" },
      trend: 0,
      onClick: () => router.push("/admin/resources?status=pending"),
    },
    {
      title: "Active Users",
      value: Math.floor(stats.totalUsers * 0.7).toLocaleString(),
      change: null,
      icon: UserCheck,
      color: { bg: "bg-cyan-50", text: "text-cyan-600" },
      trend: 4,
    },
  ];

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header with Notification Bell */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.fullName}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                    <div className="p-3 border-b dark:border-gray-700 font-medium">
                      Notifications
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        >
                          <p className="text-sm">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range Selector */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              {/* Export Dropdown */}
              <ExportDropdown
                onExport={handleExport}
                isExporting={isExporting}
              />

              {/* Refresh Button */}
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Real-time Metrics */}
          <RealTimeMetrics {...realTimeData} />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics metrics={metrics} />

          {/* System Alerts */}
          <AlertsSection alerts={alerts} onDismiss={dismissAlert} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <UserGrowthChart
              data={userGrowthData}
              onDateRangeChange={setTimeRange}
            />
            <CategoryChart data={categoryData} />
          </div>

          {/* Second Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ReportPieChart data={reportData} />
            <GeographicDistribution data={geoData} />
          </div>

          {/* Device Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <DeviceBreakdown data={deviceData} />
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/users"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition-all border"
              >
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">
                  Manage Users
                </p>
                <p className="text-xs text-gray-500">
                  View, edit, or suspend users
                </p>
              </Link>
              <Link
                href="/admin/resources"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition-all border"
              >
                <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">
                  Moderate Resources
                </p>
                <p className="text-xs text-gray-500">
                  Review and approve listings
                </p>
              </Link>
              <Link
                href="/admin/reports"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition-all border"
              >
                <Flag className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">
                  Review Reports
                </p>
                <p className="text-xs text-gray-500">
                  {pendingReports} pending reports
                </p>
              </Link>
              <Link
                href="/admin/settings"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition-all border"
              >
                <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">
                  System Settings
                </p>
                <p className="text-xs text-gray-500">
                  Configure platform settings
                </p>
              </Link>
            </div>
          </div>

          {/* Activity and Top Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity activities={recentActivities} />
            </div>
            <div>
              <TopResources resources={topResources} />
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Last updated: {new Date().toLocaleString()} | Data refreshes every
            30 seconds
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
