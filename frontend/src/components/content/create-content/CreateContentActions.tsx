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
    <div className="create-content-actions">
      <button
        type="button"
        className="create-content-action-button create-content-preview-button"
        onClick={onPreview}
        disabled={isSubmitting}
      >
        Preview
      </button>

      <div className="create-content-primary-actions">
        <button
          type="button"
          className="create-content-action-button create-content-cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="button"
          className="create-content-action-button create-content-draft-button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Save as Draft"}
        </button>

        <button
          type="button"
          className="create-content-action-button create-content-publish-button"
          onClick={onPublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}