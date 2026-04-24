"use client";

import { useState } from "react";
import ExchangesList from "./ExchangesList";

const ExchangesTab = ({
  exchanges,
  onReturn,
  onRate,
  onApprove, // ← Add this prop
  onDecline, // ← Add this prop
  initialFilter = "all", // ← Optional initial filter
}) => {
  // Manage filter state locally
  const [filter, setFilter] = useState(initialFilter);

  // If parent doesn't provide approve/decline, create default handlers
  const handleApprove =
    onApprove ||
    (async (exchange) => {
      console.log("Approve handler not provided", exchange);
      // Default implementation could call an API
    });

  const handleDecline =
    onDecline ||
    (async (exchange) => {
      console.log("Decline handler not provided", exchange);
    });

  return (
    <ExchangesList
      exchanges={exchanges}
      filter={filter}
      onFilterChange={setFilter}
      onApprove={handleApprove}
      onDecline={handleDecline}
      onReturn={onReturn}
      onRate={onRate}
    />
  );
};

export default ExchangesTab;
