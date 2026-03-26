const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const JSON_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

const FORM_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  // ✅ Pas de Content-Type — le browser le gère pour multipart/form-data
};

export const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { headers: JSON_HEADERS }),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    }),

  postForm: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: FORM_HEADERS,
      body: formData,
    }),

  // ✅ Ajout — pour évolutions futures
  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    }),
};
