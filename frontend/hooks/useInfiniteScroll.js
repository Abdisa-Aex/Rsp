"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export const useInfiniteScroll = (
  fetchMore,
  options = { threshold: 0.1, rootMargin: "100px" },
) => {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          try {
            const result = await fetchMore();
            setHasMore(result.hasMore);
            setError(null);
          } catch (err) {
            setError(err);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: options.threshold, rootMargin: options.rootMargin },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchMore, hasMore, isLoading, options.threshold, options.rootMargin]);

  return { loaderRef, hasMore, isLoading, error };
};
