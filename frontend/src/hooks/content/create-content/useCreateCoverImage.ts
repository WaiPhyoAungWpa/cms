import { useState } from "react";
import { uploadImage } from "../../../services/imageService";

export default function useCreateCoverImage(categoryId: number) {
    const [coverImageId, setCoverImageId] = useState(0);
    const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");
    const [coverImageMode, setCoverImageMode] = useState<"default" | "custom">("default");
    const [isCoverUploading, setIsCoverUploading] = useState(false);
    const [coverUploadProgress, setCoverUploadProgress] = useState(0);

    const handleCoverUpload = async (
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

      setIsCoverUploading(true);
      setCoverUploadProgress(0);

      try {
        const result = await uploadImage(
          file,
          categoryId,
          token,
          (progress) => {
            setCoverUploadProgress(progress);
          }
        );

        setCoverImageId(result.id);
        setCustomCoverImageUrl(result.filePath);
        setCoverImageMode("custom");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Unable to upload image. Please try again.");
        }
      } finally {
        setIsCoverUploading(false);
      }
    };

    const resetCoverImage = () => {
      setCoverImageId(0);
      setCustomCoverImageUrl("");
      setCoverImageMode("default");
      setIsCoverUploading(false);
      setCoverUploadProgress(0);
    };

    return {
      coverImageId,
      setCoverImageId,
      customCoverImageUrl,
      coverImageMode,
      setCoverImageMode,
      isCoverUploading,
      coverUploadProgress,
      handleCoverUpload,
      resetCoverImage,
    };
}