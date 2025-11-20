import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

export default function SideNav({ closeMenu }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Main Dashboard", icon: "📊" },
    { path: "/dashboard/analysis", label: "Character Analyzer", icon: "🔍" },
    { path: "/dashboard/compare-voices", label: "Compare Voices", icon: "🎵" },
    { path: "/dashboard/create-project", label: "Create Project", icon: "🚀" },
    { path: "/dashboard/media-store", label: "Media Store", icon: "📁" },
    { path: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 min-h-screen flex flex-col shadow-2xl border-r border-gray-700">
      {/* Close button (mobile only) */}
      <div className="flex items-center justify-between lg:hidden mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VC</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            VoiceCraft
          </h2>
        </div>
        <button 
          onClick={closeMenu}
          className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <XMarkIcon className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">VC</span>
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            VoiceCraft
          </h2>
          <p className="text-gray-400 text-xs">Character Analysis Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2 flex-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-cyan-400 text-cyan-100 shadow-lg"
                  : "hover:bg-gray-700/50 hover:border-l-4 hover:border-gray-500 text-gray-300"
              }`}
              onClick={closeMenu}
            >
              <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                isActive(item.path) ? "text-cyan-400" : "text-gray-400"
              }`}>
                {item.icon}
              </span>
              <span className={`font-medium transition-all duration-200 ${
                isActive(item.path) ? "text-white" : "group-hover:text-white"
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User Account</p>
            <p className="text-xs text-gray-400 truncate">Premium Member</p>
          </div>
        </div>
      </div>
    </nav>
  );
}