import { useEffect, useState } from "react";
import { getContents, softDeleteContent, restoreContent } from "../../services/contentService";
import { ContentListItem } from "../../types/content";

export function useManageContent() {
    const [contents, setContents] = useState<ContentListItem[]>([]);
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

    const [restoringContent, setRestoringContent] =
    useState<ContentListItem | null>(null);

    const [restoreVisibilityStatus, setRestoreVisibilityStatus] =
    useState("Private");

    const [isRestoring, setIsRestoring] = useState(false);

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

    const handleOpenRestore = (content: ContentListItem) => {
        setRestoringContent(content);
        setRestoreVisibilityStatus(content.visibilityStatus);
    };

    const handleRestore = async () => {
        if (!restoringContent) {
        return;
        }

        try {
        setIsRestoring(true);

        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Not authenticated.");
        }

        await restoreContent(
            restoringContent.id,
            restoreVisibilityStatus,
            token
        );

        alert("Content restored successfully.");

        setRestoringContent(null);

        await fetchContents();
        } catch (err) {
        if (err instanceof Error) {
            alert(err.message);
        } else {
            alert("Unable to restore content. Please try again later.");
        }
        } finally {
        setIsRestoring(false);
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

    return {
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
    };
}