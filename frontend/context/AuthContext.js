"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

// ============ COOKIE HELPER FUNCTIONS ============
const setCookie = (name, value, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};
// =================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // API call helper with token refresh

  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      // Check if body is FormData (for file uploads)
      const isFormData = options.body instanceof FormData;

      // Don't set Content-Type for FormData (browser will set it with boundary)
      const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      };

      if (token) {
        headers["x-auth-token"] = token;
      }

      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: "include",
        });

        // Handle 204 No Content
        if (response.status === 204) {
          return { success: true, data: null };
        }

        const data = await response.json();

        // SUCCESS: Any 2xx status code is success
        if (response.status >= 200 && response.status < 300) {
          return data;
        }

        // ERROR: Handle 4xx and 5xx status codes
        if (response.status === 401 && data.message === "Token expired") {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return apiCall(endpoint, options);
          }
        }

        throw new Error(data.message || "API request failed");
      } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
      }
    },
    [token, API_URL],
  );
  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setCookie("token", data.token);
        setCookie("userRole", data.user?.role || "user");
        setCookie("userId", data.user?.id);
        return data.token;
      }

      throw new Error("Refresh failed");
    } catch (error) {
      logout();
      return null;
    }
  }, [refreshToken, API_URL]);

  // Load user from localStorage and cookies
  useEffect(() => {
    const loadUser = async () => {
      let storedToken = localStorage.getItem("token");

      if (!storedToken) {
        storedToken = getCookie("token");
        if (storedToken) {
          localStorage.setItem("token", storedToken);
        }
      }

      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedToken) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);

        try {
          const data = await apiCall("/auth/me");
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Load user error:", error);
          logout();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Register
  const register = async (userData) => {
    try {
      const data = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (data.success) {
        toast.success(
          "Registration successful! Check your email for the magic link.",
        );
        return { success: true, email: data.email, userId: data.userId };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Check if email is available
  const checkEmailAvailability = async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return { available: data.available };
    } catch (error) {
      console.error("Email check error:", error);
      return { available: true };
    }
  };

  // Verify email
  const verifyEmail = async (token, email) => {
    try {
      const data = await apiCall("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ token, email }),
      });

      if (data.success) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setCookie("token", data.token);
        setCookie("userRole", data.user?.role || "user");
        setCookie("userId", data.user?.id);
        toast.success("Email verified successfully!");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Resend verification
  const resendVerification = async (email) => {
    try {
      const data = await apiCall("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (data.success) {
        toast.success("New magic link sent! Check your email.");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Login - UPDATED WITH COOKIES (FIXED)
  const login = async (email, password, rememberMe = false) => {
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          deviceInfo: rememberMe ? { name: "Remembered Device" } : null,
        }),
      });

      if (data.success) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setPendingUser({ userId: data.userId, email });
          return { success: true, requires2FA: true };
        }

        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ FIXED: use data.user

        // ADD COOKIES FOR MIDDLEWARE
        setCookie("token", data.token);
        setCookie("userRole", data.user.role || "user");
        setCookie("userId", data.user.id);

        toast.success("Logged in successfully!");
        return { success: true };
      }

      if (data.needsVerification) {
        toast.error(
          "Please verify your email before logging in. Check your inbox for the magic link.",
        );
        return { success: false, needsVerification: true, email: data.email };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Verify 2FA
  const verify2FA = async (userId, code) => {
    try {
      const data = await apiCall("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ userId, code }),
      });

      if (data.success) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        setRequires2FA(false);
        setPendingUser(null);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setCookie("token", data.token);
        setCookie("userRole", data.user?.role || "user");
        setCookie("userId", data.user?.id);
        toast.success("2FA verified successfully!");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const data = await apiCall("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (data.success) {
        toast.success("Password reset email sent!");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const data = await apiCall("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      if (data.success) {
        toast.success("Password reset successfully! Please log in.");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const data = await apiCall("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (data.success) {
        toast.success("Password changed successfully! Please log in again.");
        logout();
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const data = await apiCall("/auth/me", {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      if (data.success) {
        setUser(data.user);
        toast.success("Profile updated successfully!");
        return { success: true, user: data.user };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/upload/avatar`, {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, avatar: data.url });
        toast.success("Avatar updated successfully!");
        return { success: true, url: data.url };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Get user sessions
  const getSessions = async () => {
    try {
      const data = await apiCall("/auth/sessions");
      return data.sessions;
    } catch (error) {
      console.error("Get sessions error:", error);
      return [];
    }
  };

  // Revoke session
  const revokeSession = async (sessionId) => {
    try {
      const data = await apiCall(`/auth/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (data.success) {
        toast.success("Session revoked successfully");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Revoke all sessions
  const revokeAllSessions = async () => {
    try {
      const data = await apiCall("/auth/sessions", {
        method: "DELETE",
      });

      if (data.success) {
        toast.success("All other sessions revoked");
        return { success: true };
      }

      return { success: false, error: data.message };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout - UPDATED WITH COOKIE REMOVAL
  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await apiCall("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setRequires2FA(false);
    setPendingUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // REMOVE COOKIES
    removeCookie("token");
    removeCookie("userRole");
    removeCookie("userId");

    router.push("/login");
  }, [refreshToken, apiCall, router]);

  // Check if user has permission
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      return user.permissions?.includes(permission) || false;
    },
    [user],
  );

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === "admin" || user?.role === "super_admin";
  }, [user]);

  const value = {
    user,
    loading,
    token,
    refreshToken,
    requires2FA,
    pendingUser,
    register,
    checkEmailAvailability,
    verifyEmail,
    resendVerification,
    login,
    verify2FA,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    uploadAvatar,
    getSessions,
    revokeSession,
    revokeAllSessions,
    logout,
    hasPermission,
    isAdmin,
    isAuthenticated: !!user,
    apiCall,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
