"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function MagicLoginSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refreshToken");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [token, refreshToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Login Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Welcome back! Redirecting you to your dashboard...
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full animate-progress"
            style={{ width: "100%" }}
          />
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm text-green-600 hover:text-green-700"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
