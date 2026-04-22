
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Map,
  X,
  ChevronDown,
  Bookmark,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import ResourceCard from "../../components/ui/ResourceCard";
import FilterPanel from "../../components/browse/FilterPanel";
import SortOptions from "../../components/browse/SortOptions";
import ViewToggle from "../../components/browse/ViewToggle";
import MapView from "../../components/browse/MapView";
import EmptyState from "../../components/browse/EmptyState";
import LoadingSkeleton from "../../components/browse/LoadingSkeleton";
import SaveSearchModal from "../../components/browse/SaveSearchModal";
import QuickViewModal from "../../components/browse/QuickViewModal";
import { useInView } from "react-intersection-observer";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, apiCall } = useAuth();

  // State
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [filters, setFilters] = useState({
    resourceType: [],
    theme: [],
    sortBy: "newest",
    availability: "all",
    categories: [],
    minPrice: null,
    maxPrice: null,
    condition: null,
    minRating: null,
    location: "",
    distance: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasMore: false,
  });
  const [bookmarked, setBookmarked] = useState([]);
  const [liked, setLiked] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [savedSearches, setSavedSearches] = useState([]);

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });

  const categories = [
    "Tools",
    "Gardening",
    "Kitchen",
    "Books",
    "Electronics",
    "Furniture",
    "Sports",
    "Music",
    "Art",
    "Business",
    "Education",
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load saved searches
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) setSavedSearches(JSON.parse(saved));
  }, []);

  // Toggle functions
  const toggleResourceType = (typeId) => {
    setFilters((prev) => ({
      ...prev,
      resourceType: prev.resourceType.includes(typeId)
        ? prev.resourceType.filter((id) => id !== typeId)
        : [...prev.resourceType, typeId],
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleTheme = (themeId) => {
    setFilters((prev) => ({
      ...prev,
      theme: prev.theme.includes(themeId)
        ? prev.theme.filter((id) => id !== themeId)
        : [...prev.theme, themeId],
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      resourceType: [],
      theme: [],
      sortBy: "newest",
      availability: "all",
      categories: [],
      minPrice: null,
      maxPrice: null,
      condition: null,
      minRating: null,
      location: "",
      distance: 10,
    });
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Load resources - FIXED: removed pagination.page from dependencies
  const loadResources = useCallback(
    async (reset = true, pageOverride = null) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = reset
          ? 1
          : pageOverride !== null
            ? pageOverride
            : pagination.page + 1;

        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", pagination.limit);
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (filters.sortBy && filters.sortBy !== "newest")
          params.append("sortBy", filters.sortBy);
        if (filters.resourceType.length)
          params.append("resourceType", filters.resourceType.join(","));
        if (filters.theme.length)
          params.append("theme", filters.theme.join(","));
        if (filters.availability && filters.availability !== "all")
          params.append("availability", filters.availability);
        if (filters.categories.length)
          params.append("category", filters.categories.join(","));
        if (filters.minPrice !== null)
          params.append("minPrice", filters.minPrice);
        if (filters.maxPrice !== null)
          params.append("maxPrice", filters.maxPrice);
        if (filters.condition) params.append("condition", filters.condition);
        if (filters.minRating) params.append("minRating", filters.minRating);
        if (filters.location) params.append("location", filters.location);
        if (filters.distance) params.append("distance", filters.distance);

        // FIXED: Use apiCall instead of fetch
        const data = await apiCall(`/resources?${params.toString()}`);

        if (data.success) {
          if (reset) {
            setResources(data.resources);
          } else {
            setResources((prev) => [...prev, ...data.resources]);
          }
          setPagination(data.pagination);
        } else {
          setError(data.message || "Failed to load resources");
        }
      } catch (err) {
        console.error("Load resources error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, debouncedSearch, filters, pagination.limit],
  );

  // Load more on scroll
  useEffect(() => {
    if (inView && pagination.hasMore && !loading) {
      loadResources(false, pagination.page + 1);
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [inView, pagination.hasMore, loading, pagination.page, loadResources]);

  // Initial load - FIXED: runs when filters/debouncedSearch change
  useEffect(() => {
    loadResources(true);
  }, [
    debouncedSearch,
    filters.sortBy,
    filters.resourceType,
    filters.theme,
    filters.availability,
    filters.categories,
    filters.minPrice,
    filters.maxPrice,
    filters.condition,
    filters.minRating,
    filters.location,
    loadResources,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => setSearchQuery("");

  // Toggle bookmark - FIXED: use apiCall
  const handleToggleBookmark = async (resourceId) => {
    if (!user) {
      router.push("/login?redirect=/browse");
      return;
    }
    const isBookmarked = bookmarked.includes(resourceId);
    try {
      if (isBookmarked) {
        await apiCall(`/wishlist/${resourceId}`, { method: "DELETE" });
        setBookmarked((prev) => prev.filter((id) => id !== resourceId));
      } else {
        await apiCall("/wishlist", {
          method: "POST",
          body: JSON.stringify({ resourceId }),
        });
        setBookmarked((prev) => [...prev, resourceId]);
      }
    } catch (error) {
      console.error("Toggle bookmark error:", error);
    }
  };

  // Toggle like - FIXED: use apiCall
  const handleToggleLike = async (resourceId) => {
    if (!user) {
      router.push("/login?redirect=/browse");
      return;
    }
    const isLiked = liked.includes(resourceId);
    try {
      if (isLiked) {
        await apiCall(`/resources/${resourceId}/like`, { method: "DELETE" });
        setLiked((prev) => prev.filter((id) => id !== resourceId));
      } else {
        await apiCall(`/resources/${resourceId}/like`, { method: "POST" });
        setLiked((prev) => [...prev, resourceId]);
      }
    } catch (error) {
      console.error("Toggle like error:", error);
    }
  };

  const handleQuickView = (resource) => {
    setSelectedResource(resource);
    setShowQuickView(true);
  };

  // Export - FIXED: use apiCall
  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filters.categories.length)
        params.append("category", filters.categories.join(","));
      if (filters.minPrice !== null)
        params.append("minPrice", filters.minPrice);
      if (filters.maxPrice !== null)
        params.append("maxPrice", filters.maxPrice);

      const response = await apiCall(
        `/resources/export?${params.toString()}&format=${format}`,
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `resources-${new Date().toISOString()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) return;
    const newSearch = {
      id: Date.now(),
      name: saveSearchName,
      filters: { ...filters, search: debouncedSearch },
      date: new Date().toISOString(),
      resultsCount: pagination.total,
    };
    const updatedSearches = [newSearch, ...savedSearches].slice(0, 10);
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
    setShowSaveSearch(false);
    setSaveSearchName("");
  };

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
    if (filters.categories.length)
      params.set("category", filters.categories.join(","));
    if (filters.resourceType.length)
      params.set("type", filters.resourceType.join(","));
    if (filters.theme.length) params.set("theme", filters.theme.join(","));
    router.replace(`/browse?${params.toString()}`, { shallow: true });
  }, [
    debouncedSearch,
    filters.sortBy,
    filters.categories,
    filters.resourceType,
    filters.theme,
    router,
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header with Search */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources by title, description, or category..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 transition-colors"
                >
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Filters
                  </span>
                  {(filters.resourceType.length > 0 ||
                    filters.theme.length > 0 ||
                    filters.categories.length > 0 ||
                    filters.minPrice !== null ||
                    filters.condition ||
                    filters.availability !== "all" ||
                    filters.minRating) && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>

                <SortOptions
                  sortBy={filters.sortBy}
                  onSortChange={(sortBy) =>
                    setFilters((prev) => ({ ...prev, sortBy }))
                  }
                />
                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 transition-colors">
                    <Download className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Export
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 hidden group-hover:block z-20">
                    <button
                      onClick={() => handleExport("csv")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => handleExport("json")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Print
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowSaveSearch(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="text-sm">Save Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <FilterPanel
                showFilters={showFilters}
                filters={filters}
                setFilters={setFilters}
                toggleResourceType={toggleResourceType}
                toggleTheme={toggleTheme}
                resetFilters={resetFilters}
              />
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {debouncedSearch
                      ? `Results for "${debouncedSearch}"`
                      : "All Resources"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Showing {resources.length} of {pagination.total} results
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      const newCategories = filters.categories.includes(
                        category,
                      )
                        ? filters.categories.filter((c) => c !== category)
                        : [...filters.categories, category];
                      handleFilterChange("categories", newCategories);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.categories.includes(category)
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Results */}
              {error ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => loadResources(true)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : loading && resources.length === 0 ? (
                <LoadingSkeleton count={pagination.limit} />
              ) : resources.length === 0 ? (
                <EmptyState
                  searchQuery={debouncedSearch}
                  onClearSearch={handleClearSearch}
                  onResetFilters={resetFilters}
                />
              ) : (
                <>
                  {viewMode === "map" ? (
                    <MapView
                      resources={resources}
                      onMarkerClick={handleQuickView}
                    />
                  ) : (
                    <div
                      className={
                        viewMode === "list"
                          ? "space-y-4"
                          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      }
                    >
                      {resources.map((resource) => (
                        <ResourceCard
                          key={resource._id}
                          resource={resource}
                          variant={viewMode}
                          onQuickView={handleQuickView}
                          onBookmark={handleToggleBookmark}
                          onLike={handleToggleLike}
                          isBookmarked={bookmarked.includes(resource._id)}
                          isLiked={liked.includes(resource._id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Load More Trigger */}
                  {pagination.hasMore && (
                    <div ref={ref} className="flex justify-center py-8">
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                      ) : (
                        <button
                          onClick={() =>
                            loadResources(false, pagination.page + 1)
                          }
                          className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          Load More
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <QuickViewModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        resource={selectedResource}
        onRequest={() => {
          setShowQuickView(false);
          router.push(`/request/${selectedResource?._id}`);
        }}
      />

      <SaveSearchModal
        isOpen={showSaveSearch}
        onClose={() => setShowSaveSearch(false)}
        searchName={saveSearchName}
        setSearchName={setSaveSearchName}
        onSave={handleSaveSearch}
        resultCount={pagination.total}
      />
    </>
  );
}