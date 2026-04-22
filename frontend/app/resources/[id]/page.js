"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import AnnouncementBar from "components/layout/AnnouncementBar";
import {
  Loader2,
  MapPin,
  Calendar,
  Star,
  User,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Flag,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";
import Button from "components/ui/Button";
import Badge from "components/ui/Badge";
import toast, { Toaster } from "react-hot-toast";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { apiCall, user } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarResources, setSimilarResources] = useState([]);

  const resourceId = params.id;

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

 const fetchResource = async () => {
   setLoading(true);
   try {
     // Use regular fetch instead of apiCall (no auth required)
     const res = await fetch(
       `http://localhost:5000/api/resources/${resourceId}`,
     );
     const data = await res.json();

     if (data.success) {
       setResource(data.resource);
       setSimilarResources(data.similar || []);
     } else {
       toast.error(data.message || "Failed to load resource");
     }
   } catch (error) {
     console.error("Fetch resource error:", error);
     toast.error("Failed to load resource");
   } finally {
     setLoading(false);
   }
 };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark");
      router.push("/login");
      return;
    }
    try {
      const response = await apiCall(`/resources/${resourceId}/bookmark`, {
        method: "POST",
      });
      if (response.success) {
        toast.success("Added to wishlist");
        fetchResource(); // Refresh to update bookmark status
      }
    } catch (error) {
      toast.error(error.message || "Failed to bookmark");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      router.push("/login");
      return;
    }
    try {
      const response = await apiCall(`/resources/${resourceId}/like`, {
        method: "POST",
      });
      if (response.success) {
        toast.success("Liked!");
        fetchResource();
      }
    } catch (error) {
      toast.error(error.message || "Failed to like");
    }
  };

  const handleRequest = () => {
    if (!user) {
      toast.error("Please login to request");
      router.push("/login");
      return;
    }
    router.push(`/request/${resourceId}`);
  };

  const getPriceDisplay = () => {
    if (!resource) return "";
    if (resource.priceType === "free") return "Free";
    if (resource.priceType === "deposit") return `$${resource.deposit} deposit`;
    if (resource.priceType === "barter") return "Barter / Trade";
    return `$${resource.price}/${resource.priceUnit || "day"}`;
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resource not found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
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
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-96 bg-gray-100">
                  {resource.images && resource.images.length > 0 ? (
                    <img
                      src={resource.images[0].url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>
                {resource.images && resource.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {resource.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`${resource.title} - ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resource.title}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBookmark}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Save to wishlist"
                    >
                      <Bookmark className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      onClick={handleLike}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Like"
                    >
                      <Heart className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Report"
                    >
                      <Flag className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="success">
                    {resource.status || "Available"}
                  </Badge>
                  {resource.isVerified && (
                    <Badge variant="primary">Verified</Badge>
                  )}
                </div>

                <div className="text-3xl font-bold text-green-600 mb-4">
                  {getPriceDisplay()}
                </div>

                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Posted by {resource.owner?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Posted {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{resource.views || 0} views</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleRequest}
                  disabled={resource.status !== "available"}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {resource.status === "available"
                    ? "Request to Borrow"
                    : "Not Available"}
                </Button>
              </div>

              {/* Owner info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About the Owner
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {resource.owner?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {resource.owner?.fullName}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {resource.owner?.rating || "New"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push(`/profile/${resource.owner?._id}`)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Description section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>

          {/* Similar resources */}
          {similarResources.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Similar Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarResources.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/resources/${item._id}`)}
                    className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-green-600 font-medium mt-2">
                      {item.priceType === "free"
                        ? "Free"
                        : `$${item.price}/day`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
