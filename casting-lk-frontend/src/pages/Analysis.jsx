import { useState } from "react";
import useMediaStore from "../components/hooks/seMediaStore";
import useAnalysis from "../components/hooks/useAnalysis";
import useImageAnalysis from "../components/hooks/useImageAnalysis";
import useProjects from "../components/hooks/useProjects"; 
import ReactMarkdown from "react-markdown";

export default function Analyzer() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, addProject, loading } = useProjects(userId);
  const { handleImageAnalyze, analysisResult } = useImageAnalysis(userId);
  const { handleVoiceAnalyze, analysisVoiceResult, finalAnalysis, FinalAnalyze, loadingVoice, loadingFinal, handleUpdateProject, fetchPastProject, pastData, loadingPast } = useAnalysis(userId);
  const { imageFiles, voiceFiles } = useMediaStore(userId);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [script, setScript] = useState("");
  const { handleUpload } = useMediaStore(userId);
  const isProjectSelected = !!selectedProjectId;
  const [showPastResult, setShowPastResult] = useState(false);

const formatVoiceAnalysis = (data) => {
  if (!data) return "No data available.";

  const v = data.voice1; 

  if (!v) return "No valid voice data.";

  return `
**Pitch:** ${v.pitch.value} ${v.pitch.unit} (${v.pitch.label})\n
**Energy:** ${v.energy.value} ${v.energy.unit} (${v.energy.label})\n
**Tone:** ${v.tone.value} ${v.tone.unit} (${v.tone.label})\n
**Speech Rate:** ${v.speech_rate.value} ${v.speech_rate.unit} (${v.speech_rate.label})\n
**Emotion:** ${v.emotion.label}\n
`;
};



