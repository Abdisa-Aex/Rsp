"use client";

class PushNotificationService {
  constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    this.swRegistration = null;
    this.isSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
  }

  async init() {
    if (!this.isSupported) {
      console.warn("Push notifications not supported");
      return false;
    }

    try {
      if ("serviceWorker" in navigator) {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered");
      }
      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  async requestPermission() {
    if (!this.isSupported) {
      throw new Error("Push notifications not supported");
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    return true;
  }

  async subscribe() {
    try {
      if (!this.swRegistration) {
        await this.init();
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications/push/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          token: JSON.stringify(subscription),
          platform: "web",
          deviceInfo: this.getDeviceInfo(),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      return subscription;
    } catch (error) {
      console.error("Push subscription failed:", error);
      throw error;
    }
  }

  async unsubscribe() {
    try {
      const subscription = await this.getSubscription();
      if (!subscription) return;

      await subscription.unsubscribe();

      const token = localStorage.getItem("token");
      await fetch("/api/notifications/push/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          token: JSON.stringify(subscription),
        }),
      });

      return true;
    } catch (error) {
      console.error("Push unsubscription failed:", error);
      throw error;
    }
  }

  async getSubscription() {
    if (!this.swRegistration) return null;
    return await this.swRegistration.pushManager.getSubscription();
  }

  async isSubscribed() {
    const subscription = await this.getSubscription();
    return !!subscription;
  }

  getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let device = "Desktop";

    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
      device = "Tablet";
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      device = "Mobile";
    }

    return { browser, os, device };
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async sendTest() {
    const subscription = await this.getSubscription();
    if (!subscription) {
      throw new Error("Not subscribed to push notifications");
    }

    const token = localStorage.getItem("token");
    const response = await fetch("/api/notifications/push/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        token: JSON.stringify(subscription),
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  }
}

export default new PushNotificationService();
