import { useNavigate } from "react-router-dom";

interface ManageContentFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  setSearch: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  visibilityStatus: string;
  setVisibilityStatus: (value: string) => void;
  setPage: (page: number) => void;
}

export default function ManageContentFilters({
  searchInput,
  setSearchInput,
  setSearch,
  categoryId,
  setCategoryId,
  status,
  setStatus,
  visibilityStatus,
  setVisibilityStatus,
  setPage,
}: ManageContentFiltersProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
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

      <button onClick={() => navigate("/content/create")}>
        Create Content
      </button>
    </div>
  );
}