interface CreateContentActionsProps {
  isSubmitting: boolean;
  onPreview: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export default function CreateContentActions({
  isSubmitting,
  onPreview,
  onCancel,
  onSaveDraft,
  onPublish,
}: CreateContentActionsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPreview}
        disabled={isSubmitting}
      >
        Preview
      </button>

      <br />
      <br />

      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Save as Draft"}
      </button>

      <button
        type="button"
        onClick={onPublish}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Publish"}
      </button>
    </>
  );
}