"use client";

import { useEffect, useRef } from "react";

export const useDragAndDrop = (onDrop, acceptedTypes = ["image/*"]) => {
  const dropzoneRef = useRef(null);

  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add(
        "border-green-500",
        "bg-green-50",
        "dark:bg-green-900/20",
      );
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove(
        "border-green-500",
        "bg-green-50",
        "dark:bg-green-900/20",
      );
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove(
        "border-green-500",
        "bg-green-50",
        "dark:bg-green-900/20",
      );

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        return acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.slice(0, -2));
          }
          return file.type === type;
        });
      });

      if (validFiles.length > 0 && onDrop) {
        onDrop({ target: { files: validFiles } });
      }
    };

    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);

    return () => {
      dropzone.removeEventListener("dragover", handleDragOver);
      dropzone.removeEventListener("dragleave", handleDragLeave);
      dropzone.removeEventListener("drop", handleDrop);
    };
  }, [onDrop, acceptedTypes]);

  return dropzoneRef;
};
