import React, { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Trash2, Users, AlertCircle } from "lucide-react";

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/user");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/user/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchUsers();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await fetch(`http://localhost:5000/user/${id}`, {
        method: "DELETE"
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || (user.status || "active") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => (u.status || "active") === "active").length,
    hold: users.filter(u => u.status === "hold").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Users className="text-blue-600" size={40} />
            User Management
          </h1>
          <p className="text-slate-600">Manage all registered users and their subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Active Users</p>
                <p className="text-3xl font-bold text-slate-800">{stats.active}</p>
              </div>
              <UserCheck className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">On Hold</p>
                <p className="text-3xl font-bold text-slate-800">{stats.hold}</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-slate-600 font-medium">No users found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-700">User</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Subscription</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-slate-100 hover:bg-slate-50 transition ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.subscription === "Premium" 
                            ? "bg-purple-100 text-purple-700"
                            : user.subscription === "Pro"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {user.subscription || "Free"}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.status || "active"}
                          onChange={(e) => updateStatus(user._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 outline-none transition ${
                            (user.status || "active") === "active"
                              ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300"
                              : "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="hold">Hold</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow-sm hover:shadow"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Info */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-center text-slate-600 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}