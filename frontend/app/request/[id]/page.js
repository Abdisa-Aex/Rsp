"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function RequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, apiCall } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await apiCall(`/resources/${id}`);
      if (response.success) {
        setResource(response.resource);
        // Set default dates (tomorrow and day after)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        setStartDate(tomorrow.toISOString().split("T")[0]);
        setEndDate(dayAfter.toISOString().split("T")[0]);
      }
    } catch (error) {
      toast.error("Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    try {
      const response = await apiCall(
        `/resources/${id}/availability?startDate=${startDate}&endDate=${endDate}`,
      );
      if (response.success) {
        setAvailability(response);
        setTotalPrice(response.totalPrice);
      }
    } catch (error) {
      toast.error("Failed to check availability");
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability?.available) {
      toast.error("Resource not available for selected dates");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiCall(`/resources/${id}/request`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, message }),
      });
      if (response.success) {
        toast.success("Request sent successfully!");
        router.push(`/exchanges/${response.exchange._id}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
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

  if (!resource) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Resource not found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getPriceDisplay = () => {
    if (resource.priceType === "free") return "Free";
    if (resource.priceType === "deposit") return `$${resource.deposit} deposit`;
    if (resource.priceType === "barter") return "Barter / Trade";
    return `$${resource.price}/${resource.priceUnit}`;
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Resource Summary */}
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Request to Borrow
              </h1>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
                  {resource.images?.[0]?.url ? (
                    <img
                      src={resource.images[0].url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">
                    {resource.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {resource.location}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <User className="h-3 w-3" />
                    {resource.owner?.fullName}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-2">
                    {getPriceDisplay()}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {availability && (
                <div
                  className={`p-4 rounded-lg ${
                    availability.available
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {availability.available ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={
                        availability.available
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {availability.available
                        ? "Available for selected dates"
                        : "Not available for selected dates"}
                    </span>
                  </div>
                  {availability.available && (
                    <div className="mt-2 text-sm text-gray-600">
                      Duration: {availability.days} days • Total: $
                      {availability.totalPrice}
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Owner
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Introduce yourself and explain why you want to borrow this item..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Price Breakdown */}
              {availability?.available && totalPrice > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Price Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {getPriceDisplay()} × {availability.days} days
                      </span>
                      <span>${resource.price * availability.days}</span>
                    </div>
                    {resource.deposit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Refundable Deposit
                        </span>
                        <span>${resource.deposit}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-green-600">${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={submitting || !availability?.available}
                className="py-3"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {submitting ? "Sending Request..." : "Send Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
