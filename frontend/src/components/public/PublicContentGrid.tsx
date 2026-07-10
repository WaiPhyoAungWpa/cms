import { PublicContentListItem } from "../../types/content";
import PublicContentCard from "./PublicContentCard";
import "../../styles/components/public/PublicContentGrid.css";

interface Props {
  contents: PublicContentListItem[];
}

export default function PublicContentGrid({ contents }: Props) {
  if (contents.length === 0) {
    return (
      <p className="public-content-empty">
        No content available.
      </p>
    );
  }

  return (
    <div className="public-content-grid">
      {contents.map((content) => (
        <PublicContentCard
          key={content.id}
          content={content}
        />
      ))}
    </div>
  );
}