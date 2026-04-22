// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function ResendVerificationPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const initialEmail = searchParams.get("email") || "";

//   const [email, setEmail] = useState(initialEmail);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [countdown, setCountdown] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (countdown > 0) return;

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/resend-verification", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess(true);
//         setCountdown(60);
//         const timer = setInterval(() => {
//           setCountdown(prev => {
//             if (prev <= 1) {
//               clearInterval(timer);
//               return 0;
//             }
//             return prev - 1;
//           });
//         }, 1000);
//         setTimeout(() => setSuccess(false), 5000);
//       } else {
//         setError(data.message || "Failed to resend");
//       }
//     } catch (err) {
//       setError("Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold">Resend Verification Email</h2>
//         </div>

//         {success && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-green-700 text-center">Verification email sent!</p>
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700 text-center">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
//               placeholder="you@example.com"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading || countdown > 0}
//             className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
//           >
//             {loading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
//           </button>

//           <div className="text-center">
//             <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
//               Back to Login
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ResendVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Failed to resend verification email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Resend Verification Email
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a new verification link
          </p>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-700">
                Verification email sent! Check your inbox.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || countdown > 0}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Mail className="h-5 w-5" />
            )}
            {loading
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Verification Email"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}