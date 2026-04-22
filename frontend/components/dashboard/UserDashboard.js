"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";

export default function UserDashboard({ user }) {
  const [stats, setStats] = useState({
    resourcesShared: 0,
    resourcesBorrowed: 0,
    reputation: 0,
    activeTransactions: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome back, {user.fullName}!</h1>
          <p className="text-indigo-100 mt-2">
            {user.userType === "student" && "📚 Ready to share knowledge?"}
            {user.userType === "faculty" && "👨‍🏫 Your expertise matters"}
            {user.userType === "alumni" && "🌟 Give back to your community"}
            {user.userType === "external" && "🤝 Welcome to our community"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
            label="Resources Shared"
            value={stats.resourcesShared}
            bgColor="bg-indigo-50"
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-green-600" />}
            label="Resources Borrowed"
            value={stats.resourcesBorrowed}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-yellow-600" />}
            label="Reputation"
            value={stats.reputation}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-red-600" />}
            label="Active Transactions"
            value={stats.activeTransactions}
            bgColor="bg-red-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Share a Resource"
            description="List something you can share"
            icon="📤"
            color="from-green-500 to-emerald-600"
            href="/share"
          />
          <QuickActionCard
            title="Browse Resources"
            description="Find what you need"
            icon="🔍"
            color="from-blue-500 to-indigo-600"
            href="/browse"
          />
          <QuickActionCard
            title="My Transactions"
            description="Track your borrows/lends"
            icon="📋"
            color="from-purple-500 to-pink-600"
            href="/transactions"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Activity items would go here */}
            <p className="text-gray-500 text-center py-8">
              No recent activity to show
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white rounded-lg">{icon}</div>
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
