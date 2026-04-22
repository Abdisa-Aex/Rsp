// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "ResourceHub API",
//       version: "1.0.0",
//       description: "Resource sharing platform API documentation",
//     },
//     servers: [{ url: `http://localhost:${process.env.PORT || 5000}/api` }],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//   },
//   apis: ["./routes/*.js", "./models/*.js"],
// };

// const specs = swaggerJsdoc(options);

// module.exports = { swaggerUi, specs };

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ResourceHub API",
      version: "1.0.0",
      description: `
        Resource sharing platform API documentation.
        
        ## Features
        - 🔐 Authentication & Authorization (JWT, Magic Link, 2FA)
        - 👤 User Management (Profile, Stats, Badges)
        - 📦 Resource Management (CRUD, Search, Filters)
        - 🤝 Exchange System (Borrowing, Returns, Reviews)
        - 💬 Real-time Messaging (Socket.io)
        - 🔔 Notifications (Push, Email)
        - 📊 Analytics & Reports
        - ❤️ Wishlist & Bookmarks
        - ⭐ Reviews & Ratings
      `,
      contact: {
        name: "ResourceHub Support",
        email: "support@resourcehub.com",
        url: "https://resourcehub.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: "Development server",
      },
      {
        url: process.env.PRODUCTION_URL || "https://api.resourcehub.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Cookie-based authentication",
        },
      },
      schemas: {
        // Common responses
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },

        // User schemas
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            username: { type: "string" },
            avatar: { type: "string" },
            bio: { type: "string" },
            location: { type: "string" },
            trustScore: { type: "number" },
            points: { type: "number" },
            rating: { type: "number" },
            isVerified: { type: "boolean" },
            role: {
              type: "string",
              enum: ["user", "moderator", "admin", "super_admin"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // Resource schemas
        Resource: {
          type: "object",
          required: ["title", "description", "category", "location"],
          properties: {
            title: { type: "string", minLength: 5, maxLength: 200 },
            description: { type: "string", minLength: 20, maxLength: 5000 },
            category: { type: "string" },
            subcategory: { type: "string" },
            location: { type: "string" },
            priceType: {
              type: "string",
              enum: ["free", "rental", "deposit", "barter"],
            },
            price: { type: "number", minimum: 0 },
            priceUnit: { type: "string", enum: ["day", "week", "month"] },
            deposit: { type: "number", minimum: 0 },
            condition: {
              type: "string",
              enum: ["excellent", "good", "fair", "needs_repair"],
            },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  isPrimary: { type: "boolean" },
                },
              },
            },
            status: {
              type: "string",
              enum: ["available", "borrowed", "pending", "maintenance"],
            },
          },
        },

        // Exchange schemas
        Exchange: {
          type: "object",
          required: ["resourceId", "startDate", "endDate"],
          properties: {
            resourceId: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            message: { type: "string", maxLength: 500 },
            totalAmount: { type: "number" },
          },
        },

        // Review schemas
        Review: {
          type: "object",
          required: ["rating", "review"],
          properties: {
            rating: { type: "number", minimum: 1, maximum: 5 },
            review: { type: "string", minLength: 10, maxLength: 1000 },
          },
        },

        // Pagination
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", default: 1 },
            limit: { type: "integer", default: 12 },
            total: { type: "integer" },
            pages: { type: "integer" },
            hasMore: { type: "boolean" },
          },
        },
      },
      parameters: {
        pageParam: {
          name: "page",
          in: "query",
          description: "Page number",
          schema: { type: "integer", default: 1 },
        },
        limitParam: {
          name: "limit",
          in: "query",
          description: "Items per page",
          schema: { type: "integer", default: 12, maximum: 100 },
        },
      },
    },
    tags: [
      { name: "Authentication", description: "Login, register, verify email" },
      { name: "Users", description: "User profile management" },
      { name: "Resources", description: "Resource CRUD operations" },
      { name: "Exchanges", description: "Borrowing and returning" },
      { name: "Wishlist", description: "Save favorite resources" },
      { name: "Reviews", description: "Rate and review experiences" },
      { name: "Messages", description: "Real-time messaging" },
      { name: "Notifications", description: "Push and email notifications" },
      { name: "Admin", description: "Administrative functions" },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./controllers/*.js"],
};

// Generate Swagger specification
const specs = swaggerJsdoc(options);

// Custom CSS for better UI
const customCss = `
  .swagger-ui .topbar { background-color: #10b981; }
  .swagger-ui .topbar .download-url-wrapper .select-label select { border-color: #10b981; }
  .swagger-ui .info .title { color: #10b981; }
  .swagger-ui .btn.authorize { border-color: #10b981; color: #10b981; }
  .swagger-ui .btn.authorize svg { fill: #10b981; }
`;

// Custom JS for better UX
const customJs = `
  (function() {
    // Add timestamp to API calls to prevent caching
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (url.includes('/api/') && !url.includes('_t=')) {
        const separator = url.includes('?') ? '&' : '?';
        url = url + separator + '_t=' + Date.now();
      }
      return originalFetch.call(this, url, options);
    };
  })();
`;

// Custom options for Swagger UI
const swaggerOptions = {
  customCss,
  customJs,
  customSiteTitle: "ResourceHub API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: "monokai",
    },
  },
};

module.exports = { swaggerUi, specs, swaggerOptions };