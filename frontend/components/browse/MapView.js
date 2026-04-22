"use client";

import { useState } from "react";
import {
  MapPin,
  X,
  Navigation,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const MapView = ({ resources, onMarkerClick }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 9.35, lng: 42.8 }); // Jigjiga coordinates

  // This is a placeholder - in production, use Google Maps, Mapbox, or Leaflet
  const mockMarkers = resources?.slice(0, 10) || [];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 3));

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      {/* Map Container */}
      <div className="absolute inset-0">
        {/* Mock Map Background */}
        <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-green-900/30 dark:via-blue-900/30 dark:to-purple-900/30 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-gray-300/30 dark:bg-gray-600/30"
                style={{ top: `${i * 5}%` }}
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-gray-300/30 dark:bg-gray-600/30"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Markers */}
          {mockMarkers.map((resource, idx) => {
            // Random positions for demo - in production, use actual coordinates
            const left = 15 + ((idx * 7) % 70);
            const top = 20 + ((idx * 12) % 60);

            return (
              <button
                key={resource._id}
                className="absolute group"
                style={{ left: `${left}%`, top: `${top}%` }}
                onClick={() => {
                  setSelectedResource(resource);
                  onMarkerClick?.(resource);
                }}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute -top-1 -left-1 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-48 z-10">
                    <p className="text-sm font-medium truncate">
                      {resource.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {resource.location}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {resource.priceType === "free"
                        ? "Free"
                        : `$${resource.price}/${resource.priceUnit}`}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Center Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Center map"
        >
          <Navigation className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Location Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          <span>Jigjiga University Area</span>
        </div>
      </div>

      {/* Selected Resource Card */}
      {selectedResource && (
        <div className="absolute bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
            {selectedResource.images?.[0] && (
              <img
                src={selectedResource.images[0].url}
                alt={selectedResource.title}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {selectedResource.title}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {selectedResource.location}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {selectedResource.priceType === "free"
                  ? "Free"
                  : `$${selectedResource.price}/${selectedResource.priceUnit}`}
              </span>
              <button
                onClick={() => onMarkerClick?.(selectedResource)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Message */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
        {mockMarkers.length} resources shown
      </div>
    </div>
  );
};

export default MapView;
