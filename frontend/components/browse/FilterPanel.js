"use client";

import {
  TrendingUp,
  Clock,
  Star,
  Users,
  Download,
  Sparkles,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function FilterPanel({
  showFilters,
  filters,
  setFilters,
  toggleResourceType,
  toggleTheme,
  resetFilters,
}) {
  const getBorderColor = (typeId) => {
    switch (typeId) {
      case "physical":
        return "#3b82f6";
      case "digital":
        return "#8b5cf6";
      case "template":
        return "#f97316";
      case "tool":
        return "#10b981";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div className="lg:w-96">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl mb-6 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Filter & Sort</span>
          <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            {filters.resourceType.length + filters.theme.length} active
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Panel */}
      <div
        className={`${showFilters ? "block" : "hidden lg:block"} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 space-y-8`}
      >
        {/* Sort By Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Sort By</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "newest",
                label: "Newest",
                icon: Clock,
                desc: "Recently added",
              },
              {
                id: "popular",
                label: "Most Popular",
                icon: Star,
                desc: "Highly rated",
              },
              {
                id: "trending",
                label: "Trending",
                icon: TrendingUp,
                desc: "Hot right now",
              },
              {
                id: "recommended",
                label: "Recommended",
                icon: Users,
                desc: "For you",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, sortBy: option.id }))
                }
                className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
                  filters.sortBy === option.id
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
                    : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${filters.sortBy === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium text-base ${filters.sortBy === option.id ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Availability</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "all",
                label: "All Resources",
                icon: Globe,
                desc: "Show everything",
              },
              {
                id: "available",
                label: "Available Now",
                icon: CheckCircle,
                desc: "Immediate access",
              },
              {
                id: "borrowed",
                label: "Borrowed",
                icon: Clock,
                desc: "Currently not available",
              },
              {
                id: "limited",
                label: "Limited Stock",
                icon: XCircle,
                desc: "Limited quantity",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, availability: option.id }))
                }
                className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
                  filters.availability === option.id
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
                    : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${filters.availability === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div
                    className={`font-medium text-base ${filters.availability === option.id ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-base text-gray-600">
              <Filter className="h-5 w-5" />
              <span>
                {filters.resourceType.length + filters.theme.length} filters
                selected
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="text-base text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg rounded-xl hover:shadow-lg transition-all duration-300 shadow-md">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
