import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentTemplateRenderer from "../components/content/content-detail/ContentTemplateRenderer";
import { getContent } from "../services/contentService";
import { ContentDetail } from "../types/content";
import AdminContentDetailHeader from "../components/content/content-detail/admin/AdminContentDetailHeader";
import "../styles/pages/ContentDetailPage.css";

export default function ContentDetailPage() {
  const { id } = useParams();

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
      <main className="content-detail-state">
        <div className="content-detail-state-card">
          <h2>Loading content</h2>
          <p>Please wait while the content details are being retrieved.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="content-detail-state">
        <div className="content-detail-state-card">
          <h2>Unable to load content</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="content-detail-state">
        <div className="content-detail-state-card">
          <h2>Content not found</h2>
          <p>The requested content could not be found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="content-detail-page">
      <AdminContentDetailHeader />
      <ContentTemplateRenderer content={content} />
    </main>
  );
}