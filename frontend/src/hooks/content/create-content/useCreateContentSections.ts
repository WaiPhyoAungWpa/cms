import { useState } from "react";
import { CreateSectionRequest } from "../../../types/content";
import { uploadImage } from "../../../services/imageService";

export interface CreateSectionForm extends CreateSectionRequest {
    imageMode: "default" | "custom";
    customImageUrl: string;
    isUploading: boolean;
    uploadProgress: number;
}

export default function useCreateContentSections(categoryId: number) {
    const [sections, setSections] = useState<CreateSectionForm[]>([]);

    const handleSectionUpload = async (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          return;
        }

        setSections((previousSections) =>
          previousSections.map((section, sectionIndex) =>
            sectionIndex === index
              ? {
                  ...section,
                  isUploading: true,
                  uploadProgress: 0,
                }
              : section
          )
        );

        try {
          const result = await uploadImage(
            file,
            categoryId,
            token,
            (progress) => {
              setSections((previousSections) =>
                previousSections.map((section, sectionIndex) =>
                  sectionIndex === index
                    ? {
                        ...section,
                        uploadProgress: progress,
                      }
                    : section
                )
              );
            }
          );

          setSections((previousSections) =>
            previousSections.map((section, sectionIndex) =>
              sectionIndex === index
                ? {
                    ...section,
                    sectionImageId: result.id,
                    customImageUrl: result.filePath,
                    imageMode: "custom",
                  }
                : section
            )
          );
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          } else {
            alert("Unable to upload image. Please try again.");
          }
        } finally {
          setSections((previousSections) =>
            previousSections.map((section, sectionIndex) =>
              sectionIndex === index
                ? {
                    ...section,
                    isUploading: false,
                  }
                : section
            )
          );
        }
    };
    
    const handleAddSection = () => {
      setSections((previousSections) => [
        ...previousSections,
        {
          title: "",
          description: "",
          sectionImageId: 0,
          imageMode: "default",
          customImageUrl: "",
          isUploading: false,
          uploadProgress: 0,
        },
      ]);
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
        previousSections.map((section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                imageMode,
              }
            : section
        )
      );
    };

    const removeSection = (index: number) => {
      setSections((previousSections) =>
        previousSections.filter(
          (_, sectionIndex) => sectionIndex !== index
        )
      );
    };

    const resetSectionImages = () => {
      setSections((previousSections) =>
          previousSections.map((section) => ({
          ...section,
          sectionImageId: 0,
          imageMode: "default",
          customImageUrl: "",
          isUploading: false,
          uploadProgress: 0,
          }))
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
    };
}