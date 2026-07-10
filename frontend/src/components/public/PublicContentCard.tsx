import { PublicContentListItem } from "../../types/content";
import { getImageUrl } from "../../utils/image";
import "../../styles/components/public/PublicContentCard.css";

interface Props {
  content: PublicContentListItem;
}

export default function PublicContentCard({ content }: Props) {
  return (
    <article className="public-content-card">
      <img
        className="public-content-card-image"
        src={getImageUrl(content.coverImageUrl)}
        alt={content.title}
      />

      <div className="public-content-card-body">
        <p className="public-content-card-category">
          {content.category}
        </p>

        <h3 className="public-content-card-title">
          {content.title}
        </h3>
      </div>
    </article>
  );
}