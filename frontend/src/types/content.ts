export interface CreateSectionRequest {
  title: string;
  description: string;
  sectionImageId: number;
}

export interface CreateContentRequest {
  categoryId: number;
  title: string;
  description: string;
  coverImageId: number;
  sections: CreateSectionRequest[];
}