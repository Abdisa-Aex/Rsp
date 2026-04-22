const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

const cache = (key, ttl = 3600) => {
  return async (req, res, next) => {
    const cached = await redis.get(`${key}:${req.user?.id || req.ip}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    res.sendResponse = res.json;
    res.json = (data) => {
      redis.setex(
        `${key}:${req.user?.id || req.ip}`,
        ttl,
        JSON.stringify(data),
      );
      res.sendResponse(data);
    };
    next();
  };
};

module.exports = { redis, cache };
