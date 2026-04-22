"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  Flag,
  MoreVertical,
  Reply,
  MessageCircle,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";

const ReviewList = ({ reviews, onHelpful, onReport, onReply }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = (reviewId) => {
    if (replyText.trim()) {
      onReply?.(reviewId, replyText);
      setReplyText("");
      setShowReplyForm(null);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Member Reviews
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} from
            community members
          </p>
        </div>
        <Button variant="outline" size="small">
          Export Reviews
        </Button>
      </div>

      {/* Review Stats Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {(
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                  reviews.length || 0
              ).toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i <
                    Math.round(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length || 0,
                    )
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Overall Rating
            </p>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(
                (r) => Math.floor(r.rating) === rating,
              ).length;
              const percentage = (count / reviews.length) * 100 || 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600 dark:text-gray-400">
                    {rating}★
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-10 text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {review.reviewer?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.reviewer}
                    </h4>
                    {review.verified && (
                      <Badge variant="success" size="small">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span
                      className={`text-sm font-medium ml-2 ${getRatingColor(review.rating)}`}
                    >
                      {review.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  {review.date}
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === review.id ? null : review.id)
                  }
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {review.comment}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onHelpful?.(review.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful ({review.helpful || 0})</span>
              </button>
              <button
                onClick={() => onReport?.(review.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </button>
              <button
                onClick={() =>
                  setShowReplyForm(
                    showReplyForm === review.id ? null : review.id,
                  )
                }
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>
            </div>

            {/* Review Response */}
            {review.response && (
              <div className="mt-4 ml-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    {review.responder?.charAt(0) || "R"}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Response from {review.responder || "Owner"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {review.responseDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.response}
                </p>
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm === review.id && (
              <div className="mt-4 ml-12">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                />
                <div className="flex gap-2 mt-2">
                  <Button size="small" onClick={() => handleReply(review.id)}>
                    Post Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setShowReplyForm(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Expanded Details */}
            {expandedId === review.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Resource</p>
                    <p className="text-gray-900 dark:text-white">
                      {review.resource}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Transaction ID
                    </p>
                    <p className="text-gray-900 dark:text-white font-mono">
                      {review.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to leave a review
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
