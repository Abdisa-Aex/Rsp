"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SortAsc,
  Clock,
  TrendingUp,
  Star,
  DollarSign,
  MapPin,
} from "lucide-react";

const SortOptions = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "newest", label: "Newest First", icon: Clock },
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "rating", label: "Highest Rated", icon: Star },
    { value: "price_asc", label: "Price: Low to High", icon: DollarSign },
    { value: "price_desc", label: "Price: High to Low", icon: DollarSign },
    { value: "distance", label: "Nearest First", icon: MapPin },
  ];

  const selectedOption =
    options.find((opt) => opt.value === sortBy) || options[0];
  const SelectedIcon = selectedOption.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors"
      >
        <SortAsc className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Sort: {selectedOption.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isSelected
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {option.label}
                {isSelected && (
                  <span className="ml-auto">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortOptions;
