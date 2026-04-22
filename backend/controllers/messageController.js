const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendNotificationByType } = require("../config/firebase");
const { logger } = require("../utils/logger");
const { uploadToCloudinary } = require("../services/cloudinary");
const mongoose = require("mongoose");
// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      deletedFor: { $ne: req.user.id },
    })
      .populate("participants", "fullName username avatar online lastSeen")
      .populate("lastMessage")
      .populate("resource", "title images")
      .sort("-updatedAt");

    // Format conversations with unread counts
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== req.user.id,
      );
      const settings = conv.getUserSettings(req.user.id);

      return {
        _id: conv._id,
        type: conv.type,
        participants: conv.participants,
        otherParticipant: otherParticipant || null,
        resource: conv.resource,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: settings.unreadCount,
        muted: settings.muted,
        archived: settings.archived,
        pinned: settings.pinned,
        groupName: conv.groupName,
        groupAvatar: conv.groupAvatar,
        groupDescription: conv.groupDescription,
      };
    });

    res.json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    logger.error(`Get conversations error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// @desc    Upload voice message
// @route   POST /api/messages/voice
// @access  Private
exports.uploadVoiceMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file" });
    }
    
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "voice-messages",
      resource_type: "video", // audio uses video type in Cloudinary
    });
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      duration: req.body.duration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get conversation by ID
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
      deletedFor: { $ne: req.user.id },
    })
      .populate("participants", "fullName username avatar online lastSeen")
      .populate("lastMessage")
      .populate("resource", "title images")
      .populate("groupAdmins", "fullName username avatar");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const settings = conversation.getUserSettings(req.user.id);
    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== req.user.id,
    );

    res.json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        otherParticipant,
        unreadCount: settings.unreadCount,
        muted: settings.muted,
        archived: settings.archived,
        pinned: settings.pinned,
      },
    });
  } catch (error) {
    logger.error(`Get conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

// @desc    Create new conversation
// @route   POST /api/messages/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const {
      participantId,
      resourceId,
      message,
      type = "direct",
      groupName,
    } = req.body;

    if (type === "direct") {
      // Validate participantId
      if (!participantId) {
        return res.status(400).json({
          success: false,
          message: "Participant ID is required",
        });
      }

      // Check if participant exists
      const participant = await User.findById(participantId).select("_id");
      if (!participant) {
        return res.status(404).json({
          success: false,
          message: "Participant not found",
        });
      }

      // Check if conversation already exists
      let conversation = await Conversation.findOne({
        type: "direct",
        participants: { $all: [req.user.id, participantId], $size: 2 },
      });

      if (conversation) {
        // If conversation exists but was deleted for this user, restore it
        if (conversation.deletedFor && conversation.deletedFor.includes(req.user.id)) {
          conversation.deletedFor = conversation.deletedFor.filter(
            (id) => id.toString() !== req.user.id,
          );
          await conversation.save();
        }

        // Populate participants
        await conversation.populate("participants", "fullName username avatar online lastSeen");

        return res.json({
          success: true,
          conversation,
          message: "Conversation already exists",
        });
      }

      // Create new conversation
      conversation = new Conversation({
        type: "direct",
        participants: [req.user.id, participantId],
        resource: resourceId || null,
        settings: [
          { user: req.user.id, muted: false, archived: false, pinned: false, unreadCount: 0 },
          { user: participantId, muted: false, archived: false, pinned: false, unreadCount: 0 },
        ],
        deletedFor: [],
      });

      await conversation.save();
      await conversation.populate("participants", "fullName username avatar online lastSeen");

      // Send initial message if provided
      if (message && message.trim()) {
        const newMessage = new Message({
          conversation: conversation._id,
          sender: req.user.id,
          recipient: participantId,
          text: message.trim(),
          type: "text",
          status: "sent",
        });
        await newMessage.save();

        conversation.lastMessage = newMessage._id;
        conversation.lastMessageText = message.trim().substring(0, 100);
        conversation.lastMessageAt = newMessage.createdAt;
        conversation.lastMessageSender = req.user.id;
        conversation.messageCount = 1;
        await conversation.save();
      }

      res.status(201).json({
        success: true,
        conversation,
        message: "Conversation created successfully",
      });
    } else if (type === "group") {
      // Create group conversation
      if (!groupName) {
        return res.status(400).json({
          success: false,
          message: "Group name is required",
        });
      }

      const participants = [req.user.id, ...(req.body.participants || [])];

      const conversation = new Conversation({
        type: "group",
        participants,
        groupName,
        groupDescription: req.body.groupDescription || "",
        groupAdmins: [req.user.id],
        settings: participants.map((p) => ({
          user: p,
          muted: false,
          archived: false,
          pinned: false,
          unreadCount: 0,
        })),
        deletedFor: [],
      });

      await conversation.save();
      await conversation.populate("participants", "fullName username avatar");

      res.status(201).json({
        success: true,
        conversation,
        message: "Group created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid conversation type",
      });
    }
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
      error: error.message,
    });
  }
};
// @desc    Delete conversation (soft delete for user)
// @route   DELETE /api/messages/conversations/:conversationId
// @access  Private
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.deleteForUser(req.user.id);

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/messages/conversations/:conversationId/read
// @access  Private
exports.markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Get last message to mark as read reference
    const lastMessage = await Message.findOne({
      conversation: conversationId,
    }).sort({ createdAt: -1 });

    await conversation.resetUnread(req.user.id, lastMessage?._id);

    res.json({
      success: true,
      message: "Conversation marked as read",
    });
  } catch (error) {
    logger.error(`Mark conversation read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mark conversation as read",
    });
  }
};

// @desc    Mute conversation
// @route   PUT /api/messages/conversations/:conversationId/mute
// @access  Private
exports.muteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { duration } = req.body; // duration in minutes, null = forever

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, {
      muted: true,
      mutedUntil: duration ? new Date(Date.now() + duration * 60 * 1000) : null,
    });

    res.json({
      success: true,
      message: "Conversation muted successfully",
    });
  } catch (error) {
    logger.error(`Mute conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mute conversation",
    });
  }
};

