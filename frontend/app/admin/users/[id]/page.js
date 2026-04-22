"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Star,
  Shield,
  Package,
  Loader2,
  Ban,
  Edit,
  Trash2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) router.push("/login");
    else loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const [userRes, resourcesRes] = await Promise.all([
        apiCall(`/admin/users/${userId}`),
        apiCall(`/users/${userId}/resources?limit=10`),
      ]);
      if (userRes.success) setUser(userRes.user);
      if (resourcesRes.success) setResources(resourcesRes.resources || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/users"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">User Details</h1>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/users/${userId}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" /> Edit User
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user.fullName?.charAt(0) || "U"}
                </div>
                <h2 className="text-xl font-bold mt-4">{user.fullName}</h2>
                <p className="text-gray-500">{user.email}</p>
                {user.isBanned && (
                  <span className="mt-2 inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    Banned
                  </span>
                )}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4" />
                  <span className="text-gray-600">Username:</span>
                  <span>{user.username || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4" />
                  <span className="text-gray-600">Role:</span>
                  <span className="capitalize">{user.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-gray-600">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  <span className="text-gray-600">Joined:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">Rating:</span>
                  <span>{user.rating || "No ratings"}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold mb-3">Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {user.stats?.itemsShared || 0}
                    </p>
                    <p className="text-xs">Items Shared</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {user.stats?.itemsBorrowed || 0}
                    </p>
                    <p className="text-xs">Items Borrowed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" /> User's Resources (
                {resources.length})
              </h3>
              {resources.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No resources shared yet
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((r) => (
                    <div
                      key={r._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{r.title}</p>
                        <p className="text-sm text-gray-500">{r.category}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${r.moderationStatus === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {r.moderationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
