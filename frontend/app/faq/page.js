import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I share resources?",
      answer:
        "Navigate to the Share Resources page and complete the upload form.",
    },
    {
      question: "Is ResourceHub free?",
      answer: "Yes, ResourceHub provides free access to these features.",
    },
    {
      question: "How can I report a user?",
      answer:
        "Use the Report feature available on profiles and resource pages.",
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Frequently Asked Questions
          </h1>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
              >
                <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>

                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
