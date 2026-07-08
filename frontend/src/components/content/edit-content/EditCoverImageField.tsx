import { ChangeEvent } from "react";
import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

import "../../../styles/components/content/edit-content/EditCoverImageField.css";

interface EditCoverImageFieldProps {
  images: DefaultImage[];
  coverImageId: number;
  coverImageMode: "default" | "custom";
  originalCoverImageUrl: string;
  customCoverImageUrl: string;
  hasCoverImageChanged: boolean;
  isUploading: boolean;
  uploadProgress: number;

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
  isUploading,
  uploadProgress,
  onImageSelect,
  onModeChange,
  onUpload,
  onRestoreOriginal,
}: EditCoverImageFieldProps) {
  const selectedCoverImage = images.find(
    (image) => image.id === coverImageId
  );

  return (
    <section className="edit-cover-field">
      <div className="edit-cover-header">
        <h2>Cover Image</h2>
        <p>Select a default image or upload a custom image.</p>
      </div>

      <div className="edit-cover-mode-tabs">
        <label
          className={`edit-cover-mode-tab ${
            coverImageMode === "default" ? "active" : ""
          }`}
        >
          <input
            type="radio"
            checked={coverImageMode === "default"}
            onChange={() => onModeChange("default")}
          />
          Default Images
        </label>

        <label
          className={`edit-cover-mode-tab ${
            coverImageMode === "custom" ? "active" : ""
          }`}
        >
          <input
            type="radio"
            checked={coverImageMode === "custom"}
            onChange={() => onModeChange("custom")}
          />
          Upload Custom Image
        </label>
      </div>

      {coverImageMode === "default" && (
        <div className="edit-cover-default-images">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={`edit-cover-image-option ${
                coverImageId === image.id ? "selected" : ""
              }`}
              onClick={() => onImageSelect(image.id)}
            >
              <img
                src={getImageUrl(image.filePath)}
                alt="Default cover option"
              />

              {coverImageId === image.id && (
                <span className="edit-cover-selected-label">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {coverImageMode === "custom" && (
        <div className="edit-cover-image-panel">
          <label
            className={`edit-cover-upload ${
              isUploading ? "edit-cover-upload-loading" : ""
            }`}
          >
            {isUploading ? (
              <div className="edit-cover-upload-progress">
                <strong>
                  {uploadProgress < 100
                    ? "Uploading image..."
                    : "Processing image..."}
                </strong>

                <span className="edit-cover-upload-percentage">
                  {uploadProgress}%
                </span>

                <div className="edit-cover-progress-track">
                  <div
                    className={`edit-cover-progress-bar ${
                      uploadProgress === 100
                        ? "edit-cover-progress-bar-processing"
                        : ""
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <small>
                  {uploadProgress < 100
                    ? "Please wait while the image is being uploaded."
                    : "Upload complete. Processing the image..."}
                </small>
              </div>
            ) : (
              <>
                <span className="edit-cover-upload-icon">↑</span>

                <strong>Upload a cover image</strong>

                <small>Choose an image from your device.</small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                />
              </>
            )}
          </label>
        </div>
      )}

      <div className="edit-cover-preview-section">
        <div className="edit-cover-preview-header">
          <div>
            <h3>Current Image</h3>
            <p>
              Click the current image to restore the original selection.
            </p>
          </div>

          {!hasCoverImageChanged && (
            <span className="edit-cover-current-label">
              Current
            </span>
          )}
        </div>

        <button
          type="button"
          className={`edit-cover-preview ${
            !hasCoverImageChanged ? "selected" : ""
          }`}
          onClick={onRestoreOriginal}
        >
          <img
            src={getImageUrl(originalCoverImageUrl)}
            alt="Current cover"
          />
        </button>
      </div>

      {hasCoverImageChanged && (
        <div className="edit-cover-preview-section">
          <div className="edit-cover-preview-header">
            <div>
              <h3>New Selected Image</h3>
              <p>This image will replace the current cover after saving.</p>
            </div>

            <span className="edit-cover-new-label">
              New
            </span>
          </div>

          {selectedCoverImage ? (
            <div className="edit-cover-preview">
              <img
                src={getImageUrl(selectedCoverImage.filePath)}
                alt="New selected cover"
              />
            </div>
          ) : customCoverImageUrl ? (
            <div className="edit-cover-preview">
              <img
                src={getImageUrl(customCoverImageUrl)}
                alt="New selected cover"
              />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}