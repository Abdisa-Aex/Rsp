"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MessageCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Heart,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Sad,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Rating Stars Component
const RatingStars = ({ rating, onRatingChange, size = "lg" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const starSize = sizes[size];

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`${starSize} ${
              (hoverRating || rating) >= star
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

// Rating Presets Component
const RatingPresets = ({ onSelect }) => {
  const presets = [
    {
      rating: 5,
      label: "Excellent",
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      rating: 4,
      label: "Good",
      icon: ThumbsUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      rating: 3,
      label: "Average",
      icon: Meh,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      rating: 2,
      label: "Poor",
      icon: ThumbsDown,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      rating: 1,
      label: "Terrible",
      icon: Angry,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.rating}
            onClick={() => onSelect(preset.rating)}
            className={`p-3 rounded-xl text-center transition-all ${preset.bg} hover:scale-105`}
          >
            <Icon className={`h-6 w-6 mx-auto mb-1 ${preset.color}`} />
            <span className={`text-sm font-medium ${preset.color}`}>
              {preset.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Review Tags Component
const ReviewTags = ({ selectedTags, onToggleTag }) => {
  const tags = [
    "Friendly owner",
    "Item as described",
    "Fast pickup",
    "Good condition",
    "Would recommend",
    "On time return",
    "Great communication",
    "Flexible schedule",
    "Clean item",
    "Accurate description",
    "Reasonable price",
    "Helpful",
    "Professional",
    "Trustworthy",
    "Knowledgeable",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            selectedTags.includes(tag)
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

// Main Rate Page Component
export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user, apiCall, isAuthenticated } = useAuth();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // Load exchange details
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/rate/${id}`);
      return;
    }

    loadExchange();
  }, [id, isAuthenticated]);

  const loadExchange = async () => {
    try {
      const data = await apiCall(`/exchanges/${id}`);
      if (data.success) {
        setExchange(data.exchange);
      } else {
        setError(data.message || "Exchange not found");
      }
    } catch (error) {
      setError("Failed to load exchange details");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = await apiCall(`/exchanges/${id}/rate`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          review,
          tags,
          isPublic,
        }),
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard?tab=exchanges");
        }, 2000);
      } else {
        setError(data.message || "Failed to submit rating");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = () => {
    if (rating === 5) return "Excellent!";
    if (rating === 4) return "Very Good";
    if (rating === 3) return "Good";
    if (rating === 2) return "Fair";
    if (rating === 1) return "Poor";
    return "Select a rating";
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
        <Footer />
      </>
    );
  }

  if (error && !exchange) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Exchange Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Determine if user is rating owner or borrower
  const isOwner = exchange?.owner?._id === user?.id;
  const reviewee = isOwner ? exchange?.borrower : exchange?.owner;
  const exchangeType = isOwner ? "borrower" : "owner";

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Rate Your Experience
            </h1>
            <p className="text-gray-600 mt-2">
              Share your experience with {reviewee?.fullName}
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                Your review has been submitted. You have earned {rating * 10}{" "}
                points!
              </p>
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full animate-progress"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to dashboard...
              </p>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Item Details */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Item Details
                </h2>
                <div className="flex items-start gap-4">
                  {exchange?.resource?.images?.[0] && (
                    <img
                      src={exchange.resource.images[0].url}
                      alt={exchange.resource.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {exchange?.resource?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {exchange?.resource?.category}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exchangeType === "borrower"
                          ? "Borrowed by:"
                          : "Borrowed from:"}{" "}
                        {reviewee?.fullName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Returned:{" "}
                        {new Date(exchange?.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Form */}
              <div className="p-6 space-y-6">
                {/* Rating Stars */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Your Rating *
                  </label>
                  <RatingStars
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                  />
                  <p className="mt-3 text-lg font-medium text-gray-900">
                    {getRatingText()}
                  </p>
                </div>

                {/* Rating Presets */}
                <RatingPresets onSelect={setRating} />

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Share your experience with this user..."
                  />
                </div>

                {/* Quick Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Tags
                  </label>
                  <ReviewTags
                    selectedTags={tags}
                    onToggleTag={handleToggleTag}
                  />
                </div>

                {/* Privacy Option */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <label htmlFor="public" className="text-sm text-gray-700">
                    Make this review public
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
