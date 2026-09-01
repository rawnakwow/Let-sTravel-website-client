import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export async function getAccessToken() {
  try {
    const { data, error } = await authClient.token();

    if (error) {
      console.error("JWT token error:", error);
      return null;
    }

    return data?.token || null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const {
    public: isPublic = false,
    ...fetchOptions
  } = options;

  const token = isPublic
    ? null
    : await getAccessToken();

  const headers = new Headers(
    fetchOptions.headers || {}
  );

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...fetchOptions,
      headers,
    }
  );

  const payload = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    console.error(
      "API request failed:",
      response.status,
      path,
      payload
    );

    throw new Error(
      payload.message ||
        `Request failed with status ${response.status}`
    );
  }

  return payload;
}