"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  Loader2,
  Search,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  PiggyBank,
  Landmark,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
  ReceiptText,
  FileText,
  Printer,
  Share2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Info,
  HelpCircle,
  AlertTriangle,
  Check,
  X as XIcon,
  Star,
  Heart,
  Package,
  Handshake,
  MessageCircle,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Transaction Card Component
const TransactionCard = ({ transaction, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "rental":
        return <Handshake className="h-5 w-5 text-blue-500" />;
      case "sale":
        return <Package className="h-5 w-5 text-green-500" />;
      case "deposit":
        return <Banknote className="h-5 w-5 text-purple-500" />;
      case "refund":
        return <ArrowDownRight className="h-5 w-5 text-orange-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAmountColor = (type, amount) => {
    if (type === "refund") return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-green-600";
  };

  const getAmountPrefix = (type, amount) => {
    if (type === "refund") return "+";
    if (amount < 0) return "-";
    return "+";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transaction.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {new Date(transaction.date).toLocaleTimeString()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-lg font-bold ${getAmountColor(transaction.type, transaction.amount)}`}
            >
              {getAmountPrefix(transaction.type, transaction.amount)}$
              {Math.abs(transaction.amount).toFixed(2)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(transaction);
              }}
              className="text-sm text-green-600 hover:text-green-700 mt-1 flex items-center gap-1"
            >
              View Details
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {transaction.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {transaction.paymentMethod || "Credit Card"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reference</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {transaction.reference || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {transaction.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Transaction Filters Component
const TransactionFilters = ({ filters, onFilterChange, onReset }) => {
  const [showDateRange, setShowDateRange] = useState(false);

  const statuses = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const types = [
    { value: "all", label: "All" },
    { value: "rental", label: "Rental" },
    { value: "sale", label: "Sale" },
    { value: "deposit", label: "Deposit" },
    { value: "refund", label: "Refund" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onFilterChange("status", status.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.status === status.value
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => onFilterChange("type", type.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.type === type.value
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <button
          onClick={() => setShowDateRange(!showDateRange)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <span>Date Range</span>
          {showDateRange ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {showDateRange && (
          <div className="space-y-2 mt-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
            />
          </div>
        )}
      </div>

      {/* Amount Range */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minAmount}
            onChange={(e) => onFilterChange("minAmount", e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange("maxAmount", e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

// Transaction Stats Component
const TransactionStats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: ArrowDownRight,
      color: "text-red-500",
      bg: "bg-red-50",
      trend: stats.spentTrend,
    },
    {
      label: "Total Earned",
      value: `$${stats.totalEarned.toFixed(2)}`,
      icon: ArrowUpRight,
      color: "text-green-500",
      bg: "bg-green-50",
      trend: stats.earnedTrend,
    },
    {
      label: "Net Balance",
      value: `$${stats.netBalance.toFixed(2)}`,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50",
      trend: stats.balanceTrend,
    },
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: Receipt,
      color: "text-purple-500",
      bg: "bg-purple-50",
      trend: stats.transactionsTrend,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.trend && (
                <span
                  className={`text-xs font-medium ${stat.trend > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend > 0 ? "+" : ""}
                  {stat.trend}%
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
  );
};

// Transaction Detail Modal Component
const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Transaction Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-gray-900 dark:text-white">
                {transaction.id}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}
            >
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-6 border-y border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 mb-2">Total Amount</p>
            <p
              className={`text-4xl font-bold ${getAmountColor(transaction.type, transaction.amount)}`}
            >
              {getAmountPrefix(transaction.type, transaction.amount)}$
              {Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {transaction.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(transaction.date).toLocaleDateString()} at{" "}
                {new Date(transaction.date).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm text-gray-900 dark:text-white capitalize">
                {transaction.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {transaction.paymentMethod || "Credit Card"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {transaction.reference || "N/A"}
              </p>
            </div>
          </div>

          {/* Related Item */}
          {transaction.item && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Related Item
              </p>
              <Link
                href={`/resources/${transaction.item.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {transaction.item.image && (
                  <img
                    src={transaction.item.image}
                    alt={transaction.item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.item.category}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
            <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Transactions Page Component
export default function TransactionsPage() {
  const router = useRouter();
  const { user, apiCall } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalEarned: 0,
    netBalance: 0,
    totalTransactions: 0,
    spentTrend: 0,
    earnedTrend: 0,
    balanceTrend: 0,
    transactionsTrend: 0,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreRef = useRef(null);

  // Load transactions
  const loadTransactions = async (reset = true) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: reset ? 1 : page + 1,
        limit: 20,
        ...filters,
      });

      const data = await apiCall(`/transactions?${params.toString()}`);
      if (data.success) {
        if (reset) {
          setTransactions(data.transactions);
        } else {
          setTransactions((prev) => [...prev, ...data.transactions]);
        }
        setPage(data.page);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Load transactions error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const data = await apiCall("/transactions/stats");
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Load stats error:", error);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, []);

  // Apply filters
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadTransactions(false);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      type: "all",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  // View transaction details
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // Export transactions
  const handleExport = async (format = "csv") => {
    try {
      const params = new URLSearchParams({
        format,
        ...filters,
      });
      const response = await apiCall(
        `/transactions/export?${params.toString()}`,
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions-${new Date().toISOString()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Transactions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View and manage all your financial transactions
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport("csv")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <TransactionStats stats={stats} />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <TransactionFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>

            {/* Transactions List */}
            <div className="flex-1">
              <div className="space-y-4">
                {loading ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                    <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No transactions found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {Object.values(filters).some((v) => v)
                        ? "Try adjusting your filters"
                        : "You don't have any transactions yet"}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {transactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </AnimatePresence>
                )}

                {/* Load More Trigger */}
                {hasMore && !loading && (
                  <div ref={loadMoreRef} className="py-4 text-center">
                    {loadingMore && (
                      <Loader2 className="h-6 w-6 animate-spin text-green-500 mx-auto" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={selectedTransaction}
      />
    </>
  );
}
