"use client";

import { Package, Heart, Star, Handshake } from "lucide-react";

const EmptyState = ({ type, action }) => {
  const config = {
    items: {
      icon: Package,
      title: "No items yet",
      message: "Start sharing items with the community",
      button: "Share an Item",
      link: "/share",
    },
    wishlist: {
      icon: Heart,
      title: "Wishlist is empty",
      message: "Save items you're interested in",
      button: "Browse Resources",
      link: "/browse",
    },
    reviews: {
      icon: Star,
      title: "No reviews yet",
      message: "Your reviews will appear here",
      button: null,
      link: null,
    },
    exchanges: {
      icon: Handshake,
      title: "No exchanges yet",
      message: "Start borrowing or sharing items",
      button: "Browse Resources",
      link: "/browse",
    },
  };

  const c = config[type] || config.items;

  return (
    <div className="text-center py-12">
      <c.icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{c.title}</h3>
      <p className="text-gray-500 mb-6">{c.message}</p>
      {c.button && (
        <button
          onClick={() => (window.location.href = c.link)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {c.button}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
