import { useState } from "react";
import { analyzeImage } from "../api/analysis"; // your API function

export default function useImageAnalysis() {
  const [analysisResult, setAnalysisResult] = useState(null); // Store analysis
  const [loading, setLoading] = useState(false); // Optional: loading state
  const [error, setError] = useState(null); // Optional: error state

  // Fetch image analysis from API
  const getImageAnalysis = async (imageUrl) => {
    try {
      const data = await analyzeImage(imageUrl); // assume it returns JSON
      return data;
    } catch (err) {
      throw new Error("Failed to fetch image analysis: " + err.message);
    }
  };

  // Handle analysis with proper error handling
  const handleImageAnalyze = async (imageUrl) => {
    if (!imageUrl) {
      console.warn("No image selected for analysis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = typeof imageUrl === "string" ? imageUrl : imageUrl.url;

      const data = await getImageAnalysis(url);

      console.log("Image analysis result:", data);

      // Optional: handle different response shapes
      const result = data.analysis || data || "No analysis returned";

      setAnalysisResult(result);
    } catch (err) {
      console.error("Image analysis error:", err);
      setError(err.message);
      setAnalysisResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    analysisResult,
    handleImageAnalyze,
    setAnalysisResult
  };
}
