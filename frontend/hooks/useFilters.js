"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

export const useFilters = (initialFilters = {}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({
    sortBy: "newest",
    resourceType: [],
    availability: "all",
    theme: [],
    minPrice: null,
    maxPrice: null,
    condition: null,
    minRating: null,
    location: "",
    distance: 10,
    ...initialFilters,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, setDebouncedSearch]);

  const toggleResourceType = (type) => {
    setFilters((prev) => ({
      ...prev,
      resourceType: prev.resourceType.includes(type)
        ? prev.resourceType.filter((t) => t !== type)
        : [...prev.resourceType, type],
    }));
  };

  const toggleTheme = (theme) => {
    setFilters((prev) => ({
      ...prev,
      theme: prev.theme.includes(theme)
        ? prev.theme.filter((t) => t !== theme)
        : [...prev.theme, theme],
    }));
  };

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setFilters({
      sortBy: "newest",
      resourceType: [],
      availability: "all",
      theme: [],
      minPrice: null,
      maxPrice: null,
      condition: null,
      minRating: null,
      location: "",
      distance: 10,
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.resourceType.length) count += filters.resourceType.length;
    if (filters.theme.length) count += filters.theme.length;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.condition) count++;
    if (filters.availability !== "all") count++;
    if (filters.minRating) count++;
    if (filters.location) count++;
    return count;
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    filters,
    setFilters,
    selectedCategory,
    setSelectedCategory,
    toggleResourceType,
    toggleTheme,
    resetAllFilters,
    activeFiltersCount,
  };
};
