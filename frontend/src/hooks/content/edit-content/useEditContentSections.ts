import { ChangeEvent, useState } from "react";
import { EditSection } from "../../../types/editContent";
import { SectionDetail } from "../../../types/content";
import { mapToEditSections } from "../../../utils/editContent";
import { DefaultImage } from "../../../types/image";

export function useEditContentSections() {
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

    const handleSectionUpload = (
        index: number,
        event: ChangeEvent<HTMLInputElement>
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
                    sectionImageId: 0,
                    imageMode: "custom",
                };
            })
        );
    };

    const restoreOriginalSectionImage = (index: number) => {
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
                    sectionImageId: section.originalImageId,
                    customImageUrl: section.originalImageUrl,
                    imageFile: null,
                };
            })
        );
    };

    const updateSectionHyperlinkName = (
        index: number,
        value: string
    ) => {
        setSections(previousSections =>
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
        setSections(previousSections =>
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

    const addSection = () => {
        setSections((previousSections) => [
            ...previousSections,
            {
                id: null,
                title: "",
                description: "",
                sectionImageId: 0,
                hyperlinkName: "",
                hyperlinkUrl: "",
                imageMode: "default",
                customImageUrl: "",
                imageFile: null,
                originalImageId: 0,
                originalImageUrl: "",
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
            previousSections.map((section) => {
                if (section.customImageUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(section.customImageUrl);
                }

                return {
                    ...section,
                    sectionImageId: 0,
                    customImageUrl: "",
                    imageFile: null,
                    imageMode: "default",
                };
            })
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
        updateSectionHyperlinkName,
        updateSectionHyperlinkUrl,
    };
}