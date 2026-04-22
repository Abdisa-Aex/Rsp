"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Handshake as HandshakeIcon,
  Compass as CompassIcon,
  Map as MapIcon,
  Pepper as PepperIcon,
} from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import SearchSection from "./SearchSection";
import UserActions from "./UserActions";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              aria-label="ResourceHub Home"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">RH</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ResourceHub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLinks />
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <SearchSection />
              <UserActions />
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-800"
            >
              <div className="container mx-auto px-4 py-4">
                <SearchSection
                  variant="mobile"
                  onClose={() => setIsSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
