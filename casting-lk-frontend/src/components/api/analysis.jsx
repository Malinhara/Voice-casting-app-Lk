// src/api/analysis.js
import { apiFetch } from "./apiClient";

export const analyzeImage = async (imageUrl) => {
  const res = await apiFetch(`/analyze-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  return res.json();
};

export const analyzeVoice = async (url1) => {
  const res = await apiFetch(`/proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url1 }),
  });

  return res.json();
};

export const finalizeAnalysis = async (imageAnalysis, voiceAnalysis, script) => {
  const res = await apiFetch(`/finalanalyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageAnalysis, voiceAnalysis, script }),
  });

  return res.json();
  
};
