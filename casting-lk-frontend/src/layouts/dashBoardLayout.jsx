import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../components/sideNav";
import axios from "axios";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", subscription: "", role: "User" });

  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;

  // Fetch user data from backend
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/user/${userId}`)
        .then(res => {
          const data = res.data;
          setUser({
            name: data.name || "",
            email: data.email || "",
            subscription: data.subscription || "Basic",
            role: "User" // or set dynamically if your API returns a role
          });
        })
        .catch(err => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [userId]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideNav closeMenu={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-800 bg-gray-100 shadow lg:hidden"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* User info */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name || "User"}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D8ABC&color=fff&size=40`}
              alt="User avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
