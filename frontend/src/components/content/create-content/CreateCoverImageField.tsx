import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";

interface CreateCoverImageFieldProps {
  images: DefaultImage[];
  coverImageId: number;
  coverImageMode: "default" | "custom";
  customCoverImageUrl: string;
  isUploading: boolean;
  uploadProgress: number;
  onImageSelect: (imageId: number) => void;
  onModeChange: (mode: "default" | "custom") => void;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function CreateCoverImageField({
  images,
  coverImageId,
  coverImageMode,
  customCoverImageUrl,
  isUploading,
  uploadProgress,
  onImageSelect,
  onModeChange,
  onUpload,
}: CreateCoverImageFieldProps) {
  const selectedCoverImage = images.find(
    (image) => image.id === coverImageId
  );

  return (
    <div className="create-image-field">
      <div className="create-image-mode-selector">
        <label
          className={`create-image-mode-option ${
            coverImageMode === "default"
              ? "create-image-mode-option-active"
              : ""
          }`}
        >
          <input
            type="radio"
            name="cover-image-mode"
            checked={coverImageMode === "default"}
            onChange={() => onModeChange("default")}
          />

          <span>
            <strong>Default Image</strong>
            <small>Choose from the available category images.</small>
          </span>
        </label>

        <label
          className={`create-image-mode-option ${
            coverImageMode === "custom"
              ? "create-image-mode-option-active"
              : ""
          }`}
        >
          <input
            type="radio"
            name="cover-image-mode"
            checked={coverImageMode === "custom"}
            onChange={() => onModeChange("custom")}
          />

          <span>
            <strong>Custom Image</strong>
            <small>Upload your own cover image.</small>
          </span>
        </label>
      </div>

      {coverImageMode === "default" && (
        <div className="create-image-panel">
          <p className="create-image-panel-label">
            Available Images
          </p>

          <div className="create-image-grid">
            {images.map((image) => {
              const isSelected = coverImageId === image.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  className={`create-image-option ${
                    isSelected
                      ? "create-image-option-selected"
                      : ""
                  }`}
                  onClick={() => onImageSelect(image.id)}
                >
                  <img
                    src={getImageUrl(image.filePath)}
                    alt="Default cover option"
                  />

                  {isSelected && (
                    <span className="create-image-selected-badge">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedCoverImage && (
            <div className="create-selected-image">
              <div>
                <p className="create-image-panel-label">
                  Selected Cover
                </p>
                <span>This image will be used as the article cover.</span>
              </div>

              <img
                src={getImageUrl(selectedCoverImage.filePath)}
                alt="Selected cover"
              />
            </div>
          )}
        </div>
      )}

      {coverImageMode === "custom" && (
        <div className="create-image-panel">
          <label
            className={`create-image-upload ${
              isUploading ? "create-image-upload-loading" : ""
            }`}
          >
            {isUploading ? (
              <div className="create-image-upload-progress">
                <strong>
                  {uploadProgress < 100
                    ? "Uploading image..."
                    : "Processing image..."}
                </strong>

                <span className="create-image-upload-percentage">
                  {uploadProgress}%
                </span>

                <div className="create-image-progress-track">
                  <div
                    className={`create-image-progress-bar ${
                      uploadProgress === 100
                        ? "create-image-progress-bar-processing"
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
                <span className="create-image-upload-icon">↑</span>

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

          {customCoverImageUrl && !isUploading && (
            <div className="create-selected-image">
              <div>
                <p className="create-image-panel-label">
                  Uploaded Cover
                </p>

                <span>
                  This image will be used as the article cover.
                </span>
              </div>

              <img
                src={getImageUrl(customCoverImageUrl)}
                alt="Uploaded custom cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}