// @desc    Unmute conversation
// @route   PUT /api/messages/conversations/:conversationId/unmute
// @access  Private
exports.unmuteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, {
      muted: false,
      mutedUntil: null,
    });

    res.json({
      success: true,
      message: "Conversation unmuted successfully",
    });
  } catch (error) {
    logger.error(`Unmute conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unmute conversation",
    });
  }
};

// @desc    Pin conversation
// @route   PUT /api/messages/conversations/:conversationId/pin
// @access  Private
exports.pinConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, { pinned: true });

    res.json({
      success: true,
      message: "Conversation pinned successfully",
    });
  } catch (error) {
    logger.error(`Pin conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to pin conversation",
    });
  }
};

// @desc    Unpin conversation
// @route   PUT /api/messages/conversations/:conversationId/unpin
// @access  Private
exports.unpinConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, { pinned: false });

    res.json({
      success: true,
      message: "Conversation unpinned successfully",
    });
  } catch (error) {
    logger.error(`Unpin conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unpin conversation",
    });
  }
};

// @desc    Archive conversation
// @route   PUT /api/messages/conversations/:conversationId/archive
// @access  Private
exports.archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, { archived: true });

    res.json({
      success: true,
      message: "Conversation archived successfully",
    });
  } catch (error) {
    logger.error(`Archive conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to archive conversation",
    });
  }
};

