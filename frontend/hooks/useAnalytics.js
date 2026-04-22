"use client";

import { useCallback } from "react";

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventData = {}) => {
    // Track to Google Analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        ...eventData,
        timestamp: new Date().toISOString(),
      });
    }

    // Track to custom analytics endpoint
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", eventName, eventData);
    }
  }, []);

  const trackPageView = useCallback(
    (pagePath, pageTitle) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: pagePath,
          page_title: pageTitle,
        });
      }

      trackEvent("page_view", { pagePath, pageTitle });
    },
    [trackEvent],
  );

  const trackUserAction = useCallback(
    (action, details = {}) => {
      trackEvent("user_action", { action, ...details });
    },
    [trackEvent],
  );

  const trackError = useCallback(
    (error, context = {}) => {
      console.error(error);
      trackEvent("error", {
        message: error.message,
        stack: error.stack,
        ...context,
      });
    },
    [trackEvent],
  );

  return { trackEvent, trackPageView, trackUserAction, trackError };
};
