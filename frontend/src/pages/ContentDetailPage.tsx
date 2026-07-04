import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ContentTemplateRenderer from "../components/content/ContentTemplateRenderer";

import { getContent } from "../services/contentService";

import { ContentDetail } from "../types/content";

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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!content) {
    return <p>Content not found.</p>;
  }

  return <ContentTemplateRenderer content={content} />;
}