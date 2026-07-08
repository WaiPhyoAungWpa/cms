import { ChangeEvent, useState } from "react";
import { uploadImage } from "../../../services/imageService";
import { EditSection } from "../../../types/editContent";
import { SectionDetail } from "../../../types/content";
import { mapToEditSections } from "../../../utils/editContent";
import { DefaultImage } from "../../../types/image";

export function useEditContentSections(categoryId: number) {
    const [sections, setSections] = useState<EditSection[]>([]);

    const initializeSections = (
        initialSections: SectionDetail[]
    ) => {
        setSections(mapToEditSections(initialSections));
    };

    const updateSectionTitle = (
        index: number,
        value: string
    ) => {
        setSections((previousSections) =>
            previousSections.map((section, sectionIndex) =>
                sectionIndex === index
                ? { ...section, title: value }
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
                ? { ...section, description: value }
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
                ? { ...section, sectionImageId: imageId }
                : section
            )
        );
    };

    const setSectionImageMode = (
        index: number,
        mode: "default" | "custom"
    ) => {
        setSections((previousSections) =>
            previousSections.map((section, sectionIndex) =>
                sectionIndex === index
                ? { ...section, imageMode: mode }
                : section
            )
        );
    };

    const handleSectionUpload = async (
        index: number,
        event: ChangeEvent<HTMLInputElement>
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

    const restoreOriginalSectionImage = (index: number) => {
        setSections((previousSections) =>
            previousSections.map((section, sectionIndex) =>
                sectionIndex === index
                ? {
                    ...section,
                    sectionImageId: section.originalImageId,
                    }
                : section
            )
        );
    };

    const addSection = () => {
        setSections((previousSections) => [
            ...previousSections,
            {
                id: null,
                title: "",
                description: "",
                sectionImageId: 0,
                imageMode: "default",
                customImageUrl: "",
                originalImageId: 0,
                originalImageUrl: "",
                isUploading: false,
                uploadProgress: 0,
            },
        ]);
    };

    const removeSection = (index: number) => {
        setSections((previousSections) =>
            previousSections.filter(
                (_, sectionIndex) => sectionIndex !== index
            )
        );
    };

    const synchronizeSectionImageModes = (
        images: DefaultImage[],
        contentSections: SectionDetail[]
    ) => {
        setSections((previousSections) =>
            previousSections.map((section) => {
                const isDefaultImage = images.some(
                    (image) => image.id === section.sectionImageId
                );

                const existingSection = contentSections.find(
                    (contentSection) =>
                    contentSection.id === section.id
                );

                return {
                    ...section,
                    imageMode: isDefaultImage
                    ? "default"
                    : "custom",
                    customImageUrl:
                    existingSection?.imageUrl ??
                    section.customImageUrl,
                };
            })
        );
    };

    const resetSectionImages = () => {
        setSections((previousSections) =>
            previousSections.map((section) => ({
                ...section,
                sectionImageId: 0,
                customImageUrl: "",
                imageMode: "default",
                isUploading: false,
                uploadProgress: 0,
                }))
        );
    };

    return {
        sections,
        initializeSections,
        updateSectionTitle,
        updateSectionDescription,
        updateSectionImage,
        setSectionImageMode,
        handleSectionUpload,
        restoreOriginalSectionImage,
        addSection,
        removeSection,  
        synchronizeSectionImageModes,
        resetSectionImages,
    };
}