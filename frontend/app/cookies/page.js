"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cookie,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  Shield,
  Eye,
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
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  User,
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
  Lock,
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
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Search,
  Filter,
  Grid3x3,
  List,
  Map,
  Calendar,
  Clock,
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
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem("cookiePreferences");
    if (savedPrefs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCookiePreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const rejectAll = () => {
    setCookiePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cookieTypes = [
    {
      id: "necessary",
      name: "Necessary Cookies",
      description:
        "These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.",
      required: true,
      icon: Shield,
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description:
        "These cookies enable enhanced functionality and personalization, such as remembering your preferences and login details.",
      required: false,
      icon: SettingsIcon,
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      required: false,
      icon: TrendingUpIcon,
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description:
        "These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of marketing campaigns.",
      required: false,
      icon: MailIcon,
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
                <Cookie className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This policy explains how we use cookies and similar technologies
              on ResourceHub.
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  What Are Cookies?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Cookies are small text files that are placed on your device
                  when you visit a website. They are widely used to make
                  websites work more efficiently and provide information to the
                  website owners. Cookies help us enhance your browsing
                  experience and improve our services.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Cookie Preferences
              </h2>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                {showPreferences ? "Hide Settings" : "Manage Preferences"}
              </button>
            </div>

            {showPreferences && (
              <div className="space-y-4 mt-4">
                {cookieTypes.map((type) => {
                  const Icon = type.icon;
                  const isChecked = cookiePreferences[type.id];
                  return (
                    <div
                      key={type.id}
                      className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Icon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {type.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setCookiePreferences((prev) => ({
                              ...prev,
                              [type.id]: e.target.checked,
                            }))
                          }
                          disabled={type.required}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${isChecked ? "bg-green-500" : "bg-gray-300"} ${type.required ? "opacity-50" : ""}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transform transition-transform ${isChecked ? "translate-x-5" : "translate-x-0"} mt-0.5 ml-0.5`}
                          />
                        </div>
                      </label>
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={savePreferences}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reject All
                  </button>
                </div>
                {saved && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Preferences saved successfully
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cookie Types Explanation */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How We Use Cookies
            </h2>
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
                      <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {type.name}
                        </h3>
                        {type.required ? (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Required
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Third-Party Cookies */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <GlobeIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Third-Party Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Some cookies are placed by third-party services that appear on
                  our pages. These include:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      <strong>Google Analytics:</strong> Used to analyze website
                      traffic and user behavior
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      <strong>Facebook Pixel:</strong> Used to measure
                      advertising effectiveness
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      <strong>Cloudflare:</strong> Used for security and
                      performance optimization
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <SettingsIcon className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Managing Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Most web browsers allow you to control cookies through their
                  settings. You can usually find these settings in the "Options"
                  or "Preferences" menu of your browser. Here are links to
                  cookie management instructions for popular browsers:
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Chrome
                  </a>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Firefox
                  </a>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Safari
                  </a>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Edge
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <MailIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Questions About Cookies?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have any questions about our use of cookies, please
                  contact us at:
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    Email: privacy@resourcehub.com
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: ResourceHub, Jigjiga University, Ethiopia
                  </p>
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
