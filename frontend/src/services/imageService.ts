import { API_BASE_URL } from "../config/api";
import { DefaultImage } from "../types/image";
import { UploadImageResponse } from "../types/image";

const API_URL = `${API_BASE_URL}/images`;

export async function getDefaultImages(
  categoryId: number
): Promise<DefaultImage[]> {
  const response = await fetch(
    `${API_URL}/defaults/${categoryId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load images");
  }

  return response.json();
}

export function uploadImage(
  file: File,
  categoryId: number,
  token: string,
  onProgress?: (progress: number) => void
): Promise<UploadImageResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("categoryId", categoryId.toString());

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/upload`);

    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${token}`
    );

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round(
        (event.loaded / event.total) * 100
      );

      onProgress?.(progress);
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error("Failed to upload image"));
        return;
      }

      try {
        const result = JSON.parse(
          xhr.responseText
        ) as UploadImageResponse;

        resolve(result);
      } catch {
        reject(new Error("Invalid upload response"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Failed to upload image"));
    };

    xhr.send(formData);
  });
}