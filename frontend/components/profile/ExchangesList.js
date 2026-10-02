// "use client";

import { useState } from "react";
import {
  Handshake,
  RotateCcw,
  Star,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  MessageCircle,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";

const ExchangesList = ({
  exchanges,
  filter = "all",
  onFilterChange,
  onApprove,
  onDecline,
  onReturn,
  onRate,
  onView,
  apiCall,
  currentUserId,
}) => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);

  // // Get current user ID from localStorage or use a prop


  const normalizeExchange = (exchange) => {
    // const currentUserId = getCurrentUserId();/

    // Debug: Log what we're getting
    console.log("Exchange raw data:", {
      owner: exchange.owner,
      borrower: exchange.borrower,
      ownerType: typeof exchange.owner,
      borrowerType: typeof exchange.borrower,
    });

    // Helper to get the actual ID from owner/borrower (could be object or string)
    const getUserId = (user) => {
      if (!user) return null;
      if (typeof user === "string") return user;
      if (user._id) return user._id;
      return null;
    };

    // Helper to get the name
 const getUserName = (user) => {
   if (!user) return "Unknown";

   if (typeof user === "string") {
     return "Unknown";
   }

   return user.fullName || user.username || user.name || "Unknown";
 };

  const ownerId = getUserId(exchange.owner);
  const borrowerId = getUserId(exchange.borrower);

  const ownerName = getUserName(exchange.owner);
  const borrowerName = getUserName(exchange.borrower);

  // FIX ObjectId/string mismatch
  const currentId = String(currentUserId || "");

  console.log("USER CHECK:", {
    currentId,
    ownerId,
    borrowerId,
    ownerName,
    borrowerName,
  });

  // Determine which one is the OTHER participant
  const isCurrentUserOwner = String(ownerId) === currentId;

  const otherUserId = isCurrentUserOwner ? borrowerId : ownerId;

  const otherUserName = isCurrentUserOwner ? borrowerName : ownerName;

    return {
      id: exchange._id,
      type:
        exchange.type === "lent"
          ? "lend"
          : exchange.type === "borrowed"
            ? "borrow"
            : exchange.type,
      resourceTitle:
        exchange.resource?.title || exchange.title || "Unknown Item",
      resourceDescription: exchange.resource?.description || "",
      resourceId: exchange.resource?._id,
      location:
        exchange.resource?.location || exchange.location || "Not specified",

      // Store IDs for message button
      ownerId: ownerId,
      borrowerId: borrowerId,
      otherUserId: otherUserId, // ← This is what the message button needs
      otherUserName: otherUserName,

      partner: {
        id: otherUserId,
        fullName: otherUserName,
      },

      startDate: exchange.startDate,
      endDate: exchange.endDate,
      duration:
        exchange.duration ||
        Math.ceil(
          (new Date(exchange.endDate) - new Date(exchange.startDate)) /
            (1000 * 60 * 60 * 24),
        ),
      status: exchange.status,
      totalAmount: exchange.totalAmount || 0,
      rated: exchange.rated || false,
      lastMessage: exchange.lastMessage || null,
    };
  };

  const normalizedExchanges = exchanges.map(normalizeExchange);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "disputed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "canceled":
        return <XCircle className="h-4 w-4" />;
      case "disputed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "canceled", label: "Canceled" },
  ];

  const filteredExchanges = normalizedExchanges.filter((exchange) => {
    if (filter === "all") return true;
    return exchange.status === filter;
  });

  if (exchanges.length === 0) {
    return (
      <div className="text-center py-12">
        <Handshake className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No exchanges yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start sharing and borrowing resources to see your exchanges here
        </p>
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/browse")}
        >
          Browse Resources
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange?.(f.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Exchanges List */}
      <div className="space-y-4">
        {filteredExchanges.map((exchange) => (
          <div
            key={exchange.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === exchange.id ? null : exchange.id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getStatusColor(exchange.status)}`}
                  >
                    {getStatusIcon(exchange.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {exchange.resourceTitle}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {exchange.type === "borrow" ||
                        exchange.type === "borrowed"
                          ? `From: ${exchange.partner?.fullName || "Unknown"}`
                          : `To: ${exchange.partner?.fullName || "Unknown"}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(
                          exchange.startDate,
                        ).toLocaleDateString()} -{" "}
                        {new Date(exchange.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      exchange.status === "active"
                        ? "success"
                        : exchange.status === "pending"
                          ? "warning"
                          : "default"
                    }
                  >
                    {exchange.status.charAt(0).toUpperCase() +
                      exchange.status.slice(1)}
                  </Badge>
                  {exchange.totalAmount > 0 && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                      ${exchange.totalAmount}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === exchange.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Item Details</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {exchange.resourceDescription ||
                        "No description provided"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {exchange.location}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction Details</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Start Date:</span>
                        <span className="text-gray-700">
                          {new Date(exchange.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">End Date:</span>
                        <span className="text-gray-700">
                          {new Date(exchange.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-700">
                          {exchange.duration} days
                        </span>
                      </div>
                      {exchange.totalAmount > 0 && (
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">Total:</span>
                          <span className="text-green-600">
                            ${exchange.totalAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Preview */}
                {exchange.lastMessage && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Last message
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {exchange.lastMessage}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {/* APPROVE/DECLINE BUTTONS FOR PENDING REQUESTS */}
                  {exchange.status === "pending" && onApprove && onDecline && (
                    <>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => onApprove(exchange)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDecline(exchange)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}

                  {/* ========== FIXED MESSAGE BUTTON ========== */}



                  {/* RETURN BUTTON */}
                  {exchange.status === "active" && onReturn && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => {
                        if (!exchange.id) {
                          toast.error("Cannot return: Exchange ID missing");
                          return;
                        }
                        onReturn(exchange);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Return Item
                    </Button>
                  )}

                  {/* RATE BUTTON */}
                  {exchange.status === "completed" &&
                    !exchange.rated &&
                    onRate && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => onRate(exchange)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Rate Experience
                      </Button>
                    )}

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => {
                      const resourceId = exchange.resourceId;
                      if (resourceId) {
                        const itemObject = {
                          _id: resourceId,
                          id: resourceId,
                          title: exchange.resourceTitle,
                        };
                        onView?.(itemObject);
                      } else {
                        toast.error("Cannot view resource: ID missing");
                      }
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Resource"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredExchanges.length === 0 && (
        <div className="text-center py-12">
          <Handshake className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No {filter} exchanges found
          </p>
        </div>
      )}
    </div>
  );
};

export default ExchangesList;