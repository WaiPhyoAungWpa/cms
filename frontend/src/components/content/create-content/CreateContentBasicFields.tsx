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
    <>
      <div>
        <label>Category</label>
        <br />
        <select
          value={categoryId}
          onChange={onCategoryChange}
        >
          <option value={1}>Experience</option>
          <option value={2}>Learning</option>
          <option value={3}>Lifestyle</option>
        </select>
      </div>

      <br />

      <div>
        <label>Title</label>
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
        <label>Description</label>
        <br />
        <textarea
          rows={5}
          cols={50}
          value={description}
          onChange={(event) =>
            onDescriptionChange(event.target.value)
          }
        />
      </div>
    </>
  );
}