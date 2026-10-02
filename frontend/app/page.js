"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Search,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Users,
  Shield,
  Sparkles,
  ChevronRight,
  Heart,
  Bookmark,
  Share2,
  CheckCircle,
  Leaf,
  DollarSign,
  MessageCircle,
  Gift,
  Camera,
  Wrench,
  Book,
  Laptop,
  Bike,
  Home,
  Coffee,
  Music,
  Palette,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  Flower,
  HeartHandshake,
  Flame,
  ArrowUp,
  Package,
  Quote,
  Plus,
  UserPlus,
} from "lucide-react";
// import Header from "@/components/layout/Header";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AnnouncementBar from "../components/layout/AnnouncementBar";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Hero Section Component
const Hero = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleTyping = (value) => {
    setSearchQuery(value);

    // Mock suggestions - would come from API
    const mockSuggestions = [
      "Power tools",
      "Gardening equipment",
      "Kitchen appliances",
      "Textbooks",
      "Camping gear",
      "Electronics",
      "Furniture",
      "Sports equipment",
    ].filter((s) => s.toLowerCase().includes(value.toLowerCase()));

    setSuggestions(mockSuggestions.slice(0, 5));
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 lg:py-32"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 rounded-full text-sm font-semibold text-green-700">
              <Sparkles className="h-4 w-4" />
              Join 10,000+ Community Members
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Share Resources,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Build Community
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Connect with neighbors to borrow, share, and exchange tools,
            equipment, skills, and more. Reduce waste, save money, and
            strengthen your community.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeInUp}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200">
                <form onSubmit={handleSearch} className="flex items-center p-2">
                  <Search className="h-5 w-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="What are you looking for? (tools, equipment, skills...)"
                    className="flex-1 px-4 py-4 outline-none bg-transparent text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setSuggestions([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            {[
              { value: "10,000+", label: "Resources Shared", icon: Package },
              { value: "5,000+", label: "Community Members", icon: Users },
              { value: "150+", label: "Cities", icon: MapPin },
              { value: "94%", label: "Success Rate", icon: CheckCircle },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            {[
              "Verified Members",
              "Secure Transactions",
              "24/7 Support",
              "Community Guidelines",
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <Shield className="h-4 w-4 text-green-500" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

// Featured Resources Section
const FeaturedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadFeaturedResources();
  }, []);

  const loadFeaturedResources = async () => {
    try {
      const data = await apiCall("/resources/featured");
      if (data.success) {
        setResources(data.featured);
      }
    } catch (error) {
      console.error("Load featured error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "recent", label: "Recent", icon: Clock },
  ];

  const filteredResources = resources.filter((resource) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trending") return resource.isTrending;
    if (activeFilter === "recent") {
      const daysAgo =
        (new Date() - new Date(resource.createdAt)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }
    return true;
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Resources
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Trending in Your Community
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover popular items shared by community members near you. Curated
            based on ratings, availability, and community engagement.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-md"
              }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-green-300 hover:shadow-lg transition-all group"
          >
            <span>Browse All Resources</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Resource Card Component
const ResourceCard = ({ resource, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      Tools: Wrench,
      Gardening: Flower,
      Kitchen: Coffee,
      Books: Book,
      Electronics: Laptop,
      Furniture: Home,
      Sports: Bike,
      Music: Music,
      Art: Palette,
      Business: Briefcase,
      Education: GraduationCap,
    };
    const Icon = icons[category] || Package;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {resource.images?.[0] ? (
            <img
              src={resource.images[0].url}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              {getCategoryIcon(resource.category)}
            </div>
          )}

          {/* Badges */}
          {resource.isVerified && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </div>
          )}
          {resource.isTrending && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-full flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Trending
            </div>
          )}

          {/* Quick Actions on Hover */}
          <div
            className={`absolute bottom-3 right-3 flex gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" />
              ) : (
                <Bookmark className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">{resource.category}</span>
            <span className="text-xs text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium">
                {resource.rating || "New"}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
            {resource.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {resource.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {resource.location}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {resource.priceType === "free" ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                <span className="text-green-600 font-semibold">
                  ${resource.price}/{resource.priceUnit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Owner Info */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {resource.owner?.fullName?.charAt(0) || "U"}
            </div>
            <span className="text-xs text-gray-600">
              by {resource.owner?.fullName?.split(" ")[0] || "User"}
            </span>
            {resource.owner?.trustScore > 80 && (
              <span className="text-xs text-green-600">• High Trust</span>
            )}
          </div>
        </div>

        <Link
          href={`/resources/${resource._id}`}
          className="absolute inset-0"
          aria-label={`View ${resource.title}`}
        />
      </div>
    </motion.div>
  );
};

// How It Works Section
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      step: "1",
      title: "Browse & Find",
      description:
        "Search through thousands of resources shared by community members. Filter by category, location, or availability to find exactly what you need.",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
      image: "/images/how-it-works/browse.svg",
    },
    {
      step: "2",
      title: "Connect & Arrange",
      description:
        "Message the resource owner directly through our secure platform. Arrange pickup time, location, and discuss any details.",
      icon: MessageCircle,
      color: "from-emerald-500 to-green-500",
      image: "/images/how-it-works/connect.svg",
    },
    {
      step: "3",
      title: "Share & Return",
      description:
        "Borrow the resource for your agreed timeframe. After use, return it in the same condition. Simple, secure, and community-driven.",
      icon: HeartHandshake,
      color: "from-orange-500 to-amber-500",
      image: "/images/how-it-works/share.svg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Share & Connect in 3 Easy Steps
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with ResourceHub is simple. Follow these three steps
            to start sharing and borrowing resources in your community.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setActiveStep(index)}
                  className="relative cursor-pointer group"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isActive ? "opacity-20" : ""}`}
                  />

                  <div
                    className={`relative bg-white border-2 rounded-2xl p-8 transition-all duration-300 ${
                      isActive
                        ? "border-green-400 shadow-xl"
                        : "border-gray-200 group-hover:border-green-300 group-hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {step.step}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gradient-to-r ${step.color} group-hover:text-white transition-all`}
                    >
                      <Icon className="h-6 w-6 text-gray-600 group-hover:text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center">
                      {step.description}
                    </p>

                    {isActive && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Current Step
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Section
const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categoryData = [
    {
      id: 1,
      name: "Tools & Equipment",
      icon: Wrench,
      count: 342,
      color: "from-blue-500 to-cyan-500",
      description: "Power tools, hand tools, and equipment for any project",
    },
    {
      id: 2,
      name: "Gardening",
      icon: Flower,
      count: 198,
      color: "from-emerald-500 to-green-500",
      description: "Garden tools, seeds, and equipment for your green space",
    },
    {
      id: 3,
      name: "Kitchen",
      icon: Coffee,
      count: 156,
      color: "from-orange-500 to-amber-500",
      description: "Cookware, appliances, and utensils for culinary adventures",
    },
    {
      id: 4,
      name: "Books",
      icon: Book,
      count: 423,
      color: "from-purple-500 to-pink-500",
      description: "Fiction, non-fiction, textbooks, and educational materials",
    },
    {
      id: 5,
      name: "Electronics",
      icon: Laptop,
      count: 231,
      color: "from-slate-500 to-gray-500",
      description: "Gadgets, computers, and tech accessories",
    },
    {
      id: 6,
      name: "Furniture",
      icon: Home,
      count: 112,
      color: "from-amber-500 to-yellow-500",
      description: "Home and office furniture for comfortable living",
    },
    {
      id: 7,
      name: "Sports",
      icon: Bike,
      count: 87,
      color: "from-red-500 to-orange-500",
      description: "Sports equipment and gear for active lifestyles",
    },
    {
      id: 8,
      name: "Skills",
      icon: GraduationCap,
      count: 289,
      color: "from-rose-500 to-pink-500",
      description: "Share your skills and expertise with the community",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Browse by Category
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Find What You Need
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of resources organized into categories.
            Everything from tools to skills, all shared by your community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category.id)
                }
                className="group relative cursor-pointer"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${category.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isExpanded ? "opacity-30" : ""}`}
                />

                <div
                  className={`relative bg-white border-2 rounded-2xl p-6 transition-all duration-300 ${
                    isExpanded
                      ? "border-green-400 shadow-xl"
                      : "border-gray-200 group-hover:border-green-300 group-hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {category.count} items
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <button className="text-sm text-green-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Browse Category
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Recent Activity Section
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await apiCall("/analytics/activities?limit=5");
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Load activities error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    const icons = {
      shared: Package,
      borrowed: Handshake,
      returned: RotateCcw,
      reviewed: Star,
      joined: Users,
    };
    const Icon = icons[action] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getActivityColor = (action) => {
    const colors = {
      shared: "from-green-500 to-emerald-600",
      borrowed: "from-blue-500 to-cyan-600",
      returned: "from-purple-500 to-pink-600",
      reviewed: "from-yellow-500 to-orange-600",
      joined: "from-indigo-500 to-purple-600",
    };
    return colors[action] || "from-gray-500 to-gray-600";
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Recent Activity
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Real-Time Community Updates
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See whats happening right now in your community. Track sharing,
            borrowing, and connections in real-time.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${getActivityColor(activity.action)} flex items-center justify-center text-white shadow-sm`}
                    >
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        <span className="font-semibold">
                          {activity.user?.fullName}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          {activity.action}{" "}
                        </span>
                        <span className="font-medium">
                          {activity.resource?.title}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                        <button className="text-xs text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          Like
                        </button>
                        <button className="text-xs text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          Comment
                        </button>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-200 rounded-lg">
                        <Share2 className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}


        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await apiCall("/analytics/testimonials");
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Load testimonials error:", error);
      // Fallback to mock data
      setTestimonials([
        {
          _id: "1",
          user: {
            fullName: "Sultan ",
            role: "DIY Enthusiast",
            avatar: "SJ",
          },
          rating: 5,
          content:
            "This platform is amazing! I borrowed a power drill for my weekend project and saved $200. The process was smooth and the owner was very helpful.",
          resource: { title: "Power Drill Set" },
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          user: { fullName: "Abdisa Alex", role: "Homeowner", avatar: "MB" },
          rating: 5,
          content:
            "I shared my lawn mower and it helped three neighbors in just one month. Great way to build community and reduce waste.",
          resource: { title: "Lawn Mower" },
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          user: { fullName: "Seid  ", role: "Student", avatar: "ED" },
          rating: 4,
          content:
            "Exchange scintfic calculator for an exam and saved over $50. The platform is easy to use and the community is very responsive.",
          resource: { title: "College Textbooks" },
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          user: { fullName: "Abenezer  ", role: "Student", avatar: "ED" },
          rating: 4,
          content:
            "Borrowed textbooks for my semester and saved over $300. The platform is easy to use and the community is very responsive.",
          resource: { title: "College Textbooks" },
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          user: { fullName: "Hosama  ", role: "Student", avatar: "ED" },
          rating: 4,
          content:
            "Borrowed Futsal tacketa for the upcoming GC cup and saved over $100. The platform is easy to use and the community is very responsive.",
          resource: { title: "College Textbooks" },
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Community Says
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Real Stories, Real Impact
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied members who are building stronger
            communities through sharing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Quote className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {testimonial.user?.avatar ||
                    testimonial.user?.fullName?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonial.user?.fullName}
                  </h4>
                  <p className="text-gray-600">
                    {testimonial.user?.role || "Community Member"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Shared: {testimonial.resource?.title || "Various Resources"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-gradient-to-r from-green-500 to-blue-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Join the Sharing Revolution?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of community members who are building stronger
            neighborhoods through sharing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/share"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="h-5 w-5" />
                Share a Resource
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                <UserPlus className="h-5 w-5" />
                Sign Up Free
              </Link>
            )}
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <Search className="h-5 w-5" />
              Browse Resources
            </Link>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: DollarSign,
                title: "Save Money",
                description: "Borrow instead of buy for one-time projects",
                color: "bg-green-500",
              },
              {
                icon: Leaf,
                title: "Reduce Waste",
                description: "Give items a second life in your community",
                color: "bg-emerald-500",
              },
              {
                icon: Users,
                title: "Build Connections",
                description: "Meet neighbors and strengthen local bonds",
                color: "bg-blue-500",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div
                  className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Page Component
export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero />
      <FeaturedResources />
      <HowItWorks />
      <Categories />
      <RecentActivity />
      <Testimonials />
      <CTASection />
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
