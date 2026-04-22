// const mongoose = require("mongoose");
// require("dotenv").config();

// const createIndexes = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");

//     const User = require("../models/User");
//     const Resource = require("../models/Resource");
//     const Exchange = require("../models/Exchange");

//     // User indexes
//     await User.collection.createIndex({ email: 1 });
//     await User.collection.createIndex({ username: 1 });
//     await User.collection.createIndex({ trustScore: -1 });

//     // Resource indexes
//     await Resource.collection.createIndex({ category: 1, status: 1 });
//     await Resource.collection.createIndex({
//       location: "text",
//       title: "text",
//       description: "text",
//     });
//     await Resource.collection.createIndex({ coordinates: "2dsphere" });

//     // Exchange indexes
//     await Exchange.collection.createIndex({ owner: 1, status: 1 });
//     await Exchange.collection.createIndex({ borrower: 1, status: 1 });
//     await Exchange.collection.createIndex({ startDate: 1, endDate: 1 });

//     console.log("✅ All indexes created successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error creating indexes:", error);
//     process.exit(1);
//   }
// };

// createIndexes();

const mongoose = require("mongoose");
require("dotenv").config();

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Load all models
    const User = require("../models/User");
    const Resource = require("../models/Resource");
    const Exchange = require("../models/Exchange");
    const Message = require("../models/Message");
    const Conversation = require("../models/Conversation");
    const Notification = require("../models/Notification");
    const Review = require("../models/Review");
    const Report = require("../models/Report");
    const Token = require("../models/Token");

    console.log("📋 Creating indexes...\n");

    // ============ USER INDEXES ============
    console.log("📊 User indexes:");
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex(
      { username: 1 },
      { unique: true, sparse: true },
    );
    await User.collection.createIndex(
      { referralCode: 1 },
      { unique: true, sparse: true },
    );
    await User.collection.createIndex({ studentId: 1 }, { sparse: true });
    await User.collection.createIndex({ trustScore: -1 });
    await User.collection.createIndex({ points: -1 });
    await User.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ isBanned: 1, deletedAt: 1 });
    await User.collection.createIndex({ "stats.itemsShared": -1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ "preferences.privacy.showEmail": 1 });
    await User.collection.createIndex({ lastActive: -1 });
    await User.collection.createIndex({ online: 1 });
    console.log("   ✅ User indexes created");

    // ============ RESOURCE INDEXES ============
    console.log("\n📊 Resource indexes:");
    await Resource.collection.createIndex({ category: 1, status: 1 });
    await Resource.collection.createIndex({ owner: 1, status: 1 });
    await Resource.collection.createIndex({ status: 1, createdAt: -1 });
    await Resource.collection.createIndex({ price: 1 });
    await Resource.collection.createIndex({ rating: -1 });
    await Resource.collection.createIndex({ views: -1 });
    await Resource.collection.createIndex({ isTrending: 1, isFeatured: 1 });
    await Resource.collection.createIndex({ createdAt: -1 });
    await Resource.collection.createIndex(
      { slug: 1 },
      { unique: true, sparse: true },
    );
    await Resource.collection.createIndex({ tags: 1 });
    await Resource.collection.createIndex({
      location: "text",
      title: "text",
      description: "text",
    });
    await Resource.collection.createIndex({ coordinates: "2dsphere" });
    await Resource.collection.createIndex({ moderationStatus: 1, status: 1 });
    await Resource.collection.createIndex({ expiresAt: 1 });
    console.log("   ✅ Resource indexes created");

    // ============ EXCHANGE INDEXES ============
    console.log("\n📊 Exchange indexes:");
    await Exchange.collection.createIndex({ owner: 1, status: 1 });
    await Exchange.collection.createIndex({ borrower: 1, status: 1 });
    await Exchange.collection.createIndex({ resource: 1, status: 1 });
    await Exchange.collection.createIndex({ startDate: 1, endDate: 1 });
    await Exchange.collection.createIndex({ createdAt: -1 });
    await Exchange.collection.createIndex({ status: 1, endDate: 1 });
    await Exchange.collection.createIndex({ paymentStatus: 1 });
    await Exchange.collection.createIndex({ owner: 1, borrower: 1, status: 1 });
    console.log("   ✅ Exchange indexes created");

    // ============ MESSAGE INDEXES ============
    console.log("\n📊 Message indexes:");
    await Message.collection.createIndex({ conversation: 1, createdAt: -1 });
    await Message.collection.createIndex({ sender: 1, recipient: 1 });
    await Message.collection.createIndex({ read: 1 });
    await Message.collection.createIndex({ scheduledFor: 1 });
    await Message.collection.createIndex({ createdAt: -1 });
    await Message.collection.createIndex({ type: 1 });
    console.log("   ✅ Message indexes created");

    // ============ CONVERSATION INDEXES ============
    console.log("\n📊 Conversation indexes:");
    await Conversation.collection.createIndex({ participants: 1 });
    await Conversation.collection.createIndex({ updatedAt: -1 });
    await Conversation.collection.createIndex({ lastMessageAt: -1 });
    await Conversation.collection.createIndex({ resource: 1 });
    await Conversation.collection.createIndex({ type: 1 });
    await Conversation.collection.createIndex(
      { groupInviteLink: 1 },
      { unique: true, sparse: true },
    );
    console.log("   ✅ Conversation indexes created");

    // ============ NOTIFICATION INDEXES ============
    console.log("\n📊 Notification indexes:");
    await Notification.collection.createIndex({ user: 1, createdAt: -1 });
    await Notification.collection.createIndex({ user: 1, read: 1 });
    await Notification.collection.createIndex({ type: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    await Notification.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
    console.log("   ✅ Notification indexes created");

    // ============ REVIEW INDEXES ============
    console.log("\n📊 Review indexes:");
    await Review.collection.createIndex({ reviewee: 1, createdAt: -1 });
    await Review.collection.createIndex({ resource: 1, createdAt: -1 });
    await Review.collection.createIndex({ rating: 1 });
    await Review.collection.createIndex({ moderationStatus: 1 });
    await Review.collection.createIndex({ exchange: 1 });
    await Review.collection.createIndex({ reviewer: 1, reviewee: 1 });
    console.log("   ✅ Review indexes created");

    // ============ REPORT INDEXES ============
    console.log("\n📊 Report indexes:");
    await Report.collection.createIndex({ targetType: 1, targetId: 1 });
    await Report.collection.createIndex({ reporter: 1 });
    await Report.collection.createIndex({ status: 1, priority: 1 });
    await Report.collection.createIndex({ assignedTo: 1 });
    await Report.collection.createIndex({ createdAt: -1 });
    console.log("   ✅ Report indexes created");

    // ============ TOKEN INDEXES ============
    console.log("\n📊 Token indexes:");
    await Token.collection.createIndex({ token: 1 }, { unique: true });
    await Token.collection.createIndex({ user: 1, type: 1 });
    await Token.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
    await Token.collection.createIndex({ createdAt: -1 });
    console.log("   ✅ Token indexes created");

    // ============ COMPOUND INDEXES FOR COMMON QUERIES ============
    console.log("\n📊 Compound indexes:");

    // Resource compound indexes
    await Resource.collection.createIndex({
      category: 1,
      status: 1,
      createdAt: -1,
    });
    await Resource.collection.createIndex({
      owner: 1,
      status: 1,
      createdAt: -1,
    });
    await Resource.collection.createIndex({
      isVerified: 1,
      status: 1,
      rating: -1,
    });

    // Exchange compound indexes
    await Exchange.collection.createIndex({
      owner: 1,
      status: 1,
      createdAt: -1,
    });
    await Exchange.collection.createIndex({
      borrower: 1,
      status: 1,
      createdAt: -1,
    });
    await Exchange.collection.createIndex({
      resource: 1,
      status: 1,
      startDate: 1,
    });

    // User compound indexes
    await User.collection.createIndex({ trustScore: -1, points: -1 });
    await User.collection.createIndex({ createdAt: -1, trustScore: -1 });

    console.log("   ✅ Compound indexes created");

    // ============ TEXT SEARCH INDEXES ============
    console.log("\n📊 Text search indexes:");

    // Check if text index exists, if not create it
    const existingIndexes = await Resource.collection.indexes();
    const hasTextIndex = existingIndexes.some((idx) =>
      idx.name?.includes("text"),
    );

    if (!hasTextIndex) {
      await Resource.collection.createIndex(
        { title: "text", description: "text", tags: "text", location: "text" },
        {
          weights: { title: 10, description: 5, tags: 8, location: 3 },
          name: "text_search_index",
        },
      );
      console.log("   ✅ Text search index created");
    } else {
      console.log("   ✅ Text search index already exists");
    }

    // ============ GEOGRAPHICAL INDEXES ============
    console.log("\n📊 Geospatial indexes:");

    // Check if 2dsphere index exists
    const hasGeoIndex = existingIndexes.some((idx) =>
      idx.name?.includes("2dsphere"),
    );

    if (!hasGeoIndex) {
      await Resource.collection.createIndex({ coordinates: "2dsphere" });
      console.log("   ✅ 2dsphere index created");
    } else {
      console.log("   ✅ 2dsphere index already exists");
    }

    // ============ INDEX SUMMARY ============
    console.log("\n" + "=".repeat(50));
    console.log("📊 INDEX CREATION SUMMARY");
    console.log("=".repeat(50));

    const userIndexes = await User.collection.indexes();
    const resourceIndexes = await Resource.collection.indexes();
    const exchangeIndexes = await Exchange.collection.indexes();

    console.log(`\n✅ User indexes: ${userIndexes.length}`);
    console.log(`✅ Resource indexes: ${resourceIndexes.length}`);
    console.log(`✅ Exchange indexes: ${exchangeIndexes.length}`);
    console.log(
      `✅ Message indexes: ${(await Message.collection.indexes()).length}`,
    );
    console.log(
      `✅ Conversation indexes: ${(await Conversation.collection.indexes()).length}`,
    );
    console.log(
      `✅ Notification indexes: ${(await Notification.collection.indexes()).length}`,
    );
    console.log(
      `✅ Review indexes: ${(await Review.collection.indexes()).length}`,
    );
    console.log(
      `✅ Report indexes: ${(await Report.collection.indexes()).length}`,
    );
    console.log(
      `✅ Token indexes: ${(await Token.collection.indexes()).length}`,
    );

    console.log("\n🎉 All indexes created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    process.exit(1);
  }
};

createIndexes();