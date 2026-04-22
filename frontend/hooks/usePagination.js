"use client";

import { useState, useMemo, useEffect } from "react";

export const usePagination = (
  items,
  itemsPerPageDefault = 12,
  initialPage = 1,
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = items.slice(startIndex, endIndex);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const goToPage = (page) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
  };

  const nextPage = () => {
    if (hasNextPage) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (hasPrevPage) setCurrentPage(currentPage - 1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginationRange = useMemo(() => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { startPage, endPage, pages };
  }, [currentPage, totalPages]);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    currentItems,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setItemsPerPage,
    paginationRange,
  };
};
