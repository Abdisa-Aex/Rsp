"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  icon,
  iconPosition = "left",
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 focus:ring-green-500",
    secondary:
      "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg hover:scale-105 focus:ring-blue-500",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 focus:ring-green-500 bg-transparent",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 bg-transparent",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-red-500",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:scale-105 focus:ring-green-500",
    warning:
      "bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg hover:scale-105 focus:ring-yellow-500",
    dark: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm gap-1.5",
    medium: "px-4 py-2.5 text-sm gap-2",
    large: "px-6 py-3 text-base gap-2.5",
    xlarge: "px-8 py-4 text-lg gap-3",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const iconSize = {
    small: "h-3.5 w-3.5",
    medium: "h-4 w-4",
    large: "h-5 w-5",
    xlarge: "h-6 w-6",
  };

  const content = (
    <>
      {loading && <Loader2 className={`animate-spin ${iconSize[size]} mr-2`} />}
      {icon && iconPosition === "left" && !loading && (
        <span className={iconSize[size]}>{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && !loading && (
        <span className={iconSize[size]}>{icon}</span>
      )}
    </>
  );

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
