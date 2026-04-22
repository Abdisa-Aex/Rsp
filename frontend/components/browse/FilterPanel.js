"use client";

import {
  TrendingUp,
  Clock,
  Star,
  Users,
  Download,
  Sparkles,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function FilterPanel({
  showFilters,
  filters,
  setFilters,
  toggleResourceType,
  toggleTheme,
  resetFilters,
}) {
  const getBorderColor = (typeId) => {
    switch (typeId) {
      case "physical":
        return "#3b82f6";
      case "digital":
        return "#8b5cf6";
      case "template":
        return "#f97316";
      case "tool":
        return "#10b981";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div className="lg:w-96">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl mb-6 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Filter & Sort</span>
          <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            {filters.resourceType.length + filters.theme.length} active
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Panel */}
      <div
        className={`${showFilters ? "block" : "hidden lg:block"} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 space-y-8`}
      >
        {/* Sort By Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Sort By</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "newest",
                label: "Newest",
                icon: Clock,
                desc: "Recently added",
              },
              {
                id: "popular",
                label: "Most Popular",
                icon: Star,
                desc: "Highly rated",
              },
              {
                id: "trending",
                label: "Trending",
                icon: TrendingUp,
                desc: "Hot right now",
              },
              {
                id: "recommended",
                label: "Recommended",
                icon: Users,
                desc: "For you",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, sortBy: option.id }))
                }
                className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
                  filters.sortBy === option.id
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
                    : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${filters.sortBy === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium text-base ${filters.sortBy === option.id ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Resource Type Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Resource Type</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "physical",
                label: "Physical Theme",
                color: "from-blue-500 to-cyan-500",
              },
              {
                id: "digital",
                label: "Digital Theme",
                color: "from-purple-500 to-pink-500",
              },
              {
                id: "template",
                label: "Templates",
                color: "from-orange-500 to-amber-500",
              },
              {
                id: "tool",
                label: "Tools",
                color: "from-green-500 to-emerald-500",
              },
            ].map((type) => {
              const isSelected = filters.resourceType.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => toggleResourceType(type.id)}
                  className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-200 group ${
                    isSelected
                      ? "border-2"
                      : "border border-gray-200 hover:border-emerald-200"
                  }`}
                  style={
                    isSelected
                      ? { borderColor: getBorderColor(type.id) }
                      : undefined
                  }
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-gradient-to-r ${type.color}`}
                  />
                  <span
                    className={`font-medium text-base ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {type.label}
                  </span>
                  <div
                    className={`ml-auto h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-100"
                        : "border-gray-300 group-hover:border-emerald-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-3 w-3 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "business",
                label: "Business",
                color: "from-blue-500 to-indigo-500",
              },
              {
                id: "creative",
                label: "Creative",
                color: "from-purple-500 to-pink-500",
              },
              {
                id: "education",
                label: "Education",
                color: "from-emerald-500 to-green-500",
              },
              {
                id: "health",
                label: "Health",
                color: "from-red-500 to-orange-500",
              },
              {
                id: "tech",
                label: "Technology",
                color: "from-cyan-500 to-blue-500",
              },
              {
                id: "lifestyle",
                label: "Lifestyle",
                color: "from-amber-500 to-yellow-500",
              },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => toggleTheme(theme.id)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  filters.theme.includes(theme.id)
                    ? "ring-2 ring-offset-2 ring-emerald-400 bg-emerald-50/50"
                    : "hover:ring-1 hover:ring-emerald-200 hover:bg-emerald-50/30"
                }`}
              >
                <div className={`${theme.color} h-2 w-full rounded mb-2`} />
                <span
                  className={`text-sm font-medium ${
                    filters.theme.includes(theme.id)
                      ? "text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {theme.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-xl">Availability</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "all",
                label: "All Resources",
                icon: Globe,
                desc: "Show everything",
              },
              {
                id: "available",
                label: "Available Now",
                icon: CheckCircle,
                desc: "Immediate access",
              },
              {
                id: "upcoming",
                label: "Upcoming",
                icon: Clock,
                desc: "Releasing soon",
              },
              {
                id: "limited",
                label: "Limited Stock",
                icon: XCircle,
                desc: "Limited quantity",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, availability: option.id }))
                }
                className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
                  filters.availability === option.id
                    ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
                    : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${filters.availability === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
                >
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div
                    className={`font-medium text-base ${filters.availability === option.id ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-base text-gray-600">
              <Filter className="h-5 w-5" />
              <span>
                {filters.resourceType.length + filters.theme.length} filters
                selected
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="text-base text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg rounded-xl hover:shadow-lg transition-all duration-300 shadow-md">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
        <h3 className="font-bold text-xl mb-6">Community Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-emerald-100 text-base">Total Resources</span>
            <span className="font-bold text-lg">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-100 text-base">Active Members</span>
            <span className="font-bold text-lg">892</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-100 text-base">Cities</span>
            <span className="font-bold text-lg">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-100 text-base">Success Rate</span>
            <span className="font-bold text-lg">94%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import {
//   TrendingUp,
//   Clock,
//   Star,
//   Users,
//   Download,
//   Sparkles,
//   Calendar,
//   Globe,
//   CheckCircle,
//   XCircle,
//   Filter,
//   ChevronDown,
// } from "lucide-react";

// export default function FilterPanel({
//   showFilters,
//   filters,
//   setFilters,
//   toggleResourceType,
//   toggleTheme,
//   resetFilters,
// }) {
//   const getBorderColor = (typeId) => {
//     switch (typeId) {
//       case "physical":
//         return "#3b82f6";
//       case "digital":
//         return "#8b5cf6";
//       case "template":
//         return "#f97316";
//       case "tool":
//         return "#10b981";
//       default:
//         return "#e5e7eb";
//     }
//   };

//   return (
//     <div className="lg:w-96">
//       {/* Mobile Filter Toggle */}
//       <button
//         onClick={() => setShowFilters(!showFilters)}
//         className="lg:hidden w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl mb-6 hover:shadow-md transition-all duration-300"
//       >
//         <div className="flex items-center gap-3">
//           <Filter className="h-5 w-5 text-emerald-600" />
//           <span className="font-semibold text-gray-800">Filter & Sort</span>
//           <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
//             {/* {filters.resourceType.length + filters.theme.length} active */}
//           </span>
//         </div>
//         <ChevronDown
//           className={`h-5 w-5 text-gray-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
//         />
//       </button>

//       {/* Filter Panel */}
//       <div
//         className={`${showFilters ? "block" : "hidden lg:block"} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 space-y-8`}
//       >
//         {/* Sort By Section */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <TrendingUp className="h-5 w-5 text-emerald-600" />
//             <h3 className="font-bold text-gray-900 text-xl">Sort By</h3>
//           </div>
//           <div className="space-y-3">
//             {[
//               {
//                 id: "newest",
//                 label: "Newest",
//                 icon: Clock,
//                 desc: "Recently added",
//               },
//               {
//                 id: "popular",
//                 label: "Most Popular",
//                 icon: Star,
//                 desc: "Highly rated",
//               },
//               {
//                 id: "trending",
//                 label: "Trending",
//                 icon: TrendingUp,
//                 desc: "Hot right now",
//               },
//               {
//                 id: "recommended",
//                 label: "Recommended",
//                 icon: Users,
//                 desc: "For you",
//               },
//             ].map((option) => (
//               <button
//                 key={option.id}
//                 onClick={() =>
//                   setFilters((prev) => ({ ...prev, sortBy: option.id }))
//                 }
//                 className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
//                   filters.sortBy === option.id
//                     ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
//                     : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-lg ${filters.sortBy === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
//                 >
//                   <option.icon className="h-5 w-5" />
//                 </div>
//                 <div className="text-left flex-1">
//                   <div
//                     className={`font-medium text-base ${filters.sortBy === option.id ? "text-gray-900" : "text-gray-700"}`}
//                   >
//                     {option.label}
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">
//                     {option.desc}
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Resource Type Section */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <Download className="h-5 w-5 text-emerald-600" />
//             <h3 className="font-bold text-gray-900 text-xl">Resource Type</h3>
//           </div>
//           <div className="space-y-3">
//             {[
//               {
//                 id: "physical",
//                 label: "Physical Theme",
//                 color: "from-blue-500 to-cyan-500",
//               },
//               {
//                 id: "digital",
//                 label: "Digital Theme",
//                 color: "from-purple-500 to-pink-500",
//               },
//               {
//                 id: "template",
//                 label: "Templates",
//                 color: "from-orange-500 to-amber-500",
//               },
//               {
//                 id: "tool",
//                 label: "Tools",
//                 color: "from-green-500 to-emerald-500",
//               },
//             ].map((type) => {
//               const isSelected = filters.resourceType.includes(type.id);
//               return (
//                 <button
//                   key={type.id}
//                   onClick={() => toggleResourceType(type.id)}
//                   className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-200 group ${
//                     isSelected
//                       ? "border-2"
//                       : "border border-gray-200 hover:border-emerald-200"
//                   }`}
//                   style={
//                     isSelected
//                       ? { borderColor: getBorderColor(type.id) }
//                       : undefined
//                   }
//                 >
//                   <div
//                     className={`h-4 w-4 rounded-full bg-gradient-to-r ${type.color}`}
//                   />
//                   <span
//                     className={`font-medium text-base ${isSelected ? "text-gray-900" : "text-gray-700"}`}
//                   >
//                     {type.label}
//                   </span>
//                   <div
//                     className={`ml-auto h-6 w-6 rounded-full border-2 flex items-center justify-center ${
//                       isSelected
//                         ? "border-emerald-500 bg-emerald-100"
//                         : "border-gray-300 group-hover:border-emerald-300"
//                     }`}
//                   >
//                     {isSelected && (
//                       <div className="h-3 w-3 rounded-full bg-emerald-600" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Theme Categories */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <Sparkles className="h-5 w-5 text-emerald-600" />
//             <h3 className="font-bold text-gray-900 text-xl">Theme</h3>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             {[
//               {
//                 id: "business",
//                 label: "Business",
//                 color: "from-blue-500 to-indigo-500",
//               },
//               {
//                 id: "creative",
//                 label: "Creative",
//                 color: "from-purple-500 to-pink-500",
//               },
//               {
//                 id: "education",
//                 label: "Education",
//                 color: "from-emerald-500 to-green-500",
//               },
//               {
//                 id: "health",
//                 label: "Health",
//                 color: "from-red-500 to-orange-500",
//               },
//               {
//                 id: "tech",
//                 label: "Technology",
//                 color: "from-cyan-500 to-blue-500",
//               },
//               {
//                 id: "lifestyle",
//                 label: "Lifestyle",
//                 color: "from-amber-500 to-yellow-500",
//               },
//             ].map((theme) => (
//               <button
//                 key={theme.id}
//                 onClick={() => toggleTheme(theme.id)}
//                 className={`p-3 rounded-lg transition-all duration-200 ${
//                   filters.theme.includes(theme.id)
//                     ? "ring-2 ring-offset-2 ring-emerald-400 bg-emerald-50/50"
//                     : "hover:ring-1 hover:ring-emerald-200 hover:bg-emerald-50/30"
//                 }`}
//               >
//                 <div className={`${theme.color} h-2 w-full rounded mb-2`} />
//                 <span
//                   className={`text-sm font-medium ${
//                     filters.theme.includes(theme.id)
//                       ? "text-gray-900"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {theme.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Availability Section */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <Calendar className="h-5 w-5 text-emerald-600" />
//             <h3 className="font-bold text-gray-900 text-xl">Availability</h3>
//           </div>
//           <div className="space-y-3">
//             {[
//               {
//                 id: "all",
//                 label: "All Resources",
//                 icon: Globe,
//                 desc: "Show everything",
//               },
//               {
//                 id: "available",
//                 label: "Available Now",
//                 icon: CheckCircle,
//                 desc: "Immediate access",
//               },
//               {
//                 id: "upcoming",
//                 label: "Upcoming",
//                 icon: Clock,
//                 desc: "Releasing soon",
//               },
//               {
//                 id: "limited",
//                 label: "Limited Stock",
//                 icon: XCircle,
//                 desc: "Limited quantity",
//               },
//             ].map((option) => (
//               <button
//                 key={option.id}
//                 onClick={() =>
//                   setFilters((prev) => ({ ...prev, availability: option.id }))
//                 }
//                 className={`flex items-start gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
//                   filters.availability === option.id
//                     ? "bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-400"
//                     : "bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-lg ${filters.availability === option.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}
//                 >
//                   <option.icon className="h-5 w-5" />
//                 </div>
//                 <div className="text-left">
//                   <div
//                     className={`font-medium text-base ${filters.availability === option.id ? "text-gray-900" : "text-gray-700"}`}
//                   >
//                     {option.label}
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">
//                     {option.desc}
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Filter Actions */}
//         <div className="pt-8 border-t border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2 text-base text-gray-600">
//               <Filter className="h-5 w-5" />
//               <span>
//                 {filters.resourceType.length + filters.theme.length} filters
//                 selected
//               </span>
//             </div>
//             <button
//               onClick={resetFilters}
//               className="text-base text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
//             >
//               Clear All
//             </button>
//           </div>
//           <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg rounded-xl hover:shadow-lg transition-all duration-300 shadow-md">
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
//         <h3 className="font-bold text-xl mb-6">Community Stats</h3>
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <span className="text-emerald-100 text-base">Total Resources</span>
//             <span className="font-bold text-lg">1,234</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-emerald-100 text-base">Active Members</span>
//             <span className="font-bold text-lg">892</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-emerald-100 text-base">Cities</span>
//             <span className="font-bold text-lg">24</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-emerald-100 text-base">Success Rate</span>
//             <span className="font-bold text-lg">94%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
