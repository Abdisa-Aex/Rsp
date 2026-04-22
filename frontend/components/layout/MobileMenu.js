"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "context/AuthContext";
import { motion } from "framer-motion";
import {
  Home,
  Compass,
  Share2,
  LayoutDashboard,
  MessageCircle,
  User,
  Info,
  HelpCircle,
  Crown,
  Mail,
  Pepper as PepperIcon,
  ChevronRight,
  LogOut,
  FileText,
  Shield,
  
} from "lucide-react";

const MobileMenu = ({ onClose }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const mainNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Compass },
    { href: "/share", label: "Share", icon: Share2 },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/about", label: "About", icon: Info },
  ];

  const secondaryNavItems = [
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/contact", label: "Contact Us", icon: Mail },
    { href: "/terms", label: "Terms of Service", icon: FileText },
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="py-4 px-4">
      {/* User Info */}
      {isAuthenticated && user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {user.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {user.fullName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              {user.points && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {user.points} points
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="space-y-1 mb-6">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </div>

      {/* Admin Section */}
      {isAuthenticated && user?.role === "admin" && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Admin
          </p>
          <Link
            href="/admin/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-purple-600 dark:text-purple-400"
          >
            <Crown className="h-5 w-5" />
            <span className="font-medium">Admin Dashboard</span>
          </Link>
        </div>
      )}

      {/* Secondary Navigation */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
          Support
        </p>
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Auth Actions */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </button>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="block w-full text-center py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
