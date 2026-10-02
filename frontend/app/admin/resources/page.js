"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  Trash2,
  Edit,
  Ban,
  RefreshCw,
  Download,
  Shield,
  Flag,
  User,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Settings,
  LogOut,
  HelpCircle,
  Info,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Resource Row Component
const ResourceRow = ({
  resource,
  onApprove,
  onReject,
  onDelete,
  onViewDetails,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {resource.images?.[0] && (
            <img
              src={resource.images[0].url}
              alt={resource.title}
              className="w-10 h-10 object-cover rounded-lg"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {resource.title}
            </p>
            <p className="text-xs text-gray-500">
              by {resource.owner?.fullName}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {resource.category}
      </td>
      <td className="px-4 py-3">{getStatusBadge(resource.moderationStatus)}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {new Date(resource.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span>{resource.rating || "New"}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {resource.views}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  onViewDetails(resource);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              {resource.moderationStatus === "pending" && (
                <>
                  <button
                    onClick={() => {
                      onApprove(resource);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      onReject(resource);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  onDelete(resource);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Admin Resources Page Component
export default function AdminResourcesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, apiCall } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Categories
  const categories = [
    "Tools",
    "Gardening",
    "Kitchen",
    "Books",
    "Electronics",
    "Furniture",
    "Sports",
    "Music",
    "Art",
    "Business",
    "Education",
  ];

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/resources");
      return;
    }
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }

    loadResources();
  }, [
    isAuthenticated,
    isAdmin,
    page,
    search,
    statusFilter,
    categoryFilter,
    sortBy,
    sortOrder,
  ]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search,
        status: statusFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
      });
      const data = await apiCall(`/admin/resources?${params.toString()}`);
      if (data.success) {
        console.log("Loaded resources:", data.resources);
        setResources(data.resources);
        setTotalPages(data.pagination.pages);
        setTotalResources(data.pagination.total);
      }
    } catch (error) {
      console.error("Load resources error:", error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Use resource._id instead of resource.id
  const handleApprove = async (resource) => {
    setActionLoading(true);
    try {
      const data = await apiCall(`/admin/resources/${resource._id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ action: "approve" }),
      });
      if (data.success) {
        loadResources();
      }
    } catch (error) {
      console.error("Approve error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // FIXED: Use selectedResource._id instead of selectedResource.id
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      const data = await apiCall(
        `/admin/resources/${selectedResource._id}/moderate`,
        {
          method: "POST",
          body: JSON.stringify({ action: "reject", reason: rejectReason }),
        },
      );
      if (data.success) {
        loadResources();
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedResource(null);
      }
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // FIXED: Use resource._id instead of resource.id
  const handleDelete = async (resource) => {
    if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      setActionLoading(true);
      try {
        const data = await apiCall(`/admin/resources/${resource._id}`, {
          method: "DELETE",
        });
        if (data.success) {
          loadResources();
        } else {
          alert(data.message || "Failed to delete resource");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.message || "An error occurred while deleting");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleExportResources = async () => {
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        category: categoryFilter,
      });
      const response = await apiCall(
        `/admin/resources/export?${params.toString()}`,
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `resources-${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Moderate Resources
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {totalResources} total resources
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportResources}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={loadResources}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Resource
                        {sortBy === "title" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortBy === "date" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ) : resources.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No resources found
                      </td>
                    </tr>
                  ) : (
                    // FIXED: Use resource._id as key
                    resources.map((resource) => (
                      <ResourceRow
                        key={resource._id}
                        resource={resource}
                        onApprove={handleApprove}
                        onReject={(resource) => {
                          setSelectedResource(resource);
                          setShowRejectModal(true);
                        }}
                        onDelete={handleDelete}
                        // FIXED: Use resource._id in URL
                        onViewDetails={(resource) =>
                          router.push(`/admin/resources/${resource._id}`)
                        }
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Reject Modal */}
      {showRejectModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Reject Resource
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting "{selectedResource.title}".
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              placeholder="Reason for rejection..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Reject"
                )}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedResource(null);
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
