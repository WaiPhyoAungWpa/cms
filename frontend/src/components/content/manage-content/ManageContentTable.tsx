import { useNavigate } from "react-router-dom";
import { ContentListItem } from "../../../types/content";
import "../../../styles/pages/ManageContentPage.css";

interface ManageContentTableProps {
  contents: ContentListItem[];
  deletingId: number | null;
  handleDelete: (id: number) => void;
  handleOpenRestore: (content: ContentListItem) => void;
}

export default function ManageContentTable({
  contents,
  deletingId,
  handleDelete,
  handleOpenRestore,
}: ManageContentTableProps) {
  const navigate = useNavigate();

  return (
    <div className="manage-content-table-container">
      <div className="manage-content-table-wrapper">
        <table className="manage-content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {contents.length === 0 ? (
              <tr>
                <td colSpan={6} className="manage-content-empty">
                  No content available.
                </td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content.id}>
                  <td className="content-id">#{content.id}</td>

                  <td className="content-title">{content.title}</td>

                  <td>{content.category}</td>

                  <td>
                    <span
                      className={`content-badge content-status-${content.status.toLowerCase()}`}
                    >
                      {content.status === "SoftDeleted"
                        ? "Soft Deleted"
                        : content.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`content-badge content-visibility-${content.visibilityStatus.toLowerCase()}`}
                    >
                      {content.visibilityStatus}
                    </span>
                  </td>

                  <td>
                    <div className="manage-content-actions">
                      <button
                        className="table-action-button view-button"
                        onClick={() => navigate(`/content/${content.id}`)}
                      >
                        View
                      </button>

                      <button
                        className="table-action-button edit-button"
                        onClick={() =>
                          navigate(`/content/${content.id}/edit`)
                        }
                      >
                        Edit
                      </button>

                      {(content.status === "Published" ||
                        content.status === "Draft") && (
                        <button
                          className="table-action-button delete-button"
                          onClick={() => handleDelete(content.id)}
                          disabled={deletingId === content.id}
                        >
                          {deletingId === content.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}

                      {content.status === "SoftDeleted" && (
                        <button
                          className="table-action-button restore-button"
                          onClick={() => handleOpenRestore(content)}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}