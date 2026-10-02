"use client";

import { useState } from "react";
import ExchangesList from "./ExchangesList";

const ExchangesTab = ({
  exchanges,
  onReturn,
  onRate,
  onApprove,
  onDecline,
  apiCall, // ← Make sure this is received
  initialFilter = "all",
}) => {
  const [filter, setFilter] = useState(initialFilter);

  const handleApprove =
    onApprove ||
    (async (exchange) => {
      console.log("Approve handler not provided", exchange);
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
      apiCall={apiCall} // ← Pass it through
    />
  );
};

export default ExchangesTab;
