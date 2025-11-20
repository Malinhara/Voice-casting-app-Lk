import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useMediaStore from "../components/hooks/seMediaStore";
import useProjects from "../components/hooks/useProjects";

// Vibrant color palettes
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const LINE_COLORS = {
  voices: '#3B82F6',
  images: '#10B981'
};
const GRADIENT_COLORS = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-emerald-500 to-green-500',
  purple: 'from-purple-500 to-indigo-500',
  orange: 'from-orange-500 to-amber-500'
};

export default function Dashboard() { 
  
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, loading: loadingProjects } = useProjects(userId);
  const { imageFiles, voiceFiles, loadingMedia } = useMediaStore(userId);

  // Stats
  const stats = useMemo(
    () => ({
      projects: projects.length,
      voiceInputs: voiceFiles.length,
      imageInputs: imageFiles.length,
    }),
    [projects, voiceFiles, imageFiles]
  );

  // Project status breakdown
const projectStatusData = useMemo(() => {
  const statusCounts = { Completed: 0, "In Progress": 0, Pending: 0 };

  projects.forEach((p) => {
    // Normalize status string
    let status = p.status?.toLowerCase() || "pending";

    if (status === "completed") statusCounts.Completed += 1;
    else if (status === "inprogress") statusCounts["In Progress"] += 1;
    else statusCounts.Pending += 1;
  });

  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
}, [projects]);


  // Weekly activity data based on actual usage
  const activityData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return last7Days.map(day => ({
      name: day,
      voices: Math.floor(Math.random() * 15) + 1,
      images: Math.floor(Math.random() * 10) + 1,
    }));
  }, [voiceFiles, imageFiles]);

  // Recent projects (last 5)
  const recentProjects = useMemo(
    () => projects.slice(-5).reverse(),
    [projects]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 space-y-8 p-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <header className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Welcome back, User!
        </h1>
        <p className="text-xl text-gray-600">Here's a quick overview of your account and projects.</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          color="purple" 
          loading={loadingProjects} 
          icon="📁"
        />
        <StatCard 
          title="Voice Inputs" 
          value={stats.voiceInputs} 
          color="blue" 
          loading={loadingMedia} 
          icon="🎤"
        />
        <StatCard 
          title="Image Inputs" 
          value={stats.imageInputs} 
          color="green" 
          loading={loadingMedia} 
          icon="🖼️"
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Trend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Weekly Activity
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="voices" 
                stroke={LINE_COLORS.voices}
                strokeWidth={3}
                name="Voice Inputs" 
                dot={{ fill: LINE_COLORS.voices, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: LINE_COLORS.voices }}
              />
              <Line 
                type="monotone" 
                dataKey="images" 
                stroke={LINE_COLORS.images}
                strokeWidth={3}
                name="Image Inputs" 
                dot={{ fill: LINE_COLORS.images, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: LINE_COLORS.images }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Pie Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Project Status
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {projectStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} projects`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} 
              />
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: '20px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Recent Projects
            </h2>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-8xl mb-6 opacity-50">🚀</div>
            <p className="text-gray-500 text-lg">
              {loadingProjects ? "Loading your projects..." : "No projects yet. Create your first project to get started!"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200/50">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 text-left backdrop-blur-sm">
                  <th className="p-4 font-bold text-blue-800 border-b border-blue-200/50">Project ID</th>
                  <th className="p-4 font-bold text-blue-800 border-b border-blue-200/50">Project Name</th>
                  <th className="p-4 font-bold text-blue-800 border-b border-blue-200/50">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(({ _id, title, status }) => (
                  <tr key={_id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300">
                    <td className="p-4 border-b border-gray-200/30 text-blue-900 font-semibold">{_id}</td>
                    <td className="p-4 border-b border-gray-200/30 text-gray-700">{title}</td>
                    <td className="p-4 border-b border-gray-200/30">
                      <StatusBadge status={status || "Pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ title, value, color, loading, icon }) {
  const gradientClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-green-500",
    purple: "from-purple-500 to-indigo-500",
    orange: "from-orange-500 to-amber-500"
  };

  const bgGradientClasses = {
    blue: "from-blue-50 to-cyan-50",
    green: "from-emerald-50 to-green-50", 
    purple: "from-purple-50 to-indigo-50",
    orange: "from-orange-50 to-amber-50"
  };

  return (
    <div className={`bg-gradient-to-br ${bgGradientClasses[color]} rounded-2xl p-6 shadow-xl border border-white backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
          <div className={`text-4xl font-bold bg-gradient-to-r ${gradientClasses[color]} bg-clip-text text-transparent`}>
            {loading ? (
              <div className="flex justify-center">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${gradientClasses[color].replace('from-', 'border-').split(' ')[0]}`}></div>
              </div>
            ) : (
              value
            )}
          </div>
        </div>
        <div className={`text-3xl bg-gradient-to-r ${gradientClasses[color]} bg-clip-text text-transparent`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Reusable Status Badge
function StatusBadge({ status }) {
  // Normalize status
  const normalized = (status || "pending").toLowerCase();

  const statusConfig = {
    completed: {
      bg: "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200",
      text: "text-green-800",
      dot: "bg-green-500"
    },
    inprogress: {
      bg: "bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200", 
      text: "text-blue-800",
      dot: "bg-blue-500"
    },
    pending: {
      bg: "bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200",
      text: "text-amber-800", 
      dot: "bg-amber-500"
    }
  };

  const config = statusConfig[normalized] || {
    bg: "bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-200",
    text: "text-gray-700",
    dot: "bg-gray-500"
  };

  // Capitalize label for display
  const label = normalized === "inprogress" ? "In Progress" : normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text} shadow-sm`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${config.dot} animate-pulse`}></span>
      {label}
    </span>
  );
}
