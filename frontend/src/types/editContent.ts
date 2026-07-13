import { UpdateSectionRequest } from "./content";

export interface EditSection extends UpdateSectionRequest {
  imageMode: "default" | "custom";
  customImageUrl: string;
  imageFile: File;
  originalImageId: number;
  originalImageUrl: string;
  isUploading: boolean;
  uploadProgress: number;
}