import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserSettings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    subscription: "Basic"
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
            password: "", // leave blank for security
            subscription: data.subscription || "Basic"
          });
        })
        .catch(err => {
          showNotification("Failed to fetch user data.", "error");
          console.error(err);
        });
    }
  }, [userId]);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateDetails = () => {
    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      showNotification("All fields are required.", "error");
      return;
    }

    axios.put(`http://localhost:5000/user/${userId}`, user)
      .then(res => {
        showNotification("User details updated successfully!", "success");
      })
      .catch(err => {
        showNotification("Failed to update details.", "error");
        console.error(err);
      });
  };

  const deleteAccount = () => {
    axios.delete(`http://localhost:5000/user/${userId}`)
      .then(() => {
        localStorage.removeItem("user");
        showNotification("Account deleted successfully!", "success");
        setUser({ name: "", email: "", password: "", subscription: "Basic" });
        setShowDeleteConfirm(false);
      })
      .catch(err => {
        showNotification("Failed to delete account.", "error");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm ${
          notification.type === "success" ? "bg-green-500" :
          notification.type === "error" ? "bg-red-500" :
          "bg-blue-500"
        } text-white px-6 py-3 rounded-xl shadow-2xl`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white">
        <h1 className="text-3xl font-bold mb-6">User Settings</h1>

        <div className="space-y-4 max-w-2xl">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <p className="text-sm text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>

          {/* Subscription */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subscription Type</label>
            <select
              name="subscription"
              value={user.subscription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Basic">Basic - $40</option>
              <option value="Pro">Pro - $100</option>
              <option value="Enterprise">Enterprise - $200</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={updateDetails}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl"
            >
              Update Details
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Account?</h2>
            <p className="mb-6">Are you sure you want to delete your account? This cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 rounded-xl border">Cancel</button>
              <button onClick={deleteAccount} className="flex-1 py-2 rounded-xl bg-red-500 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
