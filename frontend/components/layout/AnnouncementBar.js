"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Zap,
  Sparkles,
  Gift,
  Award,
  Crown,
  Gem,
  Flame,
  TrendingUp,
  Star,
  Heart,
  Rocket,
  Bell,
  ChevronRight,
} from "lucide-react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    {
      id: 1,
      title: "🎉 Welcome to ResourceHub!",
      message: "Join our community and start sharing today",
      action: { text: "Get Started", href: "/register" },
      icon: Sparkles,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 2,
      title: "🔥 Trending Now",
      message: "Check out the most popular items this week",
      action: { text: "View Trending", href: "/browse?sort=trending" },
      icon: Flame,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      title: "🎁 Special Offer",
      message: "Earn 2x points for sharing this week!",
      action: { text: "Learn More", href: "/share" },
      icon: Gift,
      color: "from-pink-500 to-rose-500",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${current.color} text-white`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="hidden sm:flex items-center gap-2">
              <Icon className="h-5 w-5 animate-pulse" />
              <span className="font-semibold text-sm whitespace-nowrap">
                {current.title}
              </span>
            </div>
            <p className="text-sm truncate flex-1">{current.message}</p>
            <Link
              href={current.action.href}
              className="flex items-center gap-1 text-sm font-medium hover:underline whitespace-nowrap"
            >
              {current.action.text}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white/50 animate-progress"
          style={{ width: "100%", animationDuration: "5s" }}
        />
      </div>
    </div>
  );
};

export default AnnouncementBar;
