"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import {
  Loader2,
  User,
  Star,
  MapPin,
  Calendar,
  Award,
  Shield,
  Mail,
  Package,
  Handshake,
  Heart,
  Share2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  VerifiedIcon,
  Camera,
  Edit3,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Gift,
  Trophy,
  Zap,
  Users,
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { apiCall, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState([]);
  const [activeTab, setActiveTab] = useState("items");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchUserItems();
      fetchUserReviews();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await apiCall(`/users/${id}`);
      if (response.success) {
        setProfile(response.user);
      } else {
        toast.error("User not found");
        router.push("/browse");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile");
      router.push("/browse");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await apiCall(`/resources?userId=${id}&limit=9`);
      if (response.success) {
        setUserItems(response.resources);
      }
    } catch (error) {
      console.error("Fetch user items error:", error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await apiCall(`/users/${id}/reviews`);
      if (response.success) {
        setReviews(response.reviews || []);
      }
    } catch (error) {
      console.error("Fetch user reviews error:", error);
    }
  };

  const handleSendMessage = () => {
    if (!user) {
      toast.error("Please login to send message");
      router.push("/login");
      return;
    }
    router.push(`/messages?userId=${id}`);
  };

  const handleContact = () => {
    if (!user) {
      toast.error("Please login to contact");
      router.push("/login");
      return;
    }
    window.location.href = `mailto:${profile.email}`;
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
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

  if (!profile) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              User not found
            </h2>
            <Button onClick={() => router.push("/browse")}>Go to Browse</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4) return "text-blue-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-orange-600";
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {profile.fullName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                {profile.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                    <VerifiedIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {profile.fullName}
                  </h1>
                  {profile.isVerified && (
                    <span className="bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <VerifiedIcon className="h-3 w-3" />
                      Verified Member
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">
                      {profile.rating ? profile.rating.toFixed(1) : "New"}
                    </span>
                    <span className="text-white/80 text-sm">rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member since {memberSince}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {profile.location || "Location not set"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 justify-center md:justify-start">
                  <Button
                    onClick={handleSendMessage}
                    className="bg-white text-green-700 hover:bg-gray-100"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleContact}
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Stats Quick View */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {profile.stats?.itemsShared || 0}
                  </div>
                  <div className="text-sm opacity-80">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {profile.stats?.successfulExchanges || 0}
                  </div>
                  <div className="text-sm opacity-80">Exchanges</div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Stats Cards */}
              <motion.div
                {...fadeIn}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                          style={{ width: `${profile.trustScore || 0}%` }}
                        />
                      </div>
                      <span
                        className={`font-semibold ${getTrustScoreColor(profile.trustScore)}`}
                      >
                        {profile.trustScore || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-green-600">
                      {profile.stats?.responseRate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold">{reviews.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Bio */}
              {profile.bio && (
                <motion.div
                  {...fadeIn}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </motion.div>
              )}

              {/* Contact Info */}
              <motion.div
                {...fadeIn}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Info
                </h3>
                <div className="space-y-2">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-gray-600 hover:text-green-600"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">📞</span>
                      <span className="text-gray-600">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{profile.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("items")}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                      activeTab === "items"
                        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    Items ({userItems.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                      activeTab === "reviews"
                        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    <Star className="h-4 w-4 inline mr-2" />
                    Reviews ({reviews.length})
                  </button>
                </div>

                <div className="p-6">
                  {/* Items Tab */}
                  {activeTab === "items" && (
                    <div>
                      {userItems.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No items shared yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userItems.map((item, index) => (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() =>
                                router.push(`/resources/${item._id}`)
                              }
                              className="border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
                            >
                              <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {item.images?.[0]?.url ? (
                                    <img
                                      src={item.images[0].url}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {item.category}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-green-600 font-bold">
                                      {item.priceType === "free"
                                        ? "Free"
                                        : `$${item.price}/day`}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        item.status === "available"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-orange-100 text-orange-700"
                                      }`}
                                    >
                                      {item.status === "available"
                                        ? "Available"
                                        : "Borrowed"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div>
                      {reviews.length === 0 ? (
                        <div className="text-center py-12">
                          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No reviews yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map((review, index) => (
                            <motion.div
                              key={review._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border rounded-xl p-4"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                    {review.reviewer?.fullName?.charAt(0) ||
                                      "U"}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {review.reviewer?.fullName}
                                      </p>
                                      <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                              i < review.rating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {new Date(
                                        review.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 mt-2">
                                    {review.review}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
