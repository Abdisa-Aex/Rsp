"use client";

import { useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingBag,
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  X,
  Check,
} from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";
import ImageWithFallback from "components/ui/ImageWithFallback";
import { Package } from "lucide-react";

const WishlistGrid = ({ wishlist, onRemove, onMoveToRequest }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const toggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const selectAll = () => {
    setSelectedItems(wishlist.map((item) => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setIsBulkMode(false);
  };

  const removeSelected = () => {
    selectedItems.forEach((id) => {
      const item = wishlist.find((i) => i.id === id);
      if (item) onRemove(item);
    });
    clearSelection();
  };

  const moveSelectedToRequest = () => {
    selectedItems.forEach((id) => {
      const item = wishlist.find((i) => i.id === id);
      if (item) onMoveToRequest(item);
    });
    clearSelection();
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Save items you're interested in to see them here
        </p>
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/browse")}
        >
          Browse Resources
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Wishlist
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {!isBulkMode && wishlist.length > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsBulkMode(true)}
            >
              Select
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {isBulkMode && selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-green-700 dark:text-green-300">
              {selectedItems.length} selected
            </span>
            <button
              onClick={selectAll}
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-400"
            >
              Select all
            </button>
            <button
              onClick={clearSelection}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={moveSelectedToRequest}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Request
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={removeSelected}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all ${
                isBulkMode && selectedItems.includes(item.id)
                  ? "ring-2 ring-green-500"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {isBulkMode && (
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {item.price === 0
                          ? "Free"
                          : `$${item.price}/${item.priceUnit || "day"}`}
                      </div>
                      {item.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-500">
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Added {getTimeAgo(item.addedAt)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onMoveToRequest(item)}
                    >
                      Request Now
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() =>
                        (window.location.href = `/resources/${item.id}`)
                      }
                    >
                      View Details
                    </Button>
                    {!isBulkMode && (
                      <button
                        onClick={() => onRemove(item)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all ${
                isBulkMode && selectedItems.includes(item.id)
                  ? "ring-2 ring-green-500"
                  : ""
              }`}
            >
              {isBulkMode && (
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                </div>
              )}
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {item.isAvailable === false && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="danger">Unavailable</Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.category}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {item.price === 0
                      ? "Free"
                      : `$${item.price}/${item.priceUnit || "day"}`}
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">
                        {item.rating}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Added {getTimeAgo(item.addedAt)}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="primary"
                    size="small"
                    className="flex-1"
                    onClick={() => onMoveToRequest(item)}
                    disabled={item.isAvailable === false}
                  >
                    Request
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    className="flex-1"
                    onClick={() =>
                      (window.location.href = `/resources/${item.id}`)
                    }
                  >
                    Details
                  </Button>
                  {!isBulkMode && (
                    <button
                      onClick={() => onRemove(item)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistGrid;
