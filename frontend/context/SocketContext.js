"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, token, WS_URL]);

  const emit = useCallback(
    (event, data, callback) => {
      if (socket && isConnected) {
        socket.emit(event, data, callback);
      } else {
        console.warn(`Cannot emit ${event}: socket not connected`);
      }
    },
    [socket, isConnected],
  );

  const on = useCallback(
    (event, handler) => {
      if (socket) {
        socket.on(event, handler);
        return () => socket.off(event, handler);
      }
      return () => {};
    },
    [socket],
  );

  const off = useCallback(
    (event, handler) => {
      if (socket) {
        socket.off(event, handler);
      }
    },
    [socket],
  );

  const joinConversation = useCallback(
    (conversationId) => {
      emit("conversation:join", conversationId);
    },
    [emit],
  );

  const leaveConversation = useCallback(
    (conversationId) => {
      emit("conversation:leave", conversationId);
    },
    [emit],
  );

  const sendMessage = useCallback(
    (messageData) => {
      emit("message:send", messageData);
    },
    [emit],
  );

  const startTyping = useCallback(
    (conversationId) => {
      emit("typing:start", { conversationId });
    },
    [emit],
  );

  const stopTyping = useCallback(
    (conversationId) => {
      emit("typing:stop", { conversationId });
    },
    [emit],
  );

  const markAsRead = useCallback(
    (conversationId, messageIds) => {
      emit("message:read", { conversationId, messageIds });
    },
    [emit],
  );

  const addReaction = useCallback(
    (messageId, emoji) => {
      emit("message:react", { messageId, emoji });
    },
    [emit],
  );

  const removeReaction = useCallback(
    (messageId, emoji) => {
      emit("message:unreact", { messageId, emoji });
    },
    [emit],
  );

  const editMessage = useCallback(
    (messageId, text) => {
      emit("message:edit", { messageId, text });
    },
    [emit],
  );

  const deleteMessage = useCallback(
    (messageId, deleteForEveryone = false) => {
      emit("message:delete", { messageId, deleteForEveryone });
    },
    [emit],
  );

  const votePoll = useCallback(
    (messageId, optionId) => {
      emit("poll:vote", { messageId, optionId });
    },
    [emit],
  );

  const value = {
    socket,
    isConnected,
    connectionError,
    emit,
    on,
    off,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    addReaction,
    removeReaction,
    editMessage,
    deleteMessage,
    votePoll,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
