const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");
const { logger } = require("../utils/logger");
const { sendNotificationByType } = require("../config/firebase");

const connectedUsers = new Map(); // userId -> { socketId, socket, userData }

const setupSocket = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      if (user.isBanned) {
        return next(new Error("User is banned"));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (err) {
      logger.error(`Socket auth error: ${err.message}`);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    logger.info(`User connected: ${userId} - ${user.fullName}`);

    // Store user connection
    connectedUsers.set(userId, {
      socketId: socket.id,
      socket,
      userData: {
        id: userId,
        name: user.fullName,
        avatar: user.avatar,
        online: true,
      },
    });

    // Update user status
    await User.findByIdAndUpdate(userId, {
      online: true,
      lastSeen: new Date(),
    });

    // Broadcast online status
    io.emit("user:online", {
      userId,
      name: user.fullName,
      avatar: user.avatar,
      lastSeen: new Date(),
    });

    // Join user's conversations
    const conversations = await Conversation.find({
      participants: userId,
      deletedFor: { $ne: userId },
    }).select("_id");

    conversations.forEach((conv) => {
      socket.join(conv._id.toString());
    });

    // ========== EVENT HANDLERS ==========

    // Join conversation
    socket.on("conversation:join", async (conversationId) => {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
        deletedFor: { $ne: userId },
      });

      if (conversation) {
        socket.join(conversationId);
        logger.debug(`User ${userId} joined conversation ${conversationId}`);
      }
    });

    // Leave conversation
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
      logger.debug(`User ${userId} left conversation ${conversationId}`);
    });

    // Typing indicator
    socket.on("typing:start", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const otherParticipants = conversation.participants.filter(
          (p) => p.toString() !== userId,
        );

        otherParticipants.forEach((participantId) => {
          const participant = connectedUsers.get(participantId.toString());
          if (participant) {
            participant.socket.emit("typing:start", {
              conversationId,
              userId,
              name: user.fullName,
            });
          }
        });
      }
    });

    socket.on("typing:stop", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const otherParticipants = conversation.participants.filter(
          (p) => p.toString() !== userId,
        );

        otherParticipants.forEach((participantId) => {
          const participant = connectedUsers.get(participantId.toString());
          if (participant) {
            participant.socket.emit("typing:stop", {
              conversationId,
              userId,
            });
          }
        });
      }
    });

    // Send message
    socket.on("message:send", async (data, callback) => {
      try {
        const {
          conversationId,
          text,
          type,
          file,
          replyToId,
          location,
          contact,
          poll,
          scheduledFor,
        } = data;

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
          deletedFor: { $ne: userId },
        });

        if (!conversation) {
          throw new Error("Conversation not found or access denied");
        }

        // Check if user has blocked the conversation participants
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== userId,
        );
        if (otherParticipant && user.blockedUsers.includes(otherParticipant)) {
          throw new Error("You have blocked this user");
        }

        // Create message
        const message = new Message({
          conversation: conversationId,
          sender: userId,
          recipient: otherParticipant,
          text,
          type,
          file,
          replyTo: replyToId,
          location,
          contact,
          poll,
          scheduledFor,
          isScheduled: !!scheduledFor,
          status: scheduledFor ? "sending" : "sent",
        });

        await message.save();
        await message.populate("sender", "fullName avatar");
        await message.populate("replyTo");

        // If scheduled, don't send immediately
        if (scheduledFor && new Date(scheduledFor) > new Date()) {
          if (callback) callback({ success: true, message, scheduled: true });
          return;
        }

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageText =
          message.type === "text" ? message.text : `${message.type} message`;
        conversation.lastMessageAt = message.createdAt;
        conversation.lastMessageSender = userId;
        conversation.messageCount += 1;
        await conversation.save();

        // Emit to all participants
        io.to(conversationId).emit("message:new", message);

        // Increment unread count for other participants
        const otherParticipants = conversation.participants.filter(
          (p) => p.toString() !== userId,
        );

        for (const participantId of otherParticipants) {
          await conversation.incrementUnread(participantId);

          const participant = connectedUsers.get(participantId.toString());

          if (!participant) {
            // Create notification for offline user
            const notification = new Notification({
              user: participantId,
              type: "message",
              title: "New Message",
              message: `${user.fullName}: ${text ? text.substring(0, 100) : `${type} message`}`,
              data: {
                conversationId,
                messageId: message._id,
                senderId: userId,
                senderName: user.fullName,
              },
              priority: "high",
              actionUrl: `/messages/${conversationId}`,
            });
            await notification.save();

            // Send push notification
            await sendNotificationByType(participantId, "message", {
              senderName: user.fullName,
              messagePreview: text ? text.substring(0, 100) : `${type} message`,
              conversationId,
              messageId: message._id,
            });
          }
        }

        if (callback) callback({ success: true, message });
      } catch (error) {
        logger.error(`Message send error: ${error.message}`);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Mark messages as read
    socket.on("message:read", async ({ conversationId, messageIds }) => {
      try {
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            conversation: conversationId,
            sender: { $ne: userId },
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
            status: "read",
          },
        );

        // Reset unread count for conversation
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          await conversation.resetUnread(userId);
        }

        // Notify senders
        const messages = await Message.find({
          _id: { $in: messageIds },
          sender: { $ne: userId },
        }).select("sender");

        const senderIds = [
          ...new Set(messages.map((m) => m.sender.toString())),
        ];

        senderIds.forEach((senderId) => {
          const sender = connectedUsers.get(senderId);
          if (sender) {
            sender.socket.emit("message:read", {
              conversationId,
              messageIds,
              readBy: userId,
              readAt: new Date(),
            });
          }
        });
      } catch (error) {
        logger.error(`Message read error: ${error.message}`);
      }
    });

    // Delete message
    socket.on(
      "message:delete",
      async ({ messageId, deleteForEveryone = false }) => {
        try {
          const message = await Message.findById(messageId);

          if (!message) throw new Error("Message not found");

          const isSender = message.sender.toString() === userId;

          if (deleteForEveryone && isSender) {
            // Delete for everyone
            await message.deleteForEveryone();
            io.to(message.conversation.toString()).emit("message:deleted", {
              messageId,
              deletedFor: "everyone",
            });
          } else {
            // Delete for me
            await message.deleteForUser(userId);
            socket.emit("message:deleted", {
              messageId,
              deletedFor: "me",
            });
          }
        } catch (error) {
          logger.error(`Message delete error: ${error.message}`);
        }
      },
    );

    // Edit message
    socket.on("message:edit", async ({ messageId, text }) => {
      try {
        const message = await Message.findById(messageId);

        if (!message) throw new Error("Message not found");
        if (message.sender.toString() !== userId)
          throw new Error("Not authorized");

        await message.editMessage(text, userId);

        io.to(message.conversation.toString()).emit("message:edited", {
          messageId,
          text,
          editedAt: new Date(),
        });
      } catch (error) {
        logger.error(`Message edit error: ${error.message}`);
      }
    });

    // Add reaction
    socket.on("message:react", async ({ messageId, emoji }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        await message.addReaction(emoji, userId);

        io.to(message.conversation.toString()).emit("message:reaction", {
          messageId,
          emoji,
          userId,
          count: message.reactions.get(emoji)?.count || 0,
        });
      } catch (error) {
        logger.error(`Message reaction error: ${error.message}`);
      }
    });

    // Remove reaction
    socket.on("message:unreact", async ({ messageId, emoji }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        await message.removeReaction(emoji, userId);

        io.to(message.conversation.toString()).emit("message:unreact", {
          messageId,
          emoji,
          userId,
          count: message.reactions.get(emoji)?.count || 0,
        });
      } catch (error) {
        logger.error(`Message unreact error: ${error.message}`);
      }
    });

    // Vote in poll
    socket.on("poll:vote", async ({ messageId, optionId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.type !== "poll") throw new Error("Not a poll message");

        await message.addPollVote(optionId, userId);

        io.to(message.conversation.toString()).emit("poll:updated", {
          messageId,
          options: message.poll.options,
          totalVotes: message.poll.totalVotes,
        });
      } catch (error) {
        logger.error(`Poll vote error: ${error.message}`);
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      logger.info(`User disconnected: ${userId}`);
      connectedUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        online: false,
        lastSeen: new Date(),
      });

      io.emit("user:offline", {
        userId,
        lastSeen: new Date(),
      });
    });
  });
};

// Get connected users
const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

// Get user socket
const getUserSocket = (userId) => {
  const user = connectedUsers.get(userId);
  return user ? user.socket : null;
};

// Is user online
const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};

module.exports = {
  setupSocket,
  connectedUsers,
  getConnectedUsers,
  getUserSocket,
  isUserOnline,
};
