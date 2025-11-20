import { useState } from "react";
import useMediaStore from "../components/hooks/seMediaStore";

export default function MediaStore() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { voiceFiles, imageFiles, handleUpload, handleDelete } = useMediaStore(userId);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState({});
  const [playingAudio, setPlayingAudio] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleFileUpload = async (files, type) => {
    if (files.length === 0) return;

    try {
      // Simulate upload progress
      files.forEach((file, index) => {
        setUploadProgress(prev => ({
          ...prev,
          [`${type}-${file.name}`]: 0
        }));

        // Simulate progress updates
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const key = `${type}-${file.name}`;
            const currentProgress = prev[key] || 0;
            if (currentProgress >= 100) {
              clearInterval(interval);
              return prev;
            }
            return {
              ...prev,
              [key]: currentProgress + 10
            };
          });
        }, 100);
      });

      await handleUpload(files, type);
      showNotification(`${files.length} ${type} file(s) uploaded successfully!`, "success");
      
      // Clear progress after upload
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    } catch (error) {
      showNotification(`Failed to upload ${type} files`, "error");
      setUploadProgress({});
    }
  };

  const handleFileDelete = async (file, type) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      try {
        await handleDelete(file, type);
        showNotification("File deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete file", "error");
      }
    }
  };

  const openFile = (url) => window.open(url, "_blank");

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAudioPlay = (index) => {
    setPlayingAudio(playingAudio === index ? null : index);
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

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Media Library
          </h1>
          <p className="text-lg text-gray-600">Upload, preview, and manage your voice recordings & images</p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{voiceFiles.length}</div>
              <div className="text-sm text-gray-500">Voice Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{imageFiles.length}</div>
              <div className="text-sm text-gray-500">Images</div>
            </div>
          </div>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Upload */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Upload Voice
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
                <div className="text-4xl mb-3">🎤</div>
                <p className="text-purple-700 font-semibold mb-2">Drop audio files here or click to browse</p>
                <p className="text-purple-500 text-sm">Supports MP3, WAV, M4A</p>
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={(e) => handleFileUpload([...e.target.files], "voice")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {Object.entries(uploadProgress).map(([key, progress]) => 
                key.startsWith('voice-') && (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">{key.replace('voice-', '')}</span>
                      <span className="text-purple-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Upload Images
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-green-300 rounded-2xl p-6 text-center hover:border-green-400 transition-colors">
                <div className="text-4xl mb-3">🖼️</div>
                <p className="text-green-700 font-semibold mb-2">Drop image files here or click to browse</p>
                <p className="text-green-500 text-sm">Supports JPG, PNG, GIF, WebP</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload([...e.target.files], "image")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {Object.entries(uploadProgress).map(([key, progress]) => 
                key.startsWith('image-') && (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">{key.replace('image-', '')}</span>
                      <span className="text-green-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Voice Files Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Voice Files
              </h2>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {voiceFiles.length} file{voiceFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {voiceFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🎵</div>
              <p className="text-gray-500 text-lg mb-4">No voice files uploaded yet</p>
              <p className="text-gray-400">Upload your first audio file to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voiceFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🎵</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-purple-900 truncate">{file.name}</p>
                      <p className="text-xs text-purple-600">{formatFileSize(file.size || 0)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <audio 
                      controls 
                      src={file.url} 
                      className="w-full rounded-xl"
                      onPlay={() => handleAudioPlay(idx)}
                      onPause={() => setPlayingAudio(null)}
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openFile(file.url)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <span>🔍</span>
                        <span>Open</span>
                      </button>
                      <button
                        onClick={() => handleFileDelete(file, "voice")}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Files Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Images
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {imageFiles.length} image{imageFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {imageFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🖼️</div>
              <p className="text-gray-500 text-lg mb-4">No images uploaded yet</p>
              <p className="text-gray-400">Upload your first image to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imageFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold text-green-900 text-sm truncate">{file.name}</p>
                    <p className="text-xs text-green-600">{formatFileSize(file.size || 0)}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openFile(file.url)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-1"
                      >
                        <span>👁️</span>
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleFileDelete(file, "image")}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-1"
                      >
                        <span>🗑️</span>
                        <span>Del</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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