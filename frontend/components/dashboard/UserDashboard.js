"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Package,
  Handshake,
  Heart,
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const { user, apiCall, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    resourcesShared: 0,
    resourcesBorrowed: 0,
    reputation: 0,
    activeTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadStats();
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const statsRes = await apiCall("/users/me/stats");
      if (statsRes.success) {
        setStats({
          resourcesShared: statsRes.stats.itemsShared || 0,
          resourcesBorrowed: statsRes.stats.itemsBorrowed || 0,
          reputation: Math.floor(statsRes.stats.trustScore || 0),
          activeTransactions: statsRes.stats.activeExchanges || 0,
        });
      }
    } catch (error) {
      console.error("Load stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-green-100 mt-2">
            {user?.userType === "student" &&
              "📚 Ready to share knowledge and resources?"}
            {user?.userType === "faculty" &&
              "👨‍🏫 Your expertise matters to the community"}
            {user?.userType === "alumni" && "🌟 Give back to your community"}
            {(!user?.userType || user?.userType === "external") &&
              "🤝 Welcome to our sharing community"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="h-6 w-6 text-green-600" />}
            label="Resources Shared"
            value={stats.resourcesShared}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Handshake className="h-6 w-6 text-blue-600" />}
            label="Resources Borrowed"
            value={stats.resourcesBorrowed}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-yellow-600" />}
            label="Trust Score"
            value={`${stats.reputation}%`}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-purple-600" />}
            label="Active Transactions"
            value={stats.activeTransactions}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Share a Resource"
            description="List something you can share with the community"
            icon="📤"
            color="from-green-500 to-emerald-600"
            href="/share"
          />
          <QuickActionCard
            title="Browse Resources"
            description="Find items, tools, or skills you need"
            icon="🔍"
            color="from-blue-500 to-indigo-600"
            href="/browse"
          />
          <QuickActionCard
            title="My Transactions"
            description="Track your borrows, lends, and returns"
            icon="📋"
            color="from-purple-500 to-pink-600"
            href="/profile?tab=exchanges"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Wishlist Items</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Reviews Received</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Carbon Saved (kg)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

function QuickActionCard({ title, description, icon, color, href }) {
  return (
    <a
      href={href}
      className={`bg-gradient-to-r ${color} rounded-xl p-6 text-white hover:shadow-lg transition-all transform hover:scale-105`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </a>
  );
}
