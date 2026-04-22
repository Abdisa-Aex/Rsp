"use client";

import { useState } from "react";
import { MapPin, Navigation, ExternalLink, Copy, Check } from "lucide-react";

const LocationShare = ({ location, theme }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(location.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInMaps = () => {
    const url = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
    >
      {/* Map Preview */}
      <div className="relative h-32 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
        <MapPin className="h-8 w-8 text-green-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-green-500 rounded-full animate-ping opacity-50" />
        </div>
      </div>

      {/* Location Details */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Location</span>
        </div>

        <p className="text-sm mb-3">{location.address}</p>

        <div className="flex gap-2">
          <button
            onClick={openInMaps}
            className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
          >
            <Navigation className="h-3 w-3" />
            Open in Maps
          </button>
          <button
            onClick={copyAddress}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationShare;
