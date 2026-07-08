import { useNavigate } from "react-router-dom";
import "../../../styles/pages/ManageContentPage.css";

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
    <div className="manage-content-filters">
      <div className="manage-content-search">
        <input
          type="text"
          placeholder="Search content..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              setSearch(searchInput);
            }
          }}
        />

        <button
          className="search-button"
          onClick={() => {
            setPage(1);
            setSearch(searchInput);
          }}
        >
          Search
        </button>
      </div>

      <div className="manage-content-filter-group">
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
          <option value="">All Statuses</option>
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

      <button
        className="create-content-button"
        onClick={() => navigate("/content/create")}
      >
        + Create Content
      </button>
    </div>
  );
}