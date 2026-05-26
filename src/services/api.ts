import type { AuthUser } from "../validation/authService";

export const API_URL = "http://localhost:3000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const saved = localStorage.getItem("luxor-auth-user");
  let token = "";
  if (saved) {
    try {
      const user = JSON.parse(saved) as AuthUser;
      token = user.token || "";
    } catch (e) {}
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}
