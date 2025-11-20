export default function Contact() {
  return (
    <section className="min-h-screen bg-#e7ebf flex items-center justify-center p-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-lg p-8 md:flex md:space-x-12">
        {/* Contact Info */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl font-bold text-indigo-700 mb-6">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            We'd love to hear from you! Whether you have questions or want to collaborate,
            feel free to reach out.
          </p>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong>Email:</strong> <a href="mailto:support@voicecasting.com" className="text-indigo-600 hover:underline">support@voicecasting.com</a>
            </div>
            <div>
              <strong>Phone:</strong> <a href="tel:+1234567890" className="text-indigo-600 hover:underline">+1 (234) 567-890</a>
            </div>
            <div>
              <strong>Address:</strong> 123 Voice St, Audio City, CA
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="md:w-1/2 space-y-6" onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              required
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Write your message here..."
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
