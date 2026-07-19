interface ContentValidationSection {
  title: string;
  description: string;
  sectionImageId: number;
  imageFile: File | null;
  hyperlinkName: string;
  hyperlinkUrl: string;
}

interface ContentValidationData {
  categoryId: number;
  title: string;
  description: string;
  coverImageId: number;
  coverImageFile: File | null;
  hyperlinkName: string;
  hyperlinkUrl: string;
  sections: ContentValidationSection[];
}

export function validateContentForm({
  categoryId,
  title,
  description,
  coverImageId,
  coverImageFile,
  hyperlinkName,
  hyperlinkUrl,
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

  if (coverImageId <= 0 && !coverImageFile) {
    return "Cover image is required.";
  }

  if (
    (hyperlinkName.trim() && !hyperlinkUrl.trim()) ||
    (!hyperlinkName.trim() && hyperlinkUrl.trim())
  ) {
    return "Both external reference name and URL are required.";
  }

  if (hyperlinkUrl.trim()) {
    try {
      const url = new URL(hyperlinkUrl);

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        return "External reference URL must be a valid HTTP or HTTPS URL.";
      }
    } catch {
      return "External reference URL must be a valid HTTP or HTTPS URL.";
    }
  }

  for (let index = 0; index < sections.length; index++) {
    const section = sections[index];

    if (!section.title.trim()) {
      return `Section ${index + 1} title is required.`;
    }

    if (!section.description.trim()) {
      return `Section ${index + 1} description is required.`;
    }

    if (section.sectionImageId <= 0 && !section.imageFile) {
      return `Section ${index + 1} image is required.`;
    }

    if (
      (section.hyperlinkName.trim() && !section.hyperlinkUrl.trim()) ||
      (!section.hyperlinkName.trim() && section.hyperlinkUrl.trim())
    ) {
      return `Section ${index + 1} external reference requires both a name and URL.`;
    }

    if (section.hyperlinkUrl.trim()) {
      try {
        const url = new URL(section.hyperlinkUrl);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          return `Section ${index + 1} external reference URL must be a valid HTTP or HTTPS URL.`;
        }
      } catch {
        return `Section ${index + 1} external reference URL must be a valid HTTP or HTTPS URL.`;
      }
    }
  }

  return null;
}