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
  visibilityStatus: string;
}