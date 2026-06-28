import { DefaultImage } from "../types/image";

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