import { FormEvent } from "react";
import "../../styles/components/public/PublicContentFilters.css";

interface Props {
  search: string;
  categoryId: number | undefined;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | undefined) => void;
  onSearch: () => void;
}

export default function PublicContentFilters({
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
  onSearch,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      className="public-content-filters"
      onSubmit={handleSubmit}
    >
      <input
        className="public-content-search"
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search content..."
      />

      <select
        className="public-content-category"
        value={categoryId ?? ""}
        onChange={(event) =>
          onCategoryChange(
            event.target.value
              ? Number(event.target.value)
              : undefined
          )
        }
      >
        <option value="">All Categories</option>
        <option value="1">Experience</option>
        <option value="2">Learning</option>
        <option value="3">Lifestyle</option>
      </select>

      <button
        className="public-content-search-button"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}