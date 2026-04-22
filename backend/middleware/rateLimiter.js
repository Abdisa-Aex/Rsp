const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");

let redisClient = null;

try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
} catch (error) {
  console.warn("Redis not available, using memory store for rate limiting");
}

// General rate limiter
exports.generalLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:general:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return req.path === "/health" || req.path === "/";
  },
});

// Authentication rate limiter
exports.authLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:auth:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

// Registration rate limiter
exports.registerLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:register:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many registration attempts, please try again later.",
  },
});

// Upload rate limiter
exports.uploadLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:upload:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many uploads, please try again later.",
  },
});

// Message rate limiter
exports.messageLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:message:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many messages, please slow down.",
  },
});

// Search rate limiter
exports.searchLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rl:search:",
        resetExpiryOnChange: true,
      })
    : undefined,
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many search requests, please slow down.",
  },
});

exports.wishlistLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    success: false,
    message: "Too many wishlist actions, please try again later",
  },
});

exports.exchangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: "Too many exchange requests, please try again later",
  },
});
// API key rate limiter (for external services)
exports.apiKeyLimiter = (max = 1000, windowMs = 60 * 1000) => {
  return rateLimit({
    store: redisClient
      ? new RedisStore({
          client: redisClient,
          prefix: "rl:apikey:",
          resetExpiryOnChange: true,
        })
      : undefined,
    windowMs,
    max,
    keyGenerator: (req) => {
      return req.headers["x-api-key"] || req.ip;
    },
    skip: (req) => {
      return !req.headers["x-api-key"];
    },
  });
};
