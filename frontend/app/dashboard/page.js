"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks";
import { useNotifications } from "@/hooks";
import { useLocalStorage } from "@/hooks";
import { QrReader } from "react-qr-reader";
import { useDebounce } from "@/hooks";
import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  Package,
  Handshake,
  MessageSquare,
  CalendarDays,
  TrendingUp,
  Award,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  QrCode,
  Gift,
  Sparkles,
  Sun,
  Moon,
  Users,
  BookOpen,
  Laptop,
  Camera,
  DollarSign,
  Shield,
  Trophy,
  Flame,
  Eye,
  AlertCircle,
  Edit2,
  Send,
  Heart,
  Share2,
  Grid3x3,
  List,
  X,
  Calendar,
  Check,
  Upload,
  Sparkle,
  User,
  HelpCircle,
  ThumbsUp,
  Download,
  Trash,
  Trash2,
  Database,
  Palette,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RotateCcw as RotateIcon,
  CheckCircle2,
  Loader2,
  CheckSquare,
  Coins,
  Leaf,
  Copy,
} from "lucide-react";
import Facebook from "react-feather";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import toast, { Toaster } from "react-hot-toast";

// ============ CONSTANTS (Keep ALL your header colors) ============
const headerColors = {
  default: {
    name: "Default Green",
    gradient: "from-green-500 to-green-600",
    bg: "bg-gradient-to-r from-green-500 to-green-600",
    text: "text-white",
    buttonGradient: "from-green-500 to-green-600",
    iconHover: "hover:bg-green-600",
    searchBg: "bg-green-600/20",
    searchText: "text-white",
  },
  ocean: {
    name: "Ocean Blue",
    gradient: "from-blue-500 to-cyan-600",
    bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
    text: "text-white",
    buttonGradient: "from-blue-500 to-cyan-600",
    iconHover: "hover:bg-blue-600",
    searchBg: "bg-blue-600/20",
    searchText: "text-white",
  },
  sunset: {
    name: "Sunset Orange",
    gradient: "from-orange-500 to-red-600",
    bg: "bg-gradient-to-r from-orange-500 to-red-600",
    text: "text-white",
    buttonGradient: "from-orange-500 to-red-600",
    iconHover: "hover:bg-orange-600",
    searchBg: "bg-orange-600/20",
    searchText: "text-white",
  },
  purple: {
    name: "Royal Purple",
    gradient: "from-purple-500 to-pink-600",
    bg: "bg-gradient-to-r from-purple-500 to-pink-600",
    text: "text-white",
    buttonGradient: "from-purple-500 to-pink-600",
    iconHover: "hover:bg-purple-600",
    searchBg: "bg-purple-600/20",
    searchText: "text-white",
  },
  emerald: {
    name: "Emerald",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    text: "text-white",
    buttonGradient: "from-emerald-500 to-teal-600",
    iconHover: "hover:bg-emerald-600",
    searchBg: "bg-emerald-600/20",
    searchText: "text-white",
  },
  midnight: {
    name: "Midnight",
    gradient: "from-gray-800 to-gray-900",
    bg: "bg-gradient-to-r from-gray-800 to-gray-900",
    text: "text-white",
    buttonGradient: "from-gray-800 to-gray-900",
    iconHover: "hover:bg-gray-700",
    searchBg: "bg-gray-700/20",
    searchText: "text-white",
  },
  cherry: {
    name: "Cherry Blossom",
    gradient: "from-pink-500 to-rose-600",
    bg: "bg-gradient-to-r from-pink-500 to-rose-600",
    text: "text-white",
    buttonGradient: "from-pink-500 to-rose-600",
    iconHover: "hover:bg-pink-600",
    searchBg: "bg-pink-600/20",
    searchText: "text-white",
  },
  electric: {
    name: "Electric Blue",
    gradient: "from-cyan-400 to-blue-600",
    bg: "bg-gradient-to-r from-cyan-400 to-blue-600",
    text: "text-white",
    buttonGradient: "from-cyan-400 to-blue-600",
    iconHover: "hover:bg-cyan-600",
    searchBg: "bg-cyan-600/20",
    searchText: "text-white",
  },
  forest: {
    name: "Forest",
    gradient: "from-green-700 to-emerald-800",
    bg: "bg-gradient-to-r from-green-700 to-emerald-800",
    text: "text-white",
    buttonGradient: "from-green-700 to-emerald-800",
    iconHover: "hover:bg-green-800",
    searchBg: "bg-green-800/20",
    searchText: "text-white",
  },
  coral: {
    name: "Coral Reef",
    gradient: "from-red-400 to-orange-500",
    bg: "bg-gradient-to-r from-red-400 to-orange-500",
    text: "text-white",
    buttonGradient: "from-red-400 to-orange-500",
    iconHover: "hover:bg-red-500",
    searchBg: "bg-red-500/20",
    searchText: "text-white",
  },
  indigo: {
    name: "Indigo Dream",
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    text: "text-white",
    buttonGradient: "from-indigo-500 to-purple-600",
    iconHover: "hover:bg-indigo-600",
    searchBg: "bg-indigo-600/20",
    searchText: "text-white",
  },
  amber: {
    name: "Amber Glow",
    gradient: "from-amber-500 to-yellow-600",
    bg: "bg-gradient-to-r from-amber-500 to-yellow-600",
    text: "text-white",
    buttonGradient: "from-amber-500 to-yellow-600",
    iconHover: "hover:bg-amber-600",
    searchBg: "bg-amber-600/20",
    searchText: "text-white",
  },
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRelativeTime = (date) => {
  if (!date) return "Just now";
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">
        Loading your dashboard...
      </p>
    </div>
  </div>
);

const LoadingOverlay = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl text-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-3" />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

const Tooltip = ({ children, content, position = "top" }) => {
  const [show, setShow] = useState(false);
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap ${positions[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2 rounded-lg text-white transition-colors ${type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Books",
    subcategory: "Textbook",
    description: "",
    condition: "Good",
    location: "Campus Library",
    availableFrom: new Date().toISOString().split("T")[0],
    availableUntil: "",
    price: 0,
    deposit: 0,
    tags: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = {
    Books: ["Textbook", "Novel", "Reference", "Magazine", "Comic"],
    Electronics: [
      "Laptop",
      "Phone",
      "Tablet",
      "Headphones",
      "Camera",
      "Charger",
    ],
    Tools: ["Drill", "Saw", "Hammer", "Wrench", "Screwdriver", "Measuring"],
    Sports: ["Ball", "Racket", "Gear", "Equipment", "Apparel", "Fitness"],
    Clothing: ["Shirt", "Pants", "Jacket", "Shoes", "Accessories", "Uniform"],
    Furniture: ["Chair", "Desk", "Lamp", "Shelf", "Bed", "Storage"],
    Other: ["Misc", "Art", "Music", "Game", "Food", "Pet"],
  };

  const conditions = ["Like New", "Very Good", "Good", "Fair", "Acceptable"];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (formData.deposit < 0) newErrors.deposit = "Deposit cannot be negative";
    if (
      formData.availableFrom &&
      formData.availableUntil &&
      new Date(formData.availableFrom) > new Date(formData.availableUntil)
    ) {
      newErrors.dates =
        "Available from date must be before available until date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setIsImageLoading(true);
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsImageLoading(false);
      };
      reader.onerror = () => {
        alert("Error loading image");
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newItem = {
      id: generateId(),
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      condition: formData.condition,
      location: formData.location,
      availableFrom: formData.availableFrom,
      availableUntil: formData.availableUntil,
      price: formData.price,
      deposit: formData.deposit,
      tags: formData.tags,
      image: imagePreview,
      status: "Available",
      requests: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
    };
    onAdd(newItem);
    setIsSubmitting(false);
    onClose();
    setFormData({
      name: "",
      category: "Books",
      subcategory: "Textbook",
      description: "",
      condition: "Good",
      location: "Campus Library",
      availableFrom: new Date().toISOString().split("T")[0],
      availableUntil: "",
      price: 0,
      deposit: 0,
      tags: [],
      image: null,
    });
    setImagePreview(null);
    setTagInput("");
    setErrors({});
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Share New Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Item Name *
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${errors.name ? "border-red-500" : ""}`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Calculus Textbook"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    subcategory: categories[e.target.value]?.[0] || "",
                  })
                }
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subcategory
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
              >
                {categories[formData.category]?.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your item in detail..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Condition
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
              >
                {conditions.map((cond) => (
                  <option key={cond}>{cond}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Available From
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.availableFrom}
                onChange={(e) =>
                  setFormData({ ...formData, availableFrom: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Until (Optional)
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={formData.availableUntil}
                onChange={(e) =>
                  setFormData({ ...formData, availableUntil: e.target.value })
                }
              />
            </div>
          </div>
          {errors.dates && (
            <p className="text-xs text-red-500">{errors.dates}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Rental Price ($/day)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${errors.price ? "border-red-500" : ""}`}
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Security Deposit ($)
              </label>
              <input
                type="number"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${errors.deposit ? "border-red-500" : ""}`}
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deposit: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.deposit && (
                <p className="text-xs text-red-500 mt-1">{errors.deposit}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tags (e.g., textbook, study)"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <span className="text-sm">Choose Image</span>
              </label>
              {isImageLoading && (
                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              )}
              {imagePreview && !isImageLoading && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max size: 5MB. JPG, PNG, GIF supported.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isSubmitting ? "Sharing..." : "Share Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestItemModal = ({ isOpen, onClose, item, onRequest }) => {
  const [message, setMessage] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [duration, setDuration] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!pickupDate) {
      alert("Please select a pickup date");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onRequest(item, {
      message,
      pickupDate,
      duration,
      requestedAt: new Date().toISOString(),
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Request: {item?.name || item?.cells?.[0]}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You're requesting to borrow this item. The owner will be notified
              and can approve or decline your request.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Pickup Date *
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration (days)
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>1 week</option>
              <option value={14}>2 weeks</option>
              <option value={30}>1 month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Message (Optional)
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to the owner..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending Request..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RateItemModal = ({ isOpen, onClose, item, onRate }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewTags = [
    "Friendly owner",
    "Item as described",
    "Fast pickup",
    "Good condition",
    "Would recommend",
    "On time return",
  ];
  const toggleTag = (tag) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onRate(item, { rating, review, tags, ratedAt: new Date().toISOString() });
    setIsSubmitting(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Rate: {item?.name || item?.cells?.[0]}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                >
                  {(hoverRating || rating) >= star ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 5 && "Excellent!"}
              {rating === 4 && "Very Good"}
              {rating === 3 && "Good"}
              {rating === 2 && "Fair"}
              {rating === 1 && "Poor"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Review</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quick Tags</label>
            <div className="flex flex-wrap gap-2">
              {reviewTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${tags.includes(tag) ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReturnItemModal = ({ isOpen, onClose, exchange, onReturn }) => {
  const [condition, setCondition] = useState("Good");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const conditions = ["Like New", "Very Good", "Good", "Fair", "Damaged"];
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };
  const removePhoto = (index) =>
    setPhotos(photos.filter((_, i) => i !== index));
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReturn(exchange, {
      condition,
      notes,
      photos,
      returnedAt: new Date().toISOString(),
    });
    setIsSubmitting(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Return: {exchange?.cells?.[0]}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Item Condition
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {conditions.map((cond) => (
                <option key={cond}>{cond}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Notes
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the item's condition..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Photos (Optional)
            </label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <span className="text-sm">Upload Photos</span>
            </label>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Return photo ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processing Return..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({
  isOpen,
  onClose,
  darkMode,
  onDarkModeToggle,
  user,
  onUpdateUser,
  onOpenDataManagement,
}) => {
  const [formData, setFormData] = useState(user);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    itemRequests: true,
    returns: true,
    promotions: false,
    wishlistUpdates: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showWishlist: true,
  });
  const [language, setLanguage] = useState("english");
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onUpdateUser(formData);
    setIsSaving(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Profile Information
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Major"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.major || ""}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Student ID"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.studentId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Appearance
            </h4>
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <button
                onClick={onDarkModeToggle}
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Notifications
            </h4>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <button
                    onClick={() =>
                      setNotifications({ ...notifications, [key]: !value })
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Privacy
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Profile Visibility
                </span>
                <select
                  className="px-3 py-1 border rounded-lg dark:bg-gray-700"
                  value={privacy.profileVisibility}
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      profileVisibility: e.target.value,
                    })
                  }
                >
                  <option value="public">Public</option>
                  <option value="campus">Campus Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Email
                </span>
                <button
                  onClick={() =>
                    setPrivacy({ ...privacy, showEmail: !privacy.showEmail })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${privacy.showEmail ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${privacy.showEmail ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Phone
                </span>
                <button
                  onClick={() =>
                    setPrivacy({ ...privacy, showPhone: !privacy.showPhone })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${privacy.showPhone ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${privacy.showPhone ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Show Wishlist
                </span>
                <button
                  onClick={() =>
                    setPrivacy({
                      ...privacy,
                      showWishlist: !privacy.showWishlist,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${privacy.showWishlist ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${privacy.showWishlist ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Language
            </h4>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Data Management
            </h4>
            <button
              onClick={onOpenDataManagement}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Database className="h-4 w-4" /> Manage Data
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
}) => {
  const [filter, setFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const filteredNotifications =
    notifications?.filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "read") return n.read;
      return true;
    }) || [];
  const handleDelete = async (id) => {
    setIsDeleting(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onDelete(id);
    setIsDeleting(null);
  };
  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === "all" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"}`}
                >
                  All ({notifications?.length || 0})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === "unread" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"}`}
                >
                  Unread ({notifications?.filter((n) => !n.read).length || 0})
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === "read" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"}`}
                >
                  Read ({notifications?.filter((n) => n.read).length || 0})
                </button>
              </div>
              <div className="flex gap-2">
                {notifications?.filter((n) => !n.read).length > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <CheckSquare className="h-3 w-3" /> Mark all read
                  </button>
                )}
                {notifications?.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg transition-all hover:shadow-md ${notif.read ? "bg-gray-50 dark:bg-gray-700/50" : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {getRelativeTime(notif.time)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notif.read && (
                          <button
                            onClick={() => onMarkAsRead(notif.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          disabled={isDeleting === notif.id}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {isDeleting === notif.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
        type="danger"
      />
    </>
  );
};

const SearchModal = ({ isOpen, onClose, items, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const filteredItems = (items || []).filter((item) => {
    const itemName = item.name || item.cells?.[0] || "";
    const itemCategory = item.category || item.cells?.[1] || "";
    const itemStatus = item.status || item.cells?.[2] || "";
    const matchesSearch =
      itemName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      itemCategory.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = category === "all" || itemCategory === category;
    const matchesStatus = status === "all" || itemStatus === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name")
      return (a.name || a.cells?.[0] || "").localeCompare(
        b.name || b.cells?.[0] || "",
      );
    if (sortBy === "date")
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });
  const categories = [
    "all",
    ...new Set(
      (items || []).map((item) => item.category || item.cells?.[1] || ""),
    ),
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Search Items
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name or category..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Sort By</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
              <option value="date">Date Added</option>
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No items found
              </div>
            ) : (
              sortedItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.name || item.cells?.[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.category || item.cells?.[1]} •{" "}
                        {item.status || item.cells?.[2]}
                      </p>
                    </div>
                    {item.status === "Available" && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Available
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarModal = ({ isOpen, onClose, events, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "pickup",
    time: "12:00",
  });
  const eventTypes = [
    { value: "pickup", label: "Pickup", color: "green" },
    { value: "return", label: "Return", color: "red" },
    { value: "meeting", label: "Meeting", color: "purple" },
    { value: "reminder", label: "Reminder", color: "yellow" },
  ];
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const goToToday = () => setCurrentDate(new Date());
  const getEventsForDay = (day) =>
    (events || []).filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      onAddEvent({
        ...newEvent,
        date: `${newEvent.date}T${newEvent.time}:00`,
        id: generateId(),
      });
      setShowAddEvent(false);
      setNewEvent({ title: "", date: "", type: "pickup", time: "12:00" });
    }
  };
  const handleDayClick = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date: date.toISOString().split("T")[0] });
    setShowAddEvent(true);
  };
  const getEventColor = (type) =>
    ({
      pickup: "bg-green-100 text-green-800 border-l-4 border-green-500",
      return: "bg-red-100 text-red-800 border-l-4 border-red-500",
      meeting: "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
      reminder: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    })[type] || "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Today
              </button>
            </div>
            <h3 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => {
                setSelectedDate(null);
                setNewEvent({
                  ...newEvent,
                  date: new Date().toISOString().split("T")[0],
                });
                setShowAddEvent(true);
              }}
              className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
            >
              + Add Event
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm py-2 text-gray-600 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`border rounded-lg p-2 min-h-[100px] cursor-pointer transition-all duration-200 ${isToday ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-500 shadow-md" : "hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md"}`}
                >
                  <span
                    className={`text-sm font-medium flex items-center justify-center w-7 h-7 rounded-full ${isToday ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md" : dayEvents.length > 0 ? "font-bold text-red-600 dark:text-red-400" : ""}`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded truncate ${getEventColor(event.type)} shadow-sm`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-400 font-medium">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {showAddEvent && (
            <div className="border-t pt-4 mt-4 animate-in slide-in-from-top duration-200">
              <h4 className="font-semibold mb-3">
                {selectedDate
                  ? `Add Event for ${selectedDate.toLocaleDateString()}`
                  : "Add New Event"}
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event title"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsModal = ({ isOpen, onClose, data }) => {
  const [timeRange, setTimeRange] = useState("week");
  const totalItems = data?.myItems?.length || 0;
  const activeExchanges = data?.exchanges?.length || 0;
  const completedExchanges =
    data?.exchanges?.filter((e) => e.status === "completed").length || 0;
  const totalPoints = data?.user?.points || 0;
  const categoryStats = {};
  data?.myItems?.forEach((item) => {
    const cat = item.category || "Other";
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryStats).map(([name, count]) => ({
    name,
    value: Math.round((count / totalItems) * 100) || 0,
    count,
  }));
  const getGrowthRate = () => {
    if (timeRange === "week") return "+12%";
    if (timeRange === "month") return "+28%";
    return "+156%";
  };
  const getExchangeGrowth = () => {
    if (timeRange === "week") return `+${Math.round(activeExchanges * 0.08)}%`;
    if (timeRange === "month") return `+${Math.round(activeExchanges * 0.18)}%`;
    return `+${Math.round(activeExchanges * 0.45)}%`;
  };
  const getPointsGrowth = () => {
    if (timeRange === "week") return `+${Math.round(totalPoints * 0.1)}`;
    if (timeRange === "month") return `+${Math.round(totalPoints * 0.25)}`;
    return `+${Math.round(totalPoints * 0.6)}`;
  };
  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: {
        totalItems,
        activeExchanges,
        completedExchanges,
        totalPoints,
        categoryDistribution: categoryData,
        estimatedSavings: totalItems * 25,
        estimatedCarbonSaved: totalItems * 5,
      },
      rawData: { items: data?.myItems, exchanges: data?.exchanges },
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campus-share-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex gap-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${timeRange === range ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
              <Package className="h-6 w-6 mb-2" />
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-xs opacity-90">Total Items</p>
              <p className="text-xs opacity-75 mt-1">{getGrowthRate()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
              <Handshake className="h-6 w-6 mb-2" />
              <p className="text-2xl font-bold">{activeExchanges}</p>
              <p className="text-xs opacity-90">Active Exchanges</p>
              <p className="text-xs opacity-75 mt-1">{getExchangeGrowth()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
              <TrendingUp className="h-6 w-6 mb-2" />
              <p className="text-2xl font-bold">{completedExchanges}</p>
              <p className="text-xs opacity-90">Completed</p>
              <p className="text-xs opacity-75 mt-1">
                +{Math.round(completedExchanges * 0.15)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
              <Coins className="h-6 w-6 mb-2" />
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs opacity-90">Points Earned</p>
              <p className="text-xs opacity-75 mt-1">{getPointsGrowth()}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Category Distribution
            </h4>
            {categoryData.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No items to analyze</p>
                <p className="text-sm text-gray-400">
                  Share some items to see distribution
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryData.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-gray-500">
                        {cat.value}% ({cat.count} items)
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${cat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-4">
              <Leaf className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {totalItems * 5}kg
              </p>
              <p className="text-xs text-gray-600">CO₂ Saved</p>
              <p className="text-xs text-green-600 mt-1">
                🌱 Equivalent to planting {totalItems} trees
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                ${totalItems * 25}
              </p>
              <p className="text-xs text-gray-600">Money Saved</p>
              <p className="text-xs text-blue-600 mt-1">
                💰 ~${totalItems * 15} saved on purchases
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Community Impact
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.ceil(totalItems * 3.5)}
                </p>
                <p className="text-xs text-gray-600">
                  Items Saved from Landfill
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.ceil(activeExchanges * 2)}
                </p>
                <p className="text-xs text-gray-600">Active Borrowers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.ceil(totalPoints / 100)}
                </p>
                <p className="text-xs text-gray-600">Community Points</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4" />
              Export Analytics Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditItemModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Books",
    status: "Available",
    description: "",
    location: "",
    condition: "Good",
    price: 0,
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || item.cells?.[0] || "",
        category: item.category || item.cells?.[1] || "Books",
        status: item.status || item.cells?.[2] || "Available",
        description: item.description || "",
        location: item.location || "",
        condition: item.condition || "Good",
        price: item.price || 0,
      });
    }
  }, [item]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Item Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.name ? "border-red-500" : ""}`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Books</option>
              <option>Electronics</option>
              <option>Tools</option>
              <option>Sports</option>
              <option>Clothing</option>
              <option>Furniture</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option>Available</option>
              <option>Borrowed</option>
              <option>Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
            >
              <option>Like New</option>
              <option>Very Good</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Acceptable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Price ($/day)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.price ? "border-red-500" : ""}`}
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageDetailModal = ({ isOpen, onClose, message, onReply }) => {
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async () => {
    if (!reply.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReply(message, reply);
    setReply("");
    setIsSending(false);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Message from {message?.from}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {message?.avatar || message?.from?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{message?.from}</p>
                <p className="text-xs text-gray-400">
                  {getRelativeTime(message?.time)}
                </p>
              </div>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm">{message?.message}</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">Reply</label>
            <textarea
              rows="4"
              placeholder="Type your reply..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSending || !reply.trim()}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageExchangesModal = ({
  isOpen,
  onClose,
  exchanges,
  onUpdate,
  onReturn,
}) => {
  const [updating, setUpdating] = useState(null);
  const handleUpdate = async (exchange, action) => {
    setUpdating(exchange.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onUpdate(exchange, action);
    setUpdating(null);
  };
  const handleReturn = async (exchange) => {
    setUpdating(exchange.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReturn(exchange);
    setUpdating(null);
  };
  const getStatusColor = (status) => {
    if (status?.includes("Urgent")) return "text-red-600 bg-red-50";
    if (status?.includes("On Time")) return "text-green-600 bg-green-50";
    if (status?.includes("Upcoming")) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Manage Exchanges
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {exchanges?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active exchanges
            </div>
          ) : (
            exchanges?.map((exchange) => (
              <div
                key={exchange.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {exchange.cells?.[0]}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-4 w-4" /> Borrower:{" "}
                        {exchange.cells?.[1]}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Due:{" "}
                        {exchange.cells?.[2]}
                      </p>
                      <p
                        className={`text-sm inline-block px-2 py-1 rounded-full ${getStatusColor(exchange.cells?.[3])}`}
                      >
                        {exchange.cells?.[3]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(exchange, "extend")}
                      disabled={updating === exchange.id}
                      className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      {updating === exchange.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Extend"
                      )}
                    </button>
                    <button
                      onClick={() => handleReturn(exchange)}
                      disabled={updating === exchange.id}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {updating === exchange.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Return"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const RewardsModal = ({ isOpen, onClose, points, onRedeem }) => {
  const [redeeming, setRedeeming] = useState(null);
  const [filter, setFilter] = useState("all");
  const rewards = [
    {
      id: 1,
      name: "Campus Cafe Voucher",
      points: 500,
      icon: "☕",
      description: "$10 voucher for campus cafe",
      category: "food",
      stock: 50,
    },
    {
      id: 2,
      name: "Bookstore Discount",
      points: 1000,
      icon: "📚",
      description: "20% off at campus bookstore",
      category: "shopping",
      stock: 30,
    },
    {
      id: 3,
      name: "Tech Accessory",
      points: 1500,
      icon: "🎧",
      description: "Wireless earbuds",
      category: "electronics",
      stock: 15,
    },
    {
      id: 4,
      name: "Eco Warrior Badge",
      points: 2000,
      icon: "🌱",
      description: "Special badge and recognition",
      category: "badge",
      stock: 100,
    },
    {
      id: 5,
      name: "Premium Status",
      points: 3000,
      icon: "👑",
      description: "6 months premium membership",
      category: "membership",
      stock: 20,
    },
    {
      id: 6,
      name: "Campus Merchandise",
      points: 800,
      icon: "👕",
      description: "Campus t-shirt",
      category: "merch",
      stock: 25,
    },
  ];
  const filteredRewards =
    filter === "all" ? rewards : rewards.filter((r) => r.category === filter);
  const categories = ["all", ...new Set(rewards.map((r) => r.category))];
  const handleRedeem = async (reward) => {
    if (points < reward.points) {
      alert(
        `You need ${reward.points - points} more points to redeem this reward`,
      );
      return;
    }
    setRedeeming(reward.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onRedeem(reward);
    setRedeeming(null);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Rewards
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl text-white shadow-lg">
            <Coins className="h-12 w-12 mx-auto mb-2" />
            <p className="text-3xl font-bold mb-2">{points || 0}</p>
            <p className="text-sm">Total Points Earned</p>
            <p className="text-xs mt-2">
              Earn points by sharing items and completing exchanges!
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${filter === cat ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                {cat === "all"
                  ? "All Rewards"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{reward.icon}</span>
                  <div>
                    <p className="font-semibold">{reward.name}</p>
                    <p className="text-sm text-gray-500">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-green-600 font-medium">
                        {reward.points} points
                      </p>
                      <p className="text-xs text-gray-400">
                        {reward.stock} left
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={points < reward.points || redeeming === reward.id}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${points >= reward.points ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {redeeming === reward.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Redeem"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareModal = ({ isOpen, onClose, item, onShare }) => {
  const [copied, setCopied] = useState(false);
  const shareOptions = [
    { name: "Copy Link", icon: Copy, action: "copy", color: "text-gray-600" },
    {
      name: "Share to Facebook",
      icon: Facebook,
      action: "facebook",
      color: "text-blue-600",
    },
    {
      name: "Share to Campus Feed",
      icon: Users,
      action: "campus",
      color: "text-green-600",
    },
  ];
  const handleShare = (action) => {
    if (action === "copy") {
      const url = `${window.location.origin}/item/${item?.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onShare(item, action);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Share
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Share this item with friends
          </p>
          {shareOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleShare(option.action)}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <option.icon className={`h-5 w-5 ${option.color}`} />
              <span>{option.name}</span>
              {option.action === "copy" && copied && (
                <span className="ml-auto text-xs text-green-600">Copied!</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScanQRModal = ({ isOpen, onClose, onScan, items = [] }) => {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setScanning(false);
      try {
        const data = JSON.parse(result?.text);
        setScannedData({
          item: data.title || data.item,
          owner: data.owner,
          location: data.location,
          id: data.id,
          status: data.status || "Available",
        });
      } catch (error) {
        // Try to find item by ID in passed items
        const item = items.find((i) => i._id === result?.text);
        if (item) {
          setScannedData({
            item: item.title,
            owner: item.owner?.fullName || "Unknown",
            location: item.location,
            id: item._id,
            status: item.status,
          });
        } else {
          toast.error("Invalid QR code");
          setScanning(true);
        }
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
    toast.error("Camera access denied or unavailable");
  };

  const confirmScan = () => {
    if (scannedData) {
      onScan(scannedData);
      onClose();
    }
  };

  const resetScan = () => {
    setScannedData(null);
    setScanning(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Scan QR Code
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center space-y-4">
          {scanning && !scannedData && (
            <>
              <div className="w-64 h-64 mx-auto overflow-hidden rounded-xl">
                <QrReader
                  onResult={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%", height: "100%" }}
                  videoStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Position the QR code within the frame
              </p>
            </>
          )}

          {!scanning && !scannedData && (
            <>
              <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-red-400" />
              </div>
              <p className="text-sm text-red-600">Failed to scan QR code</p>
              <button
                onClick={() => setScanning(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
              >
                Try Again
              </button>
            </>
          )}

          {scannedData && (
            <>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-lg">{scannedData.item}</p>
                <p className="text-sm text-gray-600">
                  Owner: {scannedData.owner}
                </p>
                <p className="text-sm text-gray-600">
                  Location: {scannedData.location}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Status: {scannedData.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmScan}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Item
                </button>
                <button
                  onClick={resetScan}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Scan Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewItemModal = ({
  isOpen,
  onClose,
  item,
  onRequest,
  onShare,
  onAddToWishlist,
  wishlist,
}) => {
  if (!item) return null;
  const itemData = {
    id: item.id,
    name: item.name || item.cells?.[0] || "",
    category: item.category || item.cells?.[1] || "",
    status: item.status || item.cells?.[2] || "Available",
    owner: item.owner || "Alex Chen",
    location: item.location || "Campus Library",
    condition: item.condition || "Good",
    description: item.description || "No description provided",
    image: item.image,
    price: item.price || 0,
    deposit: item.deposit || 0,
    tags: item.tags || [],
    rating: item.rating || 4.8,
    requests: item.requests || 5,
    createdAt: item.createdAt,
  };
  const getStatusColor = (status) => {
    if (status === "Available") return "bg-green-100 text-green-800";
    if (status === "Borrowed") return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };
  const isInWishlist = wishlist?.some((w) => w.id === item.id);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Item Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {itemData.image && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={itemData.image}
                alt={itemData.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{itemData.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{itemData.category}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(itemData.status)}`}
            >
              {itemData.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
            <div>
              <p className="text-xs text-gray-500">Owner</p>
              <p className="font-medium">{itemData.owner}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">{itemData.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Condition</p>
              <p className="font-medium">{itemData.condition}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{itemData.rating}</span>
                <span className="text-xs text-gray-500">
                  ({itemData.requests} requests)
                </span>
              </div>
            </div>
          </div>
          {itemData.price > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm">
              <p className="text-sm font-medium">Rental Details</p>
              <p className="text-lg font-bold text-green-600">
                ${itemData.price}/day
              </p>
              {itemData.deposit > 0 && (
                <p className="text-xs text-gray-500">
                  Security deposit: ${itemData.deposit}
                </p>
              )}
            </div>
          )}
          <div>
            <p className="text-sm font-medium mb-2">Description</p>
            <p className="text-sm text-gray-600">{itemData.description}</p>
          </div>
          {itemData.tags && itemData.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {itemData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            {itemData.status === "Available" && (
              <button
                onClick={() => onRequest(item)}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Request Item
              </button>
            )}
            <button
              onClick={() => onShare(item)}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-all"
            >
              Share
            </button>
            {onAddToWishlist && (
              <button
                onClick={() => onAddToWishlist(item)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all group"
              >
                <Heart
                  className={`h-4 w-4 transition-all group-hover:scale-110 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WishlistModal = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToRequest,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const handleRemove = () => {
    onRemoveFromWishlist(selectedItem);
    setShowRemoveConfirm(false);
    setSelectedItem(null);
  };
  const handleClearAll = () => {
    if (wishlist?.length > 0) {
      wishlist.forEach((item) => onRemoveFromWishlist(item));
    }
    setShowRemoveConfirm(false);
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {wishlist?.length || 0}{" "}
                {wishlist?.length === 1 ? "item" : "items"} saved
              </p>
              {wishlist?.length > 0 && (
                <button
                  onClick={() => setShowRemoveConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-500px overflow-y-auto">
              {wishlist?.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Save items you're interested in
                  </p>
                </div>
              ) : (
                wishlist?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.category}
                        </p>
                        {item.price > 0 && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            ${item.price}/day
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Added {getRelativeTime(item.addedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onMoveToRequest(item)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Request
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowRemoveConfirm(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setSelectedItem(null);
        }}
        onConfirm={selectedItem ? handleRemove : handleClearAll}
        title={selectedItem ? "Remove from Wishlist" : "Clear All Wishlist"}
        message={
          selectedItem
            ? `Remove "${selectedItem.name}" from your wishlist?`
            : "Are you sure you want to clear your entire wishlist? This action cannot be undone."
        }
        type="danger"
      />
    </>
  );
};

const DataManagementModal = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef();
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Data Management
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DownloadIcon className="h-4 w-4 text-green-600" />
                Export Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Export all your data including items, exchanges, and settings as
                a backup file.
              </p>
              <button
                onClick={onExport}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Backup
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <UploadIcon className="h-4 w-4 text-blue-600" />
                Import Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Restore from a previously exported backup file.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Import Backup
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <RotateIcon className="h-4 w-4 text-red-600" />
                Reset All Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Warning: This will permanently delete all your data. This action
                cannot be undone.
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={onReset}
        title="Reset All Data"
        message="Are you absolutely sure? This will permanently delete all your items, exchanges, notifications, and settings. This action cannot be undone."
        type="danger"
      />
    </>
  );
};

const ColorPickerModal = ({ isOpen, onClose, currentColor, onSelectColor }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Choose Header Theme
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalize your dashboard with a custom header color theme
          </p>
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {Object.entries(headerColors).map(([key, color]) => (
              <button
                key={key}
                onClick={() => {
                  onSelectColor(key);
                  onClose();
                }}
                className={`p-3 rounded-xl transition-all ${currentColor === key ? "ring-2 ring-green-500 shadow-lg scale-[1.02]" : "hover:scale-[1.02] hover:shadow-md"}`}
              >
                <div className={`h-16 rounded-lg ${color.bg} mb-2 shadow-md`} />
                <p className="text-sm font-medium">{color.name}</p>
                <p className="text-xs text-gray-500 capitalize">{key}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCardModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onUpdateUser(formData);
    setIsSaving(false);
    setIsEditing(false);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
              {user?.avatar || "U"}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Edit Profile
              </button>
            )}
          </div>
          {!isEditing ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Name</span>
                <span className="font-medium">{user?.name || "User"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Email</span>
                <span className="font-medium">
                  {user?.email || "user@campus.edu"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Major</span>
                <span className="font-medium">
                  {user?.major || "Computer Science"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">
                  Student ID
                </span>
                <span className="font-medium">
                  {user?.studentId || "CS2024001"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Points</span>
                <span className="font-medium text-green-600">
                  {user?.points || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">
                  Member Since
                </span>
                <span className="font-medium">
                  {user?.joinDate
                    ? new Date(user.joinDate).toLocaleDateString()
                    : "Just now"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Major"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.major || ""}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Student ID"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                value={formData?.studentId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickActionsMenu = ({ isOpen, onClose, onAction }) => {
  const actions = [
    {
      id: "share",
      name: "Share Item",
      icon: Plus,
      color: "text-green-600",
      shortcut: "⌘N",
    },
    {
      id: "scan",
      name: "Scan QR",
      icon: QrCode,
      color: "text-blue-600",
      shortcut: "⌘Q",
    },
    {
      id: "rewards",
      name: "Rewards",
      icon: Gift,
      color: "text-orange-600",
      shortcut: null,
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: CalendarDays,
      color: "text-purple-600",
      shortcut: null,
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: TrendingUp,
      color: "text-emerald-600",
      shortcut: null,
    },
    {
      id: "messages",
      name: "Messages",
      icon: MessageSquare,
      color: "text-indigo-600",
      shortcut: "⌘M",
    },
    {
      id: "wishlist",
      name: "Wishlist",
      icon: Heart,
      color: "text-red-600",
      shortcut: "⌘W",
    },
    {
      id: "data",
      name: "Data Management",
      icon: Database,
      color: "text-gray-600",
      shortcut: null,
    },
    {
      id: "help",
      name: "Help Center",
      icon: HelpCircle,
      color: "text-gray-600",
      shortcut: "?",
    },
    {
      id: "feedback",
      name: "Feedback",
      icon: ThumbsUp,
      color: "text-pink-600",
      shortcut: null,
    },
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pr-20 pt-20 pointer-events-none">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 w-72 pointer-events-auto animate-in slide-in-from-top-5 duration-200 border border-gray-100 dark:border-gray-700"
        onMouseLeave={onClose}
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">
            Quick Actions
          </p>
        </div>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              onAction(action.id);
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <action.icon className={`h-4 w-4 ${action.color}`} />
              <span className="text-sm">{action.name}</span>
            </div>
            {action.shortcut && (
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {action.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const TrendingItems = ({ items, onItemClick }) => {
  const trendingItems = (items || [])
    .sort((a, b) => (b.requests || 0) - (a.requests || 0))
    .slice(0, 5);
  if (trendingItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Trending Items</h3>
        </div>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No items yet</p>
          <p className="text-sm text-gray-400">Share items to see trends</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Trending Items</h3>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
          Hot
        </span>
      </div>
      <div className="space-y-3">
        {trendingItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl font-bold ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-orange-500" : "text-gray-300"} group-hover:text-green-500 transition-colors`}
                >
                  #{idx + 1}
                </span>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  {item.requests || 0} requests
                </p>
                <p className="text-xs text-gray-400">
                  +{Math.floor(Math.random() * 20) + 5}%
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const AchievementProgress = ({ user, items, exchanges }) => {
  const achievements = [
    {
      name: "Sharer",
      icon: Package,
      current: items?.length || 0,
      target: 10,
      color: "green",
    },
    {
      name: "Helper",
      icon: Handshake,
      current: exchanges?.length || 0,
      target: 20,
      color: "blue",
    },
    {
      name: "Eco Warrior",
      icon: Leaf,
      current: (items?.length || 0) * 5,
      target: 100,
      color: "emerald",
    },
    {
      name: "Trusted",
      icon: Shield,
      current: Math.floor((user?.points || 0) / 100),
      target: 50,
      color: "purple",
    },
  ];
  const overallProgress = Math.round(
    achievements.reduce(
      (acc, ach) => acc + Math.min(100, (ach.current / ach.target) * 25),
      0,
    ),
  );
  const colorMap = {
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Achievement Progress</h3>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {achievements.map((ach) => {
          const percentage = Math.min(100, (ach.current / ach.target) * 100);
          const Icon = ach.icon;
          return (
            <div key={ach.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-${ach.color}-500`} />
                  <span>{ach.name}</span>
                </div>
                <span className="text-gray-500">
                  {ach.current}/{ach.target}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${colorMap[ach.color]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Overall Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="font-semibold text-green-600">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============ MAIN DASHBOARD COMPONENT ============
function DashboardPage() {
  const router = useRouter();
  const { user, apiCall, logout } = useAuth();
  const { socket, isConnected } = useSocket();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  // ============ UI STATES (Keep ALL your UI features) ============
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState(null);
  const [headerColor, setHeaderColor] = useLocalStorage(
    "headerColor",
    "default",
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    item: null,
  });
  const [showAllActivities, setShowAllActivities] = useState(false);

  // ============ BACKEND DATA STATES ============
  const [myItems, setMyItems] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    itemsShared: 0,
    itemsBorrowed: 0,
    successfulExchanges: 0,
    responseRate: 0,
    trustScore: 0,
    points: 0,
    totalSavings: 0,
    carbonSaved: 0,
  });

  // ============ LOCAL STORAGE DATA (For features that don't have backend yet) ============
  const [wishlist, setWishlist] = useLocalStorage("wishlist", []);
  const [events, setEvents] = useLocalStorage("events", []);
  const [activities, setActivities] = useLocalStorage("activities", []);

  // ============ MODAL STATES ============
  const [modals, setModals] = useState({
    settings: false,
    notifications: false,
    search: false,
    calendar: false,
    analytics: false,
    editItem: false,
    messageDetail: false,
    manageExchanges: false,
    rewards: false,
    share: false,
    scanQR: false,
    addItem: false,
    wishlist: false,
    requestItem: false,
    rateItem: false,
    returnItem: false,
    viewItem: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedShareItem, setSelectedShareItem] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openModal = useCallback(
    (name) => setModals((prev) => ({ ...prev, [name]: true })),
    [],
  );
  const closeModal = useCallback(
    (name) => setModals((prev) => ({ ...prev, [name]: false })),
    [],
  );

  // ============ LOAD REAL DATA FROM BACKEND ============
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [itemsRes, exchangesRes, statsRes, notificationsRes, messagesRes] =
        await Promise.all([
          apiCall("/users/me/items").catch(() => ({
            success: false,
            items: [],
          })),
          apiCall("/users/me/exchanges").catch(() => ({
            success: false,
            exchanges: [],
          })),
          apiCall("/users/me/stats").catch(() => ({
            success: false,
            stats: {},
          })),
          apiCall("/notifications?limit=50").catch(() => ({
            success: false,
            notifications: [],
          })),
          apiCall("/messages/conversations").catch(() => ({
            success: false,
            conversations: [],
          })),
        ]);

      if (itemsRes.success) setMyItems(itemsRes.items || []);
      if (exchangesRes.success) setExchanges(exchangesRes.exchanges || []);
      if (statsRes.success) setStats(statsRes.stats);
      if (notificationsRes.success)
        setNotificationsData(notificationsRes.notifications || []);
      if (messagesRes.success) {
        const formattedMessages =
          messagesRes.conversations?.map((conv) => ({
            id: conv._id,
            from: conv.otherParticipant?.fullName || "User",
            message: conv.lastMessageText || "No messages",
            time: conv.lastMessageAt || new Date().toISOString(),
            avatar: conv.otherParticipant?.fullName?.charAt(0) || "U",
            unread: conv.unreadCount > 0,
          })) || [];
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Load dashboard error:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, showToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ============ FORMAT DATA FOR DISPLAY ============
  const formattedExchanges = exchanges.map((ex) => ({
    id: ex._id,
    cells: [
      ex.resource?.title || "Unknown Item",
      ex.type === "borrowed"
        ? ex.owner?.fullName
        : ex.borrower?.fullName || "Unknown",
      new Date(ex.endDate).toLocaleDateString(),
      ex.status === "active"
        ? "🟢 Active"
        : ex.status === "pending"
          ? "⏳ Pending"
          : ex.status === "completed"
            ? "✅ Completed"
            : ex.status,
      ex.status === "active"
        ? "→ Return"
        : ex.status === "pending"
          ? "→ View"
          : "→ Details",
    ],
    itemId: ex.resource?._id,
    status: ex.status,
  }));

  const displayNotifications = notificationsData.map((n) => ({
    id: n._id,
    title: n.title,
    message: n.message,
    time: n.createdAt,
    read: n.read,
  }));

  // ============ METRICS FROM REAL DATA ============
  const metrics = [
    {
      title: "Total Items",
      value: stats.itemsShared?.toString() || "0",
      change: "+12%",
      icon: Package,
      trend: "up",
      color: "from-green-500 to-green-600",
      subtitle: `${myItems.filter((i) => i.status === "available").length || 0} active listings`,
    },
    {
      title: "Active Exchanges",
      value: exchanges.filter((e) => e.status === "active").length.toString(),
      change: "+8%",
      icon: Handshake,
      trend: "up",
      color: "from-blue-500 to-blue-600",
      subtitle: "ongoing transactions",
    },
    {
      title: "Trust Score",
      value: `${stats.trustScore || 0}%`,
      change: "+0.3",
      icon: Award,
      trend: "up",
      color: "from-purple-500 to-purple-600",
      subtitle: "Top 5%",
    },
    {
      title: "Points Earned",
      value: stats.points?.toString() || "0",
      change: "+245",
      icon: Gift,
      trend: "up",
      color: "from-orange-500 to-orange-600",
      subtitle: "this month",
    },
  ];

  // ============ QUICK STATS ============
  const quickStats = [
    {
      label: "Total Value Saved",
      value: `$${stats.totalSavings || 0}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "CO₂ Saved",
      value: `${stats.carbonSaved || 0}kg`,
      icon: Leaf,
      color: "text-green-600",
    },
    {
      label: "Active Friends",
      value: exchanges.length.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Items in Wishlist",
      value: (wishlist?.length || 0).toString(),
      icon: Heart,
      color: "text-red-600",
    },
  ];

  // ============ POPULAR ITEMS ============
  const popularItems = myItems.slice(0, 4).map((item) => ({
    name: item.title,
    requests: item.requests || 0,
    trend: "+5",
    icon:
      item.category === "Books"
        ? BookOpen
        : item.category === "Electronics"
          ? Laptop
          : item.category === "Tools"
            ? Wrench
            : Package,
  }));
  while (popularItems.length < 4) {
    popularItems.push({
      name: "Sample Item",
      requests: 0,
      trend: "+0",
      icon: Package,
    });
  }

  // ============ BADGES ============
  const badges = [
    {
      name: "Top Sharer",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
      earned: stats.itemsShared >= 10,
    },
    {
      name: "Trusted",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      earned: stats.trustScore >= 80,
    },
    {
      name: "Eco Hero",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      earned: stats.carbonSaved >= 100,
    },
    {
      name: "Community Leader",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      earned: stats.successfulExchanges >= 20,
    },
  ];

  // ============ HANDLE ACTIONS (Connect to backend) ============
  const handleAddItem = async (itemData) => {
    try {
      const response = await apiCall("/resources", {
        method: "POST",
        body: JSON.stringify(itemData),
      });
      if (response.success) {
        showToast("Item shared successfully!", "success");
        loadDashboardData();
        closeModal("addItem");
      }
    } catch (error) {
      showToast(error.message || "Failed to share item", "error");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const response = await apiCall(`/resources/${item._id}`, {
        method: "DELETE",
      });
      if (response.success) {
        showToast("Item deleted successfully", "success");
        loadDashboardData();
      }
    } catch (error) {
      showToast(error.message || "Failed to delete item", "error");
    }
    setConfirmDelete({ isOpen: false, item: null });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    openModal("editItem");
  };

  const handleSaveItem = async (updatedData) => {
    try {
      const response = await apiCall(`/resources/${selectedItem._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      if (response.success) {
        showToast("Item updated successfully!", "success");
        loadDashboardData();
        closeModal("editItem");
      }
    } catch (error) {
      showToast(error.message || "Failed to update item", "error");
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    openModal("viewItem");
  };

  const handleRequestItem = async (item, requestData) => {
    if (!item || !item._id) {
      showToast("Invalid item", "error");
      return;
    }

    try {
      // Calculate end date from duration
      const startDate = new Date(requestData.pickupDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + requestData.duration);

      const response = await apiCall(`/resources/${item._id}/request`, {
        method: "POST",
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          message: requestData.message || "",
        }),
      });

      if (response.success) {
        showToast("Request sent successfully!", "success");
        loadDashboardData();
        closeModal("requestItem");
        closeModal("viewItem");
      } else {
        showToast(response.message || "Failed to send request", "error");
      }
    } catch (error) {
      console.error("Request error:", error);
      showToast(error.message || "Failed to send request", "error");
    }
  };

  const handleReturnItem = async (exchange, returnData) => {
    if (!exchange || !exchange.id) {
      showToast("Invalid exchange", "error");
      return;
    }

    try {
      const response = await apiCall(`/exchanges/${exchange.id}/return`, {
        method: "POST",
        body: JSON.stringify({
          condition: returnData.condition || "Good",
          returnNotes: returnData.notes || "",
          returnPhotos: returnData.photos || [],
        }),
      });

      if (response.success) {
        showToast("Item returned successfully! +100 points", "success");
        loadDashboardData();
        closeModal("returnItem");
      } else {
        showToast(response.message || "Failed to return item", "error");
      }
    } catch (error) {
      console.error("Return error:", error);
      showToast(error.message || "Failed to return item", "error");
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await apiCall("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        }),
      });

      if (response.success) {
        showToast("Profile updated successfully!", "success");
        loadDashboardData();
      } else {
        showToast(response.message || "Failed to update profile", "error");
      }
    } catch (error) {
      showToast(error.message || "Failed to update profile", "error");
    }
  };

  const handleRateItem = async (item, ratingData) => {
    if (!item || !item._id) {
      showToast("Invalid exchange", "error");
      return;
    }

    try {
      const response = await apiCall(`/exchanges/${item._id}/rate`, {
        method: "POST",
        body: JSON.stringify({
          rating: ratingData.rating,
          review: ratingData.review,
          tags: ratingData.tags || [],
          isPublic: true,
        }),
      });

      if (response.success) {
        showToast("Rating submitted successfully! +50 points", "success");
        loadDashboardData();
        closeModal("rateItem");
      } else {
        showToast(response.message || "Failed to submit rating", "error");
      }
    } catch (error) {
      console.error("Rate error:", error);
      showToast(error.message || "Failed to submit rating", "error");
    }
  };

  const handleAddToWishlist = async (item) => {
    try {
      const response = await apiCall("/wishlist", {
        method: "POST",
        body: JSON.stringify({ resourceId: item._id }),
      });
      if (response.success) {
        setWishlist((prev) => [
          ...prev,
          {
            id: item._id,
            name: item.title,
            category: item.category,
            price: item.price,
            addedAt: new Date().toISOString(),
          },
        ]);
        showToast("Added to wishlist!", "success");
      }
    } catch (error) {
      showToast(error.message || "Failed to add to wishlist", "error");
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    try {
      const response = await apiCall(`/wishlist/${item.id}`, {
        method: "DELETE",
      });
      if (response.success) {
        setWishlist((prev) => prev.filter((w) => w.id !== item.id));
        showToast("Removed from wishlist", "success");
      }
    } catch (error) {
      showToast(error.message || "Failed to remove from wishlist", "error");
    }
  };

  const handleMoveToRequest = (item) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, wishlist: false, requestItem: true }));
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await apiCall(`/notifications/${id}/read`, { method: "PUT" });
      setNotificationsData((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiCall("/notifications/read-all", { method: "PUT" });
      setNotificationsData((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast("All notifications marked as read", "info");
    } catch (error) {
      showToast("Failed to mark all as read", "error");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await apiCall(`/notifications/${id}`, { method: "DELETE" });
      setNotificationsData((prev) => prev.filter((n) => n._id !== id));
      showToast("Notification deleted", "info");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete notification", "error");
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await apiCall("/notifications", { method: "DELETE" });
      setNotificationsData([]);
      showToast("All notifications cleared", "info");
    } catch (error) {
      showToast("Failed to clear notifications", "error");
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    openModal("messageDetail");
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, unread: false } : m)),
    );
  };

  const handleSendReply = async (message, reply) => {
    try {
      await apiCall("/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId: message.id, text: reply }),
      });
      showToast("Reply sent!", "success");
      closeModal("messageDetail");
    } catch (error) {
      showToast(error.message || "Failed to send reply", "error");
    }
  };

  const handleLike = (activity) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activity.id
          ? {
              ...a,
              likes: a.liked ? a.likes - 1 : a.likes + 1,
              liked: !a.liked,
            }
          : a,
      ),
    );
    if (!activity.liked) showToast("Liked!", "info");
  };

  const handleShare = (item, platform) => {
    showToast(`Shared to ${platform}!`, "success");
    closeModal("share");
  };

  const handleAddEvent = (eventData) => {
    setEvents((prev) => [...prev, eventData]);
    showToast("Event added to calendar", "success");
  };

  const handleRedeemReward = (reward) => {
    if ((stats.points || 0) >= reward.points) {
      showToast(`Redeemed ${reward.name}!`, "success");
    } else {
      showToast(
        `Need ${reward.points - (stats.points || 0)} more points`,
        "warning",
      );
    }
  };

  const handleQRScan = (data) => {
    showToast(`Scanned "${data.item}" successfully!`, "success");
    const scannedItem = myItems.find((item) => item.title === data.item);
    if (scannedItem) {
      setSelectedItem(scannedItem);
      openModal("viewItem");
    }
  };

  const handleSettings = () => openModal("settings");
  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => !prev);
    showToast(`${!isDarkMode ? "Dark" : "Light"} mode activated`, "info");
  };
  const handleSearch = () => {
    setShowSearchSuggestions(!showSearchSuggestions);
    if (searchQuery) openModal("search");
  };
  const handleSelectSearchItem = (item) => {
    setSelectedItem(item);
    openModal("viewItem");
    closeModal("search");
  };
  const handleRewards = () => openModal("rewards");
  const handleQuickAction = (action) => {
    if (action === "share") openModal("addItem");
    if (action === "scan") openModal("scanQR");
    if (action === "rewards") openModal("rewards");
    if (action === "calendar") openModal("calendar");
    if (action === "analytics") openModal("analytics");
    if (action === "messages") setActiveNav("messages");
    if (action === "wishlist") setShowWishlist(true);
    if (action === "data") setShowDataManagement(true);
    if (action === "help") showToast("Help Center coming soon!", "info");
    if (action === "feedback") showToast("Thanks for your feedback!", "info");
  };
  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === "calendar") openModal("calendar");
    if (navId === "analytics") openModal("analytics");
  };
  const handleUpdateExchange = async (exchange, action) => {
    try {
      if (action === "extend") {
        const newEndDate = new Date(exchange.endDate);
        newEndDate.setDate(newEndDate.getDate() + 7);
        const response = await apiCall(`/exchanges/${exchange.id}`, {
          method: "PUT",
          body: JSON.stringify({ endDate: newEndDate.toISOString() }),
        });
        if (response.success) {
          showToast("Exchange extended by 7 days!", "success");
          loadDashboardData();
        }
      } else if (action === "complete") {
        const response = await apiCall(`/exchanges/${exchange.id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: "completed" }),
        });
        if (response.success) {
          showToast("Exchange completed!", "success");
          loadDashboardData();
        }
      } else if (action === "cancel") {
        const response = await apiCall(`/exchanges/${exchange.id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: "cancelled" }),
        });
        if (response.success) {
          showToast("Exchange cancelled", "success");
          loadDashboardData();
        }
      }
    } catch (error) {
      showToast(error.message || "Failed to update exchange", "error");
    }
  };
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  const exportData = () => {
    const data = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      myItems,
      exchanges,
      events,
      notifications: notificationsData,
      messages,
      wishlist,
      activities,
      stats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resourcehub-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully!", "success");
  };
  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.myItems) setMyItems(data.myItems);
        if (data.exchanges) setExchanges(data.exchanges);
        if (data.events) setEvents(data.events);
        if (data.notifications) setNotificationsData(data.notifications);
        if (data.wishlist) setWishlist(data.wishlist);
        if (data.activities) setActivities(data.activities);
        showToast("Data imported successfully!", "success");
      } catch (error) {
        showToast("Invalid or corrupted data file", "error");
      }
    };
    reader.readAsText(file);
  };
  const resetAllData = () => {
    setMyItems([]);
    setExchanges([]);
    setEvents([]);
    setNotificationsData([]);
    setWishlist([]);
    setActivities([]);
    showToast("All data has been reset", "info");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openModal("search");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        openModal("addItem");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        setActiveNav("messages");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        setShowWishlist(true);
      }
      if (e.key === "?") {
        e.preventDefault();
        showToast(
          "Keyboard Shortcuts: ⌘K (Search), ⌘N (New Item), ⌘M (Messages), ⌘W (Wishlist)",
          "info",
        );
      }
      if (e.key === "Escape") {
        Object.keys(modals).forEach((modal) => closeModal(modal));
        setShowWishlist(false);
        setShowDataManagement(false);
        setShowColorPicker(false);
        setShowProfileCard(false);
        setShowQuickActions(false);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [modals, openModal, setActiveNav, showToast, closeModal]);

  const currentTheme = headerColors[headerColor] || headerColors.default;
  const searchSuggestions = [...myItems, ...wishlist]
    .filter((item) =>
      item?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )
    .slice(0, 5);

  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <Toaster position="top-right" />
        <AnnouncementBar />
        <Header />
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 pt-0">
          {/* ============ SIDEBAR (Keep your existing sidebar UI) ============ */}
          <aside
            className={`${sidebarCollapsed ? "w-20" : "w-72"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-xl z-20`}
          >
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">RH</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    ResourceHub
                  </span>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`${sidebarCollapsed ? "ml-auto" : "ml-auto"} p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all`}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4 rotate-90" />
                )}
              </button>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-1">
              {[
                {
                  id: "overview",
                  name: "Overview",
                  icon: LayoutDashboard,
                  badge: null,
                },
                {
                  id: "my-items",
                  name: "My Items",
                  icon: Package,
                  badge: myItems.length.toString(),
                },
                {
                  id: "exchanges",
                  name: "Exchanges",
                  icon: Handshake,
                  badge: exchanges.length.toString(),
                },
                {
                  id: "messages",
                  name: "Messages",
                  icon: MessageSquare,
                  badge: messages.filter((m) => m.unread).length.toString(),
                },
                {
                  id: "calendar",
                  name: "Calendar",
                  icon: CalendarDays,
                  badge: null,
                },
                {
                  id: "analytics",
                  name: "Analytics",
                  icon: TrendingUp,
                  badge: null,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeNav === item.id ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.name}
                        </span>
                        {item.badge && item.badge !== "0" && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${activeNav === item.id ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProfileCard(true)}
                  className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform shadow-md"
                >
                  {user?.fullName?.charAt(0) || "U"}
                </button>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.userType || "Member"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <LogOut className="h-4 w-4 text-gray-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* ============ MAIN CONTENT ============ */}
          <main className="flex-1 overflow-y-auto">
            <header
              className={`sticky top-0 z-10 ${currentTheme.bg} shadow-lg transition-all duration-300`}
            >
              <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1
                      className={`text-2xl font-bold ${currentTheme.text} capitalize flex items-center gap-2`}
                    >
                      {activeNav.replace("-", " ")}
                      {activeNav === "overview" && (
                        <Sparkle className="h-5 w-5 animate-pulse" />
                      )}
                    </h1>
                    <p
                      className={`text-sm ${currentTheme.text} opacity-90 mt-1`}
                    >
                      Welcome back, {user?.fullName?.split(" ")[0] || "User"} •{" "}
                      {stats.points || 0} points earned
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <div className="relative">
                        <Search
                          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${currentTheme.text} opacity-70 cursor-pointer`}
                        />
                        <input
                          type="text"
                          placeholder="Search items, people... (⌘K)"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchSuggestions(true);
                          }}
                          onFocus={() => setShowSearchSuggestions(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setShowSearchSuggestions(false),
                              200,
                            )
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" && openModal("search")
                          }
                          className={`pl-10 pr-4 py-2 rounded-xl ${currentTheme.searchBg} ${currentTheme.searchText} text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-64 backdrop-blur-sm transition-all`}
                        />
                      </div>
                      {showSearchSuggestions &&
                        searchSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
                            {searchSuggestions.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedItem(item);
                                  openModal("viewItem");
                                  setShowSearchSuggestions(false);
                                  setSearchQuery("");
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                              >
                                <Search className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{item.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">
                                  {item.category}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    <div
                      className={`flex items-center gap-1 border-r ${currentTheme.text} border-white/30 pr-3`}
                    >
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? `${currentTheme.searchBg}` : ""}`}
                      >
                        <Grid3x3 className={`h-4 w-4 ${currentTheme.text}`} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? `${currentTheme.searchBg}` : ""}`}
                      >
                        <List className={`h-4 w-4 ${currentTheme.text}`} />
                      </button>
                    </div>

                    {/* Color Picker */}
                    <button
                      onClick={() => setShowColorPicker(true)}
                      className={`p-2 rounded-lg transition-all ${currentTheme.iconHover} relative group`}
                      title="Change Theme Color"
                    >
                      <Palette className={`h-5 w-5 ${currentTheme.text}`} />
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => setShowWishlist(true)}
                      className={`p-2 rounded-lg transition-all relative ${currentTheme.iconHover}`}
                      title="Wishlist (⌘W)"
                    >
                      <Heart className={`h-5 w-5 ${currentTheme.text}`} />
                      {(wishlist?.length || 0) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
                          {wishlist?.length || 0}
                        </span>
                      )}
                    </button>

                    {/* Notifications */}
                    <button
                      onClick={() => openModal("notifications")}
                      className={`p-2 rounded-lg transition-all relative ${currentTheme.iconHover}`}
                      title="Notifications"
                    >
                      <Bell className={`h-5 w-5 ${currentTheme.text}`} />
                      {(displayNotifications.filter((n) => !n.read).length ||
                        0) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
                          {displayNotifications.filter((n) => !n.read).length ||
                            0}
                        </span>
                      )}
                    </button>

                    {/* Settings */}
                    <button
                      onClick={handleSettings}
                      className={`p-2 rounded-lg transition-all ${currentTheme.iconHover}`}
                      title="Settings"
                    >
                      <Settings className={`h-5 w-5 ${currentTheme.text}`} />
                    </button>

                    {/* Dark Mode */}
                    <button
                      onClick={handleDarkModeToggle}
                      className={`p-2 rounded-lg transition-all ${currentTheme.iconHover}`}
                      title="Dark Mode"
                    >
                      {isDarkMode ? (
                        <Sun className={`h-5 w-5 ${currentTheme.text}`} />
                      ) : (
                        <Moon className={`h-5 w-5 ${currentTheme.text}`} />
                      )}
                    </button>

                    {/* Quick Actions */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQuickActions(!showQuickActions)}
                        className={`p-2 rounded-lg transition-all ${currentTheme.iconHover}`}
                        title="Quick Actions"
                      >
                        <Sparkles className={`h-5 w-5 ${currentTheme.text}`} />
                      </button>
                      {showQuickActions && (
                        <div
                          className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 border border-gray-100 dark:border-gray-700 z-50"
                          onMouseLeave={() => setShowQuickActions(false)}
                        >
                          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase">
                              Quick Actions
                            </p>
                          </div>
                          {[
                            {
                              id: "share",
                              name: "Share Item",
                              icon: Plus,
                              color: "text-green-600",
                              shortcut: "⌘N",
                            },
                            {
                              id: "scan",
                              name: "Scan QR",
                              icon: QrCode,
                              color: "text-blue-600",
                              shortcut: "⌘Q",
                            },
                            {
                              id: "rewards",
                              name: "Rewards",
                              icon: Gift,
                              color: "text-orange-600",
                              shortcut: null,
                            },
                            {
                              id: "calendar",
                              name: "Calendar",
                              icon: CalendarDays,
                              color: "text-purple-600",
                              shortcut: null,
                            },
                            {
                              id: "analytics",
                              name: "Analytics",
                              icon: TrendingUp,
                              color: "text-emerald-600",
                              shortcut: null,
                            },
                            {
                              id: "messages",
                              name: "Messages",
                              icon: MessageSquare,
                              color: "text-indigo-600",
                              shortcut: "⌘M",
                            },
                            {
                              id: "wishlist",
                              name: "Wishlist",
                              icon: Heart,
                              color: "text-red-600",
                              shortcut: "⌘W",
                            },
                            {
                              id: "data",
                              name: "Data Management",
                              icon: Database,
                              color: "text-gray-600",
                              shortcut: null,
                            },
                          ].map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleQuickAction(action.id)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <action.icon
                                  className={`h-4 w-4 ${action.color}`}
                                />
                                <span className="text-sm">{action.name}</span>
                              </div>
                              {action.shortcut && (
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {action.shortcut}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Item Button */}
                    <button
                      onClick={() => openModal("addItem")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} ${currentTheme.text} hover:shadow-lg transition-all`}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Share Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, idx) => (
                  <StatCard
                    key={idx}
                    metric={metric}
                    onClick={() => showToast(`Viewing ${metric.title}`, "info")}
                  />
                ))}
              </div>

              {/* My Items Tab */}
              {activeNav === "my-items" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="border-b border-gray-100 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          My Items
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          All your shared items
                        </p>
                      </div>
                      <button
                        onClick={() => openModal("addItem")}
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add New
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                            Item
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                            Category
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                            Activity
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {myItems.map((item) => (
                          <tr
                            key={item._id}
                            className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="py-4 px-4 text-sm font-medium">
                              {item.title}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {item.category}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${item.status === "available" ? "bg-green-100 text-green-800" : item.status === "borrowed" ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800"}`}
                              >
                                {item.status || "Available"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {item.requests || 0} requests
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewItem(item)}
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4 text-gray-400" />
                                </button>
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4 text-gray-400" />
                                </button>
                                <button
                                  onClick={() =>
                                    setConfirmDelete({ isOpen: true, item })
                                  }
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-400" />
                                </button>
                                <button
                                  onClick={() =>
                                    wishlist.find((w) => w.id === item._id)
                                      ? handleRemoveFromWishlist({
                                          id: item._id,
                                          name: item.title,
                                        })
                                      : handleAddToWishlist(item)
                                  }
                                  className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                  <Heart
                                    className={`h-4 w-4 transition-all ${wishlist.find((w) => w.id === item._id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {myItems.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-12 text-gray-500"
                            >
                              No items yet. Click "Add New" to share your first
                              item!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Exchanges Tab */}
              {activeNav === "exchanges" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Active Exchanges
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ongoing transactions
                        </p>
                      </div>
                      <button
                        onClick={() => openModal("manageExchanges")}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Manage All
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">
                            Item
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">
                            Partner
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">
                            Due Date
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formattedExchanges.map((exchange) => (
                          <tr
                            key={exchange.id}
                            className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="py-4 px-4 text-sm">
                              {exchange.cells[0]}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {exchange.cells[1]}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {exchange.cells[2]}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {exchange.cells[3]}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <button
                                onClick={() => {
                                  setSelectedExchange(exchange);
                                  openModal("returnItem");
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                → {exchange.cells[4]}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {formattedExchanges.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-12 text-gray-500"
                            >
                              No exchanges yet. Start sharing to see
                              transactions!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeNav === "messages" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Messages
                    </h3>
                  </div>
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No messages yet</p>
                      <button
                        onClick={() => openModal("addItem")}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        Share an Item
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => handleMessageClick(msg)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${msg.unread ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                              {msg.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">{msg.from}</p>
                                <p className="text-xs text-gray-400">
                                  {getRelativeTime(msg.time)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {msg.message}
                              </p>
                            </div>
                            {msg.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Overview Tab */}
              {activeNav === "overview" && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                          <h3 className="text-lg font-semibold mb-0">
                            Recent Activity
                          </h3>
                        </div>
                        <div className="p-6 space-y-4">
                          {(activities || []).slice(0, 5).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3 group p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                {activity.user?.[0] || "U"}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {activity.user}
                                  </span>{" "}
                                  {activity.action}{" "}
                                  <span className="font-medium">
                                    {activity.item}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-400">
                                  {getRelativeTime(activity.time)}
                                </p>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleLike(activity)}
                                  className="flex items-center gap-1 hover:scale-110 transition-transform"
                                >
                                  <Heart
                                    className={`h-3 w-3 ${activity.liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                                  />
                                  <span className="text-xs">
                                    {activity.likes}
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedShareItem(activity);
                                    openModal("share");
                                  }}
                                  className="text-gray-400 hover:text-green-500 transition-colors"
                                >
                                  <Share2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                            <h3 className="text-lg font-semibold">
                              Popular Items
                            </h3>
                          </div>
                          <div className="p-6">
                            {popularItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  <item.icon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-green-600">
                                    {item.trend}%
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {item.requests} requests
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                            <h3 className="text-lg font-semibold">
                              Achievements
                            </h3>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                              {badges.map((badge, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-xl text-center transition-all ${badge.earned ? "bg-gray-50 dark:bg-gray-700 hover:scale-105 cursor-pointer" : "bg-gray-100 dark:bg-gray-800 opacity-50"}`}
                                >
                                  <div
                                    className={`w-10 h-10 mx-auto bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mb-2 shadow-md`}
                                  >
                                    <badge.icon className="h-5 w-5 text-white" />
                                  </div>
                                  <p className="text-xs font-medium">
                                    {badge.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                          <h3 className="text-lg font-semibold">Quick Stats</h3>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-3">
                            {quickStats.map((stat, idx) => (
                              <div
                                key={idx}
                                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                              >
                                <stat.icon
                                  className={`h-5 w-5 ${stat.color} mb-2`}
                                />
                                <p className="text-lg font-bold">
                                  {stat.value}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {stat.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                          <h3 className="text-lg font-semibold">
                            Upcoming Events
                          </h3>
                        </div>
                        <div className="p-6">
                          {(events || []).slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2 hover:shadow-md transition-all"
                            >
                              <Calendar className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">
                                  {event.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(event.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                          <h3 className="text-lg font-semibold">
                            Recent Notifications
                          </h3>
                        </div>
                        <div className="p-6">
                          {(displayNotifications || [])
                            .slice(0, 3)
                            .map((notif) => (
                              <div
                                key={notif.id}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2 hover:shadow-md transition-all"
                              >
                                <p className="text-sm font-medium">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {getRelativeTime(notif.time)}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <TrendingItems
                      items={myItems}
                      onItemClick={handleViewItem}
                    />
                    <AchievementProgress
                      user={user}
                      items={myItems}
                      exchanges={exchanges}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 mt-8">
                    <ActivityFeed
                      activities={activities}
                      onLike={handleLike}
                      onShare={(item) => {
                        setSelectedShareItem(item);
                        openModal("share");
                      }}
                      showAll={showAllActivities}
                      onToggleShowAll={() =>
                        setShowAllActivities(!showAllActivities)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-8">
                    <button
                      onClick={() => openModal("scanQR")}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <QrCode className="h-5 w-5 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Scan QR</p>
                    </button>
                    <button
                      onClick={handleRewards}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <Gift className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Rewards</p>
                    </button>
                    <button
                      onClick={() => setShowWishlist(true)}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <Heart className="h-5 w-5 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Wishlist</p>
                    </button>
                    <button
                      onClick={() => openModal("calendar")}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <CalendarDays className="h-5 w-5 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Calendar</p>
                    </button>
                    <button
                      onClick={() => openModal("analytics")}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <TrendingUp className="h-5 w-5 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Analytics</p>
                    </button>
                    <button
                      onClick={() => openModal("share")}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-center border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                    >
                      <Share2 className="h-5 w-5 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium">Share</p>
                    </button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
      <AddItemModal
        isOpen={modals.addItem}
        onClose={() => closeModal("addItem")}
        onAdd={handleAddItem}
      />
      <RequestItemModal
        isOpen={modals.requestItem}
        onClose={() => setModals((prev) => ({ ...prev, requestItem: false }))}
        item={selectedItem}
        onRequest={handleRequestItem}
      />
      <RateItemModal
        isOpen={modals.rateItem}
        onClose={() => closeModal("rateItem")}
        item={selectedItem}
        onRate={handleRateItem}
      />
      <ReturnItemModal
        isOpen={modals.returnItem}
        onClose={() => closeModal("returnItem")}
        exchange={selectedExchange}
        onReturn={handleReturnItem}
      />
      <SettingsModal
        isOpen={modals.settings}
        onClose={() => closeModal("settings")}
        darkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        user={user}
        onUpdateUser={() => {}}
        onOpenDataManagement={() => setShowDataManagement(true)}
      />
      <NotificationsModal
        isOpen={modals.notifications}
        onClose={() => closeModal("notifications")}
        notifications={notificationsData}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllRead}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />
      <SearchModal
        isOpen={modals.search}
        onClose={() => closeModal("search")}
        items={myItems}
        onSelect={handleSelectSearchItem}
      />
      <CalendarModal
        isOpen={modals.calendar}
        onClose={() => closeModal("calendar")}
        events={events}
        onAddEvent={handleAddEvent}
      />
      <AnalyticsModal
        isOpen={modals.analytics}
        onClose={() => closeModal("analytics")}
        data={{ myItems, exchanges, user: user }}
      />
      <EditItemModal
        isOpen={modals.editItem}
        onClose={() => closeModal("editItem")}
        item={selectedItem}
        onSave={handleSaveItem}
      />
      <MessageDetailModal
        isOpen={modals.messageDetail}
        onClose={() => closeModal("messageDetail")}
        message={selectedMessage}
        onReply={handleSendReply}
      />
      <ManageExchangesModal
        isOpen={modals.manageExchanges}
        onClose={() => closeModal("manageExchanges")}
        exchanges={exchanges}
        onUpdate={handleUpdateExchange}
        onReturn={(exchange) => {
          setSelectedExchange(exchange);
          closeModal("manageExchanges");
          openModal("returnItem");
        }}
      />
      <RewardsModal
        isOpen={modals.rewards}
        onClose={() => closeModal("rewards")}
        points={stats.points || 0}
        onRedeem={handleRedeemReward}
      />
      <ShareModal
        isOpen={modals.share}
        onClose={() => closeModal("share")}
        item={selectedShareItem}
        onShare={handleShare}
      />
      <ScanQRModal
        isOpen={modals.scanQR}
        onClose={() => closeModal("scanQR")}
        onScan={handleQRScan}
        items={myItems}
      />
      <ViewItemModal
        isOpen={modals.viewItem}
        onClose={() => closeModal("viewItem")}
        item={selectedItem}
        onRequest={(item) => {
          setSelectedItem(item);
          closeModal("viewItem");
          openModal("requestItem");
        }}
        onShare={(item) => {
          setSelectedShareItem(item);
          closeModal("viewItem");
          openModal("share");
        }}
        onAddToWishlist={handleAddToWishlist}
        wishlist={wishlist}
      />
      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentColor={headerColor}
        onSelectColor={setHeaderColor}
      />
      <ProfileCardModal
        isOpen={showProfileCard}
        onClose={() => setShowProfileCard(false)}
        user={user}
        onUpdateUser={() => {}}
      />
      <WishlistModal
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToRequest={handleMoveToRequest}
      />
      <DataManagementModal
        isOpen={showDataManagement}
        onClose={() => setShowDataManagement(false)}
        onExport={exportData}
        onImport={importData}
        onReset={resetAllData}
      />
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, item: null })}
        onConfirm={() => handleDeleteItem(confirmDelete.item)}
        title="Delete Item"
        message={`Are you sure you want to delete "${confirmDelete.item?.title || confirmDelete.item?.name}"? This action cannot be undone.`}
        type="danger"
      />

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : toast.type === "warning" ? "bg-yellow-500" : "bg-blue-500"} text-white`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default DashboardPage;
