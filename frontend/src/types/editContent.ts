import { UpdateSectionRequest } from "./content";

export interface EditSection extends UpdateSectionRequest {
  imageMode: "default" | "custom";
  customImageUrl: string;
  imageFile: File | null;
  originalImageId: number;
  originalImageUrl: string;
}