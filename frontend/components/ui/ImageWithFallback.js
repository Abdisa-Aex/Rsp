"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  className = "",
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const imageProps = {
    src: error ? fallbackSrc : imgSrc,
    alt,
    className,
    onError: () => {
      setError(true);
      setImgSrc(fallbackSrc);
    },
    ...props,
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image {...imageProps} fill sizes={sizes} priority={priority} />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <ImageOff className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        {...imageProps}
        width={width}
        height={height}
        priority={priority}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ImageOff className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
