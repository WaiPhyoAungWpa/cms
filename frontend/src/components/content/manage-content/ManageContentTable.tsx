import { useNavigate } from "react-router-dom";
import { ContentListItem } from "../../../types/content";

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
    <table border={1} cellPadding={10}>
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
          {contents.map((content) => (
            <tr key={content.id}>
              <td>{content.id}</td>
              <td>{content.title}</td>
              <td>{content.category}</td>
              <td>{content.status}</td>
              <td>{content.visibilityStatus}</td>
              <td>
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                    }}
                >
                  <button onClick={() => navigate(`/content/${content.id}`)}>
                      View Detail
                  </button>

                  <button onClick={() => navigate(`/content/${content.id}/edit`)}>
                    Edit
                  </button>

                  {(content.status === "Published" ||
                      content.status === "Draft") && (
                        <button
                          onClick={() => handleDelete(content.id)}
                          disabled={deletingId === content.id}
                        >
                          {deletingId === content.id ? "Deleting..." : "Delete"}
                        </button>
                  )}

                  {content.status === "SoftDeleted" && (
                    <button onClick={() => handleOpenRestore(content)}>
                      Restore
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
  );
}