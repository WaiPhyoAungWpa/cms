import { ContentDetail } from "../../types/content";
import { getImageUrl } from "../../utils/image";
import ContentDetailHeader from "./ContentDetailHeader";

import "./LearningTemplate.css";

interface Props {
  content: ContentDetail;
}

export default function LearningTemplate({ content }: Props) {

  return (
    <div className="learning-template">
      <ContentDetailHeader />

      <h1 className="learning-category">
        {content.category}
      </h1>

      <div className="learning-cover-wrapper">
        <img
          className="learning-cover"
          src={getImageUrl(content.coverImageUrl)}
          alt={content.title}
        />

        <h2 className="learning-title">
          {content.title}
        </h2>
      </div>

      <p className="learning-description">
        {content.description}
      </p>

      <div className="learning-sections">
        {content.sections.map((section) => (
          <section
            key={section.id}
            className="learning-section"
          >
            <h3 className="learning-section-title">
              {section.title}
            </h3>

            <img
              className="learning-section-image"
              src={getImageUrl(section.imageUrl)}
              alt={section.title}
            />

            <p className="learning-section-description">
                {section.description}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}