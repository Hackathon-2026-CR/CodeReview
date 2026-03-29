const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getHeaders = () => ({
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
  // ✅ Ajoute le token si présent
  ...(localStorage.getItem("token") && {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});

const FORM_HEADERS = () => ({
  "ngrok-skip-browser-warning": "true",
  ...(localStorage.getItem("token") && {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});

export const api = {
  get: (path) => fetch(`${BASE_URL}${path}`, { headers: getHeaders() }),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  postForm: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: FORM_HEADERS(),
      body: formData,
    }),

  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    }),
};