const formatImageAnalysis = (data) => {
if (!data) return "No data available.";


return `
**Face:**\n${data.face ? JSON.stringify(data.face, null, 2) : 'N/A'}\n
**Body & Pose:**\n${data.body ? JSON.stringify(data.body, null, 2) : 'N/A'}\n
**Expression & Mood:**\n${data.expression ? JSON.stringify(data.expression, null, 2) : 'N/A'}\n
`;
};


  const Row = ({ label, value, isLong }) => {
    return (
      <div className="mb-6">
        <div className="font-semibold text-gray-800 mb-3 text-lg">
          {label}
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-sm leading-relaxed">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </div>
    );
  };

  

  const showContent = (url, type) => {
    if (type === "image") {
      const img = imageFiles.find((i) => i.url === url);
      setSelectedImage(img);
    } else {
      const voice = voiceFiles.find((v) => v.url === url);
      setSelectedVoice(voice);
    }
  };

  const handleViewPast = async () => {
    if (!selectedProjectId) return alert("Please select project!");
    await fetchPastProject(selectedProjectId);
    setShowPastResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Voice + Image + Character Analyzer
          </h1>
          <p className="text-lg text-gray-600">Select project and analyze files</p>
        </div>

        {/* Project Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Select Project
            </h2>
          </div>

          <div className="space-y-4">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            >
              <option value="">-- Select a Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>+</span>
                <span>Create New Project</span>
              </button>

              <button
                onClick={handleViewPast}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>📚</span>
                <span>View Past Result</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Create New Project</h3>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (newProjectName.trim()) {
                      const proj = await addProject(newProjectName);
                      setSelectedProjectId(proj._id);
                    }
                    setShowCreateModal(false);
                    setNewProjectName("");
                  }}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Past Results Modal */}
        {showPastResult && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl p-6 relative overflow-hidden">
              <button
                onClick={() => setShowPastResult(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold transition-colors z-10"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">Past Project Result</h2>

              <div className="overflow-y-auto max-h-[70vh] pr-4">
                {loadingPast ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : !pastData ? (
                  <p className="text-gray-500 text-center py-8">No data found.</p>
                ) : (
                  <div className="space-y-6">
                    <Row label="Title" value={pastData.title} />
                    <Row label="Status" value={pastData.status} />

                    {pastData.image && (
                      <div className="mb-6">
                        <div className="font-semibold text-gray-800 mb-3">Image</div>
                        <img
                          src={pastData.image}
                          alt="Project"
                          className="w-48 h-48 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    )}

                    {pastData.audio && (
                      <div className="mb-6">
                        <div className="font-semibold text-gray-800 mb-3">Audio</div>
                        <audio controls className="w-full rounded-lg">
                          <source src={pastData.audio} />
                        </audio>
                      </div>
                    )}

                      <Row
                        label="Image Analysis"
                        value={pastData.imageAnalysis}
                        isLong
                      />

                    <Row
                      label="Voice Analysis"
                      value={formatVoiceAnalysis(pastData.voiceAnalysis)}
                      isLong
                    />

                    <Row
                      label="Character Details"
                      value={pastData.characterDetails}
                      isLong
                    />
                    <Row
                      label="Final Analysis"
                      value={pastData.finalAnalysis}
                      isLong
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        <div className={`transition-all duration-500 ${isProjectSelected ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          
          {/* Image Analysis */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Image Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Upload Image</h3>
                <input
                  type="file"
                  accept="image/*"
                  disabled={!isProjectSelected}
                  onChange={(e) => handleUpload(e.target.files, "image")}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  onClick={() => {
                    if (selectedImage) handleImageAnalyze(selectedImage.url);
                    else alert("Please select an image to analyze.");
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Analyze Image
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">All Images</h3>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => showContent(e.target.value, "image")}
                >
                  <option>-- Select an Image --</option>
                  {imageFiles.map((i) => (
                    <option key={i.url} value={i.url}>
                      {i.name}
                    </option>
                  ))}
                </select>
                {selectedImage && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    <h4 className="font-semibold text-gray-800 mb-3">Selected Image:</h4>
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {analysisResult && (
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold text-blue-800 text-lg mb-3">Image Analysis Result:</h4>
                <div className="bg-white/80 p-4 rounded-xl border border-blue-100">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Voice Analysis */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Voice Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Upload Voice</h3>
                <input
                  type="file"
                  accept="audio/*"
                  disabled={!isProjectSelected}
                  onChange={(e) => handleUpload(e.target.files, "voice")}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <button
                  onClick={() => {
                    if (selectedVoice) handleVoiceAnalyze(selectedVoice.url);
                    else alert("Please select a Voice to analyze.");
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Analyze Voice
                </button>

                {loadingVoice ? (
                  <div className="mt-4 p-4 border border-purple-200 rounded-xl bg-purple-50 text-purple-700">
                    <p className="font-medium text-center">Analyzing voice...</p>
                  </div>
                ) : (
          analysisVoiceResult && analysisVoiceResult.voice1 && (
  <div className="mt-4 p-4 border border-purple-200 rounded-xl bg-purple-50">
    <h4 className="font-semibold text-lg mb-3 text-purple-800">Voice Analysis Result</h4>
    <div className="space-y-2">

      <div>
        <span className="font-medium">Pitch:</span>
        {analysisVoiceResult.voice1.pitch.value} {analysisVoiceResult.voice1.pitch.unit} ({analysisVoiceResult.voice1.pitch.label})
      </div>

      <div>
        <span className="font-medium">Energy:</span>
        {analysisVoiceResult.voice1.energy.value} {analysisVoiceResult.voice1.energy.unit} ({analysisVoiceResult.voice1.energy.label})
      </div>

      <div>
        <span className="font-medium">Tone:</span>
        {analysisVoiceResult.voice1.tone.value} {analysisVoiceResult.voice1.tone.unit} ({analysisVoiceResult.voice1.tone.label})
      </div>

      <div>
        <span className="font-medium">Speech Rate:</span>
        {analysisVoiceResult.voice1.speech_rate.value} {analysisVoiceResult.voice1.speech_rate.unit} ({analysisVoiceResult.voice1.speech_rate.label})
      </div>

      <div>
        <span className="font-medium">Emotion:</span>
        {analysisVoiceResult.voice1.emotion.label}
      </div>

    </div>
  </div>
)

                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">All Voices</h3>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => showContent(e.target.value, "voice")}
                >
                  <option>-- Select a Voice --</option>
                  {voiceFiles.map((v) => (
                    <option key={v.url} value={v.url}>
                      {v.name}
                    </option>
                  ))}
                </select>

                {selectedVoice && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Selected Voice:</h4>
                    <audio controls className="w-full rounded-lg">
                      <source src={selectedVoice.url} type={selectedVoice.type || "audio/mpeg"} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Character Details */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Character Script / Details
              </h2>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe character here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              onClick={() => { finalAnalysis(analysisVoiceResult, analysisResult, script) }}
            >
              <span>🔍</span>
              <span>Final Analysis</span>
            </button>

            <button
              disabled={!selectedProjectId}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              onClick={() => {
                const payload = {
                  image: selectedImage?.url || "",
                  audio: selectedVoice?.url || "",
                  imageAnalysis: analysisResult,
                  voiceAnalysis: analysisVoiceResult,
                  characterDetails: script,
                  finalAnalysis: FinalAnalyze,
                };
                handleUpdateProject(selectedProjectId, payload);
              }}
            >
              <span>💾</span>
              <span>Update Project</span>
            </button>
          </div>

          {/* Loading Final Analysis */}
          {loadingFinal && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-700 font-medium text-lg">Generating final analysis...</span>
            </div>
          )}

          {/* Final Analysis Result */}
          {FinalAnalyze && !loadingFinal && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Final Analysis
                </h2>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 prose max-w-full">
                <ReactMarkdown>{FinalAnalyze}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}