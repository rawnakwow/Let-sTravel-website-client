export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAccessToken() {
  const response = await fetch("/api/access-token", { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()).token;
}

export async function apiFetch(path, options = {}) {
  const token = options.public ? null : await getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload;
}

export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not configured");
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const result = await response.json();
  if (!result.success) throw new Error("Image upload failed");
  return result.data.display_url;
}
