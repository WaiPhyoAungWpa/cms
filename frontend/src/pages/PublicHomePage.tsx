import { useEffect, useState } from "react";
import { getPublicContents } from "../services/publicContentService";
import { PublicContentListResponse } from "../types/content";
import PublicHeader from "../components/public/PublicHeader";
import PublicHero from "../components/public/PublicHero";
import LatestContent from "../components/public/LatestContent";
import PublicContentGrid from "../components/public/PublicContentGrid";
import PublicContentFilters from "../components/public/PublicContentFilters";
import PublicContentPagination from "../components/public/PublicContentPagination";
import PageState from "../components/common/PageState";
import CommunitySection from "../components/public/dashboard/CommunitySection";
import { getPublicDashboard } from "../services/publicDashboardService";
import { PublicDashboard } from "../types/publicDashboard";
import "../styles/pages/PublicHomePage.css";

export default function PublicHomePage() {
  const [data, setData] = useState<PublicContentListResponse | null>(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const [page, setPage] = useState(1);

  const [dashboard, setDashboard] = useState<PublicDashboard | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContents() {
      setLoading(true);
      setError("");

      try {
        const [contentResult, dashboardResult] =
            await Promise.all([
                getPublicContents({
                    search: appliedSearch,
                    categoryId,
                    page,
                    pageSize: 9,
                }),
                getPublicDashboard(),
            ]);

        setData(contentResult);
        setDashboard(dashboardResult);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to retrieve content. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContents();
  }, [appliedSearch, categoryId, page]);

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleCategoryChange = (value: number | undefined) => {
    setPage(1);
    setCategoryId(value);
  };

  if (loading) {
    return (
      <PageState
        title="Loading content"
        message="Please wait while published content is being retrieved."
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

  if (!data) {
    return (
      <PageState
        title="No content available"
        message="There is no published content available at the moment."
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!dashboard) {
      return (
          <PageState
              title="Loading dashboard"
              message="Please wait while dashboard data is being retrieved."
          />
      );
  }

  return (
    <div className="public-home-page">
      <PublicHeader />

      <main className="public-home-main">
        <PublicHero />

        <CommunitySection
          dashboard={dashboard}
        />

        {data.latestContent && (
          <LatestContent content={data.latestContent} />
        )}

        <section
          id="published-content"
          className="published-content"
        >
          <h2 className="published-content-title">
            Published Content
          </h2>

          <PublicContentFilters
            search={search}
            categoryId={categoryId}
            onSearchChange={setSearch}
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
          />

          <PublicContentGrid contents={data.contents.items} />

          <PublicContentPagination
            page={data.contents.page}
            totalPages={data.contents.totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>

    </div>
  );
}