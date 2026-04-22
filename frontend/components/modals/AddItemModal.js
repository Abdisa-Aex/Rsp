"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, Loader2, Plus, Trash2 } from "lucide-react";
// import Modal from "../ui/Modal";
import Modal from "components/ui/Modal";
// import Button from "../ui/Button";
import Button from "components/ui/Button";

const AddItemModal = ({ isOpen, onClose, onAdd, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    condition: "good",
    priceType: "free",
    price: "",
    priceUnit: "day",
    location: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categories = [
    "Tools",
    "Gardening",
    "Kitchen",
    "Books",
    "Electronics",
    "Furniture",
    "Sports",
    "Music",
    "Art",
    "Business",
    "Education",
  ];

  const conditions = [
    { value: "excellent", label: "Excellent - Like new" },
    { value: "good", label: "Good - Light wear" },
    { value: "fair", label: "Fair - Visible wear" },
    { value: "poor", label: "Poor - Needs repair" },
  ];

  const priceTypes = [
    { value: "free", label: "Free" },
    { value: "rental", label: "Rental (per day)" },
    { value: "deposit", label: "Deposit only" },
    { value: "barter", label: "Barter / Trade" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (!formData.location) newErrors.location = "Location is required";
    if (
      formData.priceType === "rental" &&
      (!formData.price || parseFloat(formData.price) <= 0)
    ) {
      newErrors.price = "Valid price is required for rental items";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 5 - imagePreviews.length);

    newImages.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("category", formData.category);
    submitData.append("description", formData.description);
    submitData.append("condition", formData.condition);
    submitData.append("priceType", formData.priceType);
    submitData.append("location", formData.location);
    if (formData.priceType === "rental") {
      submitData.append("price", formData.price);
      submitData.append("priceUnit", formData.priceUnit);
    }
    formData.images.forEach((image, index) => {
      submitData.append("images", image);
    });

    onAdd(submitData);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      condition: "good",
      priceType: "free",
      price: "",
      priceUnit: "day",
      location: "",
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share a Resource"
      size="lg"
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto px-1">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${
              errors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="e.g., Professional Power Drill Set"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
            >
              {conditions.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Describe your item in detail... (min 20 characters)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Price Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pricing
          </label>
          <div className="grid grid-cols-4 gap-2">
            {priceTypes.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, priceType: pt.value })
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.priceType === pt.value
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price (if rental) */}
        {formData.priceType === "rental" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${
                  errors.price
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Unit
              </label>
              <select
                value={formData.priceUnit}
                onChange={(e) =>
                  setFormData({ ...formData, priceUnit: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
              >
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
              </select>
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 ${
              errors.location
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="e.g., Downtown, Library, Room 203"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Photos (Max 5)
          </label>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-500 transition-colors"
              >
                <Camera className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">
            Upload up to 5 images (JPG, PNG, max 5MB each)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "Sharing..." : "Share Resource"}
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddItemModal;
