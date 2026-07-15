const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is missing. Add it to the frontend .env file."
  );
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, "");