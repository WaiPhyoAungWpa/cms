import { useState } from "react";

export default function useCreateCoverImage() {
    const [coverImageId, setCoverImageId] = useState(0);
    const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");
    const [coverImageMode, setCoverImageMode] = useState<"default" | "custom">("default");
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    const handleCoverUpload = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      // Clean up previous preview
      if (customCoverImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(customCoverImageUrl);
      }

      setCoverImageFile(file);
      setCustomCoverImageUrl(URL.createObjectURL(file));
      setCoverImageMode("custom");

      // Allow selecting the same file again later
      event.target.value = "";
    };

    const updateCoverImageMode = (
      mode: "default" | "custom"
    ) => {
      setCoverImageMode(mode);

      if (mode === "default") {
        if (customCoverImageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(customCoverImageUrl);
        }

        setCustomCoverImageUrl("");
        setCoverImageFile(null);
      }
    };

    const resetCoverImage = () => {
      if (customCoverImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(customCoverImageUrl);
      }

      setCoverImageId(0);
      setCustomCoverImageUrl("");
      setCoverImageMode("default");
      setCoverImageFile(null);
    };

    return {
      coverImageId,
      setCoverImageId,
      coverImageFile,
      customCoverImageUrl,
      coverImageMode,
      updateCoverImageMode,
      handleCoverUpload,
      resetCoverImage,
    };
}