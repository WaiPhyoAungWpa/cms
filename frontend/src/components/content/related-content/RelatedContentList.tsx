import { Link, useLocation } from "react-router-dom";
import type { RelatedContentResponse } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";

import "../../../styles/components/content/related-content/RelatedContentList.css";

interface Props {
  relatedContents: RelatedContentResponse[];
}

export default function RelatedContentList({ relatedContents }: Props) {
  const location = useLocation();

  const isPublicPage = location.pathname.startsWith("/public");
  const basePath = isPublicPage ? "/public/content" : "/content";

  if (relatedContents.length === 0) {
    return null;
  }

  return (
    <section className="related-contents">
      <h2 className="related-contents-title">
        Related Contents
      </h2>

      <div className="related-content-grid">
        {relatedContents.map((content) => (
          <Link
            key={content.id}
            to={`${basePath}/${content.id}`}
            className="related-content-card"
          >
            <img
              className="related-content-image"
              src={getImageUrl(content.coverImageUrl)}
              alt={content.title}
            />

            <div className="related-content-body">
              <p className="related-content-category">
                {content.category}
              </p>

              <h3 className="related-content-title">
                {content.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}