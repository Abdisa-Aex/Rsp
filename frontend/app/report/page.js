"use client";

import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function ReportPage() {
  const [issue, setIssue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Issue submitted successfully");
    setIssue("");
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Report an Issue</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
          >
            <textarea
              rows={6}
              placeholder="Describe the issue..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full p-4 rounded-lg border dark:bg-gray-900"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
