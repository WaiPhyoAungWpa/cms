import { API_BASE_URL } from "../config/api";

export function getImageUrl(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }

  const backendBase = API_BASE_URL.replace("/api", "");

  return `${backendBase}${url}`;
}