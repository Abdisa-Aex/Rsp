require("dotenv").config();
const validateEnv = require("./config/envValidation");
validateEnv();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const morgan = require("morgan");
const exchangeRoutes = require("./routes/exchanges");
const activityRoutes = require("./routes/activities");

// ============ SENTRY INITIALIZATION (OPTIONAL) ============
let Sentry;
let isSentryEnabled = false;

try {
  Sentry = require("@sentry/node");
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: 1.0,
    });
    isSentryEnabled = true;
    console.log("✅ Sentry initialized");
  } else {
    console.log("⚠️ SENTRY_DSN not set, Sentry disabled");
  }
} catch (error) {
  console.log("⚠️ Sentry not installed, error tracking disabled");
}

// Import configurations
const connectDB = require("./config/database");
const { setupSocket } = require("./socket");
const { logger } = require("./utils/logger");
const { initializeFirebase } = require("./config/firebase");

// ============ CREATE EXPRESS APP FIRST ============
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  },
  path: "/socket.io",
  transports: ["websocket", "polling"],
});

// ============ SENTRY REQUEST HANDLER (ONLY IF ENABLED) ============
if (isSentryEnabled) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// ============ CORS CONFIGURATION - MUST BE FIRST ============
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization", "Accept"],
};

// Apply CORS before all other middleware
app.use(cors(corsOptions));

// ============ THEN IMPORT ROUTES ============
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const resourceRoutes = require("./routes/resources");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");
const webhookRoutes = require("./routes/webhooks");
const wishlistRoutes = require("./routes/wishlist");

// Initialize Firebase for push notifications
initializeFirebase();

// ============ OTHER MIDDLEWARE (after CORS) ============
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", "ws://localhost:5000", "wss://*.herokuapp.com"],
      },
    },
  }),
);

// Compression
app.use(compression());

// Body parsing - MUST come before routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// ============ API ROUTES (after body parsing) ============
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/activities", activityRoutes);
// ============ HEALTH CHECK ============
app.get("/api/health", async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const uptime = process.uptime();

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    environment: process.env.NODE_ENV || "development",
    mongodb: dbStatus,
    memory: process.memoryUsage(),
    version: require("./package.json").version,
  });
});

// ============ SWAGGER DOCUMENTATION (OPTIONAL) ============
try {
  const { swaggerUi, specs } = require("./config/swagger");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("📚 Swagger documentation available at /api-docs");
} catch (error) {
  console.log("⚠️ Swagger not configured");
}

// ============ STATIC ASSETS (Production only) ============
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend/out"), {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      },
    }),
  );

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/out/index.html"));
  });
}

// ============ SENTRY ERROR HANDLER (ONLY IF ENABLED) ============
if (isSentryEnabled) {
  app.use(Sentry.Handlers.errorHandler());
}

// ============ ERROR HANDLING MIDDLEWARE (LAST) ============
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ============ SOCKET.IO SETUP ============
setupSocket(io);

// ============ DATABASE CONNECTION ============
connectDB();

// ============ GRACEFUL SHUTDOWN ============
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, closing server...");
  server.close(() => {
    mongoose.connection.close();
    logger.info("Server closed");
    process.exit(0);
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(
    `✅ CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`,
  );
});

module.exports = { app, server, io };
