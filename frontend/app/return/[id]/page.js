// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Camera,
//   Upload,
//   X,
//   Check,
//   Trash2,
//   Package,
//   User,
//   MapPin,
//   DollarSign,
//   Star,
//   MessageCircle,
//   Phone,
//   Mail,
//   Shield,
//   Flag,
//   Heart,
//   Bookmark,
//   Share2,
//   Eye,
//   Edit,
//   Plus,
//   Minus,
//   ChevronDown,
//   ChevronUp,
//   ChevronRight,
//   ChevronLeft,
//   Menu,
//   Search,
//   Filter,
//   Settings,
//   LogOut,
//   HelpCircle,
//   Info,
// } from "lucide-react";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import AnnouncementBar from "@/components/layout/AnnouncementBar";

// // Condition Selector Component
// const ConditionSelector = ({ value, onChange }) => {
//   const conditions = [
//     {
//       value: "excellent",
//       label: "Excellent",
//       description: "Like new, no signs of wear",
//       color: "text-green-600",
//       bg: "bg-green-50",
//     },
//     {
//       value: "good",
//       label: "Good",
//       description: "Light wear, fully functional",
//       color: "text-blue-600",
//       bg: "bg-blue-50",
//     },
//     {
//       value: "fair",
//       label: "Fair",
//       description: "Visible wear, minor issues",
//       color: "text-yellow-600",
//       bg: "bg-yellow-50",
//     },
//     {
//       value: "damaged",
//       label: "Damaged",
//       description: "Significant wear or damage",
//       color: "text-red-600",
//       bg: "bg-red-50",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//       {conditions.map((condition) => (
//         <button
//           key={condition.value}
//           type="button"
//           onClick={() => onChange(condition.value)}
//           className={`p-4 rounded-xl border-2 text-left transition-all ${
//             value === condition.value
//               ? `${condition.bg} border-${condition.value === "excellent" ? "green" : condition.value === "good" ? "blue" : condition.value === "fair" ? "yellow" : "red"}-500`
//               : "border-gray-200 hover:border-gray-300"
//           }`}
//         >
//           <div className={`font-medium ${condition.color}`}>
//             {condition.label}
//           </div>
//           <div className="text-xs text-gray-500 mt-1">
//             {condition.description}
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// };

