// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
// import Header from "../../components/layout/Header";
// import Footer from "../../components/layout/Footer";
// import AnnouncementBar from "../../components/layout/AnnouncementBar";

// export default function VerifyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const email = searchParams.get("email");
//   const [status, setStatus] = useState("verifying");
//   const [message, setMessage] = useState("");

//   const API_URL =
//     process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//   useEffect(() => {
//     if (!token || !email) {
//       setStatus("error");
//       setMessage("Invalid verification link");
//       return;
//     }

//     const verifyEmail = async () => {
//       try {
//         const response = await fetch(`${API_URL}/auth/verify`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, email }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setStatus("success");
//           setMessage("Email verified successfully!");
//           // Save tokens if returned
//           if (data.token) {
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("refreshToken", data.refreshToken);
//             document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
//             document.cookie = `userRole=${data.user?.role || "user"}; path=/; max-age=${7 * 24 * 60 * 60}`;
//           }
//           setTimeout(() => router.push("/login"), 3000);
//         } else {
//           setStatus("error");
//           setMessage(data.message || "Verification failed");
//         }
//       } catch (error) {
//         setStatus("error");
//         setMessage("Network error. Please try again.");
//       }
//     };

//     verifyEmail();
//   }, [token, email, router, API_URL]);

//   return (
//     <>
//       <AnnouncementBar />
//       <Header />
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//           {status === "verifying" && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center"
//             >
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Verifying your email...
//               </h2>
//               <p className="text-gray-600">
//                 Please wait while we verify your account.
//               </p>
//             </motion.div>
//           )}

//           {status === "success" && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center"
//             >
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle className="h-8 w-8 text-green-500" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Email Verified! 🎉
//               </h2>
//               <p className="text-gray-600 mb-4">{message}</p>
//               <p className="text-sm text-gray-500">Redirecting to login...</p>
//             </motion.div>
//           )}

//           {status === "error" && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center"
//             >
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <AlertCircle className="h-8 w-8 text-red-500" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Verification Failed
//               </h2>
//               <p className="text-gray-600 mb-6">{message}</p>
//               <div className="space-y-3">
//                 <Link
//                   href="/resend-verification"
//                   className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
//                 >
//                   Resend Verification Email
//                 </Link>
//                 <Link
//                   href="/login"
//                   className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
//                 >
//                   Back to Login
//                 </Link>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // Log for debugging
    console.log("Verify page loaded");
    console.log("Token:", token);
    console.log("Email:", email);
    console.log("API_URL:", API_URL);

    if (!token || !email) {
      setStatus("error");
      setMessage(
        "Invalid or missing verification link. Please request a new verification email.",
      );
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log("Sending verification request...");

        const response = await fetch(`${API_URL}/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();
        console.log("Verification response:", data);

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          // Save tokens if returned
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            if (data.user?.role) {
              document.cookie = `userRole=${data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
            }
          }

          // Countdown to redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push("/login");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setStatus("error");
          setMessage(
            data.message || "Verification failed. The link may have expired.",
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(
          "Network error. Please check your connection and try again.",
        );
      }
    };

    verifyEmail();
  }, [token, email, router, API_URL]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Email address not found. Please go to the resend page.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification email resent! Check your inbox.");
        setTimeout(() => {
          if (status === "error") {
            setMessage("");
          }
        }, 5000);
      } else {
        setMessage(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Email Verification
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {status === "verifying" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Verifying Your Email
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we verify your account...
                  </p>
                  <div className="mt-6 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Email Verified! 🎉
                  </h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-sm">
                      Your account is now active. You can start sharing and
                      borrowing resources!
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Redirecting to login in {countdown} seconds...
                  </p>
                  <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-600 rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: countdown, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-gray-600 mb-6">{message}</p>

                  <div className="space-y-3">
                    {email && (
                      <button
                        onClick={handleResendVerification}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Resend Verification Email
                      </button>
                    )}

                    <Link
                      href="/resend-verification"
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      Request New Verification Link
                    </Link>

                    <Link
                      href="/login"
                      className="w-full py-3 text-gray-600 rounded-xl font-semibold hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Having trouble? Contact support at{" "}
            <a
              href="mailto:support@jijigauniversity.edu.et"
              className="text-blue-600 hover:underline"
            >
              support@jijigauniversity.edu.et
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}