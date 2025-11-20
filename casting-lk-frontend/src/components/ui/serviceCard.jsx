export default function Services() {
  const services = [
    {
      title: "Voice Sample Matching",
      description: "Develop a complete web-based system that matches voice samples for a particular character.",
      icon: (
        <svg
          className="w-10 h-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.342 6.576c-.29 1.12-1.12 2-2.235 2.357a12.04 12.04 0 01-8.99-1.18L12 14z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7"></path>
        </svg>
      ),
    },
    {
      title: "Character Evaluation",
      description:
        "Evaluate commercial and film character characteristics input (text/image) with past experience data to determine ideal voice traits.",
      icon: (
        <svg
          className="w-10 h-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 16h.01"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h.01"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h.01"></path>
        </svg>
      ),
    },
    {
      title: "Data-driven Suggestions",
      description:
        "Provide data-driven suggestions and similarity scores to support casting suggestions.",
      icon: (
        <svg
          className="w-10 h-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 17v-6a2 2 0 012-2h.5a2 2 0 012 2v6"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-#e7ebf flex flex-col items-center justify-center p-10 space-y-12">
      <h2 className="text-4xl font-bold text-indigo-700 mb-10">Our Services</h2>
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3 max-w-6xl w-full">
        {services.map(({ title, description, icon }) => (
          <div
            key={title}
            className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-start space-y-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="bg-indigo-100 p-4 rounded-xl">{icon}</div>
            <h3 className="text-2xl font-semibold text-indigo-800">{title}</h3>
            <p className="text-gray-700">{description}</p>
            <button className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-3 transition transform hover:scale-105">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
