import { ContentListItem } from "../../../types/content";
import "../../../styles/pages/ManageContentPage.css";

interface RestoreContentModalProps {
  restoringContent: ContentListItem;
  setRestoringContent: (content: ContentListItem | null) => void;
  restoreVisibilityStatus: string;
  setRestoreVisibilityStatus: (value: string) => void;
  isRestoring: boolean;
  handleRestore: () => void;
}

export default function RestoreContentModal({
  restoringContent,
  setRestoringContent,
  restoreVisibilityStatus,
  setRestoreVisibilityStatus,
  isRestoring,
  handleRestore,
}: RestoreContentModalProps) {
  return (
    <div
      className="restore-modal-overlay"
      onClick={() => {
        if (!isRestoring) {
          setRestoringContent(null);
        }
      }}
    >
      <div
        className="restore-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="restore-modal-header">
          <div>
            <h2 id="restore-modal-title">Restore Content</h2>
            <p>
              Restore <strong>{restoringContent.title}</strong> to its previous
              content status.
            </p>
          </div>
        </div>

        <div className="restore-modal-body">
          <div className="restore-modal-field">
            <label htmlFor="original-content-status">
              Original Content Status
            </label>

            <input
              id="original-content-status"
              type="text"
              value={restoringContent.previousStatus ?? ""}
              readOnly
            />
          </div>

          <div className="restore-modal-field">
            <label htmlFor="restore-visibility-status">
              Visibility Status
            </label>

            <select
              id="restore-visibility-status"
              value={restoreVisibilityStatus}
              onChange={(event) =>
                setRestoreVisibilityStatus(event.target.value)
              }
              disabled={isRestoring}
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>

            <span className="restore-modal-hint">
              Choose who can view the content after it is restored.
            </span>
          </div>
        </div>

        <div className="restore-modal-actions">
          <button
            className="restore-modal-cancel-button"
            onClick={() => setRestoringContent(null)}
            disabled={isRestoring}
          >
            Cancel
          </button>

          <button
            className="restore-modal-confirm-button"
            onClick={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? "Restoring..." : "Restore Content"}
          </button>
        </div>
      </div>
    </div>
  );
}