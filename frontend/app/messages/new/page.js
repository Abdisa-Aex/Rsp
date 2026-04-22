"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Search, User, Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function NewConversationPage() {
  const router = useRouter();
  const { user, apiCall } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiCall(`/users/search?q=${searchQuery}`);
      if (response.success) {
        setUsers(response.users.filter((u) => u._id !== user?.id));
      }
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setCreating(true);
    try {
      const response = await apiCall("/messages/conversations", {
        method: "POST",
        body: JSON.stringify({
          participantId: selectedUser._id,
          message: message.trim() || undefined,
        }),
      });

      if (response.success) {
        toast.success("Conversation started!");
        router.push(`/messages/${response.conversation._id}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to start conversation");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Messages
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                New Conversation
              </h1>
              <p className="text-gray-600 mt-1">
                Start a new chat with another user
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type at least 2 characters..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Results
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
                        <p className="text-gray-500 mt-2">Searching...</p>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="p-8 text-center">
                        <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No users found</p>
                      </div>
                    ) : (
                      users.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => setSelectedUser(u)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                            selectedUser?._id === u._id
                              ? "bg-green-50 border-l-4 border-green-500"
                              : ""
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {u.fullName?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {u.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{u.username}
                            </div>
                          </div>
                          {selectedUser?._id === u._id && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {selectedUser.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {selectedUser.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        @{selectedUser.username}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              {selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    placeholder={`Say hello to ${selectedUser.fullName}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={startConversation}
                disabled={!selectedUser || creating}
                variant="primary"
                fullWidth
                className="py-3"
              >
                {creating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5 mr-2" />
                )}
                {creating ? "Starting..." : "Start Conversation"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
