import { useState } from "react";
import { CreateSectionRequest } from "../../../types/content";

export interface CreateSectionForm extends CreateSectionRequest {
    imageMode: "default" | "custom";
    customImageUrl: string;
    imageFile: File | null;
}

export default function useCreateContentSections() {
    const [sections, setSections] = useState<CreateSectionForm[]>([]);

    const handleSectionUpload = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) => {
          if (sectionIndex !== index) {
            return section;
          }

          if (section.customImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(section.customImageUrl);
          }

          return {
            ...section,
            imageFile: file,
            customImageUrl: URL.createObjectURL(file),
            imageMode: "custom",
          };
        })
      );

      event.target.value = "";
    };
    
    const handleAddSection = () => {
      setSections((previousSections) => [
        ...previousSections,
        {
          title: "",
          description: "",
          sectionImageId: 0,
          hyperlinkName: "",
          hyperlinkUrl: "",
          imageMode: "default",
          customImageUrl: "",
          imageFile: null,
        }
      ]);
    };

    const updateSectionHyperlinkName = (
      index: number,
      value: string
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                hyperlinkName: value,
              }
            : section
        )
      );
    };

    const updateSectionHyperlinkUrl = (
      index: number,
      value: string
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                hyperlinkUrl: value,
              }
            : section
        )
      );
    };

    const updateSectionTitle = (
      index: number,
      value: string
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                title: value,
              }
            : section
        )
      );
    };

    const updateSectionDescription = (
      index: number,
      value: string
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                description: value,
              }
            : section
        )
      );
    };

    const updateSectionImage = (
      index: number,
      imageId: number
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                sectionImageId: imageId,
              }
            : section
        )
      );
    };

    const updateSectionImageMode = (
      index: number,
      imageMode: "default" | "custom"
    ) => {
      setSections((previousSections) =>
        previousSections.map((section, sectionIndex) => {
          if (sectionIndex !== index) {
            return section;
          }

          if (
            imageMode === "default" &&
            section.customImageUrl.startsWith("blob:")
          ) {
            URL.revokeObjectURL(section.customImageUrl);
          }

          return {
            ...section,
            imageMode,
            customImageUrl:
              imageMode === "default"
                ? ""
                : section.customImageUrl,
            imageFile:
              imageMode === "default"
                ? null
                : section.imageFile,
          };
        })
      );
    };

    const removeSection = (index: number) => {
      setSections((previousSections) => {
        const section = previousSections[index];

        if (section?.customImageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(section.customImageUrl);
        }

        return previousSections.filter(
          (_, sectionIndex) => sectionIndex !== index
        );
      });
    };

    const resetSectionImages = () => {
      setSections((previousSections) =>
        previousSections.map((section) => {
          if (section.customImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(section.customImageUrl);
          }

          return {
            ...section,
            sectionImageId: 0,
            imageMode: "default",
            customImageUrl: "",
            imageFile: null,
          };
        })
      );
    };

    return {
      sections,
      handleSectionUpload,
      handleAddSection,
      updateSectionTitle,
      updateSectionDescription,
      updateSectionImage,
      updateSectionImageMode,
      removeSection,
      resetSectionImages,
      updateSectionHyperlinkName,
      updateSectionHyperlinkUrl,
    };
}