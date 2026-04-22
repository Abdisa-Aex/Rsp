"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date
export const formatDate = (date, format = "short") => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";

  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (format === "time") {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (format === "datetime") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return d.toISOString();
};

// Get relative time
export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Format number with K/M suffix
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Truncate text
export const truncate = (text, length = 100, suffix = "...") => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

// Slugify string
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone (Ethiopian format)
export const isValidEthiopianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, "");
  const regex = /^(\+251|0)[9]\d{8}$/;
  return regex.test(cleaned);
};

// Validate student ID (Jigjiga University format)
export const isValidStudentId = (id) => {
  const regex = /^JU-\d{4}-\d{4}$/i;
  return regex.test(id);
};

// Mask email
export const maskEmail = (email) => {
  const [local, domain] = email.split("@");
  const maskedLocal = local.slice(0, 2) + "***" + local.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// Mask phone
export const maskPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.slice(0, 3) + "****" + cleaned.slice(-4);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};

// Download file
export const downloadFile = (content, filename, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Parse query string
export const parseQueryString = (query) => {
  const params = new URLSearchParams(query);
  const result = {};
  for (const [key, value] of params) {
    if (value === "true") result[key] = true;
    else if (value === "false") result[key] = false;
    else if (!isNaN(value) && value !== "") result[key] = Number(value);
    else result[key] = value;
  }
  return result;
};

// Build query string
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Get random color from name
export const getColorFromName = (name) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (order === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, fields) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    }),
  );
};

// Paginate array
export const paginate = (array, page, limit) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    items: array.slice(start, end),
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
    hasMore: end < array.length,
  };
};

// Detect mobile device
export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

// Detect touch device
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Get OS
export const getOS = () => {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "windows";
  if (ua.includes("Mac")) return "mac";
  if (ua.includes("Linux")) return "linux";
  if (ua.includes("Android")) return "android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
    return "ios";
  return "unknown";
};

// Get browser
export const getBrowser = () => {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "chrome";
  if (ua.includes("Firefox")) return "firefox";
  if (ua.includes("Safari")) return "safari";
  if (ua.includes("Edge")) return "edge";
  return "unknown";
};
