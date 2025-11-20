import { useState } from "react";
import useProjects from "../components/hooks/useProjects";

export default function ProjectCreation() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, loading, addProject, editProject, removeProject } = useProjects(userId);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleAdd = async () => {
    if (!newProjectName.trim()) {
      showNotification("Please enter a project name", "error");
      return;
    }

    try {
      await addProject(newProjectName.trim());
      setNewProjectName("");
      setNewProjectStatus("Pending");
      showNotification("Project created successfully!", "success");
    } catch (error) {
      showNotification("Failed to create project", "error");
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditName(project.title);
    setEditStatus(project.status);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      showNotification("Project name cannot be empty", "error");
      return;
    }

    try {
      await editProject(editingId, { title: editName.trim(), status: editStatus });
      setEditingId(null);
      showNotification("Project updated successfully!", "success");
    } catch (error) {
      showNotification("Failed to update project", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditStatus("Pending");
    showNotification("Edit cancelled", "info");
  };

  const handleDelete = async (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      try {
        await removeProject(projectId);
        showNotification("Project deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete project", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm ${
          notification.type === "success" ? "bg-green-500" :
          notification.type === "error" ? "bg-red-500" :
          "bg-blue-500"
        } text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 transform transition-all duration-300 animate-in slide-in-from-right-full`}>
          <div className="flex items-center gap-3">
            <div className="text-lg">
              {notification.type === "success" ? "✅" :
               notification.type === "error" ? "❌" : "ℹ️"}
            </div>
            <div>
              <p className="font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: "", type: "" })}
              className="ml-2 hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          <div className="w-full bg-white/30 h-1 mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-progress"></div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Project Management
          </h1>
          <p className="text-lg text-gray-600">Create and manage your projects efficiently</p>
        </div>

        {/* Add Project Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Project
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newProjectStatus}
                onChange={(e) => setNewProjectStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!newProjectName.trim()}
            >
              <span>+</span>
              <span>Add Project</span>
            </button>
          </div>
          
          {!newProjectName.trim() && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm">
              <span>⚠️</span>
              <span>Enter a project name to continue</span>
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Projects
              </h2>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <p className="text-gray-500 text-lg mb-4">No projects yet</p>
              <p className="text-gray-400 mb-6">Get started by creating your first project above!</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Tip:</strong> Projects help you organize your work. Each project can contain multiple tasks and files.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200/50">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 text-left backdrop-blur-sm">
                    <th className="p-4 font-bold text-purple-800 border-b border-purple-200/50">Project Name</th>
                    <th className="p-4 font-bold text-purple-800 border-b border-purple-200/50">Status</th>
                    <th className="p-4 font-bold text-purple-800 border-b border-purple-200/50 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-300">
                      <td className="p-4 border-b border-gray-200/30">
                        {editingId === proj._id ? (
                          <div className="space-y-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              autoFocus
                              placeholder="Enter project name..."
                            />
                            {!editName.trim() && (
                              <p className="text-red-500 text-xs">Project name is required</p>
                            )}
                          </div>
                        ) : (
                          <span className="font-semibold text-gray-800">{proj.title}</span>
                        )}
                      </td>

                      <td className="p-4 border-b border-gray-200/30">
                        {editingId === proj._id ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <StatusBadge status={proj?.status} />
                        )}
                      </td>

                      <td className="p-4 border-b border-gray-200/30">
                        <div className="flex justify-center gap-2">
                          {editingId === proj._id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                disabled={!editName.trim()}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              >
                                <span>✓</span>
                                <span>Save</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                              >
                                <span>✕</span>
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(proj)}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                              >
                                <span>✏️</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(proj._id, proj.title)}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                              >
                                <span>🗑️</span>
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      bg: "bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-500"
    },
    "In Progress": {
      bg: "bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200", 
      text: "text-blue-800",
      dot: "bg-blue-500"
    },
    Completed: {
      bg: "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200",
      text: "text-green-800",
      dot: "bg-green-500"
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} shadow-sm`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${config.dot} animate-pulse`}></span>
      {status}
    </span>
  );
};