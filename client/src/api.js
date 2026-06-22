import axios from 'axios';

// Vite exposes env vars with the VITE_ prefix. The fallback works for local dev.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export async function fetchAnalyses() {
  const response = await api.get('/analyses');
  return response.data;
}

export async function fetchAnalysis(id) {
  const response = await api.get(`/analyses/${id}`);
  return response.data;
}

export async function createAnalysis(repositoryUrl) {
  const response = await api.post('/analyses', { repositoryUrl });
  return response.data;
}
