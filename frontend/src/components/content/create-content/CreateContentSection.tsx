import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

interface CreateContentSectionProps {
  index: number;
  title: string;
  description: string;
  sectionImageId: number;
  imageMode: "default" | "custom";
  customImageUrl: string;
  images: DefaultImage[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageSelect: (imageId: number) => void;
  onImageModeChange: (mode: "default" | "custom") => void;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
}

export default function CreateContentSection({
  index,
  title,
  description,
  sectionImageId,
  imageMode,
  customImageUrl,
  images,
  onTitleChange,
  onDescriptionChange,
  onImageSelect,
  onImageModeChange,
  onUpload,
  onRemove,
}: CreateContentSectionProps) {
  const selectedSectionImage = images.find(
    (image) => image.id === sectionImageId
  );

  return (
    <div>
      <h3>Section {index + 1}</h3>

      <button
        type="button"
        onClick={onRemove}
      >
        Remove Section
      </button>

      <div>
        <label>Section Title</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>Section Description</label>
        <br />
        <textarea
          rows={4}
          cols={40}
          value={description}
          onChange={(event) =>
            onDescriptionChange(event.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>Section Image</label>
        <br />

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="radio"
              checked={imageMode === "default"}
              onChange={() => onImageModeChange("default")}
            />
            Default Image
          </label>

          <br />

          <label>
            <input
              type="radio"
              checked={imageMode === "custom"}
              onChange={() => onImageModeChange("custom")}
            />
            Upload Custom Image
          </label>
        </div>

        {imageMode === "default" && (
          <>
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
                        sectionImageId === image.id
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

            <p>Selected Image</p>

            {selectedSectionImage && (
              <img
                src={getImageUrl(selectedSectionImage.filePath)}
                width={250}
                alt="Selected Section"
              />
            )}
          </>
        )}

        {imageMode === "custom" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
            />

            <br />
            <br />

            {customImageUrl && (
              <img
                src={getImageUrl(customImageUrl)}
                width={250}
                alt="Custom Section"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}