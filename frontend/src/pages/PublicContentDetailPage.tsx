import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentTemplateRenderer from "../components/content/content-detail/ContentTemplateRenderer";
import PublicContentDetailHeader from "../components/public/PublicContentDetailHeader";
import { getPublicContentById } from "../services/publicContentService";
import type { PublicContentDetail } from "../types/content";
import "../styles/pages/PublicContentDetailPage.css";

export default function PublicContentDetailPage() {
    const { id } = useParams();

    const [content, setContent] = useState<PublicContentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadContent() {
        try {
            const data = await getPublicContentById(Number(id));
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

    if (!content) {
    return (
        <div className="public-content-detail-state">
        <div className="public-content-detail-error-icon">!</div>

        <h2>Content not found</h2>

        <p>The requested content could not be found.</p>
        </div>
    );
    }

    return (
        <>
        <main className="public-content-detail-page">
            <PublicContentDetailHeader title={content.title} />
            <ContentTemplateRenderer content={content} />
        </main>
        </>
    );
}