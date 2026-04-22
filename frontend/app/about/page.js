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
  // Linkedin,
  // Twitter,
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
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  Building,
  Coffee,
  Smile,
  Zap,
  Rocket,
  Compass,
  Mountain,
  Tree,
  Flower,
  Cloud,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  Umbrella,
  Snowflake,
  HeartHandshake,
  Recycle,
  Trophy,
  Crown,
  Gem,
  Flame,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  AlertTriangle,
  Check,
  XCircle,
  Loader2,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  HelpCircle,
  Info,
  BookOpen,
  Video,
  Image,
  FileText,
  Newspaper,
  Podcast,
  Radio,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Speaker,
  Camera,
  Film,
  Clapperboard,
  Music,
  Microscope,
  Telescope,
  Flask,
  Beaker,
  Dna,
  Atom,
  Brain,
  HeartPulse,
  Stethoscope,
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
// import { GitHub } from "react-feather";

// Team Member Card Component
const TeamMember = ({ member, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-green-500 to-blue-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4">
            <div className="text-white">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-sm opacity-90">{member.role}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {member.bio}
          </p>

          <div className="flex items-center gap-3">
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Twitter className="h-4 w-4 text-gray-500" />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {/* <Linkedin className="h-4 w-4 text-gray-500" /> */}
              </a>
            )}
            {member.social?.github && (
              <a
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {/* <GitHub className="h-4 w-4 text-gray-500" /> */}
              </a>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-6 flex flex-col justify-between animate-in fade-in">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Expertise
              </h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {member.expertise?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Fun Fact
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {member.funFact}
              </p>
            </div>
            <button className="mt-4 text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              Connect <ExternalLink className="h-3 w-3" />
            </button>
          </div>
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
        {/* <Icon className="h-6 w-6 text-white" /> */}
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
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const timelineRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isMissionInView = useInView(missionRef, { once: true });
  const isValuesInView = useInView(valuesRef, { once: true });
  const isTeamInView = useInView(teamRef, { once: true });
  const isTimelineInView = useInView(timelineRef, { once: true });

  const controls = useAnimation();

  useEffect(() => {
    if (isHeroInView) controls.start("visible");
  }, [isHeroInView, controls]);

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Passionate about building sustainable communities through technology. Former tech lead at major sharing economy platforms.",
      expertise: ["Product Strategy", "Community Building", "Sustainability"],
      funFact: "Once built a treehouse entirely from borrowed tools!",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Sarah Chen",
      role: "Community Manager",
      bio: "Connecting neighbors and fostering trust in local communities. Background in nonprofit and community organizing.",
      expertise: [
        "Community Engagement",
        "Trust & Safety",
        "Conflict Resolution",
      ],
      funFact: "Has visited over 30 countries and borrowed items in each!",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Developer",
      bio: "Building platforms that make sharing easy and secure. Full-stack developer with 10+ years experience.",
      expertise: ["React", "Node.js", "System Architecture"],
      funFact: "Wrote his first program at age 8 on a Commodore 64!",
      social: {
        github: "https://github.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Lisa Wang",
      role: "Partnership Director",
      bio: "Creating meaningful partnerships for community growth. Expert in business development and strategic alliances.",
      expertise: ["Partnerships", "Business Development", "Marketing"],
      funFact: "Has a collection of over 500 books from borrowing!",
      social: {
        linkedin: "https://linkedin.com",
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
      icon: Heart,
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
      icon: Award,
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
    },
    {
      year: "2023",
      event: "Reached 1,000 members",
      description:
        "First community milestone with members across 10 departments.",
    },
    {
      year: "2024",
      event: "Expanded to all departments",
      description: "Rapid growth as more students embraced sharing.",
    },
    {
      year: "2025",
      event: "10,000+ resources shared",
      description: "Over 10,000 items shared, saving members $500,000+.",
    },
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Resources Shared",
      // icon: Package,
      color: "from-green-500 to-emerald-600",
    },
    {
      value: "5,000+",
      label: "Active Members",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      value: "150+",
      label: "Departments",
      icon: Globe,
      color: "from-purple-500 to-pink-600",
    },
    {
      value: "94%",
      label: "Success Rate",
      icon: CheckCircle,
      color: "from-amber-500 to-orange-600",
    },
    {
      value: "$2M+",
      label: "Money Saved",
      icon: DollarSign,
      color: "from-emerald-500 to-green-600",
    },
    {
      value: "50,000kg",
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
                {/* <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" /> */}
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Our Story
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Building Stronger Communities
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Through Sharing
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                We believe that sharing resources builds trust, saves money, and
                creates sustainable communities. Our mission is to make sharing
                easy, safe, and rewarding for everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                    >
                      {/* <Icon className="h-6 w-6 text-white" /> */}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section
          id="mission"
          ref={missionRef}
          className="py-20 bg-gray-50 dark:bg-gray-800/50"
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
                  We are building a platform that reduces waste, saves money, and
                  creates meaningful connections between neighbors. By making it
                  easy to share resources, we are helping communities become more
                  sustainable, resilient, and connected.
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
                  Our Vision
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      1 million connected community members by 2026
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Reduce community waste by 30% through sharing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Create $100M in community savings annually
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Plant 1 million trees through sharing impact
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-20 bg-white dark:bg-gray-900">
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

        {/* Impact Stats Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Numbers that show the difference we are making together in
                communities worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">10,000+</div>
                <div className="text-white/80">Resources Shared</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">5,000+</div>
                <div className="text-white/80">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">150+</div>
                <div className="text-white/80">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">$2M+</div>
                <div className="text-white/80">Community Savings</div>
              </div>
            </div>

            {/* Timeline */}
            <div ref={timelineRef} className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Our Journey
              </h3>
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/30 transform -translate-y-1/2" />
                <div className="relative flex justify-between">
                  {milestones.map((milestone, index) => (
                    <Milestone
                      key={index}
                      milestone={milestone}
                      index={index}
                      isActive={activeMilestone === index}
                      onHover={setActiveMilestone}
                    />
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <p className="text-white/90 max-w-md mx-auto">
                    {milestones[activeMilestone].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className="py-20 bg-white dark:bg-gray-900">
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
