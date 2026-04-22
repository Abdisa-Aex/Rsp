"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

export const useProfileData = () => {
  const { user, apiCall } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    itemsShared: 0,
    itemsBorrowed: 0,
    successfulExchanges: 0,
    responseRate: 0,
    trustScore: 0,
    points: 0,
    totalSavings: 0,
    carbonSaved: 0,
  });
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    resourceViews: 0,
    totalLikes: 0,
    totalShares: 0,
    monthlyViews: [],
    categoryDistribution: [],
  });

  const loadProfileData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [
        profileRes,
        statsRes,
        badgesRes,
        activitiesRes,
        itemsRes,
        exchangesRes,
        reviewsRes,
        wishlistRes,
        analyticsRes,
      ] = await Promise.all([
        apiCall("/users/me"),
        apiCall("/users/me/stats"),
        apiCall("/users/me/badges"),
        apiCall("/users/me/activities?limit=20"),
        apiCall("/users/me/items"),
        apiCall("/users/me/exchanges"),
        apiCall("/users/me/reviews"),
        apiCall("/wishlist"),
        apiCall("/users/me/analytics"),
      ]);

      if (profileRes.success) setProfile(profileRes.user);
      if (statsRes.success) setStats(statsRes.stats);
      if (badgesRes.success) setBadges(badgesRes.badges);
      if (activitiesRes.success) setActivities(activitiesRes.activities);
      if (itemsRes.success) setMyItems(itemsRes.items);
      if (exchangesRes.success) setExchanges(exchangesRes.exchanges);
      if (reviewsRes.success) setReviews(reviewsRes.reviews);
      if (wishlistRes.success) setWishlist(wishlistRes.wishlist);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
    } catch (error) {
      console.error("Load profile error:", error);
      addToast("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  }, [user, apiCall, addToast]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const updateProfile = useCallback(
    async (updates) => {
      try {
        const data = await apiCall("/users/me", {
          method: "PUT",
          body: JSON.stringify(updates),
        });
        if (data.success) {
          setProfile(data.user);
          addToast("Profile updated successfully", "success");
          return { success: true };
        }
        return { success: false, error: data.message };
      } catch (error) {
        addToast("Failed to update profile", "error");
        return { success: false, error: error.message };
      }
    },
    [apiCall, addToast],
  );

  const uploadAvatar = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const data = await apiCall("/upload/avatar", {
          method: "POST",
          body: formData,
          headers: {},
        });
        if (data.success) {
          setProfile((prev) => ({ ...prev, avatar: data.url }));
          addToast("Avatar updated successfully", "success");
          return { success: true, url: data.url };
        }
        return { success: false, error: data.message };
      } catch (error) {
        addToast("Failed to upload avatar", "error");
        return { success: false, error: error.message };
      }
    },
    [apiCall, addToast],
  );

  const deleteAccount = useCallback(async () => {
    try {
      const data = await apiCall("/users/me", { method: "DELETE" });
      if (data.success) {
        addToast("Account deleted successfully", "success");
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      addToast("Failed to delete account", "error");
      return { success: false, error: error.message };
    }
  }, [apiCall, addToast]);

  const exportData = useCallback(
    async (format = "json") => {
      try {
        const response = await apiCall(`/users/me/export?format=${format}`);
        if (response.success) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = `profile-data-${new Date().toISOString()}.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
          addToast("Data exported successfully", "success");
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (error) {
        addToast("Failed to export data", "error");
        return { success: false, error: error.message };
      }
    },
    [apiCall, addToast],
  );

  return {
    profile,
    loading,
    stats,
    badges,
    activities,
    myItems,
    exchanges,
    reviews,
    wishlist,
    analytics,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    exportData,
    refresh: loadProfileData,
  };
};
