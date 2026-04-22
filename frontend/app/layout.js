import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from ".././context/AuthContext";
import { SocketProvider } from ".././context/SocketContext"; // Add this import
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResourceHub - Share Resources, Build Community",
  description:
    "Connect with neighbors to borrow, share, and exchange tools, equipment, skills, and more. Reduce waste, save money, and strengthen your community.",
  keywords:
    "resource sharing, community, borrow, lend, tools, equipment, sustainability",
  authors: [{ name: "ResourceHub Team" }],
  openGraph: {
    title: "ResourceHub - Share Resources, Build Community",
    description:
      "Connect with neighbors to borrow, share, and exchange tools, equipment, skills, and more.",
    url: "https://resourcehub.com",
    siteName: "ResourceHub",
    images: [
      {
        url: "https://resourcehub.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResourceHub - Share Resources, Build Community",
    description:
      "Connect with neighbors to borrow, share, and exchange tools, equipment, skills, and more.",
    images: ["https://resourcehub.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <SocketProvider>
            {" "}
            {/* Add this wrapper */}
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
          </SocketProvider>{" "}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
