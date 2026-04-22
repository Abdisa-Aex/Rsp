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
  Flag,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  MoreVertical,
  Trash2,
  RefreshCw,
  Download,
  Shield,
  User,
  Calendar,
  Clock,
  MessageCircle,
  Package,
  UserX,
  Ban,
  Mail,
  Phone,
  MapPin,
  Star,
  Settings,
  LogOut,
  HelpCircle,
  Info,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Report Row Component
const ReportRow = ({ report, onResolve, onDismiss, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
      case "resource":
        return <Package className="h-4 w-4 text-green-500" />;
      case "message":
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Flag className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            Low
          </span>
        );
    }
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getTypeIcon(report.targetType)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {report.targetType === "user"
                ? report.targetUser?.fullName
                : report.targetResource?.title}
            </p>
            <p className="text-xs text-gray-500">
              Reported by {report.reporter?.fullName}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {report.reason}
        </span>
      </td>
      <td className="px-4 py-3">{getPriorityBadge(report.priority)}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {new Date(report.createdAt).toLocaleDateString()}
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
                  onViewDetails(report);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              <button
                onClick={() => {
                  onResolve(report);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600"
              >
                <CheckCircle className="h-4 w-4" />
                Resolve
              </button>
              <button
                onClick={() => {
                  onDismiss(report);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-600"
              >
                <XCircle className="h-4 w-4" />
                Dismiss
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Admin Reports Page Component
export default function AdminReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, apiCall } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/reports");
      return;
    }
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }

    loadReports();
  }, [
    isAuthenticated,
    isAdmin,
    page,
    search,
    statusFilter,
    typeFilter,
    priorityFilter,
    sortBy,
    sortOrder,
  ]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search,
        status: statusFilter,
        type: typeFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
      });
      const data = await apiCall(`/admin/reports?${params.toString()}`);
      if (data.success) {
        setReports(data.reports);
        setTotalPages(data.pagination.pages);
        setTotalReports(data.pagination.total);
      }
    } catch (error) {
      console.error("Load reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (report) => {
    setActionLoading(true);
    try {
      const data = await apiCall(`/admin/reports/${report.id}/resolve`, {
        method: "POST",
        body: JSON.stringify({ action: "resolve" }),
      });
      if (data.success) {
        loadReports();
      }
    } catch (error) {
      console.error("Resolve error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async (report) => {
    setActionLoading(true);
    try {
      const data = await apiCall(`/admin/reports/${report.id}/dismiss`, {
        method: "POST",
        body: JSON.stringify({ action: "dismiss" }),
      });
      if (data.success) {
        loadReports();
      }
    } catch (error) {
      console.error("Dismiss error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportReports = async () => {
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        type: typeFilter,
      });
      const response = await apiCall(
        `/admin/reports/export?${params.toString()}`,
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `reports-${new Date().toISOString()}.csv`;
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
                  Manage Reports
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {totalReports} total reports
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportReports}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={loadReports}
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
                    placeholder="Search reports..."
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
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
                <option value="all">All</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="resource">Resource</option>
                <option value="message">Message</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <ReportRow
                        key={report.id}
                        report={report}
                        onResolve={handleResolve}
                        onDismiss={handleDismiss}
                        onViewDetails={(report) =>
                          router.push(`/admin/reports/${report.id}`)
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
    </>
  );
}
