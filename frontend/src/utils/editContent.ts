import { SectionDetail } from "../types/content";
import { EditSection } from "../types/editContent";

export function mapToEditSections(
  sections: SectionDetail[]
): EditSection[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    sectionImageId: section.sectionImageId,
    imageFile: null,
    imageMode: "default",
    customImageUrl: section.imageUrl,
    originalImageId: section.sectionImageId,
    originalImageUrl: section.imageUrl,
  }));
}