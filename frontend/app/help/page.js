"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Rocket,
  Wrench,
  BookOpen,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  Package,
  Handshake,
  Shield,
  CreditCard,
  Clock,
  Calendar,
  MapPin,
  Star,
  Award,
  Crown,
  Gem,
  Sparkles,
  Zap,
  Flame,
  TrendingUp,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Fingerprint,
  QrCode,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Video as VideoIcon,
  Image,
  File,
  Folder,
  FolderOpen,
  Download,
  Upload,
  Save,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  Settings,
  LogOut,
  Menu,
  Filter,
  Grid3x3,
  List,
  Map,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Globe,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User,
  Users as UsersIcon,
  Package as PackageIcon,
  Handshake as HandshakeIcon,
  MessageCircle as MessageCircleIcon,
  Star as StarIcon,
  Award as AwardIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Flame as FlameIcon,
  TrendingUp as TrendingUpIcon,
  HelpCircle as HelpCircleIcon,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:text-green-600 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 group"
    >
      <div
        className={`p-3 rounded-xl ${color} mx-auto w-fit mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </button>
  );
};

// Main Help Page Component
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQs, setOpenFAQs] = useState({});

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      color: "bg-green-500",
      description: "New to ResourceHub? Start here",
    },
    {
      id: "sharing",
      title: "Sharing Resources",
      icon: Package,
      color: "bg-blue-500",
      description: "How to share your items",
    },
    {
      id: "borrowing",
      title: "Borrowing Resources",
      icon: Handshake,
      color: "bg-purple-500",
      description: "How to borrow items",
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: User,
      color: "bg-orange-500",
      description: "Manage your account",
    },
    {
      id: "payments",
      title: "Payments & Fees",
      icon: CreditCard,
      color: "bg-emerald-500",
      description: "Transactions and payments",
    },
    {
      id: "safety",
      title: "Safety & Security",
      icon: Shield,
      color: "bg-red-500",
      description: "Stay safe on our platform",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: Wrench,
      color: "bg-yellow-500",
      description: "Fix common issues",
    },
    {
      id: "legal",
      title: "Legal & Policies",
      icon: FileText,
      color: "bg-gray-500",
      description: "Terms, privacy, and policies",
    },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "What is ResourceHub?",
      answer:
        "ResourceHub is a platform that connects members of the Jigjiga University community to share, borrow, and exchange resources. It's designed to help students, faculty, and alumni save money, reduce waste, and build stronger community connections.",
    },
    {
      category: "getting-started",
      question: "How do I create an account?",
      answer:
        "Click the 'Register' button in the top right corner. Fill in your details including your university email address (.edu.et), create a password, and complete the registration process. You'll receive a verification email to confirm your account.",
    },
    {
      category: "getting-started",
      question: "Is ResourceHub free to use?",
      answer:
        "Yes, creating an account and browsing resources is completely free. Some items may have rental fees set by owners, but many members share items for free to help their community. We may charge small fees for premium features in the future.",
    },
    {
      category: "sharing",
      question: "How do I share an item?",
      answer:
        "Click the 'Share' button in the navigation bar. Fill in the item details including title, description, category, condition, location, and pricing. Add clear photos of the item from multiple angles. Review your listing and click 'Publish'. Your item will be visible to the community after moderation.",
    },
    {
      category: "sharing",
      question: "What items can I share?",
      answer:
        "You can share most physical items including tools, gardening equipment, kitchen appliances, books, electronics, furniture, sports equipment, and more. Prohibited items include illegal goods, hazardous materials, weapons, and items that violate university policies.",
    },
    {
      category: "sharing",
      question: "How do I set a price for my item?",
      answer:
        "You can choose from free, rental, deposit, or barter options. For rentals, you can set a daily, weekly, or monthly rate. You can also offer weekly or monthly discounts. Consider the item's value, condition, and market rates when setting your price.",
    },
    {
      category: "borrowing",
      question: "How do I borrow an item?",
      answer:
        "Browse or search for items you need. Click on an item to view details. Click 'Request' and select your desired dates. Add a message to the owner if needed. The owner will be notified and can approve or decline your request.",
    },
    {
      category: "borrowing",
      question: "What happens if I damage an item?",
      answer:
        "You are responsible for returning items in the same condition. If damage occurs, communicate with the owner immediately. Many items have a security deposit that can be used to cover damages. We encourage open communication and have a dispute resolution process if needed.",
    },
    {
      category: "account",
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page. Enter your email address and we'll send you a password reset link. Follow the instructions to create a new password. The link expires in 1 hour for security.",
    },
    {
      category: "account",
      question: "How do I delete my account?",
      answer:
        "Go to Settings > Data Management > Delete Account. You'll be asked to confirm this irreversible action. All your data will be permanently removed after a 30-day grace period during which you can restore your account.",
    },
    {
      category: "payments",
      question: "How do payments work?",
      answer:
        "When you request an item, you'll be asked to provide payment details. Payments are processed securely through our payment system. Funds are held until the exchange is completed, then released to the owner. Deposits are held and refunded upon successful return.",
    },
    {
      category: "payments",
      question: "Is my payment information secure?",
      answer:
        "Yes, we use industry-standard encryption (SSL/TLS) to protect your payment information. We never store your full payment details on our servers. All transactions are processed through secure payment gateways.",
    },
    {
      category: "safety",
      question: "How do you verify users?",
      answer:
        "We verify users through university email verification and phone number confirmation. Users can also earn trust scores based on successful exchanges and positive reviews. Our moderation team reviews reported content and suspicious activity.",
    },
    {
      category: "safety",
      question: "What should I do if I encounter a problem?",
      answer:
        "If you have an issue with a user or item, first try to communicate directly. If that doesn't resolve the issue, you can report the problem through our platform. Our support team will investigate and take appropriate action.",
    },
    {
      category: "troubleshooting",
      question: "I didn't receive a verification email. What should I do?",
      answer:
        "Check your spam folder. If it's not there, click 'Resend verification email' on the verification page. Ensure you entered the correct email address. If you still don't receive it, contact our support team.",
    },
    {
      category: "troubleshooting",
      question: "The app is not loading properly. What can I do?",
      answer:
        "Try refreshing the page, clearing your browser cache, or using a different browser. Check your internet connection. If the problem persists, our status page for any ongoing issues.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <HelpCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Can We Help?
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions, learn how to use ResourceHub,
              and get support
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {categories.map((category, idx) => (
              <CategoryCard
                key={category.id}
                {...category}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 text-green-600 hover:text-green-700"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQs[index]}
                    onToggle={() => toggleFAQ(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contact Support Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Live Chat
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Chat with our support team
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium">
                Start Chat →
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Email Support
              </h3>
              <p className="text-sm text-gray-500 mb-4">Get help via email</p>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Send Message →
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Video Tutorials
              </h3>
              <p className="text-sm text-gray-500 mb-4">Watch how-to videos</p>
              <a
                href="#"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                View Tutorials →
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
