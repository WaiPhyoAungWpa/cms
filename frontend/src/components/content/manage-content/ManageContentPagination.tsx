import "../../../styles/pages/ManageContentPage.css";

interface ManageContentPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  setPage: (page: number) => void;
}

export default function ManageContentPagination({
  page,
  totalPages,
  totalCount,
  setPage,
}: ManageContentPaginationProps) {
  return (
    <div className="manage-content-pagination">
      <div className="pagination-summary">
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <span className="pagination-divider" />

        <span>
          <strong>{totalCount}</strong> total records
        </span>
      </div>

      <div className="pagination-actions">
        <button
          className="pagination-button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="pagination-current-page">{page}</span>

        <button
          className="pagination-button"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}