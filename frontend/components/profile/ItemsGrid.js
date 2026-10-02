"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  MoreVertical,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Package } from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";

const ItemsGrid = ({
  searchQuery = "",
  setSearchQuery = () => {},
  itemsFilter = "all",
  setItemsFilter = () => {},
  setShowAddItemModal = () => {},
  filteredItems = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
}) => {
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");

  // Filter items based on search and status filter
  const getFilteredItems = () => {
    let items = [...filteredItems];

    // Apply status filter
    if (itemsFilter !== "all") {
      items = items.filter((item) => item.status === itemsFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query),
      );
    }

    return items;
  };

  // Sort items
  const getSortedItems = () => {
    const items = getFilteredItems();

    return [...items].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt || a.publishedAt || 0);
        const dateB = new Date(b.createdAt || b.publishedAt || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      if (sortBy === "name") {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        return sortOrder === "desc"
          ? titleB.localeCompare(titleA)
          : titleA.localeCompare(titleB);
      }
      if (sortBy === "requests") {
        const reqA = a.requests || 0;
        const reqB = b.requests || 0;
        return sortOrder === "desc" ? reqB - reqA : reqA - reqB;
      }
      return 0;
    });
  };

  const sortedItems = getSortedItems();
  const filters = ["all", "available", "borrowed", "pending"];

  // Get image URL helper
  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0 && item.images[0]?.url) {
      return item.images[0].url;
    }
    return null;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return { variant: "success", label: "Available" };
      case "borrowed":
        return { variant: "warning", label: "Borrowed" };
      case "pending":
        return { variant: "warning", label: "Pending" };
      default:
        return { variant: "default", label: status || "Unknown" };
    }
  };

  // Get price display
  const getPriceDisplay = (item) => {
    if (item.priceType === "free") return "Free";
    if (item.priceType === "deposit") return `$${item.deposit || 0} deposit`;
    if (item.priceType === "barter") return "Barter / Trade";
    return `$${item.price || 0}/${item.priceUnit || "day"}`;
  };

  if (sortedItems.length === 0 && searchQuery === "" && itemsFilter === "all") {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No items yet
        </h4>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Start sharing items with the community
        </p>
        <Button variant="primary" onClick={() => setShowAddItemModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Share an Item
        </Button>
      </div>
    );
  }

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No matching items
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Shared Items
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage items you're sharing with the community
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={itemsFilter}
            onChange={(e) => setItemsFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            {filters.map((filter) => (
              <option key={filter} value={filter}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg border ${viewMode === "grid" ? "bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-400" : "border-gray-300 dark:border-gray-600"} transition-colors`}
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
              className={`p-2 rounded-lg border ${viewMode === "list" ? "bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-400" : "border-gray-300 dark:border-gray-600"} transition-colors`}
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

        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="requests">Requests</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {sortOrder === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List View */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {sortedItems.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            const imageUrl = getImageUrl(item);

            return (
              <div
                key={item._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {getPriceDisplay(item)}
                        </p>
                        {item.requests > 0 && (
                          <p className="text-xs text-gray-500">
                            {item.requests} request
                            {item.requests !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="h-3 w-3" />
                        <span>{item.views || 0} views</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onView?.(item)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => onEdit?.(item)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => onDelete?.(item)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            const imageUrl = getImageUrl(item);

            return (
              <div
                key={item._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getPriceDisplay(item)}
                    </div>
                    {item.requests > 0 && (
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        {item.requests} requests
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                  <button
                    onClick={() => onView?.(item)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onEdit?.(item)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete?.(item)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="More"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ItemsGrid;
