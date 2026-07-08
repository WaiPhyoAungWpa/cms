import "../../../styles/components/content/edit-content/EditContentActions.css";

interface EditContentActionsProps {
  status: string;
  isSubmitting: boolean;

  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onSaveChanges: () => void;
}

export default function EditContentActions({
  status,
  isSubmitting,
  onCancel,
  onSaveDraft,
  onPublish,
  onSaveChanges,
}: EditContentActionsProps) {
  return (
    <div className="edit-content-actions">
      <button
        type="button"
        className="edit-action-cancel"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <div className="edit-content-primary-actions">
        {status === "Draft" && (
          <>
            <button
              type="button"
              className="edit-action-secondary"
              onClick={onSaveDraft}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : "Save as Draft"}
            </button>

            <button
              type="button"
              className="edit-action-primary"
              onClick={onPublish}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : "Publish"}
            </button>
          </>
        )}

        {status === "Published" && (
          <button
            type="button"
            className="edit-action-primary"
            onClick={onSaveChanges}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}