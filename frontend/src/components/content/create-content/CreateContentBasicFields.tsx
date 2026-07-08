interface CreateContentBasicFieldsProps {
  categoryId: number;
  title: string;
  description: string;
  onCategoryChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function CreateContentBasicFields({
  categoryId,
  title,
  description,
  onCategoryChange,
  onTitleChange,
  onDescriptionChange,
}: CreateContentBasicFieldsProps) {
  return (
    <div className="create-content-fields">
      <div className="create-content-field">
        <label htmlFor="create-content-category">
          Category
        </label>

        <select
          id="create-content-category"
          value={categoryId}
          onChange={onCategoryChange}
        >
          <option value={1}>Experience</option>
          <option value={2}>Learning</option>
          <option value={3}>Lifestyle</option>
        </select>
      </div>

      <div className="create-content-field">
        <label htmlFor="create-content-title">
          Title
        </label>

        <input
          id="create-content-title"
          type="text"
          value={title}
          placeholder="Enter content title"
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
        />
      </div>

      <div className="create-content-field">
        <label htmlFor="create-content-description">
          Description
        </label>

        <textarea
          id="create-content-description"
          rows={6}
          value={description}
          placeholder="Enter a short description of the content"
          onChange={(event) =>
            onDescriptionChange(event.target.value)
          }
        />
      </div>
    </div>
  );
}