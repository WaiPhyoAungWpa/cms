import { API_BASE_URL } from "../config/api";
import { PublicContentListResponse, PublicContentDetail } from "../types/content";

const API_URL = `${API_BASE_URL}/public/content`;

interface GetPublicContentsParams {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export async function getPublicContents({
  search,
  categoryId,
  page = 1,
  pageSize = 9,
}: GetPublicContentsParams = {}): Promise<PublicContentListResponse> {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (categoryId) {
    params.set("categoryId", categoryId.toString());
  }

  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve content. Please try again later."
    );
  }

  return response.json();
}

export async function getPublicContentById(
  id: number
): Promise<PublicContentDetail> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve content.");
  }

  return response.json();
}