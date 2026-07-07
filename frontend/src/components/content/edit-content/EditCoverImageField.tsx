import { ChangeEvent } from "react";
import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

interface EditCoverImageFieldProps {
  images: DefaultImage[];
  coverImageId: number;
  coverImageMode: "default" | "custom";
  originalCoverImageUrl: string;
  customCoverImageUrl: string;
  hasCoverImageChanged: boolean;

  onImageSelect: (imageId: number) => void;
  onModeChange: (mode: "default" | "custom") => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRestoreOriginal: () => void;
}

export default function EditCoverImageField({
  images,
  coverImageId,
  coverImageMode,
  originalCoverImageUrl,
  customCoverImageUrl,
  hasCoverImageChanged,
  onImageSelect,
  onModeChange,
  onUpload,
  onRestoreOriginal,
}: EditCoverImageFieldProps) {
  const selectedCoverImage = images.find(
    (image) => image.id === coverImageId
  );

  return (
    <div>
      <label>Cover Photo</label>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="radio"
            checked={coverImageMode === "default"}
            onChange={() => onModeChange("default")}
          />
          Default Image
        </label>

        <br />

        <label>
          <input
            type="radio"
            checked={coverImageMode === "custom"}
            onChange={() => onModeChange("custom")}
          />
          Upload Custom Image
        </label>
      </div>

      {coverImageMode === "default" && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => onImageSelect(image.id)}
                style={{
                  border:
                    coverImageId === image.id
                      ? "3px solid green"
                      : "1px solid #aaa",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={getImageUrl(image.filePath)}
                  alt="Default"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {coverImageMode === "custom" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
          />

          <br />
          <br />
        </>
      )}

      <hr />

      <p>Current Image</p>

      <div
        onClick={onRestoreOriginal}
        style={{
          display: "inline-block",
          border: !hasCoverImageChanged
            ? "3px solid green"
            : "1px solid #aaa",
          padding: "4px",
          cursor: "pointer",
        }}
      >
        <img
          src={getImageUrl(originalCoverImageUrl)}
          width={250}
          alt="Current Cover"
        />
      </div>

      {hasCoverImageChanged && (
        <>
          <p>New Selected Image</p>

          {selectedCoverImage ? (
            <img
              src={getImageUrl(selectedCoverImage.filePath)}
              width={250}
              alt="New Selected Cover"
            />
          ) : customCoverImageUrl ? (
            <img
              src={getImageUrl(customCoverImageUrl)}
              width={250}
              alt="New Selected Cover"
            />
          ) : null}
        </>
      )}
    </div>
  );
}