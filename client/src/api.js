const BASE_URL = "https://nonpositivistic-unmesmerised-sharyn.ngrok-free.dev";

const HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export const api = {
  get: (path) => fetch(`${BASE_URL}${path}`, { headers: HEADERS }),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(body),
    }),

  postForm: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "ngrok-skip-browser-warning": "true" }, 
      body: formData,
    }),
};
