import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContentTemplateRenderer from "../components/content/content-detail/ContentTemplateRenderer";
import { getContent } from "../services/contentService";
import { ContentDetail } from "../types/content";
import AdminContentDetailHeader from "../components/content/content-detail/admin/AdminContentDetailHeader";
import PageState from "../components/common/PageState";
import "../styles/pages/ContentDetailPage.css";

export default function ContentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<ContentDetail | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContent() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Not authenticated.");
        }

        const data = await getContent(Number(id), token);

        setContent(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to retrieve content.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [id]);

  if (loading) {
    return (
      <PageState
        title="Loading content"
        message="Please wait while the content details are being retrieved."
      />
    );
  }

  if (error) {
    return (
      <PageState
        title="Unable to load content"
        message={error}
        actionLabel="Back to Manage Content"
        onAction={() => navigate("/content")}
      />
    );
  }

  if (!content) {
    return (
      <PageState
        title="Content not found"
        message="The requested content could not be found."
        actionLabel="Back to Manage Content"
        onAction={() => navigate("/content")}
      />
    );
  }

  return (
    <main className="content-detail-page">
      <AdminContentDetailHeader />
      <ContentTemplateRenderer content={content} />
    </main>
  );
}