"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  X,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  Users,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SharePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !user) {
      router.push("/login?redirect=/share");
    }
  }, [isAuthenticated, user, router, authLoading]);

  // Main form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    availability: "available",
    condition: "excellent",
    priceType: "free",
    price: "",
    dailyRate: "",
    weeklyDiscount: "",
    monthlyDiscount: "",
    deposit: "",
    images: [],
    tags: [],
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation & UX state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Availability schedule
  const [availabilitySchedule, setAvailabilitySchedule] = useState({
    monday: { available: true, from: "09:00", to: "17:00" },
    tuesday: { available: true, from: "09:00", to: "17:00" },
    wednesday: { available: true, from: "09:00", to: "17:00" },
    thursday: { available: true, from: "09:00", to: "17:00" },
    friday: { available: true, from: "09:00", to: "17:00" },
    saturday: { available: true, from: "10:00", to: "15:00" },
    sunday: { available: false, from: "", to: "" },
  });

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

  // Navigation steps
  const steps = [
    {
      number: 1,
      label: "Basic Info",
      icon: Tag,
      requiredFields: ["title", "category", "location"],
    },
    {
      number: 2,
      label: "Details",
      icon: Camera,
      requiredFields: ["description"],
    },
    { number: 3, label: "Review", icon: CheckCircle, requiredFields: [] },
  ];

  // ========== VALIDATION FUNCTIONS ==========
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length < 5) {
          newErrors.title = "Title must be at least 5 characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.length < 20) {
          newErrors.description = "Description must be at least 20 characters";
        } else {
          delete newErrors.description;
        }
        break;

      case "location":
        if (!value.trim()) {
          newErrors.location = "Location is required";
        } else {
          delete newErrors.location;
        }
        break;

      case "category":
        if (!value) {
          newErrors.category = "Please select a category";
        } else {
          delete newErrors.category;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // ========== STEP NAVIGATION ==========
  const isStepValid = (stepNumber) => {
    const step = steps[stepNumber - 1];
    return step.requiredFields.every(
      (field) => formData[field] && formData[field].trim(),
    );
  };

  const nextStep = () => {
    if (currentStep < 3 && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ========== IMAGE HANDLING ==========
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const newImages = imageFiles.slice(0, 5 - uploadedImages.length);
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const newImages = imageFiles.slice(0, 5 - uploadedImages.length);
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  // ========== TAGS HANDLING ==========
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && tags.length < 5) {
      setTags((prev) => [...prev, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // ========== LOCATION AUTOCOMPLETE ==========
  useEffect(() => {
    if (formData.location.length > 2) {
      const mockSuggestions = [
        "Downtown, New York",
        "Brooklyn Heights, NY",
        "Manhattan, New York",
        "Queens, New York",
        "Williamsburg, Brooklyn",
        "Chicago, IL",
        "Los Angeles, CA",
        "Seattle, WA",
      ].filter((loc) =>
        loc.toLowerCase().includes(formData.location.toLowerCase()),
      );
      setLocationSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.location]);

  // ========== SAVE DRAFT ==========
  const saveDraft = () => {
    const draft = {
      ...formData,
      tags,
      uploadedImagesLength: uploadedImages.length,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("resourceDraft", JSON.stringify(draft));
    alert("Draft saved successfully! You can continue later.");
  };

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("resourceDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      if (
        window.confirm("You have a saved draft. Would you like to continue?")
      ) {
        setFormData(draft);
        setTags(draft.tags || []);
      }
    }
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      availability: "available",
      condition: "excellent",
      priceType: "free",
      price: "",
      dailyRate: "",
      weeklyDiscount: "",
      monthlyDiscount: "",
      deposit: "",
      images: [],
      tags: [],
    });
    setUploadedImages([]);
    setTags([]);
    setCurrentStep(1);
  };

  // ========== FORM SUBMISSION ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔥 SUBMIT STARTED");
    console.log("Images:", uploadedImages);

    // Validate all steps
    const allValid = steps.every((step) =>
      step.requiredFields.every(
        (field) => formData[field] && formData[field].trim(),
      ),
    );

    if (!allValid) {
      alert("Please fill in all required fields");
      setCurrentStep(1);
      return;
    }

    if (uploadedImages.length === 0) {
      alert("Please upload at least one photo of your resource");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Basic info (match backend expectations)
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("priceType", formData.priceType);
      formDataToSend.append("condition", formData.condition);

      // Handle pricing based on priceType
      if (formData.priceType === "rental") {
        const priceValue = parseFloat(formData.dailyRate) || 0;
        if (priceValue <= 0) {
          alert("Please enter a valid daily rate greater than 0");
          setIsSubmitting(false);
          return;
        }
        formDataToSend.append("price", priceValue.toString());
        formDataToSend.append("priceUnit", "day");

        if (
          formData.weeklyDiscount &&
          parseFloat(formData.weeklyDiscount) > 0
        ) {
          formDataToSend.append("weeklyDiscount", formData.weeklyDiscount);
        }
        if (
          formData.monthlyDiscount &&
          parseFloat(formData.monthlyDiscount) > 0
        ) {
          formDataToSend.append("monthlyDiscount", formData.monthlyDiscount);
        }
        if (formData.deposit && parseFloat(formData.deposit) > 0) {
          formDataToSend.append("deposit", formData.deposit);
        }
      } else if (formData.priceType === "deposit") {
        const depositValue = parseFloat(formData.deposit) || 0;
        if (depositValue <= 0) {
          alert("Please enter a valid deposit amount greater than 0");
          setIsSubmitting(false);
          return;
        }
        formDataToSend.append("deposit", depositValue.toString());
        formDataToSend.append("price", "0");
        formDataToSend.append("priceUnit", "day");
      } else if (formData.priceType === "free") {
        formDataToSend.append("price", "0");
        formDataToSend.append("priceUnit", "day");
        formDataToSend.append("deposit", "0");
      } else if (formData.priceType === "barter") {
        formDataToSend.append("price", "0");
        formDataToSend.append("priceUnit", "day");
      }

      // Tags - send as comma-separated string
      if (tags.length > 0) {
        formDataToSend.append("tags", tags.join(","));
      }

      // Availability schedule - send as JSON string
      formDataToSend.append(
        "availabilitySchedule",
        JSON.stringify(availabilitySchedule),
      );

      // Add images
      uploadedImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Get token
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in to share a resource");
      }

      // Build URL correctly - FIXED: Remove duplicate /api
      const apiUrl = "http://localhost:5000/api/resources";

      console.log("Making request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);

      // Get response as text first for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error(`Server returned: ${responseText.substring(0, 200)}`);
      }

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        localStorage.removeItem("resourceDraft");
      } else {
        // Show validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.msg || err.message)
            .join("\n");
          throw new Error(`Validation failed:\n${errorMessages}`);
        } else {
          throw new Error(
            data.message ||
              data.error ||
              `HTTP ${response.status}: Failed to share resource`,
          );
        }
      }
    } catch (error) {
      console.error("Error sharing resource:", error);
      alert(error.message || "Failed to share resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== RENDER FUNCTIONS ==========
  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Title */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resource Title *
          </label>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <input
              type="text"
              required
              className={`relative w-full px-5 py-4 bg-white border ${errors.title ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 ${errors.title ? "focus:ring-red-500" : "focus:ring-emerald-500"} focus:border-transparent shadow-sm transition-colors`}
              placeholder="e.g., Cordless Power Drill Set, Gardening Tools, or Professional Camera"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
            />
          </div>
          {errors.title && touched.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-500" />
            Category *
          </label>
          <div className="relative group">
            <select
              required
              className={`w-full px-5 py-4 bg-white border ${errors.category ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 ${errors.category ? "focus:ring-red-500" : "focus:ring-emerald-500"} focus:border-transparent appearance-none shadow-sm transition-colors`}
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {errors.category && touched.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            Location *
          </label>
          <div className="relative group">
            <input
              type="text"
              required
              className={`relative w-full px-5 py-4 bg-white border ${errors.location ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 ${errors.location ? "focus:ring-red-500" : "focus:ring-emerald-500"} focus:border-transparent shadow-sm transition-colors`}
              placeholder="Start typing your neighborhood or city..."
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              onFocus={() =>
                formData.location.length > 2 && setShowSuggestions(true)
              }
            />
          </div>
          {errors.location && touched.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
          )}

          {showSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    handleInputChange("location", suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={saveDraft}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isStepValid(1)}
        >
          Continue to Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Detailed Description *
        </label>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <textarea
            rows={6}
            required
            className={`relative w-full px-5 py-4 bg-white border ${errors.description ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 ${errors.description ? "focus:ring-red-500" : "focus:ring-emerald-500"} focus:border-transparent shadow-sm transition-colors resize-none`}
            placeholder="Describe your resource in detail. Include brand, model, condition, usage tips, and any important details..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
          />
        </div>
        {errors.description && touched.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Be specific to attract the right borrowers
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tags (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Add tags like 'power-tools', 'gardening', 'weekend-project'"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag(e)}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={tags.length >= 5}
            className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter or click Add to add tags (max 5)
        </p>
      </div>

      {/* Price & Condition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            Pricing
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "free", label: "Free", desc: "Share for free" },
              { id: "rental", label: "Rental", desc: "Charge per day" },
              { id: "deposit", label: "Deposit", desc: "Refundable deposit" },
              { id: "barter", label: "Barter", desc: "Exchange for something" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, priceType: option.id })
                }
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.priceType === option.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>

          {/* Pricing for Rental */}
          {formData.priceType === "rental" && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Set Rental Price</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Daily Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    value={formData.dailyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyRate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Weekly Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                    value={formData.weeklyDiscount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weeklyDiscount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {formData.dailyRate && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Daily:</span>
                      <span className="font-medium">
                        ${parseFloat(formData.dailyRate || 0).toFixed(2)}
                      </span>
                    </div>
                    {formData.weeklyDiscount && (
                      <div className="flex justify-between">
                        <span>
                          Weekly (with {formData.weeklyDiscount}% discount):
                        </span>
                        <span className="font-medium text-emerald-600">
                          $
                          {(
                            parseFloat(formData.dailyRate || 0) *
                            7 *
                            (1 - parseFloat(formData.weeklyDiscount || 0) / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deposit for deposit type */}
          {formData.priceType === "deposit" && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <label className="text-sm text-gray-700 mb-1 block">
                Deposit Amount ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({ ...formData, deposit: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                Deposit is refundable upon return of item in good condition
              </p>
            </div>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Condition
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "excellent", label: "Excellent", color: "bg-emerald-500" },
              { id: "good", label: "Good", color: "bg-blue-500" },
              { id: "fair", label: "Fair", color: "bg-amber-500" },
              {
                id: "needs_repair",
                label: "Needs Repair",
                color: "bg-red-500",
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, condition: option.id })
                }
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.condition === option.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${option.color}`} />
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Schedule */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">
            Set Availability Schedule (Optional)
          </h4>
        </div>
        <div className="space-y-3">
          {Object.entries(availabilitySchedule).map(([day, schedule]) => (
            <div
              key={day}
              className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={schedule.available}
                  onChange={(e) =>
                    setAvailabilitySchedule((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], available: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="capitalize font-medium text-gray-700 min-w-[100px]">
                  {day}
                </span>
              </div>
              {schedule.available && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={schedule.from}
                    onChange={(e) =>
                      setAvailabilitySchedule((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], from: e.target.value },
                      }))
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={schedule.to}
                    onChange={(e) =>
                      setAvailabilitySchedule((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], to: e.target.value },
                      }))
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4 text-emerald-500" />
          Photos (Max 5)
        </label>
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300"} rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group`}
          >
            <div
              className={`inline-flex p-4 rounded-full mb-4 transition-all ${isDragging ? "bg-gradient-to-br from-emerald-500 to-cyan-500" : "bg-gradient-to-br from-emerald-100 to-cyan-100"}`}
            >
              {isDragging ? (
                <Upload className="h-8 w-8 text-white animate-bounce" />
              ) : (
                <Upload className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700" />
              )}
            </div>
            <p
              className={`text-lg mb-2 ${isDragging ? "text-emerald-700 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
            >
              {isDragging
                ? "Drop images here"
                : "Drag & drop photos or click to browse"}
            </p>
            <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Basic Info
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isStepValid(2)}
          >
            Review & Submit
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 border border-emerald-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Review Your Listing
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Title</label>
              <div className="font-medium text-gray-900">
                {formData.title || "Not provided"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <div className="font-medium text-gray-900">
                {formData.category || "Not selected"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <div className="font-medium text-gray-900">
                {formData.location || "Not provided"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No tags added</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Condition</label>
              <div className="font-medium text-gray-900 capitalize">
                {formData.condition}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Pricing</label>
              <div className="font-medium text-gray-900 capitalize">
                {formData.priceType}
              </div>
              {formData.priceType === "rental" && formData.dailyRate && (
                <div className="text-sm text-gray-600 mt-1">
                  ${parseFloat(formData.dailyRate).toFixed(2)} per day
                  {formData.weeklyDiscount && (
                    <span className="ml-2 text-emerald-600">
                      ({formData.weeklyDiscount}% weekly discount)
                    </span>
                  )}
                </div>
              )}
              {formData.priceType === "deposit" && formData.deposit && (
                <div className="text-sm text-gray-600 mt-1">
                  ${parseFloat(formData.deposit).toFixed(2)} deposit
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500">Photos</label>
              <div className="font-medium text-gray-900">
                {uploadedImages.length}{" "}
                {uploadedImages.length === 1 ? "photo" : "photos"} uploaded
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Availability</label>
              <div className="font-medium text-gray-900">
                {
                  Object.values(availabilitySchedule).filter((d) => d.available)
                    .length
                }{" "}
                days per week
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-emerald-200">
          <label className="text-sm text-gray-500 mb-2 block">
            Description
          </label>
          <p className="text-gray-700">
            {formData.description || "No description provided"}
          </p>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mt-6 pt-6 border-t border-emerald-200">
            <label className="text-sm text-gray-500 mb-3 block">Photos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {uploadedImages.length > 4 && (
                <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      +{uploadedImages.length - 4}
                    </div>
                    <div className="text-xs text-emerald-500">more photos</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Important Terms</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                ✓ You are responsible for the condition and safety of your
                shared resource
              </p>
              <p>
                ✓ Communicate clearly with borrowers about pickup, return, and
                usage conditions
              </p>
              <p>✓ Report any issues or damage through the platform</p>
              <p>✓ Community guidelines apply to all shared items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit Details
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to cancel? All unsaved changes will be lost.",
              )
            ) {
              resetForm();
            }
          }}
          className="flex-1 px-6 py-4 border border-red-200 text-red-700 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Share with Community
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Successfully Shared!
              </h3>
              <p className="text-gray-600 mb-6">
                Your resource has been listed and is now visible to the
                community.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    resetForm();
                    router.push("/browse");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg"
                >
                  Browse Resources
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    resetForm();
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Share Another Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-200 rounded-full mb-4">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">
                Share & Earn Good Karma
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Share a Resource
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                With Your Community
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help reduce waste and build connections by sharing what you have.
              Your contribution strengthens the community.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`relative ${step.number <= currentStep ? "text-emerald-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${step.number <= currentStep ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-white"}`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium">
                    {step.label}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ${step.number < currentStep ? "bg-emerald-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-2xl shadow-emerald-500/5 overflow-hidden">
            <div className="border-b border-gray-200/50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentStep === 1 && "Basic Information"}
                    {currentStep === 2 && "Details & Photos"}
                    {currentStep === 3 && "Review & Submit"}
                  </h2>
                  <p className="text-gray-600">
                    {currentStep === 1 && "Tell us about what you're sharing"}
                    {currentStep === 2 && "Add details and photos"}
                    {currentStep === 3 && "Review your listing before sharing"}
                  </p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-full">
                  <span className="text-sm font-medium text-emerald-700">
                    Step {currentStep} of 3
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
          </div>

          {/* Benefits Card */}
          <div className="mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Benefits of Sharing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Reduce Waste</h4>
                  <p className="text-emerald-100 text-sm">
                    Give items a second life instead of throwing them away
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Build Community</h4>
                  <p className="text-emerald-100 text-sm">
                    Connect with neighbors and strengthen local bonds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Safe & Verified</h4>
                  <p className="text-emerald-100 text-sm">
                    Our platform ensures secure and trustworthy exchanges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

