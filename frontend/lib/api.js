"use client";

import { toast } from "react-hot-toast";

class API {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers["x-auth-token"] = token;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.message === "Token expired") {
          // Handle token refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.request(endpoint, options);
          }
        }
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        ...options.headers,
        "Content-Type": undefined,
      },
    });
  }
}

export const api = new API();
