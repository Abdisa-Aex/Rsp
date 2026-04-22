// "use client";

// import { useState, useRef } from "react";
// import {
//   User,
//   Mail,
//   MapPin,
//   Calendar,
//   Star,
//   Edit,
//   Shield,
//   Award,
//   Zap,
//   Users,
//   Camera,
//   X,
//   Check,
//   Share2,
//   MoreVertical,
//   BarChart3,
//   Package,
//   Heart,
//   Clock,
//   TrendingUp,
//   Target,
// } from "lucide-react";
// import Badge from "components/ui/Badge";
// import Button from "components/ui/Button";
// import ImageWithFallback from "components/ui/ImageWithFallback";

// const ProfileHeader = ({
//   userData,
//   isEditing,
//   setIsEditing,
//   imagePreview,
//   uploading,
//   triggerFileInput,
//   handleRemoveImage,
//   handleSaveProfile,
//   setShowShareModal,
//   fileInputRef,
//   dropzoneRef,
//   getInitials,
//   onUpdateUser,
// }) => {
//   const [localUserData, setLocalUserData] = useState(userData);
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);
//     await handleSaveProfile(localUserData);
//     setIsSaving(false);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setLocalUserData(userData);
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
//         {/* Avatar with drag & drop */}
//         <div className="relative">
//           <div
//             ref={dropzoneRef}
//             className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed ${
//               uploading
//                 ? "border-blue-500"
//                 : "border-gray-300 dark:border-gray-600"
//             } overflow-hidden cursor-pointer`}
//             onClick={triggerFileInput}
//           >
//             {imagePreview ? (
//               <img
//                 src={imagePreview}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
//                 {getInitials(localUserData.name)}
//               </div>
//             )}

//             {uploading && (
//               <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                 <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               </div>
//             )}
//           </div>

//           {/* Camera/Upload button */}
//           <button
//             onClick={triggerFileInput}
//             disabled={uploading}
//             className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white dark:bg-gray-800 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
//           >
//             <Camera className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-400" />
//           </button>

//           {/* Remove image button */}
//           {imagePreview && !uploading && (
//             <button
//               onClick={handleRemoveImage}
//               className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
//             >
//               <X className="h-2 w-2 md:h-3 md:w-3" />
//             </button>
//           )}

//           {/* Hidden file input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={() => {}}
//             className="hidden"
//           />
//         </div>

