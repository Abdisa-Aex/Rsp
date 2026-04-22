module.exports = {
  USER_TYPES: {
    STUDENT: "student",
    FACULTY: "faculty",
    ALUMNI: "alumni",
    EXTERNAL: "external",
  },

  USER_ROLES: {
    USER: "user",
    MODERATOR: "moderator",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
  },

  PERMISSIONS: {
    MANAGE_USERS: "manage_users",
    MANAGE_RESOURCES: "manage_resources",
    MANAGE_REPORTS: "manage_reports",
    MANAGE_SETTINGS: "manage_settings",
    VIEW_ANALYTICS: "view_analytics",
    MANAGE_ROLES: "manage_roles",
  },

  RESOURCE_STATUS: {
    AVAILABLE: "available",
    BORROWED: "borrowed",
    PENDING: "pending",
    MAINTENANCE: "maintenance",
    UNAVAILABLE: "unavailable",
    DELETED: "deleted",
  },

  RESOURCE_CONDITIONS: {
    EXCELLENT: "excellent",
    GOOD: "good",
    FAIR: "fair",
    NEEDS_REPAIR: "needs_repair",
  },

  PRICE_TYPES: {
    FREE: "free",
    RENTAL: "rental",
    DEPOSIT: "deposit",
    BARTER: "barter",
  },

  MESSAGE_TYPES: {
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    FILE: "file",
    LOCATION: "location",
    CONTACT: "contact",
    POLL: "poll",
  },

  NOTIFICATION_TYPES: {
    MESSAGE: "message",
    REQUEST: "request",
    RETURN: "return",
    REVIEW: "review",
    SYSTEM: "system",
    PROMOTION: "promotion",
    ACHIEVEMENT: "achievement",
  },

  EXCHANGE_STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELED: "canceled",
    DISPUTED: "disputed",
  },

  POINTS: {
    SHARE_ITEM: 100,
    BORROW_ITEM: 50,
    COMPLETE_EXCHANGE: 200,
    WRITE_REVIEW: 25,
    RECEIVE_REVIEW: 50,
    VERIFY_EMAIL: 100,
    VERIFY_PHONE: 50,
    REFERRAL: 500,
    DAILY_LOGIN: 10,
  },

  ACHIEVEMENTS: {
    FIRST_SHARE: {
      id: "first_share",
      name: "First Share",
      description: "Shared your first resource",
      points: 100,
      icon: "📦",
    },
    FIRST_BORROW: {
      id: "first_borrow",
      name: "First Borrow",
      description: "Borrowed your first resource",
      points: 50,
      icon: "🤝",
    },
    SUPER_SHARER: {
      id: "super_sharer",
      name: "Super Sharer",
      description: "Shared 10 resources",
      points: 500,
      icon: "🌟",
    },
    TRUSTED_MEMBER: {
      id: "trusted_member",
      name: "Trusted Member",
      description: "Reached 50 trust score",
      points: 200,
      icon: "🛡️",
    },
    COMMUNITY_HERO: {
      id: "community_hero",
      name: "Community Hero",
      description: "Helped 50 community members",
      points: 1000,
      icon: "🏆",
    },
    ECO_WARRIOR: {
      id: "eco_warrior",
      name: "Eco Warrior",
      description: "Saved 100kg CO2 through sharing",
      points: 500,
      icon: "🌱",
    },
  },

  RATE_LIMITS: {
    LOGIN: { windowMs: 15 * 60 * 1000, max: 5 },
    REGISTER: { windowMs: 60 * 60 * 1000, max: 3 },
    MESSAGE: { windowMs: 60 * 1000, max: 60 },
    SEARCH: { windowMs: 60 * 1000, max: 30 },
    UPLOAD: { windowMs: 60 * 1000, max: 10 },
  },

  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024,
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "audio/mpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    MAX_FILES: 10,
  },

  CACHE_TTL: {
    USER: 3600,
    RESOURCES: 300,
    CONVERSATIONS: 60,
    ANALYTICS: 3600,
  },

  NOTIFICATION_PREFERENCES: {
    MESSAGES: "messages",
    REQUESTS: "requests",
    RETURNS: "returns",
    REVIEWS: "reviews",
    PROMOTIONS: "promotions",
    SYSTEM: "system",
  },
};
