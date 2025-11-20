import { useState } from "react";
import useMediaStore from "../components/hooks/seMediaStore";
import useAnalysis from "../components/hooks/useAnalysis";

export default function CompareVoices() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;

  const { voiceFiles, handleUpload } = useMediaStore(userId);
  const { analysisVoiceResult, handleVoiceAnalyze, loadingVoice } = useAnalysis(userId);

  const [voice1, setVoice1] = useState(null);
  const [voice2, setVoice2] = useState(null);

  console.log("Available voice files:", voiceFiles);
 
  const analyzeBothVoices = async () => {
    if (!voice1 || !voice2) {
      alert("Select both voices first!");
      return;
    }

    const v1 = typeof voice1 === "string" ? voice1 : voice1.url;
    const v2 = typeof voice2 === "string" ? voice2 : voice2.url;

    await handleVoiceAnalyze(v1, v2);
  };

  const handleVoiceUpload = async (e, setVoice) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const file = files[0];
    setVoice(file);

    await handleUpload([file], "voice");
  };

  const renderResultCard = (title, data, color) => {
    if (!data) return null;

    return (
      <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-xl border`}>
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>

        <div className="space-y-3">
          {["pitch", "energy", "tone", "speech_rate"].map((key) => (
            <div key={key} className="flex justify-between items-center p-3 bg-white/90 rounded-lg">
              <span className="font-semibold text-gray-700">{key.replace("_", " ").toUpperCase()}:</span>
              <div className="text-right">
                <span className="font-bold text-gray-900">{data[key]?.value || "N/A"} {data[key]?.unit || ""}</span>
                <span className="text-sm text-gray-600 ml-2">({data[key]?.label || "Unknown"})</span>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center p-3 bg-white/90 rounded-lg">
            <span className="font-semibold text-gray-700">EMOTION:</span>
            <span className="font-bold text-gray-900">{data.emotion?.label || "Unknown"}</span>
          </div>
        </div>
      </div>
    );
  };

  const VoiceSelectionCard = ({ title, voice, setVoice, color }) => {
    return (
      <div className={`bg-gradient-to-br ${color} border rounded-2xl p-6 shadow-xl`}>
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>

        {/* Select Existing */}
        <label className="block text-sm font-semibold mb-2 text-white">Select Existing Voice</label>
        <select
          className="w-full border rounded-xl px-4 py-3"
          value={typeof voice === "string" ? voice : ""}
          onChange={(e) => setVoice(e.target.value)}
        >
          <option value="">-- Select existing voice --</option>
          {voiceFiles?.map((file) => (
            <option key={file.url} value={file.url}>
              {file.name}
            </option>
          ))}
        </select>

        {/* Upload New */}
        <label className="block text-sm font-semibold mt-4 mb-2 text-white">Or Upload New Voice</label>
        <div className="border-2 border-dashed border-white/50 rounded-2xl p-6 text-center relative bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer">
          <div className="text-3xl mb-3">🎤</div>
          <p className="text-white font-medium">Click to upload</p>

          <input
            type="file"
            accept="audio/wav,audio/mp3,audio/m4a"
            onChange={(e) => handleVoiceUpload(e, setVoice)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Preview */}
        {voice && (
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/50 mt-4">
            <h4 className="font-semibold mb-3">Preview</h4>
            <audio
              controls
              src={typeof voice === "string" ? voice : URL.createObjectURL(voice)}
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center bg-white/80 p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Voice Comparison
          </h1>
          <p className="text-lg text-gray-600">Upload or choose samples to compare</p>
        </div>

        {/* Voice Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VoiceSelectionCard 
            title="First Voice" 
            voice={voice1} 
            setVoice={setVoice1} 
            color="from-blue-500 to-cyan-500" 
          />
          <VoiceSelectionCard 
            title="Second Voice" 
            voice={voice2} 
            setVoice={setVoice2} 
            color="from-green-500 to-emerald-500" 
          />
        </div>

        {/* Button */}
        <div className="text-center mt-8">
          <button
            onClick={analyzeBothVoices}
            disabled={!voice1 || !voice2 || loadingVoice}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-12 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            {loadingVoice ? "Analyzing..." : "Analyze & Compare"}
          </button>
        </div>

        {/* Result */}
        {analysisVoiceResult && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderResultCard("Voice 1 Analysis", analysisVoiceResult?.voice1, "from-blue-500 to-cyan-500")}
            {renderResultCard("Voice 2 Analysis", analysisVoiceResult?.voice2, "from-green-500 to-emerald-500")}
          </div>
        )}
      </div>
    </div>
  );
}