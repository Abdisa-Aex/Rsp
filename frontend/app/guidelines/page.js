import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function GuidelinesPage() {
  const guidelines = [
    "Treat all users respectfully.",
    "Do not upload harmful or illegal content.",
    "Avoid spam or misleading information.",
    "Use appropriate language in messages and posts.",
    "Help maintain a supportive community environment.",
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Community Guidelines</h1>

          <div className="space-y-4">
            {guidelines.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
              >
                <p className="text-lg">
                  {index + 1}. {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
