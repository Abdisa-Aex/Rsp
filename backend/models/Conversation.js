const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    // Participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],

    // Resource (if conversation is about a specific resource)
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      index: true,
    },

    // Last message
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageText: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Message count
    messageCount: { type: Number, default: 0 },

    // Per-user settings
    settings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        muted: { type: Boolean, default: false },
        mutedUntil: { type: Date },
        archived: { type: Boolean, default: false },
        pinned: { type: Boolean, default: false },
        unreadCount: { type: Number, default: 0 },
        lastReadAt: { type: Date },
        lastReadMessageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      },
    ],

    // Deleted for users
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Type (direct or group)
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    // Group chat metadata (if type === 'group')
    groupName: { type: String, trim: true },
    groupAvatar: { type: String },
    groupDescription: { type: String, maxlength: 500 },
    groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupInviteLink: { type: String, unique: true, sparse: true },
    groupJoinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
        respondedAt: Date,
        respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Indexes
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({ lastMessageAt: -1 });
ConversationSchema.index({ resource: 1 });
ConversationSchema.index({ type: 1 });
ConversationSchema.index(
  { groupInviteLink: 1 },
  { unique: true, sparse: true },
);

// Pre-save middleware
ConversationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// Get user settings
ConversationSchema.methods.getUserSettings = function (userId) {
  const settings = this.settings?.find(
    (s) => s.user.toString() === userId.toString(),
  );
  if (settings) return settings;

  return {
    user: userId,
    muted: false,
    archived: false,
    pinned: false,
    unreadCount: 0,
    lastReadAt: null,
    lastReadMessageId: null,
  };
};

// Update user settings
ConversationSchema.methods.updateUserSettings = async function (
  userId,
  updates,
) {
  const existing = this.settings.find(
    (s) => s.user.toString() === userId.toString(),
  );

  if (existing) {
    Object.assign(existing, updates);
  } else {
    this.settings.push({ user: userId, ...updates });
  }

  await this.save();
  return this;
};

// Increment unread count for user
ConversationSchema.methods.incrementUnread = async function (userId) {
  const settings = this.getUserSettings(userId);
  settings.unreadCount += 1;
  await this.updateUserSettings(userId, { unreadCount: settings.unreadCount });
  return settings.unreadCount;
};

// Reset unread count for user
ConversationSchema.methods.resetUnread = async function (
  userId,
  lastMessageId,
) {
  await this.updateUserSettings(userId, {
    unreadCount: 0,
    lastReadAt: new Date(),
    lastReadMessageId: lastMessageId,
  });
  return this;
};

// Check if user can access conversation
ConversationSchema.methods.canAccess = function (userId) {
  if (this.deletedFor.includes(userId)) return false;
  return this.participants.some((p) => p.toString() === userId.toString());
};

// Get other participant (for direct chats)
ConversationSchema.methods.getOtherParticipant = function (userId) {
  if (this.type !== "direct") return null;
  return this.participants.find((p) => p.toString() !== userId.toString());
};

// Update last message
ConversationSchema.methods.updateLastMessage = async function (message) {
  this.lastMessage = message._id;
  this.lastMessageText =
    message.type === "text" ? message.text : `${message.type} message`;
  this.lastMessageAt = message.createdAt;
  this.lastMessageSender = message.sender;
  this.messageCount += 1;
  await this.save();
  return this;
};

// Soft delete for user
ConversationSchema.methods.deleteForUser = async function (userId) {
  if (!this.deletedFor.includes(userId)) {
    this.deletedFor.push(userId);
    await this.save();
  }
  return this;
};

// Restore for user
ConversationSchema.methods.restoreForUser = async function (userId) {
  this.deletedFor = this.deletedFor.filter(
    (id) => id.toString() !== userId.toString(),
  );
  await this.save();
  return this;
};

// Generate group invite link
ConversationSchema.methods.generateInviteLink = async function () {
  const inviteCode = Math.random().toString(36).substring(2, 15);
  this.groupInviteLink = inviteCode;
  await this.save();
  return `${process.env.FRONTEND_URL}/join/${inviteCode}`;
};

// Add join request
ConversationSchema.methods.addJoinRequest = async function (
  userId,
  message = "",
) {
  if (this.type !== "group") throw new Error("Not a group conversation");
  if (this.participants.includes(userId)) throw new Error("Already a member");
  if (
    this.groupJoinRequests.some((r) => r.user.toString() === userId.toString())
  ) {
    throw new Error("Request already pending");
  }

  this.groupJoinRequests.push({
    user: userId,
    message,
    status: "pending",
    requestedAt: new Date(),
  });
  await this.save();
  return this;
};

// Approve join request
ConversationSchema.methods.approveJoinRequest = async function (
  userId,
  adminId,
) {
  const request = this.groupJoinRequests.find(
    (r) => r.user.toString() === userId.toString(),
  );
  if (!request) throw new Error("Request not found");
  if (request.status !== "pending")
    throw new Error("Request already processed");

  request.status = "approved";
  request.respondedAt = new Date();
  request.respondedBy = adminId;

  this.participants.push(userId);
  await this.save();
  return this;
};

// Reject join request
ConversationSchema.methods.rejectJoinRequest = async function (
  userId,
  adminId,
  reason = "",
) {
  const request = this.groupJoinRequests.find(
    (r) => r.user.toString() === userId.toString(),
  );
  if (!request) throw new Error("Request not found");
  if (request.status !== "pending")
    throw new Error("Request already processed");

  request.status = "rejected";
  request.respondedAt = new Date();
  request.respondedBy = adminId;

  await this.save();
  return this;
};

// Remove participant from group
ConversationSchema.methods.removeParticipant = async function (
  userId,
  adminId,
) {
  if (this.type !== "group") throw new Error("Not a group conversation");
  if (
    !this.groupAdmins.includes(adminId) &&
    adminId.toString() !== userId.toString()
  ) {
    throw new Error("Not authorized");
  }

  this.participants = this.participants.filter(
    (p) => p.toString() !== userId.toString(),
  );
  if (this.groupAdmins.includes(userId)) {
    this.groupAdmins = this.groupAdmins.filter(
      (a) => a.toString() !== userId.toString(),
    );
  }

  await this.save();
  return this;
};

// Add admin
ConversationSchema.methods.addAdmin = async function (userId, adminId) {
  if (this.type !== "group") throw new Error("Not a group conversation");
  if (!this.groupAdmins.includes(adminId)) throw new Error("Not authorized");
  if (!this.participants.includes(userId)) throw new Error("User not in group");
  if (this.groupAdmins.includes(userId))
    throw new Error("User is already admin");

  this.groupAdmins.push(userId);
  await this.save();
  return this;
};

// Remove admin
ConversationSchema.methods.removeAdmin = async function (userId, adminId) {
  if (this.type !== "group") throw new Error("Not a group conversation");
  if (!this.groupAdmins.includes(adminId)) throw new Error("Not authorized");
  if (!this.groupAdmins.includes(userId)) throw new Error("User is not admin");
  if (this.groupAdmins.length === 1)
    throw new Error("Cannot remove last admin");

  this.groupAdmins = this.groupAdmins.filter(
    (a) => a.toString() !== userId.toString(),
  );
  await this.save();
  return this;
};

module.exports = mongoose.model("Conversation", ConversationSchema);
