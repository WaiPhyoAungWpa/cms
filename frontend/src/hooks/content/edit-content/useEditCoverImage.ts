import { ChangeEvent, useState } from "react";

export function useEditCoverImage(categoryId: number) {
    const [coverImageId, setCoverImageId] = useState(0);
    const [coverImageMode, setCoverImageMode] = useState<"default" | "custom">("default");
    const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");
    const [originalCoverImageId, setOriginalCoverImageId] = useState(0);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    const [
        originalCoverImageUrl,
        setOriginalCoverImageUrl,
    ] = useState("");

    const initializeCoverImage = (
        imageId: number,
        imageUrl: string
    ) => {
        setCoverImageId(imageId);
        setOriginalCoverImageId(imageId);
        setOriginalCoverImageUrl(imageUrl);
        setCustomCoverImageUrl(imageUrl);
    };

    const hasCoverImageChanged = coverImageId !== originalCoverImageId;

    const handleCoverUpload = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (customCoverImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(customCoverImageUrl);
        }

        setCoverImageFile(file);
        setCustomCoverImageUrl(URL.createObjectURL(file));
        setCoverImageId(0);
        setCoverImageMode("custom");
    };

    const restoreOriginalCoverImage = () => {
        if (customCoverImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(customCoverImageUrl);
        }

        setCoverImageId(originalCoverImageId);
        setCustomCoverImageUrl(originalCoverImageUrl);
        setCoverImageFile(null);
    };

    const resetCoverImage = () => {
        if (customCoverImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(customCoverImageUrl);
        }

        setCoverImageId(0);
        setCustomCoverImageUrl("");
        setCoverImageFile(null);
        setCoverImageMode("default");
    };

    return {
        initializeCoverImage,
        coverImageId,
        setCoverImageId,
        coverImageFile,
        coverImageMode,
        setCoverImageMode,
        customCoverImageUrl,
        setCustomCoverImageUrl,
        originalCoverImageId,
        originalCoverImageUrl,
        hasCoverImageChanged,
        handleCoverUpload,
        restoreOriginalCoverImage,
        resetCoverImage,
    };
}