"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ metric, onClick }) => {
  const getTrendIcon = () => {
    if (metric.trend === "up") {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    }
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = () => {
    if (metric.trend === "up") return "text-green-600";
    return "text-red-600";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(metric.title)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {metric.title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {metric.value}
          </h3>
          {metric.subtitle && (
            <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
          )}
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {metric.change}
            </span>
            <span className="text-xs text-gray-400">vs last week</span>
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${metric.color} shadow-lg group-hover:scale-110 transition-transform group-hover:shadow-xl`}
        >
          <metric.icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
