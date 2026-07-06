import { API_BASE_URL } from "../config/api";
import { PagedResponse } from "../types/pagination";
import { CreateContentRequest, ContentListItem, ContentDetail, UpdateContentRequest } from "../types/content";

async function getErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  try {
    const data = await response.json();

    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export interface GetContentsParams {
  search?: string;
  categoryId?: number;
  status?: string;
  visibilityStatus?: string;
  page?: number;
  pageSize?: number;
}

const API_URL = `${API_BASE_URL}/content`;

export async function publishContent(
  request: CreateContentRequest,
  token: string
) {
  const response = await fetch(`${API_URL}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to publish content");
  }

  return response.json();
}

export async function saveDraft(
  request: CreateContentRequest,
  token: string
) {
  const response = await fetch(`${API_URL}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to save draft");
  }

  return response.json();
}

export async function getContents(
  params: GetContentsParams,
  token: string
): Promise<PagedResponse<ContentListItem>> {
  const query = new URLSearchParams();

  if (params.search) {
    query.append("search", params.search);
  }

  if (params.categoryId) {
    query.append("categoryId", params.categoryId.toString());
  }

  if (params.status) {
    query.append("status", params.status);
  }

  if (params.visibilityStatus) {
    query.append("visibilityStatus", params.visibilityStatus);
  }

  if (params.page) {
  query.append("page", params.page.toString());
  }

  if (params.pageSize) {
    query.append("pageSize", params.pageSize.toString());
  }

  const url = query.toString()
    ? `${API_URL}?${query.toString()}`
    : API_URL;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve contents.");
  }

  return response.json();
}

export async function getContent(
  id: number,
  token: string
): Promise<ContentDetail> {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve content.");
  }

  return response.json();
}

export async function updateDraft(
  id: number,
  request: UpdateContentRequest,
  token: string
): Promise<ContentListItem> {
  const response = await fetch(`${API_URL}/${id}/draft`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Failed to update draft."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function publishDraft(
  id: number,
  request: UpdateContentRequest,
  token: string
): Promise<ContentListItem> {
  const response = await fetch(`${API_URL}/${id}/publish`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Failed to publish content."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function updatePublished(
  id: number,
  request: UpdateContentRequest,
  token: string
): Promise<ContentListItem> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Failed to update published content."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function softDeleteContent(
  id: number,
  token: string
): Promise<ContentListItem> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Unable to delete content. Please try again later."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function restoreContent(
  id: number,
  visibilityStatus: string,
  token: string
): Promise<ContentListItem> {
  const response = await fetch(`${API_URL}/${id}/restore`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      visibilityStatus,
    }),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Unable to restore content. Please try again later."
    );

    throw new Error(message);
  }

  return response.json();
}