"use client";

import { Grid3x3, List, Map, ZoomIn } from "lucide-react";

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "grid"
            ? "bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="Grid view"
      >
        <Grid3x3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "list"
            ? "bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="List view"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("map")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "map"
            ? "bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="Map view"
      >
        <Map className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("zoomable")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "zoomable"
            ? "bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="Zoomable view - Zoom in/out on items"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ViewToggle;
