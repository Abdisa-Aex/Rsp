"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, X } from "lucide-react";
import ResourceCard from "../ui/ResourceCard";

const ZoomableView = ({
  resources,
  onQuickView,
  onBookmark,
  onLike,
  bookmarked,
  liked,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const zoomSteps = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const currentZoomIndex = zoomSteps.indexOf(zoomLevel);

  const handleZoomIn = () => {
    if (currentZoomIndex < zoomSteps.length - 1) {
      setZoomLevel(zoomSteps[currentZoomIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      setZoomLevel(zoomSteps[currentZoomIndex - 1]);
    }
  };

  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const getGridCols = () => {
    if (zoomLevel >= 1.5) return "grid-cols-1 md:grid-cols-2";
    if (zoomLevel >= 1.25) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 p-4 overflow-auto"
    : "relative";

  return (
    <div className={containerClass}>
      {/* Zoom Controls */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-2 mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Zoom:</span>
          <button
            onClick={handleZoomOut}
            disabled={currentZoomIndex === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium min-w-[45px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={currentZoomIndex === zoomSteps.length - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {resources.length} items
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Zoomable Grid */}
      <div
        className={`grid ${getGridCols()} gap-4 transition-all duration-300`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top center",
        }}
      >
        {resources.map((resource) => (
          <div
            key={resource._id}
            className="transition-transform duration-200 hover:scale-105"
          >
            <ResourceCard
              resource={resource}
              variant="grid"
              onQuickView={onQuickView}
              onBookmark={onBookmark}
              onLike={onLike}
              isBookmarked={bookmarked?.includes(resource._id)}
              isLiked={liked?.includes(resource._id)}
            />
          </div>
        ))}
      </div>

      {fullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed bottom-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ZoomableView;
