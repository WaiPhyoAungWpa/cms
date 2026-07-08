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
    <>
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
    </>
  );
}