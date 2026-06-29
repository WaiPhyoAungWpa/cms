import { DefaultImage } from "../types/image";
import { UploadImageResponse } from "../types/image";

export async function getDefaultImages(
  categoryId: number
): Promise<DefaultImage[]> {
  const response = await fetch(
    `http://localhost:5160/api/images/defaults/${categoryId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load images");
  }

  return response.json();
}

export async function uploadImage(
  file: File,
  categoryId: number,
  token: string
): Promise<UploadImageResponse> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("categoryId", categoryId.toString());

  const response = await fetch(
    "http://localhost:5160/api/images/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}