"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

export const useResources = (initialFilters = {}) => {
  const { apiCall } = useAuth();
  const { addToast } = useToast();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchResources = useCallback(
    async (reset = true) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: reset ? 1 : pagination.page + 1,
          limit: pagination.limit,
          ...filters,
        });
        const data = await apiCall(`/resources?${params.toString()}`);
        if (data.success) {
          if (reset) {
            setResources(data.resources);
          } else {
            setResources((prev) => [...prev, ...data.resources]);
          }
          setPagination(data.pagination);
        }
      } catch (err) {
        setError(err);
        addToast(err.message || "Failed to load resources", "error");
      } finally {
        setLoading(false);
      }
    },
    [apiCall, filters, pagination.page, pagination.limit, addToast],
  );

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchResources(false);
    }
  }, [pagination.hasMore, loading, fetchResources]);

  useEffect(() => {
    fetchResources(true);
  }, [filters]);

  const refetch = useCallback(() => {
    fetchResources(true);
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    loadMore,
    refetch,
  };
};
