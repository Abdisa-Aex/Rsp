"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  MessageCircle,
  Phone,
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Camera,
  Star,
  Truck,
  Send,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Flag,
  Shield,
  Heart,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast, { Toaster } from "react-hot-toast";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { color: "yellow", icon: Clock, text: "Pending Approval" },
    approved: { color: "blue", icon: CheckCircle, text: "Approved" },
    active: { color: "green", icon: Truck, text: "Active - Currently Rented" },
    completed: { color: "purple", icon: Award, text: "Completed" },
    cancelled: { color: "red", icon: XCircle, text: "Cancelled" },
    disputed: { color: "orange", icon: AlertCircle, text: "Disputed" },
  };
  const cfg = config[status] || config.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-${cfg.color}-100 text-${cfg.color}-800`}
    >
      <Icon className="h-4 w-4" />
      {cfg.text}
    </span>
  );
};

// Timeline Component
const Timeline = ({ exchange }) => {
  const events = [
    {
      key: "requestedAt",
      label: "Request Sent",
      icon: Send,
      date: exchange?.requestedAt || exchange?.createdAt,
    },
    {
      key: "approvedAt",
      label: "Approved",
      icon: CheckCircle,
      date: exchange?.approvedAt,
    },
    {
      key: "activatedAt",
      label: "Pickup / Activated",
      icon: Truck,
      date: exchange?.activatedAt,
    },
    {
      key: "completedAt",
      label: "Returned / Completed",
      icon: Award,
      date: exchange?.completedAt,
    },
  ];

  const getStatus = (date, index) => {
    if (date) return "completed";
    if (index === 0 && exchange?.status !== "cancelled") return "current";
    return "pending";
  };

  return (
    <div className="relative">
      {events.map((event, idx) => {
        const status = getStatus(event.date, idx);
        const Icon = event.icon;
        return (
          <div key={event.key} className="flex items-start gap-4 mb-6 relative">
            {idx < events.length - 1 && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-12 ${status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
            <div
              className={`p-2 rounded-full ${status === "completed" ? "bg-green-100" : status === "current" ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <Icon
                className={`h-5 w-5 ${status === "completed" ? "text-green-600" : status === "current" ? "text-blue-600" : "text-gray-400"}`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${status === "pending" ? "text-gray-500" : "text-gray-900"}`}
              >
                {event.label}
              </p>
              {event.date && (
                <p className="text-xs text-gray-400">
                  {new Date(event.date).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Action Button Component
const ActionButtons = ({ exchange, user, onAction, loading }) => {
  const isOwner = user?.id === exchange?.owner?._id;
  const isBorrower = user?.id === exchange?.borrower?._id;
  const { status } = exchange || {};

  const actions = [];

  if (status === "pending" && isOwner) {
    actions.push({
      label: "Approve Request",
      variant: "success",
      action: "approve",
      icon: CheckCircle,
    });
    actions.push({
      label: "Decline Request",
      variant: "danger",
      action: "decline",
      icon: XCircle,
    });
  }
  if (status === "pending" && isBorrower) {
    actions.push({
      label: "Cancel Request",
      variant: "danger",
      action: "cancel",
      icon: XCircle,
    });
  }
  if (status === "approved" && isOwner) {
    actions.push({
      label: "Mark as Picked Up",
      variant: "primary",
      action: "activate",
      icon: Truck,
    });
  }
  if (status === "active" && isBorrower) {
    actions.push({
      label: "Return Item",
      variant: "primary",
      action: "return",
      icon: Truck,
    });
  }
  if (status === "completed") {
    const hasRated = isOwner ? exchange?.ownerRating : exchange?.borrowerRating;
    if (!hasRated) {
      actions.push({
        label: "Rate User",
        variant: "primary",
        action: "rate",
        icon: Star,
      });
    }
  }

  if (actions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
      {actions.map((action) => (
        <Button
          key={action.action}
          variant={action.variant}
          fullWidth
          onClick={() => onAction(action.action)}
          disabled={loading}
        >
          <action.icon className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

// Main Component
export default function ExchangeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, apiCall, isAuthenticated } = useAuth();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnCondition, setReturnCondition] = useState("good");
  const [returnNotes, setReturnNotes] = useState("");
  const [returnPhotos, setReturnPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (id) fetchExchange();
  }, [id, isAuthenticated]);

  const fetchExchange = async () => {
    try {
      const data = await apiCall(`/exchanges/${id}`);
      if (data.success) setExchange(data.exchange);
      else toast.error("Failed to load exchange");
    } catch (error) {
      toast.error(error.message || "Failed to load exchange");
    } finally {
      setLoading(false);
    }
  };

 const handleAction = async (action) => {
   if (action === "approve") {
     if (!confirm("Approve this exchange request?")) return;
     setUpdating(true);
     try {
       await apiCall(`/exchanges/${id}/status`, {
         method: "PUT",
         body: JSON.stringify({ status: "approved" }),
       });
       toast.success("Request approved!");
       fetchExchange();
     } catch (error) {
       toast.error(error.message || "Failed to approve");
     } finally {
       setUpdating(false);
     }
   } else if (action === "decline") {
     if (!confirm("Decline this exchange request?")) return;
     setUpdating(true);
     try {
       // ✅ FIXED: Use "canceled" (one 'l') not "cancelled"
       await apiCall(`/exchanges/${id}/status`, {
         method: "PUT",
         body: JSON.stringify({ status: "canceled" }),
       });
       toast.success("Request declined");
       router.push("/profile?tab=exchanges");
     } catch (error) {
       toast.error(error.message || "Failed to decline");
     } finally {
       setUpdating(false);
     }
   } else if (action === "cancel") {
     if (!confirm("Cancel this exchange request?")) return;
     setUpdating(true);
     try {
       // ✅ FIXED: Use "canceled" (one 'l') not "cancelled"
       await apiCall(`/exchanges/${id}/status`, {
         method: "PUT",
         body: JSON.stringify({ status: "canceled" }),
       });
       toast.success("Request cancelled");
       router.push("/profile?tab=exchanges");
     } catch (error) {
       toast.error(error.message || "Failed to cancel");
     } finally {
       setUpdating(false);
     }
   } else if (action === "activate") {
     if (!confirm("Mark this item as picked up?")) return;
     setUpdating(true);
     try {
       await apiCall(`/exchanges/${id}/status`, {
         method: "PUT",
         body: JSON.stringify({ status: "active" }),
       });
       toast.success("Item marked as picked up!");
       fetchExchange();
     } catch (error) {
       toast.error(error.message || "Failed to update");
     } finally {
       setUpdating(false);
     }
   } else if (action === "return") {
     setShowReturnModal(true);
   } else if (action === "rate") {
     router.push(`/rate/${id}`);
   }
 };

  const handleReturnSubmit = async () => {
    setUpdating(true);
    try {
      await apiCall(`/exchanges/${id}/return`, {
        method: "POST",
        body: JSON.stringify({
          condition: returnCondition,
          returnNotes,
          returnPhotos,
        }),
      });
      toast.success("Item returned successfully!");
      setShowReturnModal(false);
      fetchExchange();
    } catch (error) {
      toast.error(error.message || "Failed to process return");
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/upload/resource", {
        method: "POST",
        headers: { "x-auth-token": token },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setReturnPhotos([...returnPhotos, ...data.images]);
        toast.success(`${data.images.length} photo(s) uploaded`);
      }
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index) => {
    setReturnPhotos(returnPhotos.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await apiCall(`/exchanges/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });
      toast.success("Message sent!");
      setMessageText("");
      setShowMessageModal(false);
    } catch (error) {
      toast.error("Failed to send message");
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

  if (!exchange) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Exchange Not Found</h2>
            <Button onClick={() => router.push("/profile")}>
              Go to Profile
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const otherUser =
    user?.id === exchange?.owner?._id ? exchange?.borrower : exchange?.owner;
  const isOwner = user?.id === exchange?.owner?._id;
  const resource = exchange?.resource;

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Exchange Details
                    </h1>
                    <p className="text-gray-500 text-sm font-mono">
                      ID: {exchange._id}
                    </p>
                  </div>
                  <StatusBadge status={exchange.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(exchange.startDate).toLocaleDateString()} -{" "}
                    {new Date(exchange.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    {exchange.duration} days
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-green-600">
                      Total: ${exchange.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Exchange Timeline
                </h2>
                <Timeline exchange={exchange} />
              </div>

              {/* Item Details */}
              {resource && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Item Details
                  </h2>
                  <Link
                    href={`/resources/${resource._id}`}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    {resource.images?.[0]?.url && (
                      <img
                        src={resource.images[0].url}
                        alt={resource.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {resource.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {resource.location}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {isOwner ? "Borrower" : "Owner"}
                </h2>
                {otherUser && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                        {otherUser.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {otherUser.fullName}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {otherUser.rating || 4.5}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setShowMessageModal(true)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <ActionButtons
                  exchange={exchange}
                  user={user}
                  onAction={handleAction}
                  loading={updating}
                />
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Rate</span>
                    <span>${exchange.price}/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span>{exchange.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${exchange.price * exchange.duration}</span>
                  </div>
                  {exchange.deposit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit</span>
                      <span>${exchange.deposit}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ${exchange.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {exchange.message && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                  <p className="text-sm font-medium text-yellow-800 mb-1 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message from{" "}
                    {isOwner
                      ? exchange.borrower?.fullName
                      : exchange.owner?.fullName}
                  </p>
                  <p className="text-gray-700 text-sm">{exchange.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title={`Send Message to ${otherUser?.fullName}`}
      >
        <textarea
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Type your message..."
        />
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" onClick={() => setShowMessageModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Return Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Item Condition
            </label>
            <select
              value={returnCondition}
              onChange={(e) => setReturnCondition(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="excellent">Excellent - Like new</option>
              <option value="good">Good - Normal wear</option>
              <option value="fair">Fair - Some issues</option>
              <option value="damaged">Damaged - Significant issues</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Photos
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {returnPhotos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={photo.url}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <Camera className="h-4 w-4" />
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2 inline" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Notes
            </label>
            <textarea
              rows={3}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Any issues or comments..."
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleReturnSubmit} disabled={updating}>
              Confirm Return
            </Button>
            <Button variant="outline" onClick={() => setShowReturnModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}
