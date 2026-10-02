"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Package,
  Star,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle,
  Share2,
  Heart,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  Tag,
  Briefcase,
  Shield,
  Award,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  QrCode,
  FileText,
  Info,
  Zap,
  Wifi,
  Battery,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Watch,
  Mic,
  Video,
  Printer,
  Speaker,
  Tv,
  Gamepad,
  Book,
  GraduationCap,
  Briefcase as BusinessIcon,
  Home,
  Car,
  Bike,
  Utensils,
  Coffee,
  Shirt,
  Gift,
  Sparkles,
  TrendingDown,
  Activity,
  BarChart,
  PieChart,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Image from "next/image";

// Modern Image Gallery Component
const ImageGallery = ({ images = [], title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center h-96">
        <div className="text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-video">
          <img
            src={currentImage.url}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsZoomed(true)}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 rounded-lg text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-all"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === idx
                  ? "border-green-500 ring-2 ring-green-500/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-green-300"
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <XCircle className="h-6 w-6" />
          </button>
          <img
            src={currentImage.url}
            alt={title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      icon: CheckCircle,
      color: "green",
      label: "Approved",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-400",
    },
    pending: {
      icon: Clock,
      color: "yellow",
      label: "Pending Review",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-400",
    },
    rejected: {
      icon: XCircle,
      color: "red",
      label: "Rejected",
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-400",
    },
    suspended: {
      icon: AlertCircle,
      color: "orange",
      label: "Suspended",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-800 dark:text-orange-400",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
};

// Info Card Component
const InfoCard = ({ icon: Icon, label, value, color = "blue" }) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-all">
    <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
      <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white mt-1">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ onClick, icon: Icon, label, variant = "primary" }) => {
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary:
      "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${variants[variant]}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, trend, color = "green" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {trend > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

// Quick Action Card
const QuickActionCard = ({ icon: Icon, label, onClick, color = "green" }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
  >
    <div
      className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-full group-hover:scale-110 transition-transform`}
    >
      <Icon className={`h-5 w-5 text-${color}-600`} />
    </div>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </span>
  </button>
);

export default function AdminResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { apiCall, isAuthenticated, isAdmin } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin/resources");
      return;
    }
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    loadResource();
  }, [params.id]);

  const loadResource = async () => {
    try {
      const data = await apiCall(`/admin/resources/${params.id}`);
      if (data.success) {
        setResource(data.resource);
      } else {
        setError(data.message || "Resource not found");
      }
    } catch (error) {
      console.error("Load error:", error);
      setError(error.message || "Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${resource?.title}"?`)) {
      try {
        const data = await apiCall(`/admin/resources/${resource._id}`, {
          method: "DELETE",
        });
        if (data.success) {
          router.push("/admin/resources");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleApprove = async () => {
    try {
      const data = await apiCall(`/admin/resources/${resource._id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ action: "approve" }),
      });
      if (data.success) {
        loadResource();
      }
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const data = await apiCall(`/admin/resources/${resource._id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ action: "reject", reason }),
      });
      if (data.success) {
        loadResource();
      }
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: Smartphone,
      Books: Book,
      Tools: Wrench,
      Sports: Activity,
      Music: Headphones,
      Art: Palette,
      Business: BusinessIcon,
      Education: GraduationCap,
      Furniture: Home,
      Kitchen: Utensils,
      Gardening: Leaf,
      Clothing: Shirt,
    };
    const Icon = icons[category] || Package;
    return Icon;
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading resource details...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !resource) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Resource Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error ||
                "The resource you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              href="/admin/resources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const CategoryIcon = getCategoryIcon(resource.category);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/resources"
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {resource.title}
                  </h1>
                  <StatusBadge status={resource.moderationStatus} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Resource ID: {resource._id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ActionButton
                onClick={() =>
                  window.open(`/resources/${resource._id}`, "_blank")
                }
                icon={ExternalLink}
                label="View Public"
                variant="secondary"
              />
              <ActionButton
                onClick={copyToClipboard}
                icon={copied ? CheckCircle : Copy}
                label={copied ? "Copied!" : "Copy Link"}
                variant="secondary"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Gallery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-6">
                <ImageGallery images={resource.images} title={resource.title} />
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Description
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {resource.description || "No description provided."}
                </p>
              </div>

              {/* Specifications */}
              {resource.specifications &&
                Object.keys(resource.specifications).length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Specifications
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(resource.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              {String(value)}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Features */}
              {resource.features && resource.features.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Features & Amenities
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tags
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Total Views"
                    value={resource.views || 0}
                    icon={Eye}
                    color="blue"
                  />
                  <StatCard
                    label="Rating"
                    value={resource.rating?.toFixed(1) || "New"}
                    icon={Star}
                    color="yellow"
                  />
                  <StatCard
                    label="Requests"
                    value={resource.requests || 0}
                    icon={MessageCircle}
                    color="purple"
                  />
                  <StatCard
                    label="Bookmarks"
                    value={resource.bookmarks || 0}
                    icon={Heart}
                    color="red"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <InfoCard
                    icon={CategoryIcon}
                    label="Category"
                    value={resource.category}
                    color="green"
                  />
                  <InfoCard
                    icon={MapPin}
                    label="Location"
                    value={resource.location}
                    color="red"
                  />
                  <InfoCard
                    icon={Calendar}
                    label="Created"
                    value={new Date(resource.createdAt).toLocaleDateString()}
                    color="orange"
                  />
                  <InfoCard
                    icon={Clock}
                    label="Last Updated"
                    value={new Date(resource.updatedAt).toLocaleDateString()}
                    color="purple"
                  />
                  {resource.condition && (
                    <InfoCard
                      icon={Shield}
                      label="Condition"
                      value={resource.condition.replace("_", " ").toUpperCase()}
                      color="teal"
                    />
                  )}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Price Type
                    </span>
                    <span className="font-medium capitalize">
                      {resource.priceType || "Free"}
                    </span>
                  </div>
                  {resource.priceType === "rental" && (
                    <>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Price
                        </span>
                        <span className="font-medium text-green-600">
                          ${resource.price}/{resource.priceUnit || "day"}
                        </span>
                      </div>
                      {resource.deposit > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Security Deposit
                          </span>
                          <span className="font-medium">
                            ${resource.deposit}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {resource.priceType === "deposit" && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Deposit Amount
                      </span>
                      <span className="font-medium">${resource.deposit}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                  Owner Information
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {resource.owner?.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {resource.owner?.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {resource.owner?.email}
                    </p>
                    {resource.owner?.phone && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {resource.owner.phone}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Moderation Actions */}
              {resource.moderationStatus === "pending" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-yellow-200 dark:border-yellow-800 p-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                    Moderation Actions
                  </h3>
                  <div className="space-y-3">
                    <ActionButton
                      onClick={handleApprove}
                      icon={CheckCircle}
                      label="Approve Resource"
                      variant="primary"
                    />
                    <ActionButton
                      onClick={handleReject}
                      icon={XCircle}
                      label="Reject Resource"
                      variant="danger"
                    />
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-800 p-6">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase mb-4">
                  Danger Zone
                </h3>
                <ActionButton
                  onClick={handleDelete}
                  icon={Trash2}
                  label="Delete Resource"
                  variant="danger"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  This action cannot be undone. This will permanently delete the
                  resource and all associated data.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-3 gap-3">




                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Resource
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <input
                  type="text"
                  value={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  readOnly
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-center gap-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                  <WhatsApp className="h-5 w-5" />
                </button>
                <button className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                QR Code
              </h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg inline-block mx-auto">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Scan this QR code to view the resource
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

// WhatsApp icon component (since it might not be imported)
const WhatsApp = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.032 2.017c-5.523 0-10 4.477-10 10 0 1.752.456 3.475 1.316 4.987L2 22l5.111-1.318c1.454.783 3.1 1.2 4.825 1.2 5.524 0 10-4.477 10-10s-4.476-10-10-10zm0 1.5c4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5c-1.517 0-2.995-.402-4.278-1.155l-.29-.168-3.034.783.839-2.986-.18-.305c-.842-1.336-1.285-2.87-1.285-4.457 0-4.69 3.81-8.5 8.5-8.5z" />
  </svg>
);

// Missing icon imports
const Wrench = (props) => <Package {...props} />;
const Leaf = (props) => <Package {...props} />;
const Palette = (props) => <Package {...props} />;
