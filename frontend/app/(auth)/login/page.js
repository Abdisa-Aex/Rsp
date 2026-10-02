"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
  Fingerprint,
  QrCode,
  Smartphone,
  Send,
  RefreshCw,
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  ArrowRight,
  ChevronRight,
  Globe,
  Twitter,
  Github,
  Apple,
  Key,
  ShieldCheck,
  Laptop,
  Tablet,
  X,
  Check,
  ExternalLink,
  Copy,
  ArrowLeft,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import AnnouncementBar from "../../../components/layout/AnnouncementBar";
import { Facebook } from "react-feather";
import { Chrome } from "react-feather";
import { Monitor } from "lucide-react";

// Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback("");
      return;
    }

    let score = 0;
    let feedbackMsg = "";

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      feedbackMsg =
        "Weak password - use more characters and mix of letters, numbers, and symbols";
    } else if (score <= 4) {
      feedbackMsg = "Medium password - could be stronger";
    } else {
      feedbackMsg = "Strong password!";
    }

    setStrength(Math.min(100, (score / 7) * 100));
    setFeedback(feedbackMsg);
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor()} transition-all duration-300`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{Math.round(strength)}%</span>
      </div>
      {feedback && (
        <p
          className={`text-xs mt-1 ${strength < 60 ? "text-yellow-600" : "text-green-600"}`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

// Password Requirements List Component
const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: "At least 8 characters", test: () => password.length >= 8 },
    {
      label: "At least 1 uppercase letter",
      test: () => /[A-Z]/.test(password),
    },
    {
      label: "At least 1 lowercase letter",
      test: () => /[a-z]/.test(password),
    },
    { label: "At least 1 number", test: () => /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      test: () => /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          {req.test() ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-gray-400" />
          )}
          <span className={req.test() ? "text-green-600" : "text-gray-500"}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// 2FA Modal Component
const TwoFAModal = ({ isOpen, onClose, onVerify, email }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("");
    const newCode = [...code];
    digits.forEach((digit, idx) => {
      if (idx < 6) newCode[idx] = digit;
    });
    setCode(newCode);
    if (newCode.every((digit) => digit) && onVerify) {
      onVerify(newCode.join(""));
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    const result = await onVerify(verificationCode);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter the 6-digit code from your authenticator app
          </p>
          <p className="text-xs text-gray-400 mt-2">Sent to {email}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              aria-label={`Digit ${index + 1} of 6`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={() => onClose()}
          className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

// Session Management Modal
const SessionsModal = ({
  isOpen,
  onClose,
  sessions,
  onRevoke,
  onRevokeAll,
}) => {
  if (!isOpen) return null;

  const getDeviceIcon = (device) => {
    if (device?.toLowerCase().includes("mobile"))
      return <Smartphone className="h-5 w-5 text-gray-500" />;
    if (device?.toLowerCase().includes("tablet"))
      return <Tablet className="h-5 w-5 text-gray-500" />;
    return <Monitor className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Active Sessions</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          You are logged in on these devices. Revoke any sessions you don't
          recognize.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
          {sessions.map((session, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getDeviceIcon(session.device)}
                <div>
                  <p className="font-medium text-gray-900">
                    {session.deviceName || session.device || "Unknown Device"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.location || "Unknown location"} •{" "}
                    {session.lastActive || "Recently active"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRevoke(session.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Revoke session"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {sessions.length > 1 && (
          <button
            onClick={onRevokeAll}
            className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            Revoke All Other Sessions
          </button>
        )}
      </motion.div>
    </div>
  );
};

// Magic Link Modal
const MagicLinkModal = ({ isOpen, onClose, onSend, email }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setSending(true);
    setError("");
    const result = await onSend(email);
    setSending(false);
    if (result.success) {
      setSent(true);
      setTimeout(() => onClose(), 3000);
    } else {
      setError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Magic Link Login</h3>
          <p className="text-sm text-gray-500 mt-1">
            We'll send you a link to sign in instantly
          </p>
        </div>

        {!sent ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "Sending..." : "Send Magic Link"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-700 mb-2">Magic link sent!</p>
            <p className="text-sm text-gray-500">Check your email to sign in</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Back to login
        </button>
      </motion.div>
    </div>
  );
};

// Main Login Page Component
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  // const redirectTo = searchParams.get("redirect") || "/profile";
  const { login, getSessions, revokeSession, revokeAllSessions, verify2FA } =
    useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // Session management
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState([]);

  // Magic link
  const [showMagicLink, setShowMagicLink] = useState(false);

  // Refs
  const emailInputRef = useRef(null);
  const errorRef = useRef(null);

  // Check for lockout
  useEffect(() => {
    const storedLockout = localStorage.getItem("login_lockout");
    if (storedLockout) {
      const lockoutData = JSON.parse(storedLockout);
      if (lockoutData.expires > Date.now()) {
        setLockoutTime(lockoutData.expires);
        setAttempts(lockoutData.attempts);
      } else {
        localStorage.removeItem("login_lockout");
      }
    }
  }, []);

  // Focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Focus error when appears
  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  // Load sessions after login
  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Load sessions error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔵 Login attempt started");
    console.log("🔵 Email:", email);
    console.log("🔵 Password length:", password.length);
    console.log("🔵 Remember me:", rememberMe);

    // Check lockout
    if (lockoutTime && lockoutTime > Date.now()) {
      const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
      setError(
        `Too many failed attempts. Please try again in ${remainingMinutes} minutes.`,
      );
      return;
    }

    setError("");
    setLoading(true);

    console.log("🔵 Calling login function...");
    const result = await login(email, password, rememberMe);
    console.log("🟢 Login result:", result);

    if (result.success) {
      console.log("🟢 Login successful! Redirecting to:", redirectTo);
      if (result.requires2FA) {
        setPendingUser({ userId: result.userId, email });
        setShow2FA(true);
        setLoading(false);
        return;
      }

      // Load sessions after login
      await loadSessions();

      // Reset attempts on success
      localStorage.removeItem("login_lockout");
      setAttempts(0);
      setLockoutTime(null);

      // Check if token was saved
      console.log("🔵 Token in localStorage:", localStorage.getItem("token"));
      console.log(
        "🔵 RefreshToken in localStorage:",
        localStorage.getItem("refreshToken"),
      );

      router.push(redirectTo);
    } else if (result.needsVerification) {
      console.log("🟡 Needs verification");
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      console.log("🔴 Login failed:", result.error);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        localStorage.setItem(
          "login_lockout",
          JSON.stringify({
            attempts: newAttempts,
            expires: lockoutUntil,
          }),
        );
        setLockoutTime(lockoutUntil);
        setError(`Too many failed attempts. Account locked for 15 minutes.`);
      } else {
        setError(
          `${result.error || "Login failed"} (${5 - newAttempts} attempts remaining)`,
        );
      }
    }

    setLoading(false);
  };

  const handle2FAVerify = async (code) => {
    try {
      const result = await verify2FA(pendingUser.userId, code);
      if (result.success) {
        setShow2FA(false);
        await loadSessions();
        router.push(redirectTo);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleRevokeSession = async (sessionId) => {
    await revokeSession(sessionId);
    await loadSessions();
  };

  const handleRevokeAllSessions = async () => {
    await revokeAllSessions();
    await loadSessions();
  };

  const handleMagicLink = async (email) => {
    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return null;
    const remaining = Math.max(0, lockoutTime - Date.now());

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* aria-live region for screen readers */}
          <div aria-live="polite" className="sr-only">
            {error && `Error: ${error}`}
          </div>

          {/* Lockout Warning */}
          {lockoutTime && lockoutTime > Date.now() && (
            <div
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              role="alert"
            >
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">
                  Account temporarily locked
                </p>
                <p className="text-red-600 text-sm">
                  Too many failed attempts. Try again in{" "}
                  <span className="font-mono">{getRemainingLockoutTime()}</span>
                </p>
              </div>
            </div>
          )}

          {error && !lockoutTime && (
            <div
              ref={errorRef}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              role="alert"
              tabIndex={-1}
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  aria-label="Email address"
                  aria-invalid={!!error}
                  disabled={lockoutTime && lockoutTime > Date.now()}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>


              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  aria-label="Password"
                  aria-invalid={!!error}
                  disabled={lockoutTime && lockoutTime > Date.now()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {password && (
                <>
                  {/* <PasswordStrengthMeter password={password} /> */}
                  {/* <PasswordRequirements password={password} /> */}
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Remember me"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                aria-label="Forgot password?"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading || (lockoutTime && lockoutTime > Date.now())}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              aria-busy={loading}
              aria-label={loading ? "Signing in..." : "Sign in"}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {sessions.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSessions(true)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
              >
                Manage active sessions ({sessions.length})
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-gray-600">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-semibold"
              aria-label="Register new account"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Modals */}
        <TwoFAModal
          isOpen={show2FA}
          onClose={() => setShow2FA(false)}
          onVerify={handle2FAVerify}
          email={pendingUser?.email}
        />

        <SessionsModal
          isOpen={showSessions}
          onClose={() => setShowSessions(false)}
          sessions={sessions}
          onRevoke={handleRevokeSession}
          onRevokeAll={handleRevokeAllSessions}
        />

        {/* <MagicLinkModal
          isOpen={showMagicLink}
          onClose={() => setShowMagicLink(false)}
          onSend={handleMagicLink}
          email={email}
        /> */}
      </div>
      <Footer />
    </>
  );
}
