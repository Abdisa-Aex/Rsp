"use client";

import { useState } from "react";
import { BarChart3, Check, X, PieChart } from "lucide-react";

const Poll = ({ poll, onVote, theme }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = () => {
    if (selectedOption !== null && !hasVoted) {
      onVote(poll.id, selectedOption);
      setHasVoted(true);
    }
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  return (
    <div
      className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-purple-500" />
        <p className="font-medium text-gray-900 dark:text-white">
          {poll.question}
        </p>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isVoted = hasVoted || showResults;

          return (
            <div key={option.id} className="relative">
              <label
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  !hasVoted && !showResults
                    ? "hover:bg-gray-200 dark:hover:bg-gray-600"
                    : ""
                }`}
              >
                {!hasVoted && !showResults && (
                  <input
                    type="radio"
                    name="poll"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedOption(option.id)}
                    className="w-4 h-4 text-green-500 focus:ring-green-500"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.text}
                    </span>
                    {isVoted && (
                      <span className="text-xs text-gray-500">
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {isVoted && (
                    <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {!hasVoted && !showResults && (
        <button
          onClick={handleVote}
          disabled={selectedOption === null}
          className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Vote
        </button>
      )}

      {(hasVoted || showResults) && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <PieChart className="h-3 w-3" />
            <span>
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
            </span>
          </div>
          {!showResults && (
            <button
              onClick={() => setShowResults(true)}
              className="text-xs text-green-600 hover:text-green-700"
            >
              View Results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Poll;
