"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MagicLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token && email) {
      // Redirect to success page with token
      router.push(
        `/magic-login/success?token=${token}&email=${encodeURIComponent(email)}`,
      );
    } else {
      router.push("/login?error=invalid_link");
    }
  }, [token, email, error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your magic link...</p>
      </div>
    </div>
  );
}
