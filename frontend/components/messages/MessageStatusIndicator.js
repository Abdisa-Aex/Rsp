"use client";

import { Clock, Check, CheckCheck, AlertCircle } from "lucide-react";

const MessageStatusIndicator = ({ status, read, className = "" }) => {
  if (status === "sending") {
    return (
      <Clock className={`h-3 w-3 animate-pulse text-gray-400 ${className}`} />
    );
  }
  if (status === "sent") {
    return <Check className={`h-3 w-3 text-gray-400 ${className}`} />;
  }
  if (status === "delivered") {
    return <CheckCheck className={`h-3 w-3 text-blue-400 ${className}`} />;
  }
  if (status === "read" || read) {
    return <CheckCheck className={`h-3 w-3 text-green-400 ${className}`} />;
  }
  if (status === "failed") {
    return <AlertCircle className={`h-3 w-3 text-red-400 ${className}`} />;
  }
  return null;
};

export default MessageStatusIndicator;
