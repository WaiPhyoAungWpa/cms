import { ContentListItem } from "../../../types/content";

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
    <div className="restore-modal-overlay">
      <div className="restore-modal">
        <h2>Restore Content</h2>

        <div className="restore-modal-field">
          <label>Original Content Status</label>
          <input
            type="text"
            value={restoringContent.previousStatus ?? ""}
            readOnly
          />
        </div>

        <div className="restore-modal-field">
          <label>Visibility Status</label>
          <select
            value={restoreVisibilityStatus}
            onChange={(event) =>
              setRestoreVisibilityStatus(event.target.value)
            }
            disabled={isRestoring}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div className="restore-modal-actions">
          <button
            onClick={() => setRestoringContent(null)}
            disabled={isRestoring}
          >
            Cancel
          </button>

          <button onClick={handleRestore} disabled={isRestoring}>
            {isRestoring ? "Restoring..." : "Restore"}
          </button>
        </div>
      </div>
    </div>
  );
}