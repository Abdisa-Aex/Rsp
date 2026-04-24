"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  MessageCircle,
  Star,
  CreditCard,
  ChevronDown,
  Package,
  HeartHandshake,
  LayoutDashboard,
} from "lucide-react";

const UserActions = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    // Load mock notifications
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications([
      {
        id: 1,
        title: "New Message",
        message: "Sarah sent you a message",
        time: "5 min ago",
        read: false,
        type: "message",
      },
      {
        id: 2,
        title: "Request Approved",
        message: "Your request for Power Drill was approved",
        time: "1 hour ago",
        read: false,
        type: "request",
      },
      {
        id: 3,
        title: "Item Returned",
        message: "Mike returned your camera",
        time: "2 hours ago",
        read: true,
        type: "return",
      },
    ]);
    setUnreadCount(2);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push("/");
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: Package, label: "My Items", href: "/dashboard?tab=items" },
    {
      icon: HeartHandshake,
      label: "Exchanges",
      href: "/dashboard?tab=exchanges",
    },
    { icon: Star, label: "Favorites", href: "/favorites" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notif.read ? "bg-green-50 dark:bg-green-900/20" : ""}`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/notifications"
                  className="block text-center text-sm text-green-600 hover:text-green-700"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Menu */}
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.points !== undefined && (
                      <p className="text-xs text-green-600 mt-1">
                        {user.points} points
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserActions;
