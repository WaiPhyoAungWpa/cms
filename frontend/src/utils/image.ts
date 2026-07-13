import { API_BASE_URL } from "../config/api";

export function getImageUrl(url: string): string {
  if (!url) {
    return "";
  }

  // Local preview image
  if (url.startsWith("blob:")) {
    return url;
  }

  // Absolute URL (Cloudinary)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const backendBase = API_BASE_URL.replace("/api", "");

  return `${backendBase}${url}?v=2`;
}