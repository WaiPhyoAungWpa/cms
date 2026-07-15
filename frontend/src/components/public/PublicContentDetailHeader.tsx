import { useNavigate } from "react-router-dom";
import "../../styles/components/content/content-detail/public/PublicContentDetailHeader.css";

interface Props {
  title: string;
}

export default function PublicContentDetailHeader({ title }: Props) {
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });

        return;
      }

      if (!navigator.clipboard) {
        throw new Error("Clipboard is not available.");
      }

      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      alert("Unable to share this link. Please copy the URL manually.");
    }
  };

  return (
    <div className="public-content-detail-header">
      <button type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">&larr;</span>
        Back
      </button>

      <button type="button" onClick={handleShare}>
        Share
      </button>
    </div>
  );
}