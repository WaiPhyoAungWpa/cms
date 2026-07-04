import { ContentDetail } from "../../types/content";
import { getImageUrl } from "../../utils/image";
import ContentDetailHeader from "./ContentDetailHeader";

import "./LifestyleTemplate.css";

interface Props {
  content: ContentDetail;
}

export default function LifestyleTemplate({ content }: Props) {

  return (
    <div className="lifestyle-template">
      <ContentDetailHeader />

      <h1 className="lifestyle-category">
        {content.category}
      </h1>

      <div className="lifestyle-cover-wrapper">
        <img
          className="lifestyle-cover"
          src={getImageUrl(content.coverImageUrl)}
          alt={content.title}
        />

        <div className="lifestyle-cover-content">
          <h2 className="lifestyle-title">
            {content.title}
          </h2>

          <p className="lifestyle-description">
            {content.description}
          </p>
        </div>
      </div>

      <div className="lifestyle-sections">
        {content.sections.map((section, index) => (
          <section
            key={section.id}
            className={`lifestyle-section ${
              index % 2 === 1 ? "lifestyle-section-reverse" : ""
            }`}
          >
            <div className="lifestyle-section-content">
              <h3 className="lifestyle-section-title">
                {section.title}
              </h3>

              <p className="lifestyle-section-description">
                {section.description}
              </p>
            </div>

            <img
              className="lifestyle-section-image"
              src={getImageUrl(section.imageUrl)}
              alt={section.title}
            />
          </section>
        ))}
      </div>
    </div>
  );
}