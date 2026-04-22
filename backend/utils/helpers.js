const crypto = require("crypto");
const validator = require("validator");

// Generate random verification code
exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random referral code
exports.generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Generate random slug
exports.generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Calculate distance between two coordinates (Haversine formula)
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format currency
exports.formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Format date
exports.formatDate = (date, format = "short") => {
  const d = new Date(date);

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

  if (format === "relative") {
    return exports.getTimeAgo(d);
  }

  return d.toISOString();
};

// Get time ago
exports.getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

// Truncate text
exports.truncate = (text, length = 100, suffix = "...") => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

// Generate random color
exports.randomColor = () => {
  const colors = [
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
    "#ec489a",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Validate email
exports.isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate phone (Ethiopian format)
exports.isValidEthiopianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, "");
  const regex = /^(\+251|0)[9]\d{8}$/;
  return regex.test(cleaned);
};

// Validate student ID
exports.isValidStudentId = (id) => {
  const regex = /^JU-\d{4}-\d{4}$/i;
  return regex.test(id);
};

// Mask email
exports.maskEmail = (email) => {
  const [local, domain] = email.split("@");
  const maskedLocal = local.slice(0, 2) + "***" + local.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// Mask phone
exports.maskPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.slice(0, 3) + "****" + cleaned.slice(-4);
};

// Parse query string
exports.parseQuery = (query) => {
  const parsed = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === "true") parsed[key] = true;
    else if (value === "false") parsed[key] = false;
    else if (!isNaN(value) && value !== "") parsed[key] = Number(value);
    else parsed[key] = value;
  }
  return parsed;
};

// Paginate results
exports.paginate = (items, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit),
      hasMore: end < items.length,
    },
  };
};

// Deep clone object
exports.deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Sleep/delay
exports.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Retry function
exports.retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await exports.sleep(delay);
    return exports.retry(fn, retries - 1, delay * 2);
  }
};

// Generate random string
exports.randomString = (length = 10) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

// Hash string
exports.hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

// Compare hashed strings
exports.compareHash = (str, hash) => {
  return exports.hashString(str) === hash;
};

// Extract mentions from text
exports.extractMentions = (text) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

// Extract hashtags from text
exports.extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }
  return hashtags;
};

// Validate URL
exports.isValidUrl = (url) => {
  return validator.isURL(url);
};

// Sanitize HTML
exports.sanitizeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "");
};

// Escape HTML
exports.escapeHtml = (text) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Unescape HTML
exports.unescapeHtml = (text) => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};
