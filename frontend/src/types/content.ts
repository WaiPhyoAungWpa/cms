import { PagedResponse } from "./pagination";

export interface CreateSectionRequest {
  title: string;
  description: string;
  sectionImageId: number;
  useCustomImage?: boolean;
  customImageUrl?: string;
  hyperlinkName: string;
  hyperlinkUrl: string;
}

export interface CreateContentRequest {
  categoryId: number;
  title: string;
  description: string;
  coverImageId: number;
  relatedContentIds: number[];
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: CreateSectionRequest[];
}

export interface ContentListItem {
  id: number;
  title: string;
  category: string;
  status: string;
  previousStatus: string | null;
  visibilityStatus: string;
}

export interface SectionDetail {
  id: number;
  title: string;
  description: string;
  sectionImageId: number;
  imageUrl: string;
  hyperlinkName: string;
  hyperlinkUrl: string;
}

export interface ContentDetail {
  id: number;
  categoryId: number;
  category: string;
  title: string;
  description: string;
  status: string;
  visibilityStatus: string;
  coverImageId: number;
  coverImageUrl: string;
  relatedContents: RelatedContentResponse[];
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: SectionDetail[];
}

export interface RelatedContentResponse {
  id: number;
  title: string;
  category: string;
  coverImageUrl: string;
}

export interface UpdateSectionRequest {
  id: number | null;
  title: string;
  description: string;
  sectionImageId: number;
  hyperlinkName: string;
  hyperlinkUrl: string;
}

export interface UpdateContentRequest {
  categoryId: number;
  visibilityStatus: string;
  title: string;
  description: string;
  coverImageId: number;
  relatedContentIds: number[];
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: UpdateSectionRequest[];
}

export interface PublicContentListItem {
  id: number;
  title: string;
  category: string;
  coverImageUrl: string;
}

export interface PublicLatestContent {
  id: number;
  title: string;
  description: string;
  category: string;
  coverImageUrl: string;
}

export interface PublicContentStats {
  total: number;
  experience: number;
  learning: number;
  lifestyle: number;
}

export interface PublicContentListResponse {
  contents: PagedResponse<PublicContentListItem>;
  latestContent: PublicLatestContent | null;
  stats: PublicContentStats;
}

export interface PublicContentSection {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  hyperlinkName: string;
  hyperlinkUrl: string;
}

export interface PublicContentDetail {
  id: number;
  category: string;
  title: string;
  description: string;
  coverImageUrl: string;
  relatedContents: RelatedContentResponse[];
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: PublicContentSection[];
}

export interface ContentTemplateData {
  id: number;
  category: string;
  title: string;
  description: string;
  coverImageUrl: string;
  relatedContents: RelatedContentResponse[];
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    hyperlinkName: string;
    hyperlinkUrl: string;
  }[];
}
