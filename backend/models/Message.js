const mongoose = require("mongoose");
const { MESSAGE_TYPES } = require("../config/constants");

const MessageSchema = new mongoose.Schema(
  {
    // Conversation
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Recipient (for quick lookup)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Content
    text: { type: String, default: "" },
    type: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
    },

    // File attachments
    file: {
      url: { type: String },
      name: { type: String },
      size: { type: Number },
      mimeType: { type: String },
      publicId: { type: String },
      duration: { type: Number }, // For audio/video
      thumbnail: { type: String }, // For video
      transcript: { type: String }, // For voice messages
    },

    // Location sharing
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      name: { type: String },
      placeId: { type: String },
    },

    // Contact sharing
    contact: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      vcard: { type: String }, // vCard data
    },

    // Poll
    poll: {
      question: String,
      options: [
        {
          id: Number,
          text: String,
          votes: { type: Number, default: 0 },
          voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      ],
      totalVotes: { type: Number, default: 0 },
      expiresAt: Date,
      isClosed: { type: Boolean, default: false },
    },

    // Reply to
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Forward chain (for forwarded messages)
    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    forwardChain: [
      {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        senderName: String,
        forwardedAt: Date,
      },
    ],

    // Status tracking
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read", "failed"],
      default: "sending",
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    deliveredAt: { type: Date },
    sentAt: { type: Date, default: Date.now },

    // Response tracking
    responseSent: { type: Boolean, default: false },
    responseTime: { type: Number }, // milliseconds

    // Reactions
    reactions: {
      type: Map,
      of: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      default: {},
    },

    // Edit tracking
    edited: { type: Boolean, default: false },
    editHistory: [
      {
        text: { type: String },
        editedAt: { type: Date, default: Date.now },
      },
    ],

    // Delete tracking (soft delete per user)
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deletedForEveryone: { type: Boolean, default: false },

    // Scheduled message
    scheduledFor: { type: Date },
    isScheduled: { type: Boolean, default: false },

    // Expiry
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },

    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Indexes for performance
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ read: 1 });
MessageSchema.index({ scheduledFor: 1 }, { sparse: true });
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware
MessageSchema.pre("save", function () {
  this.updatedAt = Date.now();
  if (this.isModified("status") && this.status === "sent" && !this.sentAt) {
    this.sentAt = Date.now();
  }
  if (this.isModified("read") && this.read && !this.readAt) {
    this.readAt = Date.now();
  }

  // Handle scheduled messages
  if (this.scheduledFor && this.scheduledFor > new Date()) {
    this.isScheduled = true;
    this.status = "sending";
  }
});
// Mark as read
MessageSchema.methods.markAsRead = async function (userId) {
  if (
    !this.read &&
    this.recipient &&
    this.recipient.toString() === userId.toString()
  ) {
    this.read = true;
    this.readAt = new Date();
    this.status = "read";
    await this.save();
  }
  return this;
};

// Mark as delivered
MessageSchema.methods.markAsDelivered = async function () {
  if (this.status === "sent") {
    this.status = "delivered";
    this.deliveredAt = new Date();
    await this.save();
  }
  return this;
};

// Add reaction
MessageSchema.methods.addReaction = async function (emoji, userId) {
  const reaction = this.reactions.get(emoji) || { count: 0, users: [] };

  if (!reaction.users.includes(userId)) {
    reaction.count += 1;
    reaction.users.push(userId);
    this.reactions.set(emoji, reaction);
    await this.save();
  }

  return this;
};

// Remove reaction
MessageSchema.methods.removeReaction = async function (emoji, userId) {
  const reaction = this.reactions.get(emoji);
  if (reaction) {
    const userIndex = reaction.users.indexOf(userId);
    if (userIndex !== -1) {
      reaction.users.splice(userIndex, 1);
      reaction.count -= 1;

      if (reaction.count === 0) {
        this.reactions.delete(emoji);
      } else {
        this.reactions.set(emoji, reaction);
      }

      await this.save();
    }
  }

  return this;
};

// Get reaction users
MessageSchema.methods.getReactionUsers = function (emoji) {
  const reaction = this.reactions.get(emoji);
  return reaction ? reaction.users : [];
};

// Soft delete for user
MessageSchema.methods.deleteForUser = async function (userId) {
  if (!this.deletedFor.includes(userId)) {
    this.deletedFor.push(userId);
    await this.save();
  }
  return this;
};

// Delete for everyone
MessageSchema.methods.deleteForEveryone = async function () {
  this.deletedForEveryone = true;
  this.text = "This message was deleted";
  this.file = null;
  this.location = null;
  this.contact = null;
  this.poll = null;
  await this.save();
  return this;
};

// Check if message is visible to user
MessageSchema.methods.isVisibleToUser = function (userId) {
  if (this.deletedForEveryone) return false;
  return !this.deletedFor.includes(userId);
};

// Edit message content
MessageSchema.methods.editMessage = async function (newText, userId) {
  if (this.sender.toString() !== userId.toString()) {
    throw new Error("Not authorized to edit this message");
  }

  this.editHistory.push({ text: this.text, editedAt: new Date() });
  this.text = newText;
  this.edited = true;
  this.updatedAt = new Date();

  await this.save();
  return this;
};

// Record response time
MessageSchema.methods.recordResponse = async function () {
  if (this.recipient && !this.responseSent) {
    this.responseSent = true;
    if (this.createdAt) {
      this.responseTime = Date.now() - this.createdAt.getTime();
    }
    await this.save();
  }
  return this;
};

// Add to poll vote
MessageSchema.methods.addPollVote = async function (optionId, userId) {
  if (this.type !== MESSAGE_TYPES.POLL) return this;
  if (this.poll.isClosed) return this;
  if (this.poll.expiresAt && this.poll.expiresAt < new Date()) {
    this.poll.isClosed = true;
    await this.save();
    return this;
  }

  const option = this.poll.options.find((o) => o.id === optionId);
  if (option && !option.voters.includes(userId)) {
    option.votes += 1;
    option.voters.push(userId);
    this.poll.totalVotes += 1;
    await this.save();
  }

  return this;
};

// Close poll
MessageSchema.methods.closePoll = async function () {
  if (this.type === MESSAGE_TYPES.POLL) {
    this.poll.isClosed = true;
    await this.save();
  }
  return this;
};

// Schedule message
MessageSchema.methods.schedule = async function (scheduleFor) {
  this.scheduledFor = scheduleFor;
  this.isScheduled = true;
  this.status = "sending";
  await this.save();
  return this;
};

// Set expiry
MessageSchema.methods.setExpiry = async function (expiresIn) {
  this.expiresAt = new Date(Date.now() + expiresIn);
  await this.save();
  return this;
};

module.exports = mongoose.model("Message", MessageSchema);
