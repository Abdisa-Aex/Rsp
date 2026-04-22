"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Clock,
  Heart,
  Bookmark,
  Share2,
  Eye,
  CheckCircle,
  Flame,
  Crown,
  Gift,
  AlertCircle,
  ImageOff,
  ChevronRight,
  User,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Handshake,
  Award,
  Shield,
  Zap,
  Sparkles,
  // ADD THESE MISSING ICONS BELOW:
  Wrench,
  Flower,
  Utensils,
  Book,
  Laptop,
  Sofa,
  Dumbbell,
  Music,
  Palette,
  Briefcase,
  GraduationCap,
  Microscope,
  Shirt,
  Bike,
  Camera,
  Gamepad,
  Headphones,
} from "lucide-react";

import { motion } from "framer-motion";
import Button from "./Button";
import Badge from "./Badge";

const ResourceCard = ({
  resource,
  variant = "grid",
  onQuickView,
  onBookmark,
  onLike,
  isBookmarked,
  isLiked,
  onClick,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);

  const getCategoryIcon = (category) => {
    const icons = {
      Tools: Wrench,
      Gardening: Flower,
      Kitchen: Utensils,
      Books: Book,
      Electronics: Laptop,
      Furniture: Sofa,
      Sports: Dumbbell,
      Music: Music,
      Art: Palette,
      Business: Briefcase,
      Education: GraduationCap,
      Science: Microscope,
      Health: Heart,
      Clothing: Shirt,
      Vehicles: Bike,
      Photography: Camera,
      Gaming: Gamepad,
      Audio: Headphones,
    };
    const Icon = icons[resource.category] || Package;
    return <Icon className="h-5 w-5" />;
  };

  const formatPrice = () => {
    if (resource.priceType === "free") return "Free";
    if (resource.priceType === "deposit") return `$${resource.deposit} deposit`;
    if (resource.priceType === "barter") return "Barter / Trade";
    return `$${resource.price}/${resource.priceUnit}`;
  };

  const getStatusBadge = () => {
    if (resource.status === "available") {
      return (
        <Badge
          variant="success"
          size="small"
          icon={<CheckCircle className="h-3 w-3" />}
        >
          Available
        </Badge>
      );
    }
    if (resource.status === "borrowed") {
      return (
        <Badge
          variant="warning"
          size="small"
          icon={<Clock className="h-3 w-3" />}
        >
          Borrowed
        </Badge>
      );
    }
    if (resource.status === "pending") {
      return (
        <Badge
          variant="warning"
          size="small"
          icon={<AlertCircle className="h-3 w-3" />}
        >
          Pending
        </Badge>
      );
    }
    return null;
  };

  const getTrendingBadge = () => {
    if (resource.isTrending) {
      return (
        <Badge
          variant="warning"
          size="small"
          icon={<Flame className="h-3 w-3" />}
        >
          Trending
        </Badge>
      );
    }
    if (resource.isFeatured) {
      return (
        <Badge
          variant="primary"
          size="small"
          icon={<Crown className="h-3 w-3" />}
        >
          Featured
        </Badge>
      );
    }
    return null;
  };

  const handleClick = (e) => {
    if (e.target.closest("button")) return;
    if (onClick) onClick(resource);
  };

  if (variant === "list") {
    return (
      <div
        className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="relative md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {resource.images?.[0] && !imageError ? (
              <img
                src={resource.images[0].url}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
                {getCategoryIcon(resource.category)}
              </div>
            )}
            <div className="absolute top-2 left-2 flex gap-1">
              {resource.isVerified && (
                <Badge
                  variant="success"
                  size="small"
                  icon={<CheckCircle className="h-3 w-3" />}
                >
                  Verified
                </Badge>
              )}
              {getTrendingBadge()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.category}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">
                    •
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {resource.rating || "New"}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-3 w-3" />
                    <span>{resource.views} views</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                  {formatPrice()}
                </div>
                {getStatusBadge()}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {resource.owner?.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  by {resource.owner?.fullName?.split(" ")[0] || "User"}
                </span>
                {resource.owner?.trustScore > 80 && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    • High Trust
                  </span>
                )}
              </div>

              <div
                className={`flex gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 md:opacity-0"}`}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onBookmark?.(resource._id);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isBookmarked ? "Remove bookmark" : "Save for later"}
                >
                  {isBookmarked ? (
                    <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLike?.(resource._id);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isLiked ? "Unlike" : "Like"}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView?.(resource);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Quick view"
                >
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {resource.images?.[0] && !imageError ? (
          <img
            src={resource.images[0].url}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
            {getCategoryIcon(resource.category)}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {resource.isVerified && (
            <Badge
              variant="success"
              size="small"
              icon={<CheckCircle className="h-3 w-3" />}
            >
              Verified
            </Badge>
          )}
          {getTrendingBadge()}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmark?.(resource._id);
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
            title={isBookmarked ? "Remove bookmark" : "Save for later"}
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike?.(resource._id);
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(resource);
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
            title="Quick view"
          >
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {resource.category}
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {resource.rating || "New"}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {resource.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {resource.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{resource.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {formatPrice()}
            </span>
          </div>
        </div>
      </div>

      {/* Owner Info */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {resource.owner?.fullName?.charAt(0) || "U"}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            by {resource.owner?.fullName?.split(" ")[0] || "User"}
          </span>
          {resource.owner?.trustScore > 80 && (
            <span className="text-xs text-green-600 dark:text-green-400">
              • High Trust
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/resources/${resource._id}`}
        className="absolute inset-0"
        aria-label={`View ${resource.title}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ResourceCard;