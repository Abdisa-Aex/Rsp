"use client";

import {
  Search,
  FilterX,
  RefreshCw,
  Package,
  Heart,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";

const EmptyState = ({ searchQuery, onClearSearch, onResetFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        {searchQuery ? (
          <Search className="h-12 w-12 text-gray-400" />
        ) : (
          <Package className="h-12 w-12 text-gray-400" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {searchQuery ? "No resources found" : "No resources available"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
          : "There are no resources matching your criteria. Try adjusting your filters or check back later."}
      </p>

      <div className="flex gap-3 justify-center">
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Search
          </button>
        )}
        <button
          onClick={onResetFilters}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <FilterX className="h-4 w-4" />
          Reset Filters
        </button>
        {!searchQuery && (
          <Link
            href="/share"
            className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Share an Item
          </Link>
        )}
      </div>

      {/* Suggestions */}
      {searchQuery && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "power tools",
              "gardening equipment",
              "textbooks",
              "kitchen appliances",
              "camping gear",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onClearSearch()}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
