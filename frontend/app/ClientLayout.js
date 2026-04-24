"use client";

import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";

export default function ClientLayout({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <>
      <AuthProvider>
        <SocketProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
      <Analytics />
    </>
  );
}
