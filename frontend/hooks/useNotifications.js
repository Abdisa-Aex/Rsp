"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useNotifications = () => {
  const [notifications, setNotifications] = useLocalStorage(
    "notifications",
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = useCallback(
    (notification) => {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
      return newNotification.id;
    },
    [setNotifications],
  );

  const markAsRead = useCallback(
    (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [setNotifications],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const removeNotification = useCallback(
    (id) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications],
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((n) => !n.read);
  }, [notifications]);

  const getAllNotifications = useCallback(() => {
    return notifications;
  }, [notifications]);

  const getNotificationsByType = useCallback(
    (type) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications],
  );

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const sendBrowserNotification = useCallback(
    async (title, options = {}) => {
      const hasPermission = await requestNotificationPermission();

      if (hasPermission && "Notification" in window) {
        const notification = new Notification(title, {
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
          ...options,
        });

        notification.onclick = () => {
          if (options.onClick) {
            options.onClick();
          }
          window.focus();
        };

        return notification;
      }

      return null;
    },
    [requestNotificationPermission],
  );

  const notify = useCallback(
    async ({
      title,
      message,
      type = "info",
      data = {},
      sendBrowser = false,
    }) => {
      const id = addNotification({
        title,
        message,
        type,
        data,
        timestamp: new Date().toISOString(),
      });

      if (sendBrowser && typeof window !== "undefined") {
        await sendBrowserNotification(title, {
          body: message,
          data: { id, ...data },
        });
      }

      return id;
    },
    [addNotification, sendBrowserNotification],
  );

  const notifySuccess = useCallback(
    (title, message, options = {}) => {
      return notify({
        title,
        message,
        type: "success",
        sendBrowser: options.sendBrowser || false,
        data: options.data,
      });
    },
    [notify],
  );

  const notifyError = useCallback(
    (title, message, options = {}) => {
      return notify({
        title,
        message,
        type: "error",
        sendBrowser: options.sendBrowser || false,
        data: options.data,
      });
    },
    [notify],
  );

  const notifyInfo = useCallback(
    (title, message, options = {}) => {
      return notify({
        title,
        message,
        type: "info",
        sendBrowser: options.sendBrowser || false,
        data: options.data,
      });
    },
    [notify],
  );

  const notifyWarning = useCallback(
    (title, message, options = {}) => {
      return notify({
        title,
        message,
        type: "warning",
        sendBrowser: options.sendBrowser || false,
        data: options.data,
      });
    },
    [notify],
  );

  return {
    notifications,
    unreadCount,
    showNotifications,
    setShowNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadNotifications,
    getAllNotifications,
    getNotificationsByType,
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    sendBrowserNotification,
    requestNotificationPermission,
  };
};
