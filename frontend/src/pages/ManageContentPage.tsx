import { useManageContent } from "../hooks/content/useManageContent";
import ManageContentFilters from "../components/content/manage-content/ManageContentFilters";
import ManageContentTable from "../components/content/manage-content/ManageContentTable";
import ManageContentPagination from "../components/content/manage-content/ManageContentPagination";
import RestoreContentModal from "../components/content/manage-content/RestoreContentModal";
import PageState from "../components/common/PageState";
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
      <PageState
        title="Loading content"
        message="Please wait while your content records are being retrieved."
      />
    );
  }

  if (error) {
    return (
      <PageState
        title="Unable to load content"
        message={error}
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
      />
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