import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContents, softDeleteContent } from "../services/contentService";
import { ContentListItem } from "../types/content";

export default function ManageContentPage() {
  const navigate = useNavigate();
  const [contents, setContents] =
      useState<ContentListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not authenticated.");
          return;
        }

        const data = await getContents(
          {
          search: search || undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          status: status || undefined,
          visibilityStatus: visibilityStatus || undefined,
          page,
          pageSize,
          },
          token
        );

        setContents(data.items);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setError("");
      } catch {
        setError("Failed to retrieve contents.");
      } finally {
        setLoading(false);
      }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Not authenticated.");
      }

      await softDeleteContent(id, token);

      alert("Content deleted successfully.");

      await fetchContents();
    } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Unable to delete content. Please try again later.");
        }
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
      fetchContents();
  }, [
      page,
      search,
      categoryId,
      status,
      visibilityStatus,
  ]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Content</h1>

    <div 
    style={{ 
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      }}>
        <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setPage(1);
                    setSearch(searchInput);
                }
            }}
        />

        <select
            value={categoryId}
            onChange={(e) => {
                setPage(1);
                setCategoryId(e.target.value);
            }}
        >
            <option value="">All Categories</option>
            <option value="1">Experience</option>
            <option value="2">Learning</option>
            <option value="3">Lifestyle</option>
        </select>

        <select
            value={status}
            onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
            }}
        >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="SoftDeleted">Soft Deleted</option>
        </select>

        <select
            value={visibilityStatus}
            onChange={(e) => {
                setPage(1);
                setVisibilityStatus(e.target.value);
            }}
        >
            <option value="">All Visibility</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
        </select>
    </div>

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
                      <button>Restore</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
          Showing page {page} of {totalPages}
      </p>
      <p>
          Total Records: {totalCount}
      </p>
      <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
      >
          Previous
      </button>
      <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
      >
          Next
      </button>
    </div>
  );
}