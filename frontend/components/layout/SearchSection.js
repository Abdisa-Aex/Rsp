"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  TrendingUp,
  Clock,
  MapPin,
  Package,
  Wrench,
  Book,
  Laptop,
  Flower,
  Coffee,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce"
const SearchSection = ({ variant = "desktop", onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // Mock suggestions - would come from API
        const mockSuggestions = [
          { text: `${debouncedQuery} tools`, category: "Tools", count: 24 },
          { text: `${debouncedQuery} equipment`, category: "Tools", count: 18 },
          { text: `${debouncedQuery} textbooks`, category: "Books", count: 32 },
          {
            text: `${debouncedQuery} laptop`,
            category: "Electronics",
            count: 12,
          },
          {
            text: `${debouncedQuery} gardening`,
            category: "Gardening",
            count: 8,
          },
        ];
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error("Fetch suggestions error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const saveSearch = (term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    saveSearch(searchTerm);
    router.push(`/browse?search=${encodeURIComponent(searchTerm)}`);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  if (variant === "mobile") {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for tools, books, electronics..."
            className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions &&
          (suggestions.length > 0 || recentSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              {recentSearches.length > 0 && !query && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </div>
                  </div>
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(term)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {term}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <TrendingUp className="h-3 w-3" />
                      Suggestions
                    </div>
                  </div>
                  {suggestions.map((suggestion, idx) => {
                    const getCategoryIcon = () => {
                      switch (suggestion.category) {
                        case "Tools":
                          return <Wrench className="h-4 w-4" />;
                        case "Books":
                          return <Book className="h-4 w-4" />;
                        case "Electronics":
                          return <Laptop className="h-4 w-4" />;
                        case "Gardening":
                          return <Flower className="h-4 w-4" />;
                        case "Kitchen":
                          return <Coffee className="h-4 w-4" />;
                        default:
                          return <Package className="h-4 w-4" />;
                      }
                    };
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon()}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion.text}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {suggestion.count} items
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {isLoading && (
                <div className="px-4 py-3 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
                </div>
              )}
            </div>
          )}
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search resources..."
            className="w-80 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500 text-sm transition-all group-hover:bg-gray-50 dark:group-hover:bg-gray-700"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions &&
        (suggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {recentSearches.length > 0 && !query && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                </div>
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(term)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {term}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    Suggestions
                  </div>
                </div>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion.text}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {suggestion.count} items
                    </span>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="px-4 py-3 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchSection;
