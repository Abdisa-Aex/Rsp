"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "context/AuthContext";
import {
  Home,
  Compass,
  Share2,
  LayoutDashboard,
  MessageCircle,
  User,
  Info,
  Crown,
} from "lucide-react";

const AdminLink = () => {
  const pathname = usePathname();
  const { isAdmin, user } = useAuth();

  // Debug logging - remove after testing
  console.log("AdminLink - isAdmin:", isAdmin());
  console.log("AdminLink - user role:", user?.role);

  if (!isAdmin()) return null;

  return (
    <Link
      href="/admin/dashboard"
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        pathname?.startsWith("/admin")
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      }`}
    >
      <span className="flex items-center gap-2">
        <Crown className="h-4 w-4" />
        Admin
      </span>
    </Link>
  );
};

const NavLinks = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth(); // isAuthenticated is a boolean, not a function

  const publicNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Compass },
    { href: "/about", label: "About", icon: Info },
  ];

  const protectedNavItems = [

    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
     { href: "/share", label: "Share", icon: Share2 },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {/* Always visible nav items (public) */}
      {publicNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "text-green-600 dark:text-green-400"
                : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            )}
          </Link>
        );
      })}

      {/* Protected nav items - only show when authenticated */}
      {isAuthenticated && ( // ✅ Use isAuthenticated directly as a boolean, not as a function
        <>
          {protectedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                )}
              </Link>
            );
          })}

          <AdminLink />
        </>
      )}
    </nav>
  );
};

export default NavLinks;
