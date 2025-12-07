// src/lib/api.ts
import { toast } from "sonner";

// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-proyecto-agil.onrender.com/api";
//const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
  if (typeof window !== "undefined") {
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  return token;
};

const api = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const authToken = getAuthToken();
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return;
  }

  if (!response.ok) {
    // si falla, intentamos leer texto en vez de json
    const errorText = await response.text().catch(() => "");
    console.error("❌ Error API:", errorText);
    throw new Error(errorText || "Error de red");
  }

  // ✅ aquí detectamos el tipo de contenido
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/pdf")) {
    return await response.blob(); // PDF como Blob
  }

  if (contentType.includes("application/json")) {
    return await response.json(); // JSON normal
  }

  return await response.text(); // fallback para otros tipos (CSV, texto plano, etc.)
};

export default api;