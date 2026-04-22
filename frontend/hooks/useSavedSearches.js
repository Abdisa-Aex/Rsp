"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useLocalStorage(
    "savedSearches",
    [],
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState("");

  const saveSearch = (filters, search, resultCount) => {
    const newSearch = {
      id: Date.now(),
      name: searchName || `Search ${savedSearches.length + 1}`,
      filters: { ...filters, search },
      date: new Date().toISOString(),
      resultsCount: resultCount,
    };

    setSavedSearches((prev) => [newSearch, ...prev].slice(0, 10));
    setShowSaveModal(false);
    setSearchName("");
    return newSearch;
  };

  const deleteSearch = (id) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSearch = (id, updates) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const getSearch = (id) => {
    return savedSearches.find((s) => s.id === id);
  };

  return {
    savedSearches,
    showSaveModal,
    setShowSaveModal,
    searchName,
    setSearchName,
    saveSearch,
    deleteSearch,
    updateSearch,
    getSearch,
  };
};
