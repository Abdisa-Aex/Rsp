"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import {
  Package,
  Calendar,
  User,
  Camera,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

// Condition Selector Component
const ConditionSelector = ({ value, onChange }) => {
  const conditions = [
    {
      value: "excellent",
      label: "Excellent",
      description: "Like new, no signs of wear",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-500",
    },
    {
      value: "good",
      label: "Good",
      description: "Light wear, fully functional",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-500",
    },
    {
      value: "fair",
      label: "Fair",
      description: "Visible wear, minor issues",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-500",
    },
    {
      value: "damaged",
      label: "Damaged",
      description: "Significant wear or damage",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {conditions.map((condition) => (
        <button
          key={condition.value}
          type="button"
          onClick={() => onChange(condition.value)}
          className={`p-3 rounded-xl border-2 text-left transition-all ${
            value === condition.value
              ? `${condition.bg} ${condition.border}`
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className={`font-medium ${condition.color}`}>
            {condition.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {condition.description}
          </div>
          {value === condition.value && (
            <Check className="h-4 w-4 text-green-500 mt-1" />
          )}
        </button>
      ))}
    </div>
  );
};

export default function ReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, apiCall } = useAuth();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) fetchExchange();
  }, [id]);

  const fetchExchange = async () => {
    try {
      const response = await apiCall(`/exchanges/${id}`);
      if (response.success) {
        setExchange(response.exchange);

        // ✅ Check if user is the borrower
        if (response.exchange.borrower?._id !== user?._id) {
          toast.error("You are not authorized to return this item");
          router.push("/dashboard?tab=exchanges");
        }

        // ✅ Check if exchange is active
        if (response.exchange.status !== "active") {
          toast.error("This exchange is not active. Cannot return.");
          router.push("/dashboard?tab=exchanges");
        }
      }
    } catch (error) {
      toast.error("Failed to load exchange");
      router.push("/dashboard?tab=exchanges");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload/resource",
        {
          method: "POST",
          headers: { "x-auth-token": localStorage.getItem("token") },
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        setPhotos([...photos, ...data.images]);
        toast.success(`${data.images.length} photo(s) uploaded`);
      }
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!condition) {
      toast.error("Please select item condition");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiCall(`/exchanges/${id}/return`, {
        method: "POST",
        body: JSON.stringify({
          condition,
          returnNotes: notes,
          returnPhotos: photos,
        }),
      });

      if (response.success) {
        toast.success("Item returned successfully! +100 points");

        // ✅ Redirect to exchange detail page to see updated status
        setTimeout(() => {
          router.push(`/exchanges/${id}?returned=true`);
        }, 1500);
      } else {
        toast.error(response.message || "Failed to complete return");
      }
    } catch (error) {
      console.error("Return error:", error);
      toast.error(error.message || "Failed to complete return");
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

  if (!exchange) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Exchange not found</h2>
            <Button onClick={() => router.push("/dashboard?tab=exchanges")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
            <ArrowLeft className="h-5 w-5" /> Back
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Return Item
              </h1>
              <p className="text-gray-600">
                Confirm the return of your borrowed item
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Exchange Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
                    {exchange.resource?.images?.[0]?.url ? (
                      <img
                        src={exchange.resource.images[0].url}
                        alt={exchange.resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400 m-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {exchange.resource?.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Borrowed:{" "}
                      {new Date(exchange.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(exchange.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3 w-3" />
                      Owner: {exchange.owner?.fullName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Condition *
                </label>
                <ConditionSelector value={condition} onChange={setCondition} />
              </div>

              {/* Return Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img
                          src={photo.url}
                          alt={`Return ${idx + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Camera className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </div>
                  )}
                </div>
              </div>

              {/* Return Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Any additional notes about the return..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Warning Message */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Please ensure the item is in good condition before
                  returning. The owner will review the return and may dispute
                  any damages.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={submitting}
                className="py-3"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                {submitting ? "Processing..." : "Confirm Return"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
