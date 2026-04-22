"use client";

import { useState, useEffect, useCallback } from "react";
// import pushService from "./lib/pushService";
 
import { useAuth } from "./useAuth";
import { toast } from "react-hot-toast";
import pushService from "../lib/pushNotifications"
export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSupported(pushService.isSupported);
    checkSubscription();
    checkPermission();
  }, []);

  const checkSubscription = async () => {
    if (!pushService.isSupported) return;
    const subscribed = await pushService.isSubscribed();
    setIsSubscribed(subscribed);
  };

  const checkPermission = () => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);
  };

  const requestPermission = useCallback(async () => {
    if (!pushService.isSupported) {
      toast.error("Push notifications are not supported on this device");
      return false;
    }

    setLoading(true);
    try {
      await pushService.requestPermission();
      setPermission("granted");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!pushService.isSupported || permission !== "granted") {
      toast.error("Please enable notifications first");
      return false;
    }

    setLoading(true);
    try {
      await pushService.subscribe();
      setIsSubscribed(true);
      toast.success("Push notifications enabled");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      await pushService.unsubscribe();
      setIsSubscribed(false);
      toast.success("Push notifications disabled");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTest = useCallback(async () => {
    try {
      await pushService.sendTest();
      toast.success("Test notification sent!");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTest,
  };
};
