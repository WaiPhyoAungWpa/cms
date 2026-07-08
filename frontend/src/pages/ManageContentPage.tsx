import { useManageContent } from "../hooks/content/useManageContent";
import ManageContentFilters from "../components/content/manage-content/ManageContentFilters";
import ManageContentTable from "../components/content/manage-content/ManageContentTable";
import ManageContentPagination from "../components/content/manage-content/ManageContentPagination";
import RestoreContentModal from "../components/content/manage-content/RestoreContentModal";
import "../styles/pages/ManageContentPage.css";

export default function ManageContentPage() {
  const {
    contents,
    page,
    setPage,
    totalPages,
    totalCount,
    loading,
    error,
    searchInput,
    setSearchInput,
    setSearch,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    visibilityStatus,
    setVisibilityStatus,
    deletingId,
    handleDelete,
    restoringContent,
    setRestoringContent,
    restoreVisibilityStatus,
    setRestoreVisibilityStatus,
    isRestoring,
    handleOpenRestore,
    handleRestore,
  } = useManageContent();

  if (loading) {
    return (
      <div className="manage-content-state">
        <div className="manage-content-spinner" />

        <h2>Loading content</h2>

        <p>Please wait while your content records are being retrieved.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-content-state">
        <div className="manage-content-error-icon">!</div>

        <h2>Unable to load content</h2>

        <p>{error}</p>

        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="manage-content-page">
      <header className="manage-content-header">
        <div>
          <h1>Manage Content</h1>
          <p>View, edit, delete, and restore your content.</p>
        </div>
      </header>

      <ManageContentFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        status={status}
        setStatus={setStatus}
        visibilityStatus={visibilityStatus}
        setVisibilityStatus={setVisibilityStatus}
        setPage={setPage}
      />

      <ManageContentTable
        contents={contents}
        deletingId={deletingId}
        handleDelete={handleDelete}
        handleOpenRestore={handleOpenRestore}
      />

      {restoringContent && (
        <RestoreContentModal
          restoringContent={restoringContent}
          setRestoringContent={setRestoringContent}
          restoreVisibilityStatus={restoreVisibilityStatus}
          setRestoreVisibilityStatus={setRestoreVisibilityStatus}
          isRestoring={isRestoring}
          handleRestore={handleRestore}
        />
      )}

      <ManageContentPagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
      />
    </div>
  );
}