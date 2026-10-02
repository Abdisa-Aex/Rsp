// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useAuth } from "context/AuthContext";
// import Header from "components/layout/Header";
// import Footer from "components/layout/Footer";
// import AnnouncementBar from "components/layout/AnnouncementBar";
// import {
//   Loader2,
//   MapPin,
//   Calendar,
//   Star,
//   User,
//   Eye,
//   Heart,
//   Bookmark,
//   Share2,
//   Flag,
//   MessageCircle,
//   ChevronLeft,
// } from "lucide-react";
// import Button from "components/ui/Button";
// import Badge from "components/ui/Badge";
// import toast, { Toaster } from "react-hot-toast";

// export default function ResourceDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { apiCall, user } = useAuth();
//   const [resource, setResource] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [similarResources, setSimilarResources] = useState([]);

//   const resourceId = params.id;

//   useEffect(() => {
//     if (resourceId) {
//       fetchResource();
//     }
//   }, [resourceId]);

//  const fetchResource = async () => {
//    setLoading(true);
//    try {
//      // Use regular fetch instead of apiCall (no auth required)
//      const res = await fetch(
//        `http://localhost:5000/api/resources/${resourceId}`,
//      );
//      const data = await res.json();

//      if (data.success) {
//        setResource(data.resource);
//        setSimilarResources(data.similar || []);
//      } else {
//        toast.error(data.message || "Failed to load resource");
//      }
//    } catch (error) {
//      console.error("Fetch resource error:", error);
//      toast.error("Failed to load resource");
//    } finally {
//      setLoading(false);
//    }
//  };

//   const handleBookmark = async () => {
//     if (!user) {
//       toast.error("Please login to bookmark");
//       router.push("/login");
//       return;
//     }
//     try {
//       const response = await apiCall(`/resources/${resourceId}/bookmark`, {
//         method: "POST",
//       });
//       if (response.success) {
//         toast.success("Added to wishlist");
//         fetchResource(); // Refresh to update bookmark status
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to bookmark");
//     }
//   };

//   const handleLike = async () => {
//     if (!user) {
//       toast.error("Please login to like");
//       router.push("/login");
//       return;
//     }
//     try {
//       const response = await apiCall(`/resources/${resourceId}/like`, {
//         method: "POST",
//       });
//       if (response.success) {
//         toast.success("Liked!");
//         fetchResource();
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to like");
//     }
//   };

//   const handleRequest = () => {
//     if (!user) {
//       toast.error("Please login to request");
//       router.push("/login");
//       return;
//     }
//     router.push(`/request/${resourceId}`);
//   };

//   const getPriceDisplay = () => {
//     if (!resource) return "";
//     if (resource.priceType === "free") return "Free";
//     if (resource.priceType === "deposit") return `$${resource.deposit} deposit`;
//     if (resource.priceType === "barter") return "Barter / Trade";
//     return `$${resource.price}/${resource.priceUnit || "day"}`;
//   };

