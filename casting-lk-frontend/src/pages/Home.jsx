import "../App.css";
import Contact from "../components/ui/contact";
import Services from "../components/ui/serviceCard";
import Subscriptions from "../components/ui/subscriptions";

export default function Home() {
  return (
    <div id="home" className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-50 flex flex-col items-center justify-center p-6 space-y-8 ">
      <h1  className="text-5xl font-extrabold text-center text-indigo-700 drop-shadow-lg mt-36">
        Welcome to Voice Casting
      </h1>
      <p className="text-xl text-center text-gray-700 max-w-xl">
        Discover amazing voice talents or showcase your voice for casting projects.
      </p>
      <div className="w-full max-w-xl shadow-2xl border border-indigo-200 rounded-2xl p-8 bg-white/90 backdrop-blur-sm text-center space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-800">Get Started</h2>
        <p className="text-gray-600">
          Join our community of voice actors, directors, and casting agents to collaborate on exciting projects.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 transition transform hover:scale-105">
          Explore
        </button>
      </div>


      <div id="services">
        <Services />
      </div>

     <div id="pricing">
      <Subscriptions />
       </div>
      {/* Contact Section */}
      <div id="about">
        <Contact />
      </div>
    </div>
  );
}
