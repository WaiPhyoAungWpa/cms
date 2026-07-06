export interface CreateSectionRequest {
  title: string;
  description: string;
  sectionImageId: number;
  useCustomImage?: boolean;
  customImageUrl?: string;
}

export interface CreateContentRequest {
  categoryId: number;
  title: string;
  description: string;
  coverImageId: number;
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
  sections: SectionDetail[];
}

export interface UpdateSectionRequest {
  id: number | null;
  title: string;
  description: string;
  sectionImageId: number;
}

export interface UpdateContentRequest {
  categoryId: number;
  visibilityStatus: string;
  title: string;
  description: string;
  coverImageId: number;
  sections: UpdateSectionRequest[];
}