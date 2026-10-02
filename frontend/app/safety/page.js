import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function SafetyPage() {
  const rules = [
    "Verify user information before transactions.",
    "Avoid sharing sensitive personal information.",
    "Meet in safe public locations when exchanging resources.",
    "Report suspicious or abusive behavior immediately.",
    "Respect community rules and platform policies.",
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Safety Guidelines</h1>

          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
              >
                <h2 className="font-semibold text-xl mb-2">
                  Guideline {index + 1}
                </h2>

                <p className="text-gray-600 dark:text-gray-300">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
