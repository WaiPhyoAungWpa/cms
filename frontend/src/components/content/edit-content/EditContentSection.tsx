import { ChangeEvent } from "react";
import { EditSection } from "../../../types/editContent";
import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

import "../../../styles/components/content/edit-content/EditContentSection.css";

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
    <article className="edit-section-card">
      <div className="edit-section-header">
        <div>
          <span className="edit-section-number">
            Section {index + 1}
          </span>

          <h3>
            {section.title.trim() || "Untitled Section"}
          </h3>
        </div>

        <button
          type="button"
          className="edit-section-remove"
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </div>

      <div className="edit-section-fields">
        <div className="edit-section-field">
          <label htmlFor={`section-title-${index}`}>
            Section Title
          </label>

          <input
            id={`section-title-${index}`}
            type="text"
            value={section.title}
            onChange={(event) =>
              onTitleChange(index, event.target.value)
            }
            placeholder="Enter section title"
          />
        </div>

        <div className="edit-section-field">
          <label htmlFor={`section-description-${index}`}>
            Section Description
          </label>

          <textarea
            id={`section-description-${index}`}
            rows={5}
            value={section.description}
            onChange={(event) =>
              onDescriptionChange(index, event.target.value)
            }
            placeholder="Enter section description"
          />
        </div>
      </div>

      <div className="edit-section-image-area">
        <div className="edit-section-image-header">
          <h4>Section Image</h4>
          <p>Select a default image or upload a custom image.</p>
        </div>

        <div className="edit-section-mode-tabs">
          <label
            className={`edit-section-mode-tab ${
              section.imageMode === "default" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              checked={section.imageMode === "default"}
              onChange={() =>
                onImageModeChange(index, "default")
              }
            />
            Default Images
          </label>

          <label
            className={`edit-section-mode-tab ${
              section.imageMode === "custom" ? "active" : ""
            }`}
          >
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
          <div className="edit-section-default-images">
            {images.map((image) => (
              <button
                key={image.id}
                type="button"
                className={`edit-section-image-option ${
                  section.sectionImageId === image.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  onImageChange(index, image.id)
                }
              >
                <img
                  src={getImageUrl(image.filePath)}
                  alt="Default section option"
                />

                {section.sectionImageId === image.id && (
                  <span className="edit-section-selected-label">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {section.imageMode === "custom" && (
          <div className="edit-section-image-panel">
            <label
              className={`edit-section-upload ${
                section.isUploading
                  ? "edit-section-upload-loading"
                  : ""
              }`}
            >
              {section.isUploading ? (
                <div className="edit-section-upload-progress">
                  <strong>
                    {section.uploadProgress < 100
                      ? "Uploading image..."
                      : "Processing image..."}
                  </strong>

                  <span className="edit-section-upload-percentage">
                    {section.uploadProgress}%
                  </span>

                  <div className="edit-section-progress-track">
                    <div
                      className={`edit-section-progress-bar ${
                        section.uploadProgress === 100
                          ? "edit-section-progress-bar-processing"
                          : ""
                      }`}
                      style={{
                        width: `${section.uploadProgress}%`,
                      }}
                    />
                  </div>

                  <small>
                    {section.uploadProgress < 100
                      ? "Please wait while the image is being uploaded."
                      : "Upload complete. Processing the image..."}
                  </small>
                </div>
              ) : (
                <>
                  <span className="edit-section-upload-icon">
                    ↑
                  </span>

                  <strong>Upload a section image</strong>

                  <small>
                    Choose an image from your device.
                  </small>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onImageUpload(index, event)
                    }
                  />
                </>
              )}
            </label>
          </div>
        )}

        {!isNewSection && (
          <div className="edit-section-preview-area">
            <div className="edit-section-preview-header">
              <div>
                <h4>Current Image</h4>
                <p>
                  Click the current image to restore the original selection.
                </p>
              </div>

              {!hasSectionImageChanged && (
                <span className="edit-section-current-label">
                  Current
                </span>
              )}
            </div>

            <button
              type="button"
              className={`edit-section-preview ${
                !hasSectionImageChanged ? "selected" : ""
              }`}
              onClick={() =>
                onRestoreOriginalImage(index)
              }
            >
              <img
                src={getImageUrl(section.originalImageUrl)}
                alt="Current section"
              />
            </button>
          </div>
        )}

        {section.sectionImageId > 0 &&
          (isNewSection || hasSectionImageChanged) && (
            <div className="edit-section-preview-area">
              <div className="edit-section-preview-header">
                <div>
                  <h4>New Selected Image</h4>
                  <p>
                    This image will be used after saving.
                  </p>
                </div>

                <span className="edit-section-new-label">
                  New
                </span>
              </div>

              {selectedSectionImage ? (
                <div className="edit-section-preview">
                  <img
                    src={getImageUrl(
                      selectedSectionImage.filePath
                    )}
                    alt="New selected section"
                  />
                </div>
              ) : section.customImageUrl ? (
                <div className="edit-section-preview">
                  <img
                    src={getImageUrl(section.customImageUrl)}
                    alt="New selected section"
                  />
                </div>
              ) : null}
            </div>
          )}
      </div>
    </article>
  );
}