"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Globe,
  Shield,
  Award,
  Mail,
  Phone,
  MapPin,
  Github,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Leaf,
  DollarSign,
  Clock,
  Calendar,
  Star,
  Quote,
  ArrowRight,

  Rocket,

  HeartHandshake,
  Recycle,
  Trophy,

  Check,
  XCircle,
  Loader2,
  Menu,
  X,

  BookOpen,

  Pill,
  Syringe,
  Ambulance,
  Hospital,
  School,
  University,
  Library,
  Book,
  Bookmark,
  BookMarked,
} from "lucide-react";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import { Linkedin } from "react-feather";
import { Twitter } from "react-feather";
import { GitHub } from "react-feather";
import { MessageCircle } from "lucide-react";
import { User } from "lucide-react";

// Floating Element Component
const FloatingElement = ({ children, delay = 0, duration = 4 }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

// Counter Component
const Counter = ({ target, suffix = "", prefix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
    </div>
  );
};

// Testimonial Card Component
const Testimonial = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
    >
      <Quote className="h-8 w-8 text-green-500 mb-4" />
      <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
        "{testimonial.content}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Blog Post Card
const BlogPost = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
    >
      <div className="relative h-48 bg-gradient-to-br from-green-500 to-blue-500">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          {post.date}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// Partner Logo Component
const PartnerLogo = ({ name, logo, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
    >
      <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">
        {name}
      </div>
    </motion.div>
  );
};

// Team Member Card Component - Click to expand, no hover
const TeamMember = ({ member, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Animated border glow on card */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-xl transition-opacity duration-500 ${showDetails ? "opacity-40" : "opacity-0"}`} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300">

        {/* Image Container - NO GREEN OVERLAYS AT ALL */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          <img
            src={member.image}
            alt={member.name}
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Rating Badge - Bottom right (keep this - no green) */}
          <div className="absolute bottom-5 right-5">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-lg shadow-lg">
              <Star className="h-3.5 w-3.5 text-white fill-white" />
              <span className="text-sm font-bold text-white">{member.rating || "New"}</span>
            </div>
          </div>

          {/* Verified Badge - Top right */}
          {member.isVerified && (
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full shadow-lg">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}

          {/* Role Badge - Top left */}
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs rounded-full font-medium shadow-lg">
              {member.role.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* BOTTOM CARD ONLY - GREEN BACKGROUND HERE */}
        <div className="p-5 bg-gradient-to-r from-green-600 to-emerald-600">

          {/* Name and Role - Now inside the bottom card */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-sm text-white/90">{member.role}</p>
          </div>

          {/* Bio - White text */}
          <p className="text-white/90 text-sm mb-4 line-clamp-3 leading-relaxed">
            {member.bio}
          </p>

          {/* Expertise Tags - White background with green text */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.expertise.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white text-green-700 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {member.expertise.length > 3 && (
                <span className="px-2 py-0.5 bg-white/80 text-green-700 rounded-full text-xs">
                  +{member.expertise.length - 3}
                </span>
              )}
            </div>
          )}

          {/* View Profile Button - White background with green text */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-white text-green-600 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            {showDetails ? (
              <>
                <X className="h-4 w-4" />
                Close Profile
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                View Full Profile
              </>
            )}
          </button>
        </div>

        {/* Expanded Details Modal */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-5 flex flex-col justify-between rounded-2xl shadow-2xl"
          >
            {/* Modal content remains the same */}
            <div>
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-green-600 text-2xl font-bold shadow-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl">
                    {member.name}
                  </h4>
                  <p className="text-sm text-white/80">{member.role}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-white" />
                  About
                </h4>
                <p className="text-sm text-white/90 leading-relaxed">
                  {member.fullBio || member.bio}
                </p>
              </div>

              {member.expertise && member.expertise.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-white" />
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white text-green-700 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <h4 className="text-xs font-semibold text-yellow-200 mb-1 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Fun Fact
                </h4>
                <p className="text-sm text-white/90 italic">
                  "{member.funFact}"
                </p>
              </div>

              {member.joined && (
                <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {member.joined}
                </div>
              )}

              <div className="flex gap-3 mt-3">
                {member.social?.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all text-gray-600 hover:text-blue-500"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all text-gray-600 hover:text-blue-600"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.social?.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all text-gray-600 hover:text-gray-800"
                  >
                    <GitHub className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <button className="mt-5 w-full py-2.5 bg-white text-green-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] active:scale-95">
              <MessageCircle className="h-4 w-4" />
              Connect with {member.name.split(" ")[0]}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
// Value Card Component
const ValueCard = ({ value, index }) => {
  const Icon = value.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {value.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {value.description}
      </p>
    </motion.div>
  );
};

// Milestone Component
const Milestone = ({ milestone, index, isActive, onHover }) => {
  return (
    <div
      className={`relative flex-1 text-center cursor-pointer transition-all ${isActive ? "scale-105" : ""}`}
      onMouseEnter={() => onHover(index)}
    >
      <div
        className={`w-4 h-4 rounded-full mx-auto mb-2 ${isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} transition-colors`}
      />
      <div
        className={`text-sm font-semibold ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
      >
        {milestone.year}
      </div>
      <div
        className={`text-xs ${isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"} mt-1`}
      >
        {milestone.event}
      </div>
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

// Main About Page Component
export default function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeTab, setActiveTab] = useState("story");
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const timelineRef = useRef(null);
  const statsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isMissionInView = useInView(missionRef, { once: true });
  const isValuesInView = useInView(valuesRef, { once: true });
  const isTeamInView = useInView(teamRef, { once: true });
  const isTimelineInView = useInView(timelineRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true });

  const controls = useAnimation();

  useEffect(() => {
    if (isHeroInView) controls.start("visible");
  }, [isHeroInView, controls]);

const team = [
  {
    name: "Abdisa Alemayehu",
    role: "Frontend Developer & Tester",
    bio: "Passionate about developing user-friendly interfaces through technologies.",
    fullBio:
      "Abdisa specializes in creating responsive and accessible web applications. With expertise in modern frontend frameworks, he ensures every user interaction is smooth and intuitive. He's dedicated to bridging the gap between design and functionality.",
    image: "/team/abdisa.jpg",
    expertise: ["React", "Next.js", "Tailwind CSS", "UI/UX", "Testing"],
    funFact: "Once built a treehouse entirely from borrowed tools!",
    rating: 5,
    reviews: 24,
    isVerified: true,
    joined: "January 2024",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Seid Nurhussen",
    role: "Backend Developer & Tester",
    bio: "Passionate about developing backend through different technology.",
    fullBio:
      "Seid is a backend specialist who builds robust, scalable APIs and database systems. He ensures data integrity, security, and optimal performance for all server-side operations.",
    image: "/team/seid.jpg",
    expertise: ["Node.js", "Express.js", "MongoDB", "API Design", "Security"],
    funFact: "Once debugged a production issue at 3 AM and saved the day!",
    rating: 5,
    reviews: 19,
    isVerified: true,
    joined: "January 2024",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Sultan Siraj",
    role: "Manager & Frontend Developer",
    bio: "Passionate about developing user-friendly interfaces through technologies & leading, cooperating the members.",
    fullBio:
      "Sultan is both a technical leader and hands-on developer. He excels at team coordination, project management, and creating intuitive user experiences that delight users.",
    image: "/team/sultan.jpg",
    expertise: [
      "Team Leadership",
      "Project Management",
      "React",
      "UI/UX",
      "Agile",
    ],
    funFact: "Has visited over 30 countries and borrowed items in each!",
    rating: 5,
    reviews: 42,
    isVerified: true,
    joined: "January 2024",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Mohammed Ferhan",
    role: "Tester",
    bio: "Building platforms that make sharing easy and secure.",
    fullBio:
      "Mohammed is dedicated to quality assurance, ensuring every feature works flawlessly before reaching users. He creates comprehensive test plans and automates testing processes.",
    image: "/team/osama.jpg",
    expertise: [
      "Manual Testing",
      "Automation",
      "Bug Tracking",
      "QA Strategy",
      "Performance Testing",
    ],
    funFact: "Wrote his first program at age 8 on a Commodore 64!",
    rating: 5,
    reviews: 15,
    isVerified: true,
    joined: "February 2024",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Abenezer",
    role: "Tester",
    bio: "Creating meaningful partnerships for community growth.",
    fullBio:
      "Abenezer focuses on building relationships and ensuring community feedback is incorporated into the product. He bridges the gap between users and developers.",
    image: "/team/abenezer.jpg",
    expertise: [
      "Community Engagement",
      "User Testing",
      "Feedback Analysis",
      "Documentation",
      "Training",
    ],
    funFact: "Has a collection of over 500 books from borrowing!",
    rating: 5,
    reviews: 31,
    isVerified: true,
    joined: "February 2024",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Verified members and secure transactions ensure safe sharing for everyone in our community.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Everything we do is focused on strengthening local connections and building lasting relationships.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description:
        "Reducing waste by promoting reuse and sharing resources instead of buying new.",
    },
    {
      icon: HeartHandshake,
      title: "Inclusivity",
      description:
        "Open to everyone, regardless of background or economic status. Sharing should be accessible to all.",
    },
    {
      icon: Target,
      title: "Impact",
      description:
        "Measuring our success by positive community impact, not just financial metrics.",
    },
    {
      icon: Trophy,
      title: "Excellence",
      description:
        "Striving for the best experience in resource sharing and community building.",
    },
  ];

  const milestones = [
    {
      year: "2022",
      event: "Founded in Jigjiga",
      description:
        "Started with a vision of building stronger communities through sharing.",
      icon: Rocket,
    },
    {
      year: "2023",
      event: "Reached 1,000 members",
      description:
        "First community milestone with members across 10 departments.",
      icon: Users,
    },
    {
      year: "2024",
      event: "Expanded to all departments",
      description: "Rapid growth as more students embraced sharing.",
      icon: Globe,
    },
    {
      year: "2025",
      event: "10,000+ resources shared",
      description: "Over 10,000 items shared, saving members $500,000+.",
      icon: Trophy,
    },
  ];

  const testimonials = [
    {
      name: "Yordanos Feleke",
      role: "University Student",
      content:
        "This platform has completely changed how I access resources. I've saved hundreds of dollars and met amazing people in my community!",
    },
    {
      name: "Esubalew Getu",
      role: "University Student",
      content:
        "As an educator, I love how this platform enables students to share textbooks and supplies. It's made education more accessible.",
    },
    {
      name: "Selihom",
      role: "Student & Business Owner",
      content:
        "Partnering with this platform has helped my business reach new customers while supporting sustainable practices.",
    },
  ];

  const partners = [
    { name: "University Partners" },
    { name: "Tech for Good" },
    { name: "Green Future" },
    { name: "Community Foundation" },
    { name: "Eco Alliance" },
    { name: "Youth Network" },
  ];

  const blogPosts = [
    {
      title: "How Sharing Builds Stronger Communities",
      excerpt:
        "Discover the science behind why sharing resources leads to happier, more connected neighborhoods.",
      date: "March 15, 2025",
      slug: "sharing-builds-communities",
    },
    {
      title: "Our 2025 Impact Report",
      excerpt:
        "See how our community saved over $2 million and reduced waste by 50,000kg this year.",
      date: "February 10, 2025",
      slug: "2025-impact-report",
    },
    {
      title: "Tips for First-Time Borrowers",
      excerpt:
        "Everything you need to know about borrowing items safely and building trust in your community.",
      date: "January 5, 2025",
      slug: "tips-first-time-borrowers",
    },
  ];

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Resources Shared",
      icon: BookMarked,
      color: "from-green-500 to-emerald-600",
    },
    {
      value: 5000,
      suffix: "+",
      label: "Active Members",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      value: 150,
      suffix: "+",
      label: "Departments",
      icon: Globe,
      color: "from-purple-500 to-pink-600",
    },
    {
      value: 94,
      suffix: "%",
      label: "Success Rate",
      icon: CheckCircle,
      color: "from-amber-500 to-orange-600",
    },
    {
      value: 2000000,
      prefix: "$",
      suffix: "+",
      label: "Money Saved",
      icon: DollarSign,
      color: "from-emerald-500 to-green-600",
    },
    {
      value: 50000,
      suffix: "kg",
      label: "CO₂ Saved",
      icon: Leaf,
      color: "from-teal-500 to-green-600",
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 py-20 lg:py-32"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <FloatingElement delay={0} duration={6}>
              <div className="absolute top-20 left-10 w-16 h-16 bg-green-300 dark:bg-green-700 rounded-full opacity-20" />
            </FloatingElement>
            <FloatingElement delay={1} duration={8}>
              <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 dark:bg-blue-700 rounded-full opacity-20" />
            </FloatingElement>
          </div>

          <div className="relative container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Our Story
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Building Stronger Communities
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Through Sharing
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
              >
                We believe that sharing resources builds trust, saves money, and
                creates sustainable communities. Our mission is to make sharing
                easy, safe, and rewarding for everyone.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  Join Our Community
                </Link>
                <a
                  href="#mission"
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section with Counter Animation */}
        <section ref={statsRef} className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Counter
                      target={stat.value}
                      suffix={stat.suffix || ""}
                      prefix={stat.prefix || ""}
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-center gap-4 mb-12">
              {["story", "mission", "impact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto text-center"
            >
              {activeTab === "story" && (
                <div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Born from a simple idea during the pandemic, our platform
                    started when a group of students realized they had tools and
                    resources sitting idle while others needed them.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Today, we've grown into a vibrant community of thousands who
                    believe that sharing isn't just economical—it's
                    transformative. Every shared resource represents money
                    saved, waste reduced, and a connection strengthened.
                  </p>
                </div>
              )}
              {activeTab === "mission" && (
                <div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    To create a world where communities thrive through shared
                    resources, reducing waste and building connections that last
                    a lifetime.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    We envision a future where sharing is the norm, where every
                    tool, skill, and resource is accessible to those who need
                    it, and where communities grow stronger through mutual
                    support.
                  </p>
                </div>
              )}
              {activeTab === "impact" && (
                <div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Through our platform, we've helped communities save over $2
                    million, reduced waste by 50,000kg, and facilitated
                    thousands of meaningful connections between neighbors.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Each day, more people discover the power of sharing, and
                    we're just getting started.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section
          id="mission"
          ref={missionRef}
          className="py-20 bg-white dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isMissionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                  <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Our Mission
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Create a world where communities thrive through shared
                  resources
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  We are building a platform that reduces waste, saves money,
                  and creates meaningful connections between neighbors. By
                  making it easy to share resources, we are helping communities
                  become more sustainable, resilient, and connected.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Our vision is a world where sharing is the norm, where every
                  tool, skill, and resource is accessible to those who need it,
                  and where communities grow stronger through mutual support.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isMissionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Vision Goals
                </h3>
                <ul className="space-y-4">
                  {[
                    "10,000 connected community members by 2027",
                    "Reduce community waste  through sharing",


                  ].map((goal, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isMissionInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {goal}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          ref={valuesRef}
          className="py-20 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Our Values
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Principles That Guide Us
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                These core values shape everything we do and every decision we
                make.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Testimonials
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Community Says
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Real stories from real members who've experienced the power of
                sharing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={testimonial.name}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>



        {/* Partners Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Partners
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Working together to build stronger, more sustainable
                communities.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((partner, index) => (
                <PartnerLogo
                  key={partner.name}
                  name={partner.name}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Latest Stories
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                From Our Blog
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Insights, stories, and updates from the ResourceHub community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <BlogPost key={post.slug} post={post} index={index} />
              ))}
            </div>



          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full mb-6">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Meet the Team
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Passionate People, Stronger Communities
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A dedicated team committed to building better communities
                through technology and human connection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <TeamMember key={member.name} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of community members who are building stronger
                neighborhoods through sharing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  Join Free Today
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Contact Our Team
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

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
        `}</style>
      </div>
      <Footer />
    </>
  );
}
