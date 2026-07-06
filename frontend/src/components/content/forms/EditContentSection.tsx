import { ChangeEvent } from "react";
import { EditSection } from "../../../types/editContent";
import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

interface EditContentSectionProps {
  section: EditSection;
  index: number;
  images: DefaultImage[];

  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onImageChange: (index: number, imageId: number) => void;
  onImageModeChange: (
    index: number,
    mode: "default" | "custom"
  ) => void;
  onImageUpload: (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRestoreOriginalImage: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function EditContentSection({
  section,
  index,
  images,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onImageModeChange,
  onImageUpload,
  onRestoreOriginalImage,
  onRemove,
}: EditContentSectionProps) {
  const selectedSectionImage = images.find(
    (image) => image.id === section.sectionImageId
  );

  const isNewSection = section.id === null;

  const hasSectionImageChanged =
    section.sectionImageId !== section.originalImageId;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Section {index + 1}</h3>

        <button
          type="button"
          onClick={() => onRemove(index)}
        >
          Remove Section
        </button>
      </div>

      <div>
        <label>Section Title</label>

        <br />

        <input
          type="text"
          value={section.title}
          onChange={(event) =>
            onTitleChange(index, event.target.value)
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
          value={section.description}
          onChange={(event) =>
            onDescriptionChange(index, event.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>Section Image</label>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="radio"
              checked={section.imageMode === "default"}
              onChange={() =>
                onImageModeChange(index, "default")
              }
            />
            Default Image
          </label>

          <br />

          <label>
            <input
              type="radio"
              checked={section.imageMode === "custom"}
              onChange={() =>
                onImageModeChange(index, "custom")
              }
            />
            Upload Custom Image
          </label>
        </div>

        {section.imageMode === "default" && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() =>
                  onImageChange(index, image.id)
                }
                style={{
                  border:
                    section.sectionImageId === image.id
                      ? "3px solid green"
                      : "1px solid #aaa",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={getImageUrl(image.filePath)}
                  width={100}
                  height={100}
                  alt="Default"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

        {section.imageMode === "custom" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                onImageUpload(index, event)
              }
            />

            <br />
            <br />
          </>
        )}

        {!isNewSection && (
          <>
            <hr />

            <p>Current Image</p>

            <div
              onClick={() =>
                onRestoreOriginalImage(index)
              }
              style={{
                display: "inline-block",
                border: !hasSectionImageChanged
                  ? "3px solid green"
                  : "1px solid #aaa",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              <img
                src={getImageUrl(section.originalImageUrl)}
                width={200}
                alt="Current Section"
              />
            </div>
          </>
        )}

        {section.sectionImageId > 0 &&
          (isNewSection || hasSectionImageChanged) && (
            <>
              <p>New Selected Image</p>

              {selectedSectionImage ? (
                <img
                  src={getImageUrl(
                    selectedSectionImage.filePath
                  )}
                  width={200}
                  alt="New Selected Section"
                />
              ) : section.customImageUrl ? (
                <img
                  src={getImageUrl(section.customImageUrl)}
                  width={200}
                  alt="New Selected Section"
                />
              ) : null}
            </>
          )}
      </div>
    </div>
  );
}