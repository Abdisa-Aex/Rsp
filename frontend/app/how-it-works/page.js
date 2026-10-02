import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up and complete your profile to start using ResourceHub.",
    },
    {
      title: "Browse Resources",
      description:
        "Search and explore available resources shared by the community.",
    },
    {
      title: "Share Resources",
      description: "Upload or share resources that may help other users.",
    },
    {
      title: "Connect with Users",
      description: "Use messaging and requests to communicate securely.",
    },
    {
      title: "Build Community Reputation",
      description: "Earn badges and positive feedback through contributions.",
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">How ResourceHub Works</h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            ResourceHub is a community-driven platform where users can share,
            discover, and manage useful resources safely and efficiently.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
              >
                <h2 className="text-2xl font-semibold mb-3">
                  {index + 1}. {step.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
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
