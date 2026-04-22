"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Facebook,
  X,
  Link as LinkIcon,
  Users,
  Mail,
} from "lucide-react";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";

const ShareProfileModal = ({ isOpen, onClose, profileUrl, userName }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      action: copyToClipboard,
      color: "text-gray-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      color: "text-blue-600",
    },
    {
      name: "X",
      icon: X,
      url: `https://twitter.com/intent/tweet?text=Check out ${userName}'s profile on ResourceHub&url=${encodeURIComponent(profileUrl)}`,
      color: "text-sky-500",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${userName}'s ResourceHub Profile&body=Check out their profile: ${profileUrl}`,
      color: "text-gray-600",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Profile" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Share {userName}'s profile with others
        </p>

        <div className="flex gap-3 justify-center">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            if (option.action) {
              return (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${option.color}`}
                  title={option.name}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            }
            return (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${option.color}`}
                title={option.name}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProfileModal;
