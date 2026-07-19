import { ContentTemplateData  } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";
import RelatedContentList from "../related-content/RelatedContentList";

import "../../../styles/components/content/content-detail/LearningTemplate.css";

interface Props {
  content: ContentTemplateData;
}

export default function LearningTemplate({ content }: Props) {
  return (
    <div className="learning-template">

      <p className="learning-category">{content.category}</p>

      <div className="learning-cover-wrapper">
        <img
          className="learning-cover"
          src={getImageUrl(content.coverImageUrl)}
          alt={content.title}
        />

        <div className="learning-cover-overlay" />

        <h1 className="learning-title">{content.title}</h1>
      </div>

      <div className="learning-intro">
        <p className="learning-description">{content.description}</p>

        {content.hyperlinkUrl && (
          <div className="learning-link">
            <h3 className="learning-link-heading">
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

      <div className="learning-sections">
        {content.sections.map((section) => (
          <section key={section.id} className="learning-section">
            <h2 className="learning-section-title">{section.title}</h2>

            <img
              className="learning-section-image"
              src={getImageUrl(section.imageUrl)}
              alt={section.title}
            />

            <p className="learning-section-description">
              {section.description}
            </p>

            {section.hyperlinkUrl && (
              <div className="learning-section-link">
                <h3 className="learning-link-heading">
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
          </section>
        ))}
      </div>

      <RelatedContentList relatedContents={content.relatedContents} />
    </div>
  );
}