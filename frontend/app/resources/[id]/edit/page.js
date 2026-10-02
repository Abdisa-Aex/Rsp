"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import AnnouncementBar from "components/layout/AnnouncementBar";
import { Loader2, ArrowLeft, X, Plus, Upload, Trash2 } from "lucide-react";
import Button from "components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priceType: "free",
    price: "",
    deposit: "",
    priceUnit: "day",
    condition: "good",
    status: "available",
    tags: [],
    availabilityStart: "",
    availabilityEnd: "",
    existingImages: [],
  });

  const [newImages, setNewImages] = useState([]);
  const resourceId = params.id;

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await apiCall(`/resources/${resourceId}`);
      if (response.success) {
        const resource = response.resource;
        setFormData({
          title: resource.title || "",
          description: resource.description || "",
          category: resource.category || "",
          location: resource.location || "",
          priceType: resource.priceType || "free",
          price: resource.price || "",
          deposit: resource.deposit || "",
          priceUnit: resource.priceUnit || "day",
          condition: resource.condition || "good",
          status: resource.status || "available",
          tags: resource.tags || [],
          availabilityStart:
            resource.availabilityDates?.start?.split("T")[0] || "",
          availabilityEnd: resource.availabilityDates?.end?.split("T")[0] || "",
          existingImages: resource.images || [],
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

 const handleImageUpload = async (e) => {
   const files = Array.from(e.target.files);
   if (files.length === 0) return;

   setUploadingImages(true);
   const formData = new FormData();
   files.forEach((file) => formData.append("images", file));

   try {
     const token = localStorage.getItem("token");

     // Direct fetch - not using apiCall
     const response = await fetch("http://localhost:5000/api/upload/resource", {
       method: "POST",
       headers: {
         "x-auth-token": token,
         // NO Content-Type header - let browser set it
       },
       body: formData,
     });

     const data = await response.json();

     if (data.success) {
       setNewImages([...newImages, ...data.images]);
       setHasChanges(true);
       toast.success(`${data.images.length} image(s) uploaded`);
     } else {
       toast.error(data.message || "Failed to upload images");
     }
   } catch (error) {
     console.error("Upload error:", error);
     toast.error(error.message || "Failed to upload images");
   } finally {
     setUploadingImages(false);
     e.target.value = "";
   }
 };

  const removeExistingImage = (publicId) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter(
        (img) => img.publicId !== publicId,
      ),
    });
    setHasChanges(true);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const addTag = () => {
    const input = document.getElementById("tagInput");
    const tag = input.value.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setHasChanges(true);
      input.value = "";
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    setHasChanges(true);
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this resource? This action cannot be undone.",
      )
    ) {
      try {
        const response = await apiCall(`/resources/${resourceId}`, {
          method: "DELETE",
        });
        if (response.success) {
          toast.success("Resource deleted successfully");
          router.push("/profile?tab=items");
        } else {
          toast.error(response.message || "Failed to delete");
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete");
      }
    }
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setSubmitting(true);

   try {
     const updateData = {
       title: formData.title,
       description: formData.description,
       category: formData.category,
       location: formData.location,
       priceType: formData.priceType,
       condition: formData.condition,
       status: formData.status,
       tags: formData.tags,
       availabilityStart: formData.availabilityStart || null,
       availabilityEnd: formData.availabilityEnd || null,
       // Send the new images that were uploaded
       newImages: newImages, // ← THIS IS IMPORTANT
     };

     if (formData.priceType === "rental") {
       updateData.price = parseFloat(formData.price) || 0;
       updateData.priceUnit = formData.priceUnit;
     }

     if (formData.priceType === "deposit") {
       updateData.deposit = parseFloat(formData.deposit) || 0;
     }

     console.log("Updating with new images:", newImages); // Debug log

     const response = await apiCall(`/resources/${resourceId}`, {
       method: "PUT",
       body: JSON.stringify(updateData),
     });

     if (response.success) {
       toast.success("Resource updated successfully!");
       setHasChanges(false);
      //  router.push(`/resources/${resourceId}`);
      router.push("/dashboard?tab=my-items");
     } else {
       toast.error(response.message || "Failed to update");
     }
   } catch (error) {
     console.error("Update error:", error);
     toast.error(error.message || "Failed to update");
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

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Resource
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {/* Existing Images */}
                    {formData.existingImages?.map((img, idx) => (
                      <div
                        key={img.publicId || idx}
                        className="relative w-20 h-20"
                      >
                        <img
                          src={img.url}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.publicId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {/* New Images */}
                    {newImages.map((img, idx) => (
                      <div key={`new-${idx}`} className="relative w-20 h-20">
                        <img
                          src={img.url}
                          alt={`New ${idx + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="w-full text-sm"
                  />
                  {uploadingImages && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="tagInput"
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Type
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="free">Free</option>
                  <option value="rental">Rental</option>
                  <option value="deposit">Deposit</option>
                  <option value="barter">Barter</option>
                </select>
              </div>

              {/* Rental Fields */}
              {formData.priceType === "rental" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per day
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Unit
                    </label>
                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="day">Per Day</option>
                      <option value="week">Per Week</option>
                      <option value="month">Per Month</option>
                    </select>
                  </div>
                </>
              )}

              {/* Deposit Field */}
              {formData.priceType === "deposit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Amount
                  </label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs_repair">Needs Repair</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Availability Dates */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Availability Dates (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="availabilityStart"
                      value={formData.availabilityStart}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="availabilityEnd"
                      value={formData.availabilityEnd}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>

            {/* Delete Button */}
            <div className="mt-8 border-t pt-6">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Resource
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Warning: This action cannot be undone. All data will be
                permanently removed.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