//         {/* User Info */}
//         <div className="flex-1">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
//             <div className="flex-1">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={localUserData.name}
//                     onChange={(e) =>
//                       setLocalUserData({
//                         ...localUserData,
//                         name: e.target.value,
//                       })
//                     }
//                     className="text-2xl md:text-3xl font-bold border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full bg-transparent dark:text-white"
//                   />
//                 ) : (
//                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//                     {localUserData.name}
//                   </h1>
//                 )}
//                 {userData.verified && (
//                   <Badge
//                     variant="success"
//                     className="flex items-center gap-1 w-fit"
//                   >
//                     <Shield className="h-3 w-3" />
//                     Verified
//                   </Badge>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 text-gray-600 dark:text-gray-400 mb-4">
//                 <div className="flex items-center gap-1">
//                   <Mail className="h-4 w-4" />
//                   {isEditing ? (
//                     <input
//                       type="email"
//                       value={localUserData.email}
//                       onChange={(e) =>
//                         setLocalUserData({
//                           ...localUserData,
//                           email: e.target.value,
//                         })
//                       }
//                       className="border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 flex-1 bg-transparent"
//                     />
//                   ) : (
//                     <span className="truncate">{localUserData.email}</span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <MapPin className="h-4 w-4" />
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={localUserData.location}
//                       onChange={(e) =>
//                         setLocalUserData({
//                           ...localUserData,
//                           location: e.target.value,
//                         })
//                       }
//                       className="border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500"
//                     />
//                   ) : (
//                     localUserData.location
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   Member since {localUserData.joinDate}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-4 md:mt-0">
//               {isEditing ? (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={handleCancel}
//                     size="small"
//                     className="whitespace-nowrap"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="primary"
//                     onClick={handleSave}
//                     size="small"
//                     className="whitespace-nowrap"
//                     disabled={isSaving}
//                   >
//                     {isSaving ? (
//                       <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <Check className="h-4 w-4 mr-2" />
//                     )}
//                     {isSaving ? "Saving..." : "Save"}
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={() => setIsEditing(true)}
//                     size="small"
//                     className="whitespace-nowrap"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     onClick={() => setShowShareModal(true)}
//                     size="small"
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Rating & Badges */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 md:h-5 md:w-5 ${
//                       i < Math.floor(localUserData.rating)
//                         ? "text-yellow-400 fill-yellow-400"
//                         : i < localUserData.rating
//                           ? "text-yellow-400 fill-yellow-400 opacity-50"
//                           : "text-gray-300 dark:text-gray-600"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
//                 {localUserData.rating}
//               </span>
//               <span className="text-gray-600 dark:text-gray-400 text-sm">
//                 ({localUserData.reviews} reviews)
//               </span>
//             </div>

//             {/* Badges */}
//             <div className="flex flex-wrap gap-2">
//               {localUserData.badges?.map((badge) => {
//                 const Icon = badge.icon;
//                 return (
//                   <Badge
//                     key={badge.id}
//                     variant="outline"
//                     className={`${badge.color} text-xs`}
//                   >
//                     <Icon className="h-3 w-3 mr-1" />
//                     {badge.name}
//                   </Badge>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Bio & Interests */}
//           <div className="space-y-4">
//             <div>
//               {isEditing ? (
//                 <>
//                   <textarea
//                     value={localUserData.bio}
//                     onChange={(e) =>
//                       setLocalUserData({
//                         ...localUserData,
//                         bio: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-transparent dark:text-white"
//                     rows="3"
//                     placeholder="Tell us about yourself..."
//                   />
//                   <div className="mt-3">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Interests (comma-separated)
//                     </label>
//                     <input
//                       type="text"
//                       value={localUserData.interests?.join(", ")}
//                       onChange={(e) =>
//                         setLocalUserData({
//                           ...localUserData,
//                           interests: e.target.value
//                             .split(",")
//                             .map((i) => i.trim())
//                             .filter((i) => i),
//                         })
//                       }
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-transparent dark:text-white"
//                       placeholder="e.g., DIY, Gardening, Cooking"
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
//                     {localUserData.bio}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {localUserData.interests?.map((interest, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="text-xs"
//                       >
//                         {interest}
//                       </Badge>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;
"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Star,
  Edit,
  Shield,
  Award,
  Zap,
  Users,
  Camera,
  X,
  Check,
  Share2,
  MoreVertical,
  BarChart3,
  Package,
  Heart,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import Badge from "components/ui/Badge";
import Button from "components/ui/Button";
import ImageWithFallback from "components/ui/ImageWithFallback";

// Helper function with null check
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ProfileHeader = ({
  userData,
  isEditing,
  setIsEditing,
  onAvatarUpload,
  uploadingAvatar,
  onShare,
  onUpdateUser,
}) => {
  // Initialize with safe default values
  const [localUserData, setLocalUserData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    interests: [],
    rating: 0,
    reviews: 0,
    badges: [],
    verified: false,
    joinDate: "",
    ...userData,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setLocalUserData((prev) => ({
        ...prev,
        name: userData.fullName || userData.name || "",
        email: userData.email || "",
        location: userData.location || "",
        bio: userData.bio || "",
        interests: userData.interests || [],
        rating: userData.rating || 0,
        reviews: userData.totalRatings || 0,
        badges: userData.badges || [],
        verified: userData.isVerified || false,
        joinDate: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString()
          : "N/A",
        avatar: userData.avatar || null,
      }));
    }
  }, [userData]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onAvatarUpload?.(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        fullName: localUserData.name,
        bio: localUserData.bio,
        location: localUserData.location,
        interests: localUserData.interests,
      };
      await onUpdateUser?.(updates);
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original userData
    if (userData) {
      setLocalUserData({
        name: userData.fullName || userData.name || "",
        email: userData.email || "",
        location: userData.location || "",
        bio: userData.bio || "",
        interests: userData.interests || [],
        rating: userData.rating || 0,
        reviews: userData.totalRatings || 0,
        badges: userData.badges || [],
        verified: userData.isVerified || false,
        joinDate: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString()
          : "N/A",
        avatar: userData.avatar || null,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
        {/* Avatar with drag & drop */}
        <div className="relative">
          <div
            ref={dropzoneRef}
            className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed ${
              uploadingAvatar
                ? "border-blue-500"
                : "border-gray-300 dark:border-gray-600"
            } overflow-hidden cursor-pointer`}
            onClick={triggerFileInput}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : localUserData.avatar ? (
              <img
                src={localUserData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
                {getInitials(localUserData.name)}
              </div>
            )}

            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Camera/Upload button */}
          <button
            onClick={triggerFileInput}
            disabled={uploadingAvatar}
            className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white dark:bg-gray-800 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Camera className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Remove image button */}
          {imagePreview && !uploadingAvatar && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
            >
              <X className="h-2 w-2 md:h-3 md:w-3" />
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={localUserData.name}
                    onChange={(e) =>
                      setLocalUserData({
                        ...localUserData,
                        name: e.target.value,
                      })
                    }
                    className="text-2xl md:text-3xl font-bold border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 w-full bg-transparent dark:text-white"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {localUserData.name || "User"}
                  </h1>
                )}
                {localUserData.verified && (
                  <Badge
                    variant="success"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={localUserData.email}
                      onChange={(e) =>
                        setLocalUserData({
                          ...localUserData,
                          email: e.target.value,
                        })
                      }
                      className="border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 flex-1 bg-transparent"
                    />
                  ) : (
                    <span className="truncate">
                      {localUserData.email || "No email"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={localUserData.location || ""}
                      onChange={(e) =>
                        setLocalUserData({
                          ...localUserData,
                          location: e.target.value,
                        })
                      }
                      className="border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500"
                    />
                  ) : (
                    localUserData.location || "No location set"
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {localUserData.joinDate}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size="small"
                    className="whitespace-nowrap"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    size="small"
                    className="whitespace-nowrap"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    size="small"
                    className="whitespace-nowrap"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={onShare} size="small">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Rating & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 md:h-5 md:w-5 ${
                      i < Math.floor(localUserData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < localUserData.rating
                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                          : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {localUserData.rating}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                ({localUserData.reviews} reviews)
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {localUserData.badges?.map((badge, index) => {
                const Icon = badge.icon || Award;
                return (
                  <Badge
                    key={badge.id || index}
                    variant="outline"
                    className="text-xs"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {badge.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Bio & Interests */}
          <div className="space-y-4">
            <div>
              {isEditing ? (
                <>
                  <textarea
                    value={localUserData.bio || ""}
                    onChange={(e) =>
                      setLocalUserData({
                        ...localUserData,
                        bio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-transparent dark:text-white"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interests (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={localUserData.interests?.join(", ") || ""}
                      onChange={(e) =>
                        setLocalUserData({
                          ...localUserData,
                          interests: e.target.value
                            .split(",")
                            .map((i) => i.trim())
                            .filter((i) => i),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-transparent dark:text-white"
                      placeholder="e.g., DIY, Gardening, Cooking"
                    />
                  </div>
                </>
              ) : (
                <>
                  {localUserData.bio && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      {localUserData.bio}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {localUserData.interests?.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;