import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* ========================================
   GET BETTER AUTH JWT
======================================== */

export async function getAccessToken() {
  try {
    const { data, error } =
      await authClient.token();

    if (error) {
      console.error(
        "JWT token error:",
        error
      );

      return null;
    }

    return data?.token || null;
  } catch (error) {
    console.error(
      "Failed to get access token:",
      error
    );

    return null;
  }
}

/* ========================================
   API FETCH
======================================== */

export async function apiFetch(
  path,
  options = {}
) {
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
    headers.set(
      "Content-Type",
      "application/json"
    );
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

/* ========================================
   IMGBB IMAGE UPLOAD
======================================== */

export async function uploadImage(file) {
  if (!file) {
    throw new Error(
      "Please select an image"
    );
  }

  const apiKey =
    process.env
      .NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_IMGBB_API_KEY is not configured"
    );
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error(
      "Please select a valid image file"
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "Image must be smaller than 5 MB"
    );
  }

  const formData = new FormData();

  formData.append(
    "image",
    file
  );

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success ||
      !result.data?.display_url
    ) {
      console.error(
        "ImgBB upload failed:",
        result
      );

      throw new Error(
        result?.error?.message ||
          "Image upload failed"
      );
    }

    return result.data.display_url;
  } catch (error) {
    console.error(
      "Image upload error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to upload image"
    );
  }
}