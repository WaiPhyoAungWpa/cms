import { ChangeEvent, useState } from "react";
import { uploadImage } from "../../services/imageService";

export function useEditCoverImage(categoryId: number) {
    const [coverImageId, setCoverImageId] = useState(0);

    const [coverImageMode, setCoverImageMode] = useState<"default" | "custom">("default");

    const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");

    const [originalCoverImageId, setOriginalCoverImageId] = useState(0);

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

    const handleCoverUpload = async (
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

            try {
                const result = await uploadImage(
                    file,
                    categoryId,
                    token
                );

                setCoverImageId(result.id);
                setCustomCoverImageUrl(result.filePath);
                setCoverImageMode("custom");
            } catch {
                alert("Failed to upload image");
            }
    };

    const restoreOriginalCoverImage = () => {
        setCoverImageId(originalCoverImageId);
    };

    const resetCoverImage = () => {
        setCoverImageId(0);
        setCustomCoverImageUrl("");
        setCoverImageMode("default");
    };

    return {
        initializeCoverImage,
        coverImageId,
        setCoverImageId,
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