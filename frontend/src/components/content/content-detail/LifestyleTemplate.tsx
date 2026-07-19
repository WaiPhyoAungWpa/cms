import { ContentTemplateData  } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";
import RelatedContentList from "../related-content/RelatedContentList";

import "../../../styles/components/content/content-detail/LifestyleTemplate.css";

interface Props {
  content: ContentTemplateData;
}

export default function LifestyleTemplate({ content }: Props) {
  return (
    <div className="lifestyle-template">

      <p className="lifestyle-category">{content.category}</p>

      <div className="lifestyle-cover-wrapper">
        <img
          className="lifestyle-cover"
          src={getImageUrl(content.coverImageUrl)}
          alt={content.title}
        />

        <div className="lifestyle-cover-overlay" />

        <div className="lifestyle-cover-content">
          <h1 className="lifestyle-title">{content.title}</h1>

          <p className="lifestyle-description">{content.description}</p>

          {content.hyperlinkUrl && (
            <div className="lifestyle-link">
            <h3 className="lifestyle-link-heading">
              External Reference
            </h3>

              <a
                href={content.hyperlinkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.hyperlinkName || content.hyperlinkUrl}
              </a>
            </div>
          )}
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
              <h2 className="lifestyle-section-title">{section.title}</h2>

              <p className="lifestyle-section-description">
                {section.description}
              </p>

              {section.hyperlinkUrl && (
                <div className="lifestyle-section-link">
                  <h3 className="lifestyle-link-heading">
                    External Reference
                  </h3>

                  <a
                    href={section.hyperlinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {section.hyperlinkName || section.hyperlinkUrl}
                  </a>
                </div>
              )}
            </div>

            <img
              className="lifestyle-section-image"
              src={getImageUrl(section.imageUrl)}
              alt={section.title}
            />
          </section>
        ))}
      </div>

      <RelatedContentList relatedContents={content.relatedContents} />
    </div>
  );
}