//   if (loading) {
//     return (
//       <>
//         <AnnouncementBar />
//         <Header />
//         <div className="min-h-screen flex items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-green-500" />
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (!resource) {
//     return (
//       <>
//         <AnnouncementBar />
//         <Header />
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Resource not found
//             </h2>
//             <Button onClick={() => router.back()}>Go Back</Button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Toaster position="top-right" />
//       <AnnouncementBar />
//       <Header />
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
//           {/* Back button */}
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
//           >
//             <ChevronLeft className="h-5 w-5" />
//             Back
//           </button>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left column - Images */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                 <div className="relative h-96 bg-gray-100">
//                   {resource.images && resource.images.length > 0 ? (
//                     <img
//                       src={resource.images[0].url}
//                       alt={resource.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Package className="h-20 w-20 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//                 {resource.images && resource.images.length > 1 && (
//                   <div className="flex gap-2 p-4 overflow-x-auto">
//                     {resource.images.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img.url}
//                         alt={`${resource.title} - ${idx + 1}`}
//                         className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right column - Details */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {resource.title}
//                   </h1>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleBookmark}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Save to wishlist"
//                     >
//                       <Bookmark className="h-5 w-5 text-gray-500" />
//                     </button>
//                     <button
//                       onClick={handleLike}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Like"
//                     >
//                       <Heart className="h-5 w-5 text-gray-500" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Share"
//                     >
//                       <Share2 className="h-5 w-5 text-gray-500" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Report"
//                     >
//                       <Flag className="h-5 w-5 text-gray-500" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 mb-4">
//                   <Badge variant="success">
//                     {resource.status || "Available"}
//                   </Badge>
//                   {resource.isVerified && (
//                     <Badge variant="primary">Verified</Badge>
//                   )}
//                 </div>

//                 <div className="text-3xl font-bold text-green-600 mb-4">
//                   {getPriceDisplay()}
//                 </div>

//                 <div className="space-y-3 text-gray-600 mb-6">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4" />
//                     <span>{resource.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     <span>Posted by {resource.owner?.fullName}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     <span>
//                       Posted {new Date(resource.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Eye className="h-4 w-4" />
//                     <span>{resource.views || 0} views</span>
//                   </div>
//                 </div>

//                 <Button
//                   variant="primary"
//                   fullWidth
//                   onClick={handleRequest}
//                   disabled={resource.status !== "available"}
//                 >
//                   <MessageCircle className="h-4 w-4 mr-2" />
//                   {resource.status === "available"
//                     ? "Request to Borrow"
//                     : "Not Available"}
//                 </Button>
//               </div>

//               {/* Owner info */}
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h3 className="font-semibold text-gray-900 mb-4">
//                   About the Owner
//                 </h3>
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
//                     {resource.owner?.fullName?.charAt(0) || "U"}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       {resource.owner?.fullName}
//                     </p>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
//                       <span className="text-sm text-gray-600">
//                         {resource.owner?.rating || "New"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   fullWidth
//                   onClick={() => router.push(`/profile/${resource.owner?._id}`)}
//                 >
//                   View Profile
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Description section */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Description
//             </h2>
//             <p className="text-gray-700 whitespace-pre-wrap">
//               {resource.description}
//             </p>
//           </div>

//           {/* Similar resources */}
//           {similarResources.length > 0 && (
//             <div className="mt-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Similar Resources
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {similarResources.map((item) => (
//                   <div
//                     key={item._id}
//                     onClick={() => router.push(`/resources/${item._id}`)}
//                     className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
//                   >
//                     <h4 className="font-semibold text-gray-900">
//                       {item.title}
//                     </h4>
//                     <p className="text-sm text-gray-500">{item.category}</p>
//                     <p className="text-green-600 font-medium mt-2">
//                       {item.priceType === "free"
//                         ? "Free"
//                         : `$${item.price}/day`}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
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
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Shield,
  Mail,
  ExternalLink,
  ThumbsUp,
  ChevronRight,
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [imageLoaded, setImageLoaded] = useState({});

  const resourceId = params.id;

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/resources/${resourceId}`);
      if (data.success) {
        setResource(data.resource);
        setSimilarResources(data.similar || []);
        if (user) {
          setIsBookmarked(data.resource.bookmarked || false);
          setIsLiked(data.resource.liked || false);
        }
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
      if (isBookmarked) {
        await apiCall(`/wishlist/${resourceId}`, { method: "DELETE" });
        toast.success("Removed from wishlist");
        setIsBookmarked(false);
      } else {
        await apiCall("/wishlist", {
          method: "POST",
          body: JSON.stringify({ resourceId }),
        });
        toast.success("Added to wishlist");
        setIsBookmarked(true);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update bookmark");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      router.push("/login");
      return;
    }
    try {
      if (isLiked) {
        await apiCall(`/resources/${resourceId}/like`, { method: "DELETE" });
        toast.success("Unliked");
        setIsLiked(false);
        setResource((prev) => ({ ...prev, likes: (prev.likes || 0) - 1 }));
      } else {
        await apiCall(`/resources/${resourceId}/like`, { method: "POST" });
        toast.success("Liked!");
        setIsLiked(true);
        setResource((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to like");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
    setShowShareMenu(false);
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      await apiCall(`/resources/${resourceId}/report`, {
        method: "POST",
        body: JSON.stringify({ reason: reportReason, details: reportDetails }),
      });
      toast.success("Report submitted. Our team will review it.");
      setShowReportModal(false);
      setReportReason("");
      setReportDetails("");
    } catch (error) {
      toast.error(error.message || "Failed to submit report");
    }
  };

  const handleRequest = () => {
    if (!user) {
      toast.error("Please login to request");
      router.push("/login");
      return;
    }
    if (resource.status !== "available") {
      toast.error("This item is not available for request");
      return;
    }
    router.push(`/request/${resourceId}`);
  };

  const handleContactOwner = () => {
    if (!user) {
      toast.error("Please login to contact");
      router.push("/login");
      return;
    }
    router.push(`/messages?userId=${resource.owner?._id}`);
  };

  const getPriceDisplay = () => {
    if (!resource) return "";
    if (resource.priceType === "free") return "Free";
    if (resource.priceType === "deposit") return `$${resource.deposit} deposit`;
    if (resource.priceType === "barter") return "Barter / Trade";
    return `$${resource.price}/${resource.priceUnit || "day"}`;
  };

  const getConditionBadge = () => {
    const conditions = {
      excellent: { color: "success", label: "Excellent" },
      good: { color: "info", label: "Good" },
      fair: { color: "warning", label: "Fair" },
      damaged: { color: "danger", label: "Damaged" },
    };
    const cond = conditions[resource?.condition] || {
      color: "default",
      label: resource?.condition || "Good",
    };
    return <Badge variant={cond.color}>{cond.label}</Badge>;
  };

  const nextImage = () => {
    if (resource?.images && currentImageIndex < resource.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleImageLoad = (idx) => {
    setImageLoaded((prev) => ({ ...prev, [idx]: true }));
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resource not found
            </h2>
            <Button onClick={() => router.push("/browse")}>
              Browse Resources
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hasImages = resource.images && resource.images.length > 0;
  const canRequest = resource.status === "available";
  const isOwner = user?._id === resource.owner?._id;
  const mainImage = hasImages ? resource.images[currentImageIndex] : null;

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
            {/* Left column - Perfect Images Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Main Image Container - Fixed aspect ratio */}
                <div className="relative w-full pt-[100%] bg-gray-100">
                  {hasImages ? (
                    <>
                      {/* Loading skeleton */}
                      {!imageLoaded[currentImageIndex] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                        </div>
                      )}
                      {/* Main Image - Object Cover for perfect fit */}
                      <img
                        src={mainImage?.url}
                        alt={resource.title}
                        onLoad={() => handleImageLoad(currentImageIndex)}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoaded[currentImageIndex]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {/* Image Navigation Arrows */}
                      {resource.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={
                              currentImageIndex === resource.images.length - 1
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          {/* Image Counter */}
                          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 rounded-lg text-white text-xs z-10">
                            {currentImageIndex + 1} / {resource.images.length}
                          </div>

                          {/* Dot Indicators */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                            {resource.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`transition-all ${
                                  idx === currentImageIndex
                                    ? "w-6 h-2 bg-white rounded-full"
                                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/75"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery - Fixed size images */}
                {hasImages && resource.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t">
                    {resource.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? "border-green-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${resource.title} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === currentImageIndex && (
                          <div className="absolute inset-0 bg-green-500/20" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Details (same as before) */}
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resource.title}
                  </h1>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={handleBookmark}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={
                        isBookmarked
                          ? "Remove from wishlist"
                          : "Save to wishlist"
                      }
                    >
                      <Bookmark
                        className={`h-5 w-5 ${isBookmarked ? "fill-amber-500 text-amber-500" : "text-gray-500"}`}
                      />
                    </button>
                    <button
                      onClick={handleLike}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-5 w-5 text-gray-500" />
                      </button>
                      {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                          <button
                            onClick={handleShare}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            Copy Link
                          </button>
                          <button
                            onClick={() => {
                              setShowShareMenu(false);
                              setShowReportModal(true);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                          >
                            Report Listing
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant={
                      resource.status === "available" ? "success" : "warning"
                    }
                  >
                    {resource.status === "available"
                      ? "Available"
                      : resource.status === "borrowed"
                        ? "Currently Borrowed"
                        : resource.status}
                  </Badge>
                  {resource.isVerified && (
                    <Badge
                      variant="primary"
                      icon={<CheckCircle className="h-3 w-3" />}
                    >
                      Verified
                    </Badge>
                  )}
                  {getConditionBadge()}
                  {resource.isTrending && (
                    <Badge
                      variant="warning"
                      icon={<Award className="h-3 w-3" />}
                    >
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {getPriceDisplay()}
                </div>

                {/* Details Grid */}
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>by {resource.owner?.fullName}</span>
                    {resource.owner?.trustScore > 80 && (
                      <Badge
                        variant="success"
                        size="small"
                        icon={<Shield className="h-3 w-3" />}
                      >
                        Trusted
                      </Badge>
                    )}
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
                  {resource.likes > 0 && (
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{resource.likes} people like this</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwner ? (
                  <>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleRequest}
                      disabled={!canRequest}
                      className="mb-3"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {canRequest ? "Request to Borrow" : "Not Available"}
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleContactOwner}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Owner
                    </Button>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">This is your own listing</p>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() =>
                        router.push(`/resources/${resourceId}/edit`)
                      }
                      className="mt-2"
                    >
                      Edit Listing
                    </Button>
                  </div>
                )}
              </div>

              {/* Owner Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About the Owner
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {resource.owner?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {resource.owner?.fullName}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {resource.owner?.rating
                          ? resource.owner.rating.toFixed(1)
                          : "New"}
                      </span>
                      {resource.owner?.totalReviews > 0 && (
                        <span className="text-xs text-gray-400 ml-1">
                          ({resource.owner.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {resource.owner?.joinedDate && (
                    <p>
                      Member since{" "}
                      {new Date(resource.owner.joinedDate).toLocaleDateString()}
                    </p>
                  )}
                  {resource.owner?.successfulExchanges > 0 && (
                    <p className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-green-500" />
                      {resource.owner.successfulExchanges} successful exchanges
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push(`/profile/${resource.owner?._id}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Similar Resources with perfect images */}
          {similarResources.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Similar Resources You Might Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {similarResources.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/resources/${item._id}`)}
                    className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className="flex gap-3">
                      {/* Fixed size image for similar items */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {item.images?.[0]?.url ? (
                          <img
                            src={item.images[0].url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-green-600 font-medium mt-1">
                          {item.priceType === "free"
                            ? "Free"
                            : `$${item.price}/${item.priceUnit || "day"}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal - same as before */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Report Listing
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reason *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam or misleading</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="scam">Scam or fraud</option>
                  <option value="offensive">Offensive language</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Please provide more information..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleReport}
                  variant="danger"
                  className="flex-1"
                >
                  Submit Report
                </Button>
                <Button
                  onClick={() => setShowReportModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}