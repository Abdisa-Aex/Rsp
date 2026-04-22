"use client";

import { Apple, Smartphone, Download, Store } from "lucide-react";

export default function AppBadges({ variant = "horizontal", className = "" }) {
  const appStoreUrl =
    process.env.NEXT_PUBLIC_APP_STORE_URL ||
    "https://apps.apple.com/app/resourcehub";
  const googlePlayUrl =
    process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
    "https://play.google.com/store/apps/details?id=com.resourcehub";

  const badges = [
    {
      name: "App Store",
      icon: Apple,
      url: appStoreUrl,
      color: "bg-gray-900",
      textColor: "text-white",
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "Google Play",
      icon: Store,
      url: googlePlayUrl,
      color: "bg-green-600",
      textColor: "text-white",
      hoverColor: "hover:bg-green-700",
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <a
              key={badge.name}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${badge.color} ${badge.hoverColor} ${badge.textColor} px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{badge.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "qr") {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <img
            src="/images/qr-code-app.png"
            alt="Download App QR Code"
            className="w-32 h-32"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Scan to download</p>
          <div className="flex gap-2 justify-center">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <a
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon className="h-6 w-6 text-gray-600" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal badges (default)
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <a
            key={badge.name}
            href={badge.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${badge.color} ${badge.hoverColor} ${badge.textColor} px-6 py-3 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-md`}
          >
            <Icon className="h-6 w-6" />
            <div>
              <div className="text-xs opacity-80">Download on the</div>
              <div className="text-lg font-semibold">{badge.name}</div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
