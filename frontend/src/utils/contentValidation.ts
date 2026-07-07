interface ContentValidationSection {
  title: string;
  description: string;
  sectionImageId: number;
}

interface ContentValidationData {
  categoryId: number;
  title: string;
  description: string;
  coverImageId: number;
  sections: ContentValidationSection[];
}

export function validateContentForm({
  categoryId,
  title,
  description,
  coverImageId,
  sections,
}: ContentValidationData): string | null {
  if (categoryId <= 0) {
    return "Category is required.";
  }

  if (!title.trim()) {
    return "Title is required.";
  }

  if (!description.trim()) {
    return "Description is required.";
  }

  if (coverImageId <= 0) {
    return "Cover image is required.";
  }

  for (let index = 0; index < sections.length; index++) {
    const section = sections[index];

    if (!section.title.trim()) {
      return `Section ${index + 1} title is required.`;
    }

    if (!section.description.trim()) {
      return `Section ${index + 1} description is required.`;
    }

    if (section.sectionImageId <= 0) {
      return `Section ${index + 1} image is required.`;
    }
  }

  return null;
}