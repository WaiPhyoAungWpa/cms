import { PublicLatestContent } from "../../types/content";
import { getImageUrl } from "../../utils/image";
import "../../styles/components/public/LatestContent.css";

interface Props {
  content: PublicLatestContent;
}

export default function LatestContent({ content }: Props) {
  return (
    <section className="latest-content">
      <h2 className="latest-content-title">
        Latest Content
      </h2>

      <article className="latest-content-card">
        <img
          className="latest-content-image"
          src={getImageUrl(content.coverImageUrl)}
          alt={content.title}
        />

        <div className="latest-content-body">
          <p className="latest-content-category">
            {content.category}
          </p>

          <h3 className="latest-content-content-title">
            {content.title}
          </h3>

          <p className="latest-content-description">
            {content.description}
          </p>
        </div>
      </article>
    </section>
  );
}