
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { Play, Pause } from "lucide-react";
import Link from "next/link";
import {
  Search,
  Send,
  Image as ImageIcon,
  Phone,
  Video,
  MoreVertical,
  Forward,
   
  Volume2, // ← ADD THIS

  
 
  CheckSquare, // ← ADD THIS
  Square, // ← ADD THIS
  Info,
  Smile,
  Mic,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  X,
  Reply,
  Trash2,
  Copy,
  Pin,
  Star,
  Settings,
  Moon,
  Sun,
  UserPlus,
  Sidebar,
  SidebarClose,
  MessageSquare,
  BadgeCheck,
  VolumeX,
  Paperclip,
  FileText,
  Download,
  ThumbsUp,
  Heart,
  Edit as EditIcon,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// ============ HELPER COMPONENTS ============

const MessageStatusIndicator = ({ status, read }) => {
  if (status === "sending")
    return <Clock className="h-3 w-3 animate-pulse text-gray-400" />;
  if (status === "sent") return <Check className="h-3 w-3 text-gray-400" />;
  if (status === "delivered")
    return <CheckCheck className="h-3 w-3 text-blue-400" />;
  if (read) return <CheckCheck className="h-3 w-3 text-green-400" />;
  return null;
};

const TypingIndicator = ({ name, theme }) => (
  <div className="flex justify-start">
    <div
      className={`border rounded-2xl rounded-bl-none p-3 shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex space-x-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-2">{name} is typing...</span>
    </div>
  </div>
);

const AudioPlayer = ({ url, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <button
        onClick={togglePlay}
        className={`p-2 rounded-full ${isPlaying ? "bg-red-500" : "bg-green-500"} text-white`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <div className="flex-1">
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            Voice message
          </span>
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ theme, onNewChat }) => (
  <div className="h-full flex flex-col items-center justify-center p-8">
    <div
      className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-100 to-gray-200"
      }`}
    >
      <MessageSquare
        className={`h-16 w-16 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
      />
    </div>
    <h3
      className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
      Welcome to Messages
    </h3>
    <p
      className={`text-center max-w-md mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
    >
      Select a conversation to start messaging, or create a new chat to connect
      with other users.
    </p>
    <button
      onClick={onNewChat}
      className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        <span>New Chat</span>
      </div>
    </button>
  </div>
);

// ============ MAIN COMPONENT ============

export default function MessagesPage() {
  const router = useRouter();
  const { user, apiCall } = useAuth();
  const { socket, isConnected } = useSocket();

  // State
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);
  const [showMessageActions, setShowMessageActions] = useState(null);
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // ============ VOICE RECORDING STATES ============
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef(null);

  // ============ SEARCH IN CHAT STATES ============
  const [searchInChat, setSearchInChat] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  // ============ SELECTION MODE STATES ============
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessagesList, setSelectedMessagesList] = useState([]);

  // ============ FORWARD MESSAGE STATES ============
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardToUser, setForwardToUser] = useState("");
  const [forwardSearchResults, setForwardSearchResults] = useState([]);

  // ============ CONVERSATION ACTIONS ============
  const [pinnedConversations, setPinnedConversations] = useState([]);

  // ============ LOAD CONVERSATIONS ============
  const loadConversations = useCallback(async () => {
    try {
      const response = await apiCall("/messages/conversations");
      if (response.success) {
        setConversations(response.conversations || []);
        if (response.conversations?.length > 0 && !activeChat) {
          setActiveChat(response.conversations[0]);
          loadMessages(response.conversations[0]._id);
        }
      }
    } catch (error) {
      console.error("Load conversations error:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [apiCall, activeChat]);

  // ============ LOAD MESSAGES ============
  const loadMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      try {
        const response = await apiCall(`/messages/${conversationId}`);
        if (response.success) {
          setMessages((prev) => ({
            ...prev,
            [conversationId]: response.messages || [],
          }));
          scrollToBottom();
          markConversationRead(conversationId);
        }
      } catch (error) {
        console.error("Load messages error:", error);
      }
    },
    [apiCall],
  );

  // ============ MARK CONVERSATION AS READ ============
  const markConversationRead = useCallback(
    async (conversationId) => {
      try {
        await apiCall(`/messages/conversations/${conversationId}/read`, {
          method: "PUT",
        });
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
      } catch (error) {
        console.error("Mark read error:", error);
      }
    },
    [apiCall],
  );

  // ============ SEND MESSAGE ============
  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() && !replyTo && !editMessage) return;
    if (!activeChat) return;

    setSending(true);
    const tempId = Date.now();
    const messageText = messageInput.trim();

    // Handle edit message
    if (editMessage) {
      try {
        const response = await apiCall(`/messages/${editMessage.id}`, {
          method: "PUT",
          body: JSON.stringify({ text: messageText }),
        });
        if (response.success) {
          setMessages((prev) => ({
            ...prev,
            [activeChat._id]: prev[activeChat._id].map((msg) =>
              msg.id === editMessage.id
                ? { ...msg, text: messageText, edited: true }
                : msg,
            ),
          }));
          toast.success("Message edited");
        }
      } catch (error) {
        toast.error("Failed to edit message");
      } finally {
        setEditMessage(null);
        setMessageInput("");
        setSending(false);
      }
      return;
    }

    // Create temporary message
    const tempMessage = {
      id: tempId,
      sender: user?._id,
      senderName: user?.fullName,
      text: messageText,
      createdAt: new Date().toISOString(),
      read: false,
      status: "sending",
      replyTo: replyTo
        ? { id: replyTo.id, text: replyTo.text, sender: replyTo.senderName }
        : null,
    };

    // Add to UI immediately
    setMessages((prev) => ({
      ...prev,
      [activeChat._id]: [...(prev[activeChat._id] || []), tempMessage],
    }));
    setMessageInput("");
    setReplyTo(null);
    scrollToBottom();

    try {
      const response = await apiCall("/messages", {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeChat._id,
          text: messageText,
          replyToId: replyTo?.id,
        }),
      });

      if (response.success) {
        setMessages((prev) => ({
          ...prev,
          [activeChat._id]: prev[activeChat._id].map((msg) =>
            msg.id === tempId ? response.message : msg,
          ),
        }));

        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === activeChat._id
              ? {
                  ...conv,
                  lastMessageText: messageText,
                  lastMessageAt: new Date().toISOString(),
                }
              : conv,
          ),
        );
      }
    } catch (error) {
      console.error("Send message error:", error);
      setMessages((prev) => ({
        ...prev,
        [activeChat._id]: prev[activeChat._id].map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg,
        ),
      }));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }, [messageInput, activeChat, apiCall, user, replyTo, editMessage]);
  // ============ HANDLE FILE UPLOAD ============
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiCall("/messages/upload", {
        method: "POST",
        body: formData,
        headers: {},
      });
      if (response.success) {
        // Send message with file
        await apiCall("/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId: activeChat._id,
            text: "",
            type: file.type.startsWith("image/") ? "image" : "file",
            file: response.file,
          }),
        });
        loadMessages(activeChat._id);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  // ============ DELETE MESSAGE ============
  const deleteMessage = useCallback(
    async (messageId, forEveryone = false) => {
      try {
        const endpoint = forEveryone
          ? `/messages/${messageId}/for-everyone`
          : `/messages/${messageId}`;
        await apiCall(endpoint, { method: "DELETE" });

        setMessages((prev) => ({
          ...prev,
          [activeChat._id]: prev[activeChat._id].filter(
            (m) => m.id !== messageId && m._id !== messageId,
          ),
        }));
        toast.success("Message deleted");
      } catch (error) {
        toast.error("Failed to delete message");
      }
    },
    [apiCall, activeChat],
  );

  // ============ ADD REACTION ============
  const addReaction = useCallback(
    async (messageId, emoji) => {
      try {
        await apiCall(`/messages/${messageId}/react`, {
          method: "POST",
          body: JSON.stringify({ emoji }),
        });

        setMessages((prev) => ({
          ...prev,
          [activeChat._id]: prev[activeChat._id].map((msg) => {
            if (msg.id === messageId || msg._id === messageId) {
              const reactions = { ...(msg.reactions || {}) };
              reactions[emoji] = (reactions[emoji] || 0) + 1;
              return { ...msg, reactions };
            }
            return msg;
          }),
        }));
      } catch (error) {
        console.error("Add reaction error:", error);
      }
    },
    [apiCall, activeChat],
  );

  // ============ COPY MESSAGE ============
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // ============ HANDLE TYPING INDICATOR ============
  const handleTyping = useCallback(() => {
    if (!socket || !isConnected || !activeChat) return;

    socket.emit("typing:start", { conversationId: activeChat._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId: activeChat._id });
    }, 2000);
  }, [socket, isConnected, activeChat]);

  // ============ SCROLL TO BOTTOM ============
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ============ FORMAT TIME ============
  const formatMessageTime = (timeString) => {
    if (!showTimestamps) return "";
    const time = parseISO(timeString);
    return format(time, "h:mm a");
  };

  const formatDateHeader = (timeString) => {
    const date = parseISO(timeString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // ============ GROUP MESSAGES BY DATE ============
  const groupMessagesByDate = (msgs) => {
    const groups = [];
    let currentDate = null;
    msgs.forEach((msg) => {
      const msgDate = formatDateHeader(msg.createdAt || msg.time);
      if (msgDate !== currentDate) {
        groups.push({ type: "date", date: msgDate });
        currentDate = msgDate;
      }
      groups.push(msg);
    });
    return groups;
  };
  // ============ VOICE RECORDING ============
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice-message.webm");
        formData.append("duration", recordingTime.toString());

        setUploadingFile(true);
        try {
          const response = await apiCall("/messages/voice", {
            method: "POST",
            body: formData,
            headers: {},
          });
          if (response.success) {
            await apiCall("/messages", {
              method: "POST",
              body: JSON.stringify({
                conversationId: activeChat._id,
                text: "",
                type: "audio",
                file: response,
              }),
            });
            loadMessages(activeChat._id);
            toast.success("Voice message sent");
          }
        } catch (error) {
          console.error("Voice message error:", error);
          toast.error("Failed to send voice message");
        } finally {
          setUploadingFile(false);
          setRecordingTime(0);
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
          }
        }
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAudioChunks(chunks);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Microphone error:", error);
      toast.error("Microphone access denied. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  // ============ SEARCH IN CHAT ============
  const searchMessagesInChat = async () => {
    if (!searchInChat.trim() || !activeChat) return;

    try {
      const response = await apiCall(
        `/messages/${activeChat._id}/search?q=${encodeURIComponent(searchInChat)}`,
      );
      if (response.success) {
        setSearchResults(response.messages || []);
        setShowSearchResults(true);
        setCurrentSearchIndex(response.messages?.length > 0 ? 0 : -1);

        if (response.messages?.length === 0) {
          toast.info("No messages found");
        } else {
          toast.success(`Found ${response.messages.length} messages`);
          // Scroll to first result
          scrollToMessage(response.messages[0]._id);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search messages");
    }
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add(
        "bg-yellow-100",
        "transition-colors",
        "duration-1000",
      );
      setTimeout(() => {
        element.classList.remove("bg-yellow-100");
      }, 2000);
    }
  };

  const nextSearchResult = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(nextIndex);
    scrollToMessage(searchResults[nextIndex]._id);
  };

  const prevSearchResult = () => {
    if (searchResults.length === 0) return;
    const prevIndex = currentSearchIndex - 1;
    if (prevIndex < 0) return;
    setCurrentSearchIndex(prevIndex);
    scrollToMessage(searchResults[prevIndex]._id);
  };

  const clearSearch = () => {
    setSearchInChat("");
    setSearchResults([]);
    setShowSearchResults(false);
    setCurrentSearchIndex(-1);
  };
  // ============ SELECTION MODE ============
  const toggleSelectMessage = (messageId) => {
    setSelectedMessagesList((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };

  const bulkDeleteMessages = async () => {
    if (selectedMessagesList.length === 0) return;

    if (
      confirm(
        `Delete ${selectedMessagesList.length} message${selectedMessagesList.length > 1 ? "s" : ""}?`,
      )
    ) {
      let successCount = 0;
      for (const id of selectedMessagesList) {
        try {
          await apiCall(`/messages/${id}`, { method: "DELETE" });
          successCount++;
        } catch (error) {
          console.error("Delete error:", error);
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} message${successCount > 1 ? "s" : ""} deleted`,
        );
        loadMessages(activeChat._id);
      }
      setSelectedMessagesList([]);
      setSelectMode(false);
    }
  };

  const selectAllMessages = () => {
    const currentMessages = messages[activeChat._id] || [];
    const allIds = currentMessages.map((m) => m.id || m._id);
    setSelectedMessagesList(allIds);
  };

  const clearSelection = () => {
    setSelectedMessagesList([]);
    setSelectMode(false);
  };
  // ============ FORWARD MESSAGE ============
  const searchUsersToForward = async (query) => {
    if (!query || query.length < 2) {
      setForwardSearchResults([]);
      return;
    }

    try {
      const response = await apiCall(
        `/users/search?q=${encodeURIComponent(query)}`,
      );
      if (response.success) {
        setForwardSearchResults(response.users || []);
      }
    } catch (error) {
      console.error("Search users error:", error);
    }
  };

  const forwardToConversation = async (targetUserId) => {
    if (!forwardMessage) return;

    try {
      // Create or get conversation
      const convResponse = await apiCall("/messages/conversations", {
        method: "POST",
        body: JSON.stringify({ participantId: targetUserId }),
      });

      if (convResponse.success) {
        // Send forwarded message
        await apiCall("/messages", {
          method: "POST",
          body: JSON.stringify({
            conversationId: convResponse.conversation._id,
            text: `Forwarded: ${forwardMessage.text}`,
            type: "text",
          }),
        });
        toast.success("Message forwarded");
        setShowForwardModal(false);
        setForwardMessage(null);
      }
    } catch (error) {
      console.error("Forward error:", error);
      toast.error("Failed to forward message");
    }
  };
  // ============ CONVERSATION ACTIONS ============
  const togglePinConversation = async (conversationId) => {
    try {
      const isPinned = pinnedConversations.includes(conversationId);
      await apiCall(`/messages/conversations/${conversationId}/pin`, {
        method: "PUT",
      });

      setPinnedConversations((prev) =>
        isPinned
          ? prev.filter((id) => id !== conversationId)
          : [...prev, conversationId],
      );
      loadConversations();
      toast.success(isPinned ? "Unpinned" : "Pinned");
    } catch (error) {
      console.error("Pin error:", error);
      toast.error("Failed to pin conversation");
    }
  };

  const toggleMuteConversation = async (conversationId) => {
    try {
      const conversation = conversations.find((c) => c._id === conversationId);
      const isMuted = conversation?.muted;

      await apiCall(`/messages/conversations/${conversationId}/mute`, {
        method: "PUT",
      });
      loadConversations();
      toast.success(isMuted ? "Unmuted" : "Muted");
    } catch (error) {
      console.error("Mute error:", error);
      toast.error("Failed to mute conversation");
    }
  };

  // ============ WEB SOCKET LISTENERS ============
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (data.conversationId === activeChat?._id) {
        setMessages((prev) => ({
          ...prev,
          [activeChat._id]: [...(prev[activeChat._id] || []), data.message],
        }));
        scrollToBottom();
        markConversationRead(activeChat._id);
      }
      loadConversations();
    };

    const handleTypingStart = (data) => {
      if (
        data.conversationId === activeChat?._id &&
        data.userId !== user?._id
      ) {
        setTypingUser(data.name);
      }
    };

    const handleTypingStop = (data) => {
      if (data.conversationId === activeChat?._id) {
        setTypingUser(null);
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId === activeChat?._id) {
        setMessages((prev) => ({
          ...prev,
          [activeChat._id]: prev[activeChat._id].map((msg) =>
            data.messageIds.includes(msg.id || msg._id)
              ? { ...msg, read: true, status: "read" }
              : msg,
          ),
        }));
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message:read", handleMessageRead);
    };
  }, [socket, activeChat, user, loadConversations, markConversationRead]);

  // ============ INITIAL LOAD ============
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  // ============ RESPONSIVE ============
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============ FILTER CONVERSATIONS ============
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherParticipant?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conv.lastMessageText?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeMessages = activeChat ? messages[activeChat._id] || [] : [];
  const groupedMessages = groupMessagesByDate(activeMessages);

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
  const emojis = [
    "😀",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "😢",
    "😡",
    "😎",
    "🥳",
    "🥰",
    "🙏",
    "😭",
    "🤣",
    "💀",
  ];
  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="container mx-auto px-2 py-4 max-w-7xl">
        <div
          className={`rounded-2xl shadow-xl overflow-hidden h-[85vh] ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex h-full">
            {/* ============ SIDEBAR ============ */}
            {(!isMobileView || !activeChat) && (
              <div
                className={`${sidebarCollapsed ? "w-16" : "w-80"} border-r flex flex-col ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-bold">Messages</h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        {sidebarCollapsed ? (
                          <Sidebar className="h-5 w-5" />
                        ) : (
                          <SidebarClose className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5" />
                        ) : (
                          <Moon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Connection Status */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span className="text-gray-500">
                      {isConnected ? "Connected" : "Reconnecting..."}
                    </span>
                  </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No conversations found</p>
                      <button
                        onClick={() => router.push("/messages/new")}
                        className="mt-4 text-green-600 text-sm hover:text-green-700"
                      >
                        Start a new chat
                      </button>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv._id}
                        onClick={() => {
                          setActiveChat(conv);
                          loadMessages(conv._id);
                          if (isMobileView) setActiveChat(conv);
                        }}
                        className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${activeChat?._id === conv._id ? "bg-green-50 border-l-4 border-green-500" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {conv.otherParticipant?.fullName?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium truncate">
                                {conv.otherParticipant?.fullName}
                              </p>
                              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                {conv.lastMessageAt
                                  ? format(
                                      parseISO(conv.lastMessageAt),
                                      "h:mm a",
                                    )
                                  : ""}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessageText || "No messages"}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                              {conv.unreadCount}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinConversation(conv._id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pin
                                className={`h-3 w-3 ${conv.pinned ? "text-green-500 fill-green-500" : "text-gray-400"}`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMuteConversation(conv._id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {conv.muted ? (
                                <VolumeX className="h-3 w-3 text-gray-400" />
                              ) : (
                                <Volume2 className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ============ CHAT AREA ============ */}
            {activeChat ? (
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isMobileView && (
                      <button
                        onClick={() => setActiveChat(null)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    {!isMobileView && sidebarCollapsed && (
                      <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Sidebar className="h-5 w-5" />
                      </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {activeChat.otherParticipant?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {activeChat.otherParticipant?.fullName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {activeChat.resource?.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Search in Chat - Add this near the header buttons */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSearchResults(!showSearchResults)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Search className="h-5 w-5 text-gray-500" />
                      </button>

                      {showSearchResults && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-20 p-3">
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              value={searchInChat}
                              onChange={(e) => setSearchInChat(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && searchMessagesInChat()
                              }
                              placeholder="Search in conversation..."
                              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              onClick={searchMessagesInChat}
                              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm"
                            >
                              Search
                            </button>
                          </div>

                          {searchResults.length > 0 && (
                            <>
                              <div className="text-xs text-gray-500 mb-2">
                                {searchResults.length} results
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={prevSearchResult}
                                  disabled={currentSearchIndex <= 0}
                                  className="flex-1 py-1 text-sm border rounded-lg disabled:opacity-50"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={nextSearchResult}
                                  disabled={
                                    currentSearchIndex >=
                                    searchResults.length - 1
                                  }
                                  className="flex-1 py-1 text-sm border rounded-lg disabled:opacity-50"
                                >
                                  Next
                                </button>
                              </div>
                            </>
                          )}

                          <button
                            onClick={clearSearch}
                            className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600"
                          >
                            Clear search
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectMode(!selectMode)}
                      className={`p-2 rounded-lg ${selectMode ? "bg-green-100 text-green-600" : "hover:bg-gray-100"}`}
                    >
                      {selectMode ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Video className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                {selectMode && selectedMessagesList.length > 0 && (
                  <div className="bg-green-50 p-3 flex justify-between items-center">
                    <span className="text-sm text-green-700">
                      {selectedMessagesList.length} message
                      {selectedMessagesList.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllMessages}
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-100 rounded"
                      >
                        Select all
                      </button>
                      <button
                        onClick={bulkDeleteMessages}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {groupedMessages.map((item, idx) =>
                    item.type === "date" ? (
                      <div key={`date-${idx}`} className="flex justify-center">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                    ) : (
                      <div
                        id={`message-${item.id || item._id}`}
                        key={item.id || item._id || idx}
                        className={`flex ${item.sender === user?._id ? "justify-end" : "justify-start"} relative group`}
                      >
                        {/* Selection checkbox */}
                        {selectMode && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-8">
                            <input
                              type="checkbox"
                              checked={selectedMessagesList.includes(
                                item.id || item._id,
                              )}
                              onChange={() =>
                                toggleSelectMessage(item.id || item._id)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                            />
                          </div>
                        )}
                        {/* Three dots button - only visible on hover */}
                        {item.sender === user?._id && (
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={() =>
                                setShowMessageActions(
                                  showMessageActions === (item.id || item._id)
                                    ? null
                                    : item.id || item._id,
                                )
                              }
                              className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                            >
                              <MoreVertical className="h-3 w-3 text-gray-500" />
                            </button>
                          </div>
                        )}

                        {/* Dropdown menu */}
                        {showMessageActions === (item.id || item._id) && (
                          <div className="absolute right-0 top-6 z-20 bg-white rounded-lg shadow-lg border w-44">
                            <button
                              onClick={() => {
                                copyMessage(item.text);
                                setShowMessageActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Copy className="h-4 w-4" /> Copy
                            </button>
                            <button
                              onClick={() => {
                                setReplyTo({
                                  id: item.id || item._id,
                                  text: item.text,
                                  senderName: item.senderName,
                                });
                                setShowMessageActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Reply className="h-4 w-4" /> Reply
                            </button>
                            {item.sender === user?._id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditMessage({
                                      id: item.id || item._id,
                                      text: item.text,
                                    });
                                    setMessageInput(item.text);
                                    setShowMessageActions(null);
                                    textareaRef.current?.focus();
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <EditIcon className="h-4 w-4" /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    deleteMessage(item.id || item._id, false);
                                    setShowMessageActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete for me
                                </button>
                                <button
                                  onClick={() => {
                                    deleteMessage(item.id || item._id, true);
                                    setShowMessageActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete for
                                  everyone
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[70%] rounded-2xl p-3 ${item.sender === user?._id ? "bg-green-500 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"}`}
                        >
                          {/* Reply To */}
                          {item.replyTo && (
                            <div className="mb-2 p-2 rounded bg-white/20 text-sm">
                              <p className="text-xs opacity-80">
                                Replying to {item.replyTo.senderName}
                              </p>
                              <p className="truncate text-sm">
                                {item.replyTo.text}
                              </p>
                            </div>
                          )}

                          {/* Message Text */}
                          <p className="whitespace-pre-wrap break-words">
                            {item.text}
                          </p>

                          {/* Reactions */}
                          {item.reactions &&
                            Object.keys(item.reactions).length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {Object.entries(item.reactions).map(
                                  ([emoji, count]) => (
                                    <button
                                      key={emoji}
                                      onClick={() =>
                                        addReaction(item.id || item._id, emoji)
                                      }
                                      className="text-xs bg-white/20 rounded-full px-1.5 py-0.5"
                                    >
                                      {emoji} {count}
                                    </button>
                                  ),
                                )}
                              </div>
                            )}

                          {/* Footer */}
                          <div
                            className={`flex justify-end items-center gap-1 mt-1 text-xs ${item.sender === user?._id ? "text-green-100" : "text-gray-400"}`}
                          >
                            <span>
                              {formatMessageTime(item.createdAt || item.time)}
                            </span>
                            {item.sender === user?._id && (
                              <MessageStatusIndicator
                                status={item.status}
                                read={item.read}
                              />
                            )}
                            {item.edited && (
                              <span className="italic">edited</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  {typingUser && (
                    <TypingIndicator name={typingUser} theme={theme} />
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Preview */}
                {replyTo && (
                  <div className="mx-4 mb-2 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        Replying to {replyTo.senderName}
                      </p>
                      <p className="text-sm truncate">{replyTo.text}</p>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Edit Preview */}
                {editMessage && (
                  <div className="mx-4 mb-2 p-3 bg-yellow-50 rounded-lg flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-xs text-yellow-600">Editing message</p>
                      <p className="text-sm truncate">{editMessage.text}</p>
                    </div>
                    <button
                      onClick={() => setEditMessage(null)}
                      className="p-1 hover:bg-yellow-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Smile className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!activeChat}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : "hover:bg-gray-100"
                      }`}
                      title={
                        isRecording ? "Stop recording" : "Record voice message"
                      }
                    >
                      {isRecording ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                          <span className="text-xs">
                            {formatRecordingTime(recordingTime)}
                          </span>
                        </div>
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      onKeyUp={handleTyping}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={1}
                      style={{ minHeight: "40px", maxHeight: "100px" }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!messageInput.trim() || sending}
                      className={`p-2 rounded-lg ${messageInput.trim() && !sending ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
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
            ) : (
              <EmptyState
                theme={theme}
                onNewChat={() => router.push("/messages/new")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Chat Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition-transform mt-0.5 ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Show Timestamps</span>
                <button
                  onClick={() => setShowTimestamps(!showTimestamps)}
                  className={`w-12 h-6 rounded-full transition-colors ${showTimestamps ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition-transform mt-0.5 ${showTimestamps ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Read Receipts</span>
                <button
                  onClick={() => setShowReadReceipts(!showReadReceipts)}
                  className={`w-12 h-6 rounded-full transition-colors ${showReadReceipts ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition-transform mt-0.5 ${showReadReceipts ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={() => {}}
        className="hidden"
        accept="image/*,video/*,application/pdf,.doc,.docx,.mp3,.wav"
      />
      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Forward Message</h3>
              <button
                onClick={() => setShowForwardModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Search users
                </label>
                <input
                  type="text"
                  value={forwardToUser}
                  onChange={(e) => {
                    setForwardToUser(e.target.value);
                    searchUsersToForward(e.target.value);
                  }}
                  placeholder="Type user name..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {forwardSearchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {forwardSearchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => forwardToConversation(user._id)}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}