"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "user",
    phone: "",
    location: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) router.push("/login");
    else loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const data = await apiCall(`/admin/users/${userId}`);
      if (data.success)
        setFormData({
          fullName: data.user.fullName || "",
          role: data.user.role || "user",
          phone: data.user.phone || "",
          location: data.user.location || "",
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiCall(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: formData.role }),
      });
      setMessage({ type: "success", text: "User updated successfully" });
      setTimeout(() => router.push(`/admin/users/${userId}`), 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {message && (
            <div
              className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              {message.text}
            </div>
          )}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/admin/users/${userId}`}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Edit User</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-lg bg-white rounded-xl shadow-sm p-6"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}{" "}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
