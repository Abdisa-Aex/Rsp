"use client";

import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "medium",
  className = "",
  icon,
  ...props
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    secondary:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="h-3.5 w-3.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
