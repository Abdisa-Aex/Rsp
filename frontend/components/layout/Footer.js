
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import AppBadges from "components/ui/AppBadges";
import { Heart } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { GitHub } from "react-feather";
import { Youtube } from "react-feather";
import { Linkedin } from "react-feather";
import { Instagram } from "react-feather";
import { Twitter } from "react-feather";
import { Facebook } from "react-feather";



const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setEmail("");
    }
  };

  const footerLinks = {
    Platform: [
      { name: "Browse Resources", href: "/browse" },
      { name: "Share Resources", href: "/share" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Safety Guidelines", href: "/safety" },
      { name: "Success Stories", href: "/stories" },
    ],
    Community: [
      { name: "Community Guidelines", href: "/guidelines" },
      { name: "Become a Partner", href: "/partner" },
      { name: "Volunteer", href: "/volunteer" },
      { name: "Events", href: "/events" },
      { name: "Forum", href: "/forum" },
    ],
    Support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Report an Issue", href: "/report" },
      { name: "FAQ", href: "/faq" },
      { name: "Status", href: "/status" },
    ],
    Legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
      { name: "Data Request", href: "/data-request" },
    ],
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">RH</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                ResourceHub
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting communities through sharing. Reduce waste, save money,
              and build stronger neighborhoods together.
            </p>

            {/* Social Icons - Individual rendering */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
               
                <Youtube className="h-5 w-5" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-400 transition-colors"
                aria-label="GitHub"
              >
                <GitHub className="h-5 w-5" />
              </a>
            </div>

            <AppBadges variant="compact" />
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Get the latest news and updates
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-r-lg hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
          {newsletterSubscribed && (
            <p className="text-green-400 text-sm text-center mt-2">
              Thanks for subscribing!
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} ResourceHub. All rights reserved.
            <span className="hidden md:inline mx-2">•</span>
            <span className="block md:inline mt-1 md:mt-0">
              Made with <Heart className="h-3 w-3 inline text-red-500" /> for
              stronger communities
            </span>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;