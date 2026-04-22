"use client";

const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
