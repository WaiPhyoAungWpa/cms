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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Content</h1>

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