import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AnnouncementBar from "../../components/layout/AnnouncementBar";

export default function EventsPage() {
  const events = [
    {
      title: "Community Resource Sharing Day",
      date: "June 15, 2026",
    },
    {
      title: "Student Collaboration Workshop",
      date: "July 2, 2026",
    },
    {
      title: "Tech & Innovation Meetup",
      date: "August 10, 2026",
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-gray-900 dark:text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Community Events</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>

                <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
