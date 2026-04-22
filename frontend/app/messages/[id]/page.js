"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";
import { useSocket } from "hooks/useSocket";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import AnnouncementBar from "components/layout/AnnouncementBar";
import {
  Loader2,
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Image,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Phone,
  Video,
  Info,
  Trash2,
  Edit,
  Reply,
  Copy,
  Flag,
  X,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Sad,
} from "lucide-react";
import Button from "components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { apiCall, user } = useAuth();
  const {
    socket,
    isConnected,
    sendMessage: socketSendMessage,
    on,
    off,
  } = useSocket();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationId = params.id;

  // Load conversation and messages
  useEffect(() => {
    if (conversationId) {
      loadConversation();
      loadMessages();
    }
  }, [conversationId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
        markAsRead(message._id);
      }
    };

    // Listen for typing indicators
    const handleTypingStart = (data) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setTypingUsers((prev) => [...new Set([...prev, data.userId])]);
      }
    };

    const handleTypingStop = (data) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    };

    // Listen for message edits
    const handleMessageEdited = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, text: data.text, edited: true }
            : msg,
        ),
      );
    };

    // Listen for message deletions
    const handleMessageDeleted = (data) => {
      if (data.deletedFor === "everyone") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? { ...msg, text: "This message was deleted", deleted: true }
              : msg,
          ),
        );
      }
    };

    // Listen for read receipts
    const handleMessageRead = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            data.messageIds.includes(msg._id)
              ? { ...msg, read: true, readAt: data.readAt }
              : msg,
          ),
        );
      }
    };

    on("message:new", handleNewMessage);
    on("typing:start", handleTypingStart);
    on("typing:stop", handleTypingStop);
    on("message:edited", handleMessageEdited);
    on("message:deleted", handleMessageDeleted);
    on("message:read", handleMessageRead);

    return () => {
      off("message:new", handleNewMessage);
      off("typing:start", handleTypingStart);
      off("typing:stop", handleTypingStop);
      off("message:edited", handleMessageEdited);
      off("message:deleted", handleMessageDeleted);
      off("message:read", handleMessageRead);
    };
  }, [socket, isConnected, conversationId, user?.id, on, off]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const response = await apiCall(
        `/messages/conversations/${conversationId}`,
      );
      if (response.success) {
        setConversation(response.conversation);
      }
    } catch (error) {
      console.error("Load conversation error:", error);
      toast.error("Failed to load conversation");
    }
  };

  const loadMessages = async () => {
    try {
      const response = await apiCall(`/messages/${conversationId}`);
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error("Load messages error:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !editingMessage) return;
    if (sending) return;

    setSending(true);
    try {
      if (editingMessage) {
        // Edit existing message
        const response = await apiCall(`/messages/${editingMessage._id}`, {
          method: "PUT",
          body: JSON.stringify({ text: newMessage }),
        });
        if (response.success) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === editingMessage._id
                ? { ...msg, text: newMessage, edited: true }
                : msg,
            ),
          );
          setEditingMessage(null);
          toast.success("Message edited");
        }
      } else {
        // Send new message
        const response = await apiCall("/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId,
            text: newMessage,
            type: "text",
            replyToId: replyTo?._id,
          }),
        });
        if (response.success) {
          setMessages((prev) => [...prev, response.message]);
          socketSendMessage({
            conversationId,
            text: newMessage,
            type: "text",
            replyToId: replyTo?._id,
          });
          setReplyTo(null);
        }
      }
      setNewMessage("");
      stopTyping();
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socketSendMessage({ conversationId, typing: true });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (typing) {
      setTyping(false);
      socketSendMessage({ conversationId, typing: false });
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await apiCall(`/messages/${messageId}/read`, { method: "POST" });
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const response = await apiCall(`/messages/${messageId}/react`, {
        method: "POST",
        body: JSON.stringify({ emoji }),
      });
      if (response.success) {
        loadMessages();
      }
    } catch (error) {
      console.error("Add reaction error:", error);
    }
  };

  const deleteMessage = async (messageId, forEveryone = false) => {
    if (!confirm("Delete this message?")) return;

    try {
      const endpoint = forEveryone
        ? `/messages/${messageId}/for-everyone`
        : `/messages/${messageId}`;
      const response = await apiCall(endpoint, { method: "DELETE" });
      if (response.success) {
        if (forEveryone) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === messageId
                ? { ...msg, text: "This message was deleted", deleted: true }
                : msg,
            ),
          );
        } else {
          setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        }
        toast.success("Message deleted");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiCall("/upload/message", {
        method: "POST",
        body: formData,
        headers: {},
      });
      if (response.success) {
        await apiCall("/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId,
            text: "",
            type: file.type.startsWith("image/") ? "image" : "file",
            file: response.file,
          }),
        });
      }
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);

    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return msgDate.toLocaleDateString();
  };

  const getMessageStatus = (message) => {
    if (message.sender?._id !== user?.id) return null;
    if (message.read) return <CheckCheck className="h-3 w-3 text-blue-500" />;
    if (message.delivered)
      return <CheckCheck className="h-3 w-3 text-gray-400" />;
    return <Check className="h-3 w-3 text-gray-400" />;
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
        <Footer />
      </>
    );
  }

  const messageGroups = groupMessagesByDate();
  const otherParticipant = conversation?.otherParticipant;

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {otherParticipant?.fullName?.charAt(0) || "U"}
                    </div>
                    {otherParticipant?.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {otherParticipant?.fullName || "User"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {typingUsers.length > 0
                        ? "Typing..."
                        : otherParticipant?.online
                          ? "Online"
                          : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="container mx-auto px-4 max-w-4xl">
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex mb-3 ${msg.sender?._id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender?._id !== user?.id && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                        {msg.sender?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] ${msg.sender?._id === user?.id ? "items-end" : "items-start"} flex flex-col`}
                    >
                      <div className="group relative">
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            msg.sender?._id === user?.id
                              ? "bg-green-500 text-white rounded-br-sm"
                              : "bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200"
                          } ${msg.deleted ? "italic opacity-70" : ""}`}
                        >
                          {msg.replyTo && (
                            <div className="text-xs opacity-70 mb-1 border-l-2 border-gray-400 pl-2">
                              Replying to: {msg.replyTo.text?.substring(0, 50)}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.text ||
                              (msg.type === "image"
                                ? "📷 Image"
                                : msg.type === "file"
                                  ? "📎 File"
                                  : "")}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(msg.createdAt)}
                            </span>
                            {getMessageStatus(msg)}
                          </div>
                        </div>

                        {/* Message Actions */}
                        <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {msg.sender?._id === user?.id && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMessage(msg);
                                  setNewMessage(msg.text);
                                  inputRef.current?.focus();
                                }}
                                className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                              >
                                <Edit className="h-3 w-3 text-gray-500" />
                              </button>
                              <button
                                onClick={() => deleteMessage(msg._id, false)}
                                className="p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setReplyTo(msg);
                              inputRef.current?.focus();
                            }}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <Reply className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Reactions */}
                      {msg.reactions &&
                        Object.keys(msg.reactions).length > 0 && (
                          <div className="flex gap-1 mt-1 ml-2">
                            {Object.entries(msg.reactions).map(
                              ([emoji, data]) => (
                                <span
                                  key={emoji}
                                  className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full"
                                >
                                  {emoji} {data.count}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Indicator */}
        {replyTo && (
          <div className="bg-gray-100 border-t border-gray-200 px-4 py-2">
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Replying to: </span>
                <span className="text-gray-700">
                  {replyTo.text?.substring(0, 50)}
                </span>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Edit Indicator */}
        {editingMessage && (
          <div className="bg-gray-100 border-t border-gray-200 px-4 py-2">
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Editing message</span>
              </div>
              <button
                onClick={() => setEditingMessage(null)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Image className="h-5 w-5 text-gray-500" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  onKeyUp={handleTyping}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <Smile className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
