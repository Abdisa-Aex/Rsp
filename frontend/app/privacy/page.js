"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Cookie,
  Trash2,
  Share2,
  User,
  Globe,
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
  Trash2 as TrashIcon,
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
  Clock,
  MapPin,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Phone,
  User as UserIcon,
  Users,
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
  Smartphone as SmartphoneIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Watch as WatchIcon,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon2,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Grid3x3 as GridIcon,
  List as ListIcon,
  Map as MapIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon2,
  FileText,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState("March 26, 2024");

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content:
        "We collect information you provide directly to us, such as when you create an account, share resources, or contact us. This includes:",
      subsections: [
        "Account information (name, email, phone, student ID)",
        "Profile information (bio, interests, location)",
        "Resource listings (descriptions, photos, pricing)",
        "Transaction and exchange history",
        "Messages and communications with other users",
        "Ratings and reviews you provide",
      ],
    },
    {
      title: "2. Information Automatically Collected",
      icon: GlobeIcon2,
      content:
        "When you use our platform, we automatically collect certain information, including:",
      subsections: [
        "Device information (IP address, browser type, operating system)",
        "Usage data (pages visited, time spent, features used)",
        "Location data (with your permission)",
        "Cookies and similar tracking technologies",
        "Log data and performance metrics",
      ],
    },
    {
      title: "3. How We Use Your Information",
      icon: SettingsIcon,
      content: "We use your information to:",
      subsections: [
        "Provide and maintain our services",
        "Process transactions and exchanges",
        "Communicate with you about your account and activity",
        "Personalize your experience and recommendations",
        "Improve and develop new features",
        "Ensure safety and prevent fraud",
        "Comply with legal obligations",
      ],
    },
    {
      title: "4. Sharing Your Information",
      icon: Share2,
      content: "We may share your information in the following circumstances:",
      subsections: [
        "With other users as part of resource sharing (profile information, ratings)",
        "With service providers who assist in operating our platform",
        "To comply with legal requirements or respond to lawful requests",
        "To protect the rights, property, or safety of ResourceHub and its users",
        "In connection with a merger, acquisition, or sale of assets",
      ],
    },
    {
      title: "5. Data Security",
      icon: ShieldCheck,
      content:
        "We implement reasonable security measures to protect your information, including:",
      subsections: [
        "Encryption of data in transit and at rest",
        "Secure authentication and access controls",
        "Regular security assessments and monitoring",
        "Employee training on data protection",
        "Incident response procedures",
      ],
    },
    {
      title: "6. Your Rights and Choices",
      icon: UserCheck,
      content: "You have certain rights regarding your personal information:",
      subsections: [
        "Access and obtain a copy of your data",
        "Correct inaccurate information",
        "Delete your account and associated data",
        "Opt out of marketing communications",
        "Withdraw consent where applicable",
        "Data portability",
      ],
    },
    {
      title: "7. Cookies and Tracking",
      icon: Cookie,
      content: "We use cookies and similar technologies to:",
      subsections: [
        "Remember your preferences and login status",
        "Analyze how you use our platform",
        "Personalize content and recommendations",
        "Improve performance and security",
        "You can manage cookie preferences in your browser settings",
      ],
    },
    {
      title: "8. Data Retention",
      icon: Clock,
      content:
        "We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for:",
      subsections: [
        "Legal and regulatory compliance",
        "Fraud prevention and security",
        "Research and analytical purposes",
        "Resolving disputes and enforcing agreements",
      ],
    },
    {
      title: "9. Children's Privacy",
      icon: Shield,
      content:
        "Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.",
    },
    {
      title: "10. International Data Transfers",
      icon: GlobeIcon2,
      content:
        "Your information may be transferred to and processed in countries other than your own. We take appropriate safeguards to ensure your data remains protected in accordance with this Privacy Policy.",
    },
    {
      title: "11. Changes to This Policy",
      icon: EditIcon,
      content:
        "We may update this Privacy Policy from time to time. We will notify you of material changes through the platform or via email. Your continued use of ResourceHub after changes become effective constitutes acceptance of the updated policy.",
    },
    {
      title: "12. Contact Us",
      icon: MailIcon,
      content:
        "If you have questions about this Privacy Policy or our data practices, please contact us:",
      subsections: [
        "Email: privacy@resourcehub.com",
        "Address: ResourceHub, Jigjiga University, Ethiopia",
        "Phone: +251-XXX-XXX-XXX",
      ],
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
                <Shield className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your information.
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Commitment to Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  ResourceHub is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our platform. Please
                  read this policy carefully.
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
                      {section.subsections && (
                        <ul className="mt-3 space-y-2">
                          {section.subsections.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                            >
                              <span className="text-green-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* GDPR/CCPA Notice */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Your Privacy Rights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Depending on your location, you may have additional privacy
                  rights. Residents of the EU have rights under the GDPR, and
                  California residents have rights under the CCPA. These rights
                  include the ability to access, correct, delete, and port your
                  personal information.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <MailIcon className="h-4 w-4" />
                    Exercise Your Rights
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Terms of Service
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
