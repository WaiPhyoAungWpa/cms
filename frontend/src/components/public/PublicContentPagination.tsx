import "../../styles/components/public/PublicContentPagination.css";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PublicContentPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="public-content-pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <span className="public-content-pagination-info">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}