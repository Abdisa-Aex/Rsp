"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Bell,
  Package,
  Flag,
  Handshake,
  UserPlus,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function AllActivitiesPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) router.push("/login");
    else loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await apiCall("/admin/activities?limit=50");
      if (data.success) setActivities(data.activities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                All Activities
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Complete history of platform activities
              </p>
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {activities.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No activities found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity, idx) => (
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
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-xs text-gray-400">
            Showing {activities.length} total activities
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
