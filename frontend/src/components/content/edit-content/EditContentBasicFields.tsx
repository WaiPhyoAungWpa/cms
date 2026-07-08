import { ChangeEvent } from "react";

import "../../../styles/components/content/edit-content/EditContentBasicFields.css";

interface EditContentBasicFieldsProps {
  categoryId: number;
  visibilityStatus: string;
  title: string;
  description: string;

  onCategoryChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
  onVisibilityStatusChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function EditContentBasicFields({
  categoryId,
  visibilityStatus,
  title,
  description,
  onCategoryChange,
  onVisibilityStatusChange,
  onTitleChange,
  onDescriptionChange,
}: EditContentBasicFieldsProps) {
  return (
    <section className="edit-basic-fields">
      <div className="edit-basic-fields-header">
        <h2>Content Details</h2>
        <p>Update the main information and visibility of this content.</p>
      </div>

      <div className="edit-basic-fields-grid">
        <div className="edit-basic-field">
          <label htmlFor="edit-category">Category</label>

          <select
            id="edit-category"
            value={categoryId}
            onChange={onCategoryChange}
          >
            <option value={1}>Experience</option>
            <option value={2}>Learning</option>
            <option value={3}>Lifestyle</option>
          </select>

          <span className="edit-basic-field-help">
            Changing the category will reset the selected images.
          </span>
        </div>

        <div className="edit-basic-field">
          <label htmlFor="edit-visibility">Visibility Status</label>

          <select
            id="edit-visibility"
            value={visibilityStatus}
            onChange={(event) =>
              onVisibilityStatusChange(event.target.value)
            }
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <span className="edit-basic-field-help">
            Choose whether this content is publicly visible.
          </span>
        </div>

        <div className="edit-basic-field edit-basic-field-full">
          <label htmlFor="edit-title">Title</label>

          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
            placeholder="Enter content title"
          />
        </div>

        <div className="edit-basic-field edit-basic-field-full">
          <label htmlFor="edit-description">Description</label>

          <textarea
            id="edit-description"
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
            placeholder="Enter content description"
            rows={6}
          />
        </div>
      </div>
    </section>
  );
}