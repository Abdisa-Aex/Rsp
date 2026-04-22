"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Star,
  MapPin,
  Clock,
  User,
  Calendar,
  Eye,
  Heart,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Handshake,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const QuickViewModal = ({ isOpen, onClose, resource, onRequest }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!resource) return null;

  const images = resource.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
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
        <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
          Available
        </Badge>
      );
    }
    if (resource.status === "borrowed") {
      return (
        <Badge variant="warning" icon={<Clock className="h-3 w-3" />}>
          Borrowed
        </Badge>
      );
    }
    return (
      <Badge variant="default" icon={<AlertCircle className="h-3 w-3" />}>
        Pending
      </Badge>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick View"
      size="lg"
      showClose={false}
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Image Gallery */}
        <div className="relative h-64 md:h-80 bg-gray-100 dark:bg-gray-700">
          {images.length > 0 ? (
            <img
              src={images[currentImage]?.url || images[0]?.url}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImage ? "w-4 bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">
                  {resource.category}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">
                    {resource.rating || "New"}
                  </span>
                </div>
                {getStatusBadge()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {resource.title}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPrice()}
              </div>
              {resource.priceType === "rental" && resource.deposit > 0 && (
                <p className="text-xs text-gray-500">
                  +${resource.deposit} deposit
                </p>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
            {resource.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{resource.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span className="text-sm">
                by {resource.owner?.fullName || "User"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Posted {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{resource.views} views</span>
            </div>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {resource.status === "available" && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onRequest?.(resource);
                  onClose();
                }}
                icon={<Handshake className="h-4 w-4" />}
              >
                Request Item
              </Button>
            )}
            <Link
              href={`/resources/${resource._id}`}
              className="flex-1"
              onClick={onClose}
            >
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </Link>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={isBookmarked ? "Remove bookmark" : "Save for later"}
            >
              {isBookmarked ? (
                <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
