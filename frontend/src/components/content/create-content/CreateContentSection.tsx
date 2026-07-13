import { DefaultImage } from "../../../types/image";
import { getImageUrl } from "../../../utils/image";
import "../../../styles/components/content/create-content/CreateContentSection.css";

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
    <article className="create-content-section">
      <div className="create-content-section-header">
        <div>
          <span className="create-content-section-label">
            Content Section
          </span>
          <h3>Section {index + 1}</h3>
        </div>

        <button
          type="button"
          className="create-content-remove-section-button"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="create-content-fields">
        <div className="create-content-field">
          <label htmlFor={`section-${index}-title`}>
            Section Title
          </label>

          <input
            id={`section-${index}-title`}
            type="text"
            value={title}
            placeholder="Enter section title"
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
          />
        </div>

        <div className="create-content-field">
          <label htmlFor={`section-${index}-description`}>
            Section Description
          </label>

          <textarea
            id={`section-${index}-description`}
            rows={5}
            value={description}
            placeholder="Enter section description"
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
          />
        </div>
      </div>

      <div className="create-section-image-field">
        <div className="create-section-image-heading">
          <h4>Section Image</h4>
          <p>Select a default image or upload a custom image.</p>
        </div>

        <div className="create-image-mode-selector">
          <label
            className={`create-image-mode-option ${
              imageMode === "default"
                ? "create-image-mode-option-active"
                : ""
            }`}
          >
            <input
              type="radio"
              name={`section-${index}-image-mode`}
              checked={imageMode === "default"}
              onChange={() => onImageModeChange("default")}
            />

            <span>
              <strong>Default Image</strong>
              <small>Choose from the available category images.</small>
            </span>
          </label>

          <label
            className={`create-image-mode-option ${
              imageMode === "custom"
                ? "create-image-mode-option-active"
                : ""
            }`}
          >
            <input
              type="radio"
              name={`section-${index}-image-mode`}
              checked={imageMode === "custom"}
              onChange={() => onImageModeChange("custom")}
            />

            <span>
              <strong>Custom Image</strong>
              <small>Select an image from your device.</small>
            </span>
          </label>
        </div>

        {imageMode === "default" && (
          <div className="create-image-panel">
            <p className="create-image-panel-label">
              Available Images
            </p>

            <div className="create-image-grid">
              {images.map((image) => {
                const isSelected =
                  sectionImageId === image.id;

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
                      alt={`Section ${index + 1} image option`}
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

            {selectedSectionImage && (
              <div className="create-selected-image">
                <div>
                  <p className="create-image-panel-label">
                    Selected Image
                  </p>
                  <span>
                    This image will be used for section {index + 1}.
                  </span>
                </div>

                <img
                  src={getImageUrl(selectedSectionImage.filePath)}
                  alt={`Selected image for section ${index + 1}`}
                />
              </div>
            )}
          </div>
        )}

        {imageMode === "custom" && (
          <div className="create-image-panel">
            <label className="create-image-upload">
              <span className="create-image-upload-icon">↑</span>

              <strong>Select a section image</strong>

              <small>
                The image will be uploaded when you save or publish.
              </small>

              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
              />
            </label>

            {customImageUrl && (
              <div className="create-selected-image">
                <div>
                  <p className="create-image-panel-label">
                    Selected Image
                  </p>

                  <span>
                    This image will be used for section {index + 1}.
                  </span>
                </div>

                <img
                  src={customImageUrl}
                  alt={`Selected image for section ${index + 1}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}