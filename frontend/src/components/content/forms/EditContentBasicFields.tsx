import { ChangeEvent } from "react";

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
    <>
      <div>
        <label>Category</label>

        <select
          value={categoryId}
          onChange={onCategoryChange}
        >
          <option value={1}>Experience</option>
          <option value={2}>Learning</option>
          <option value={3}>Lifestyle</option>
        </select>
      </div>

      <div>
        <label>Visibility Status</label>

        <select
          value={visibilityStatus}
          onChange={(event) =>
            onVisibilityStatusChange(event.target.value)
          }
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      <div>
        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
        />
      </div>

      <div>
        <label>Description</label>

        <textarea
          value={description}
          onChange={(event) =>
            onDescriptionChange(event.target.value)
          }
        />
      </div>
    </>
  );
}