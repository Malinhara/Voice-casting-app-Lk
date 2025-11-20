// src/api/apiClient.js
export const apiFetch = (endpoint, options = {}) => {
  return fetch(`http://localhost:5000${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
};
