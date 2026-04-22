"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

export const useBookmark = (resourceId) => {
  const { user, apiCall } = useAuth();
  const { addToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    }
  }, [user, resourceId]);

  const checkBookmarkStatus = async () => {
    if (!user) return;
    try {
      const data = await apiCall(`/wishlist/check/${resourceId}`);
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error("Check bookmark error:", error);
    }
  };

  const toggleBookmark = useCallback(async () => {
    if (!user) {
      addToast("Please sign in to bookmark items", "warning");
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await apiCall(`/wishlist/${resourceId}`, { method: "DELETE" });
        setIsBookmarked(false);
        addToast("Removed from bookmarks", "success");
      } else {
        await apiCall("/wishlist", {
          method: "POST",
          body: JSON.stringify({ resourceId }),
        });
        setIsBookmarked(true);
        addToast("Added to bookmarks", "success");
      }
    } catch (error) {
      console.error("Toggle bookmark error:", error);
      addToast("Failed to update bookmark", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user, resourceId, isBookmarked, apiCall, addToast]);

  return { isBookmarked, toggleBookmark, isLoading };
};
