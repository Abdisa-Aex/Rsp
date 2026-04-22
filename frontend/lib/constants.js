// Categories with Complete Data
export const categories = [
  {
    id: 1,
    name: "Tools",
    icon: "🔧",
    iconComponent: "Wrench",
    count: 342,
    color: "from-blue-500 to-cyan-500",
    description: "Power tools, hand tools, and equipment for any project",
    popular: ["Power Drills", "Saws", "Wrenches", "Screwdrivers", "Hammers"],
    image: "/images/categories/tools.jpg",
    trending: true,
    new: false,
  },
  {
    id: 2,
    name: "Gardening",
    icon: "🌱",
    iconComponent: "Sprout",
    count: 198,
    color: "from-emerald-500 to-green-500",
    description: "Garden tools, seeds, and equipment for your green space",
    popular: ["Lawn Mowers", "Pruners", "Tillers", "Hoses", "Shovels"],
    image: "/images/categories/gardening.jpg",
    trending: true,
    new: false,
  },
  {
    id: 3,
    name: "Kitchen",
    icon: "🍳",
    iconComponent: "Utensils",
    count: 156,
    color: "from-orange-500 to-amber-500",
    description: "Cookware, appliances, and utensils for culinary adventures",
    popular: [
      "Mixers",
      "Blenders",
      "Cookware Sets",
      "Knives",
      "Baking Supplies",
    ],
    image: "/images/categories/kitchen.jpg",
    trending: false,
    new: true,
  },
  {
    id: 4,
    name: "Books",
    icon: "📚",
    iconComponent: "Book",
    count: 423,
    color: "from-purple-500 to-pink-500",
    description: "Fiction, non-fiction, textbooks, and educational materials",
    popular: [
      "Novels",
      "Textbooks",
      "Children Books",
      "Biographies",
      "Self-Help",
    ],
    image: "/images/categories/books.jpg",
    trending: true,
    new: false,
  },
  {
    id: 5,
    name: "Sports",
    icon: "⚽",
    iconComponent: "Activity",
    count: 87,
    color: "from-red-500 to-orange-500",
    description: "Sports equipment and gear for active lifestyles",
    popular: ["Balls", "Rackets", "Camping Gear", "Bikes", "Fitness Equipment"],
    image: "/images/categories/sports.jpg",
    trending: false,
    new: false,
  },
  {
    id: 6,
    name: "Electronics",
    icon: "💻",
    iconComponent: "Monitor",
    count: 231,
    color: "from-slate-500 to-gray-500",
    description: "Gadgets, computers, and tech accessories",
    popular: ["Laptops", "Cameras", "Audio Equipment", "Phones", "Tablets"],
    image: "/images/categories/electronics.jpg",
    trending: true,
    new: true,
  },
  {
    id: 7,
    name: "Furniture",
    icon: "🛋️",
    iconComponent: "Armchair",
    count: 112,
    color: "from-amber-500 to-yellow-500",
    description: "Home and office furniture for comfortable living",
    popular: ["Chairs", "Tables", "Desks", "Sofas", "Shelves"],
    image: "/images/categories/furniture.jpg",
    trending: false,
    new: false,
  },
  {
    id: 8,
    name: "Skills",
    icon: "🎨",
    iconComponent: "GraduationCap",
    count: 289,
    color: "from-rose-500 to-pink-500",
    description: "Share your skills and expertise with the community",
    popular: [
      "Tutoring",
      "Music Lessons",
      "DIY Workshops",
      "Coding",
      "Art Classes",
    ],
    image: "/images/categories/skills.jpg",
    trending: true,
    new: true,
  },
];

// Featured Resources
export const featuredResources = [
  {
    id: 1,
    title: "Professional Power Drill Set",
    description:
      "Complete cordless drill set with various bits. Perfect for DIY projects and home repairs.",
    category: "Tools",
    location: "Downtown",
    postedBy: "Alex Johnson",
    timeAgo: "2 hours ago",
    rating: 4.8,
    isVerified: true,
    isTrending: true,
    image: "/images/resources/drill-set.jpg",
    price: 25,
    priceUnit: "day",
    availability: "available",
  },
  // ... more featured resources
];

// How It Works Steps
export const howItWorks = [
  {
    step: "1",
    title: "Browse & Find",
    description:
      "Search through thousands of resources shared by community members.",
    icon: "Search",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "2",
    title: "Connect & Arrange",
    description:
      "Message the resource owner directly through our secure platform.",
    icon: "MessageCircle",
    color: "from-emerald-500 to-green-500",
  },
  {
    step: "3",
    title: "Share & Return",
    description:
      "Borrow the resource for your agreed timeframe. After use, return it.",
    icon: "RefreshCw",
    color: "from-orange-500 to-amber-500",
  },
];

// Community Stats
export const communityStats = {
  totalResources: 1842,
  activeMembers: 1256,
  totalExchanges: 3421,
  cities: 24,
  successRate: 94,
  averageRating: 4.7,
  monthlyGrowth: 23,
  topCategories: [
    { name: "Tools", percentage: 28, count: 516 },
    { name: "Books", percentage: 22, count: 405 },
    { name: "Gardening", percentage: 15, count: 276 },
    { name: "Electronics", percentage: 12, count: 221 },
    { name: "Kitchen", percentage: 10, count: 184 },
  ],
  dailyActivity: [
    { day: "Mon", views: 1245, exchanges: 89 },
    { day: "Tue", views: 1389, exchanges: 102 },
    { day: "Wed", views: 1567, exchanges: 134 },
    { day: "Thu", views: 1423, exchanges: 118 },
    { day: "Fri", views: 1789, exchanges: 156 },
    { day: "Sat", views: 2102, exchanges: 189 },
    { day: "Sun", views: 1987, exchanges: 167 },
  ],
};

// Sort Options
export const sortOptions = [
  { id: "newest", label: "Newest First", icon: "Clock", value: "newest" },
  { id: "popular", label: "Most Popular", icon: "Star", value: "popular" },
  { id: "trending", label: "Trending", icon: "TrendingUp", value: "trending" },
  {
    id: "recommended",
    label: "Recommended",
    icon: "Users",
    value: "recommended",
  },
  {
    id: "price_asc",
    label: "Price: Low to High",
    icon: "DollarSign",
    value: "price_asc",
  },
  {
    id: "price_desc",
    label: "Price: High to Low",
    icon: "DollarSign",
    value: "price_desc",
  },
  { id: "distance", label: "Nearest First", icon: "MapPin", value: "distance" },
  { id: "rating", label: "Highest Rated", icon: "Star", value: "rating" },
];

// Pagination Config
export const paginationConfig = {
  defaultItemsPerPage: 12,
  itemsPerPageOptions: [12, 24, 48, 96],
  maxVisiblePages: 5,
  showFirstLast: true,
};

// Search Config
export const searchConfig = {
  debounceDelay: 300,
  minSearchLength: 2,
  maxSuggestions: 5,
  recentSearchesLimit: 5,
  popularSearches: [
    "Power tools",
    "Gardening equipment",
    "Kitchen appliances",
    "Textbooks",
    "Camping gear",
  ],
};

// Format helpers
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export const formatPrice = (price, unit = "day") => {
  return `$${price}/${unit}`;
};

export const formatRating = (rating) => {
  return `${rating} ★ (${rating.toFixed(1)})`;
};

export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
};
