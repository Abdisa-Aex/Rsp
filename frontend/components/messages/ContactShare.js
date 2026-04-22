"use client";

import { User, Phone, Mail, Copy, Check, MessageCircle } from "lucide-react";

const ContactShare = ({ contact, theme }) => {
  const [copied, setCopied] = useState(false);

  const copyContact = () => {
    const text = `${contact.name}\n${contact.phone || ""}\n${contact.email || ""}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const handleMessage = () => {
    if (contact.phone) {
      window.location.href = `sms:${contact.phone}`;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <User className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Contact</span>
      </div>

      <p className="font-medium text-gray-900 dark:text-white">
        {contact.name}
      </p>

      {contact.phone && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {contact.phone}
        </p>
      )}

      {contact.email && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {contact.email}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        {contact.phone && (
          <>
            <button
              onClick={handleCall}
              className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <Phone className="h-3 w-3" />
              Call
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="h-3 w-3" />
              Message
            </button>
          </>
        )}
        {contact.email && (
          <button
            onClick={handleEmail}
            className={`flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 ${contact.phone ? "" : "w-full"}`}
          >
            <Mail className="h-3 w-3" />
            Email
          </button>
        )}
        <button
          onClick={copyContact}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ContactShare;
