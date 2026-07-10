import { useNavigate } from "react-router-dom";
import "../../styles/components/public/PublicContentDetailHeader.css";

interface Props {
  title: string;
}

export default function PublicContentDetailHeader({ title }: Props) {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        url: window.location.href,
      });

      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard.");
  };

  return (
    <div className="public-content-detail-header">
      <button type="button" onClick={() => navigate(-1)}>
        <span>←</span>
        Back
      </button>

      <button type="button" onClick={handleShare}>
        Share
      </button>
    </div>
  );
}