// @desc    Unarchive conversation
// @route   PUT /api/messages/conversations/:conversationId/unarchive
// @access  Private
exports.unarchiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await conversation.updateUserSettings(req.user.id, { archived: false });

    res.json({
      success: true,
      message: "Conversation unarchived successfully",
    });
  } catch (error) {
    logger.error(`Unarchive conversation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unarchive conversation",
    });
  }
};

// @desc    Get messages for conversation
// @route   GET /api/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { before, limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
      deletedFor: { $ne: req.user.id },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const query = {
      conversation: conversationId,
      deletedFor: { $ne: req.user.id },
      deletedForEveryone: false,
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "fullName username avatar")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Mark messages as read
    const unreadMessages = messages.filter(
      (m) => m.sender._id.toString() !== req.user.id && !m.read,
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map((m) => m._id) } },
        { read: true, readAt: new Date(), status: "read" },
      );

      // Reset unread count
      await conversation.resetUnread(req.user.id);
    }

    res.json({
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === parseInt(limit),
    });
  } catch (error) {
    logger.error(`Get messages error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
// @desc    Upload file for message
// @route   POST /api/messages/upload
// @access  Private
exports.uploadMessageFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "messages",
      transformation: req.file.mimetype.startsWith("image/")
        ? [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }]
        : undefined,
    });

    res.json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      text,
      type = "text",
      replyToId,
      location,
      contact,
      poll,
      scheduledFor,
    } = req.body;

    console.log("Send message request:", { conversationId, text: text?.substring(0, 50), type });

    // Validate
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    let conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Get other participant
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user.id,
    );

    if (!otherParticipant) {
      return res.status(404).json({
        success: false,
        message: "Other participant not found",
      });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      recipient: otherParticipant,
      text: text || "",
      type: type,
      replyTo: replyToId,
      location,
      contact,
      poll,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isScheduled: !!scheduledFor,
      status: scheduledFor ? "sending" : "sent",
    });

    await message.save();
    await message.populate("sender", "fullName username avatar");

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageText = type === "text" ? (text || "").substring(0, 100) : `${type} message`;
    conversation.lastMessageAt = message.createdAt;
    conversation.lastMessageSender = req.user.id;
    conversation.messageCount += 1;
    await conversation.save();

    // Update unread count for recipient - manual update to avoid method issues
    const recipientSettings = conversation.settings.find(
      (s) => s.user.toString() === otherParticipant.toString()
    );
    if (recipientSettings) {
      recipientSettings.unreadCount = (recipientSettings.unreadCount || 0) + 1;
      await conversation.save();
    }

    // Send notification (don't let it fail the request)
    try {
      await Notification.create({
        user: otherParticipant,
        type: "message",
        title: "New Message",
        message: `${req.user.fullName}: ${text ? text.substring(0, 100) : `${type} message`}`,
        data: {
          conversationId,
          messageId: message._id,
          senderId: req.user.id,
          senderName: req.user.fullName,
        },
        priority: "high",
        actionUrl: `/messages/${conversationId}`,
      });
    } catch (notifError) {
      console.error("Notification error:", notifError);
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    logger.error(`Send message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// @desc    Edit message
// @route   PUT /api/messages/:messageId
// @access  Private
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this message",
      });
    }

    if (message.deletedForEveryone) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit deleted message",
      });
    }

    await message.editMessage(text, req.user.id);

    res.json({
      success: true,
      message,
      message: "Message edited successfully",
    });
  } catch (error) {
    logger.error(`Edit message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to edit message",
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone = false } = req.query;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const isSender = message.sender.toString() === req.user.id;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    if (!isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      });
    }

    if (deleteForEveryone && (isSender || isAdmin)) {
      await message.deleteForEveryone();
      res.json({
        success: true,
        message: "Message deleted for everyone",
      });
    } else {
      await message.deleteForUser(req.user.id);
      res.json({
        success: true,
        message: "Message deleted for you",
      });
    }
  } catch (error) {
    logger.error(`Delete message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// @desc    Delete message for everyone
// @route   DELETE /api/messages/:messageId/for-everyone
// @access  Private (sender only)
exports.deleteForEveryone = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message for everyone",
      });
    }

    await message.deleteForEveryone();

    res.json({
      success: true,
      message: "Message deleted for everyone",
    });
  } catch (error) {
    logger.error(`Delete for everyone error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete message for everyone",
    });
  }
};

// @desc    Mark message as read
// @route   POST /api/messages/:messageId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.recipient?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this message as read",
      });
    }

    await message.markAsRead(req.user.id);

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
};

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/react
// @access  Private
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.deletedForEveryone) {
      return res.status(400).json({
        success: false,
        message: "Cannot react to deleted message",
      });
    }

    await message.addReaction(emoji, req.user.id);

    res.json({
      success: true,
      message: "Reaction added successfully",
    });
  } catch (error) {
    logger.error(`Add reaction error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to add reaction",
    });
  }
};

// @desc    Remove reaction from message
// @route   DELETE /api/messages/:messageId/react
// @access  Private
exports.removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.query;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.removeReaction(emoji, req.user.id);

    res.json({
      success: true,
      message: "Reaction removed successfully",
    });
  } catch (error) {
    logger.error(`Remove reaction error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to remove reaction",
    });
  }
};

// @desc    Search messages in conversation
// @route   GET /api/messages/:conversationId/search
// @access  Private
exports.searchMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { q, limit = 50 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
      text: { $regex: q, $options: "i" },
      deletedFor: { $ne: req.user.id },
      deletedForEveryone: false,
    })
      .populate("sender", "fullName username avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages,
      total: messages.length,
    });
  } catch (error) {
    logger.error(`Search messages error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to search messages",
    });
  }
};

// @desc    Send typing indicator
// @route   POST /api/messages/:conversationId/typing
// @access  Private
exports.typingIndicator = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Socket.IO handles typing events, this is just an API endpoint for HTTP fallback
    // The actual typing indicator is sent via Socket.IO

    res.json({
      success: true,
    });
  } catch (error) {
    logger.error(`Typing indicator error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send typing indicator",
    });
  }
};
