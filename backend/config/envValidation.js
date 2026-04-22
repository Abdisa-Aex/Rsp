// const requiredEnvVars = [
//   "MONGO_URI",
//   "JWT_SECRET",
//   "JWT_REFRESH_SECRET",
//   "FRONTEND_URL",
//   "CLOUDINARY_CLOUD_NAME",
//   "CLOUDINARY_API_KEY",
//   "CLOUDINARY_API_SECRET",
//   "GMAIL_EMAIL",
//   "GMAIL_APP_PASSWORD",
// ];

// const validateEnv = () => {
//   const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
//   if (missing.length > 0) {
//     console.error(
//       `❌ Missing required environment variables: ${missing.join(", ")}`,
//     );
//     process.exit(1);
//   }
//   console.log("✅ All environment variables are set");
// };

// module.exports = validateEnv;

const requiredEnvVars = [
  // Database
  "MONGO_URI",

  // JWT Authentication
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",

  // Frontend
  "FRONTEND_URL",

  // Cloudinary (Image Upload)
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",

  // Email (Gmail)
  "GMAIL_EMAIL",
  "GMAIL_APP_PASSWORD",

  // ========== ADD THESE ADDITIONAL REQUIRED VARIABLES ==========

  // Server
  "PORT",

  // JWT Expiry (optional but good to have defaults)
  // "JWT_EXPIRE",
  // "JWT_REFRESH_EXPIRE",
];

// Optional variables that won't crash the server if missing
const optionalEnvVars = [
  "NODE_ENV",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "REDIS_URL",
  "SENTRY_DSN",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_WS_URL",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY",
  "NEXT_PUBLIC_APP_STORE_URL",
  "NEXT_PUBLIC_GOOGLE_PLAY_URL",
];

const validateEnv = () => {
  console.log("🔍 Validating environment variables...\n");

  // Check required variables
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((env) => console.error(`   - ${env}`));
    console.error("\n⚠️ Please add these variables to your .env file\n");
    process.exit(1);
  }

  console.log("✅ All required environment variables are set");

  // Check optional variables (just warn)
  const missingOptional = optionalEnvVars.filter(
    (envVar) => !process.env[envVar],
  );
  if (missingOptional.length > 0) {
    console.log(
      "\n⚠️ Optional environment variables missing (features may be limited):",
    );
    missingOptional.forEach((env) => console.log(`   - ${env}`));
  }

  // Additional validations
  console.log("\n📋 Environment Details:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`   PORT: ${process.env.PORT || 5000}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  console.log(
    `   MongoDB: ${process.env.MONGO_URI?.includes("localhost") ? "Local" : "Cloud"}`,
  );

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "\n⚠️ Warning: JWT_SECRET should be at least 32 characters long",
    );
  }

  if (
    process.env.JWT_REFRESH_SECRET &&
    process.env.JWT_REFRESH_SECRET.length < 32
  ) {
    console.warn(
      "⚠️ Warning: JWT_REFRESH_SECRET should be at least 32 characters long",
    );
  }

  // Validate MongoDB URI format
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith("mongodb")) {
    console.warn(
      "⚠️ Warning: MONGO_URI doesn't look like a valid MongoDB connection string",
    );
  }

  // Validate frontend URL format
  if (
    process.env.FRONTEND_URL &&
    !process.env.FRONTEND_URL.startsWith("http")
  ) {
    console.warn(
      "⚠️ Warning: FRONTEND_URL should start with http:// or https://",
    );
  }

  // Validate Cloudinary configuration
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    console.log("\n✅ Cloudinary configuration present");
  }

  // Validate Gmail configuration
  if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
    console.log("✅ Gmail configuration present");
  }

  console.log("\n✅ Environment validation complete\n");
};

module.exports = validateEnv;