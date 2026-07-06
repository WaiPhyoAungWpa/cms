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
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "2rem",
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      {status === "Draft" && (
        <>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : "Save as Draft"}
          </button>

          <button
            type="button"
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
          onClick={onSaveChanges}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : "Save Changes"}
        </button>
      )}
    </div>
  );
}