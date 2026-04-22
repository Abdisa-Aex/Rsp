"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Scale,
  Users,
  Heart,
  Globe,
  Lock,
  Eye,
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  BookOpen,
  Flag,
  DollarSign,
  Package,
  Handshake,
  MessageCircle,
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
  ShieldOff,
  LockKeyhole,
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
  Video,
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
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  Search,
  Filter,
  Grid3x3,
  List,
  Map,
  Calendar,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User as UserIcon,
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
  Shield as ShieldIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  Clock as ClockIcon2,
  Calendar as CalendarIcon,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState("March 26, 2024");

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content:
        "By accessing or using ResourceHub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.",
    },
    {
      title: "2. Eligibility",
      icon: UserCheck,
      content:
        "You must be at least 18 years old to use ResourceHub. By using our platform, you represent and warrant that you meet this eligibility requirement. You also confirm that you are a member of the Jigjiga University community (student, faculty, alumni, or external partner).",
    },
    {
      title: "3. Account Registration",
      icon: UserIcon,
      content:
        "You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
    },
    {
      title: "4. Sharing Resources",
      icon: PackageIcon,
      content:
        "When sharing resources, you must provide accurate descriptions and photos. You represent that you own or have permission to share the items. You are responsible for the condition and safety of your shared resources. Prohibited items include illegal goods, hazardous materials, weapons, and items that violate any laws or university policies.",
    },
    {
      title: "5. Borrowing Resources",
      icon: HandshakeIcon,
      content:
        "When borrowing resources, you agree to treat items with care and return them in the same condition. You are responsible for any damage beyond normal wear and tear. You must adhere to the agreed return dates and communicate with the owner about any issues.",
    },
    {
      title: "6. Transactions and Payments",
      icon: DollarSign,
      content:
        "Any financial transactions between users are conducted through our secure payment system. ResourceHub may charge fees for certain services. All fees are non-refundable unless otherwise stated. We use industry-standard encryption to protect your payment information.",
    },
    {
      title: "7. User Conduct",
      icon: ShieldIcon,
      content:
        "You agree to use ResourceHub in a respectful and lawful manner. Harassment, spam, fraud, and any form of abusive behavior are strictly prohibited. We reserve the right to suspend or terminate accounts that violate these standards.",
    },
    {
      title: "8. Content and Intellectual Property",
      icon: FileText,
      content:
        "You retain ownership of the content you post. By posting content, you grant ResourceHub a license to display and distribute it. You must not post content that infringes on others' intellectual property rights. We respect copyright laws and will respond to takedown notices.",
    },
    {
      title: "9. Privacy and Data Protection",
      icon: LockIcon,
      content:
        "Your privacy is important to us. We collect and process personal data in accordance with our Privacy Policy. You consent to the collection and use of your information as described. We implement security measures to protect your data.",
    },
    {
      title: "10. Termination",
      icon: LogOut,
      content:
        "We may suspend or terminate your account for violating these terms. You may delete your account at any time. Upon termination, your content may be removed from the platform. Certain obligations survive termination.",
    },
    {
      title: "11. Disclaimers and Limitation of Liability",
      icon: AlertTriangle,
      content:
        "ResourceHub is provided 'as is' without warranties. We are not liable for any damages arising from your use of the platform. We do not guarantee the accuracy or reliability of user content. Users are solely responsible for their interactions.",
    },
    {
      title: "12. Dispute Resolution",
      icon: Scale,
      content:
        "Any disputes arising from these terms shall be resolved through binding arbitration. You agree to waive the right to a jury trial or to participate in a class action. The arbitration will take place in Jigjiga, Ethiopia.",
    },
    {
      title: "13. Changes to Terms",
      icon: Edit,
      content:
        "We may update these terms from time to time. We will notify you of material changes. Your continued use of the platform constitutes acceptance of the updated terms. The latest version is always available on our website.",
    },
    {
      title: "14. Contact Information",
      icon: MailIcon,
      content:
        "If you have questions about these terms, please contact us at legal@resourcehub.com or through our contact form. Our address is: ResourceHub, Jigjiga University, Ethiopia.",
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <FileText className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Please read these terms carefully before using ResourceHub
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to ResourceHub
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  ResourceHub is a platform that connects members of the Jigjiga
                  University community to share, borrow, and exchange resources.
                  These Terms of Service govern your use of our website, mobile
                  applications, and all related services.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
                      <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Acknowledgement */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  By using ResourceHub, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have any questions or concerns, please contact us
                  before using the platform.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MailIcon className="h-4 w-4" />
                    Contact Us
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LockIcon className="h-4 w-4" />
                    Privacy Policy
                  </Link>
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
