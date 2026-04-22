"use client";

import { motion } from "framer-motion";

const TypingIndicator = ({ users, theme }) => {
  if (!users || users.length === 0) return null;

  const typingText =
    users.length === 1
      ? `${users[0]} is typing...`
      : `${users.length} people are typing...`;

  return (
    <div className="flex justify-start">
      <div
        className={`border rounded-2xl rounded-bl-none p-4 shadow-sm ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  theme === "dark" ? "bg-gray-500" : "bg-gray-400"
                }`}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay,
                }}
              />
            ))}
          </div>
          <span
            className={`text-sm ml-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {typingText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