// // Photo Upload Component
// const PhotoUpload = ({ photos, onAdd, onRemove }) => {
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach((file) => {
//       if (file.size > 5 * 1024 * 1024) {
//         alert("Photo size should be less than 5MB");
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         onAdd({ url: reader.result, file });
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <label className="block text-sm font-medium text-gray-700">
//           Return Photos (Optional)
//         </label>
//         <span className="text-xs text-gray-500">{photos.length}/5 photos</span>
//       </div>

//       <label className="cursor-pointer block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
//         <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//         <p className="text-sm text-gray-600">
//           Click to upload photos of the items condition
//         </p>
//         <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 5MB each</p>
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           className="hidden"
//           onChange={handleFileChange}
//         />
//       </label>

//       {photos.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {photos.map((photo, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={photo.url}
//                 alt={`Return photo ${index + 1}`}
//                 className="w-full h-24 object-cover rounded-lg"
//               />
//               <button
//                 onClick={() => onRemove(index)}
//                 className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Return Page Component
// export default function ReturnPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params;
//   const { user, apiCall, isAuthenticated } = useAuth();

//   const [exchange, setExchange] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [condition, setCondition] = useState("good");
//   const [notes, setNotes] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   // Load exchange details
//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push(`/login?redirect=/return/${id}`);
//       return;
//     }

//     loadExchange();
//   }, [id, isAuthenticated]);

//   const loadExchange = async () => {
//     try {
//       const data = await apiCall(`/exchanges/${id}`);
//       if (data.success) {
//         setExchange(data.exchange);
//       } else {
//         setError(data.message || "Exchange not found");
//       }
//     } catch (error) {
//       setError("Failed to load exchange details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddPhoto = (photo) => {
//     if (photos.length >= 5) {
//       alert("Maximum 5 photos allowed");
//       return;
//     }
//     setPhotos([...photos, photo]);
//   };

//   const handleRemovePhoto = (index) => {
//     setPhotos(photos.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setError("");

//     try {
//       // Upload photos first if any
//       const uploadedPhotos = [];
//       for (const photo of photos) {
//         if (photo.file) {
//           const formData = new FormData();
//           formData.append("file", photo.file);
//           const uploadRes = await apiCall("/upload/single", {
//             method: "POST",
//             body: formData,
//             headers: {},
//           });
//           if (uploadRes.success) {
//             uploadedPhotos.push(uploadRes.url);
//           }
//         } else {
//           uploadedPhotos.push(photo.url);
//         }
//       }

//       const data = await apiCall(`/exchanges/${id}/return`, {
//         method: "POST",
//         body: JSON.stringify({
//           condition,
//           notes,
//           photos: uploadedPhotos,
//         }),
//       });

//       if (data.success) {
//         setSuccess(true);
//         setTimeout(() => {
//           router.push("/dashboard?tab=exchanges");
//         }, 2000);
//       } else {
//         setError(data.message || "Failed to process return");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
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

//   if (error && !exchange) {
//     return (
//       <>
//         <AnnouncementBar />
//         <Header />
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Exchange Not Found
//             </h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <Link
//               href="/dashboard"
//               className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//             >
//               Back to Dashboard
//             </Link>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <AnnouncementBar />
//       <Header />
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
//           {/* Header */}
//           <div className="mb-8">
//             <Link
//               href="/dashboard"
//               className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Dashboard
//             </Link>
//             <h1 className="text-3xl font-bold text-gray-900">Return Item</h1>
//             <p className="text-gray-600 mt-2">
//               Please provide details about the items condition when returning
//             </p>
//           </div>

//           {success ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200"
//             >
//               <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Return Submitted!
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Your return request has been submitted. The owner will be
//                 notified.
//               </p>
//               <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-green-500 rounded-full animate-progress"
//                   style={{ width: "100%" }}
//                 />
//               </div>
//               <p className="text-sm text-gray-500 mt-4">
//                 Redirecting to dashboard...
//               </p>
//             </motion.div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               {/* Item Details */}
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Item Details
//                 </h2>
//                 <div className="flex items-start gap-4">
//                   {exchange?.resource?.images?.[0] && (
//                     <img
//                       src={exchange.resource.images[0].url}
//                       alt={exchange.resource.title}
//                       className="w-20 h-20 object-cover rounded-lg"
//                     />
//                   )}
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">
//                       {exchange?.resource?.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {exchange?.resource?.category}
//                     </p>
//                     <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <Calendar className="h-3 w-3" />
//                         Borrowed:{" "}
//                         {new Date(exchange?.startDate).toLocaleDateString()}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         Due: {new Date(exchange?.endDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Form */}
//               <div className="p-6 space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Item Condition *
//                   </label>
//                   <ConditionSelector
//                     value={condition}
//                     onChange={setCondition}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Return Notes (Optional)
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="Describe the condition of the item or any additional notes..."
//                   />
//                 </div>

//                 <PhotoUpload
//                   photos={photos}
//                   onAdd={handleAddPhoto}
//                   onRemove={handleRemovePhoto}
//                 />

//                 {error && (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//                     <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//                     <p className="text-red-700">{error}</p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={submitting}
//                     className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {submitting ? (
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                     ) : (
//                       <CheckCircle className="h-5 w-5" />
//                     )}
//                     {submitting ? "Submitting..." : "Submit Return"}
//                   </button>
//                   <Link
//                     href="/dashboard"
//                     className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </Link>
//                 </div>
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

// Condition Selector Component (from first version - better UI)
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
      if (response.success) setExchange(response.exchange);
    } catch (error) {
      toast.error("Failed to load exchange");
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
        toast.success("Item returned successfully!");
        router.push(`/exchanges/${id}`);
      }
    } catch (error) {
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
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3 w-3" />
                      Owner: {exchange.owner?.fullName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Condition - Using better UI from first version */}
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