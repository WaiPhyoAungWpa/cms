import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContentTemplateRenderer from "../components/content/content-detail/ContentTemplateRenderer";
import PublicContentDetailHeader from "../components/public/PublicContentDetailHeader";
import PublicHeader from "../components/public/PublicHeader";
import PageState from "../components/common/PageState";
import { getPublicContentById } from "../services/publicContentService";
import type { PublicContentDetail } from "../types/content";
import "../styles/pages/PublicContentDetailPage.css";

export default function PublicContentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

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
            actionLabel="Back to Home"
            onAction={() => navigate("/")}
            />
        );
    }

    if (!content) {
        return (
            <PageState
            title="Content not found"
            message="The requested content could not be found."
            actionLabel="Back to Home"
            onAction={() => navigate("/")}
            />
        );
    }

    return (
        <>
        <PublicHeader />
        <main className="public-content-detail-page">
            <PublicContentDetailHeader title={content.title} />
            <ContentTemplateRenderer content={content} />
        </main>
        </>
    );
}