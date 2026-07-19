import { ContentTemplateData  } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";
import RelatedContentList from "../related-content/RelatedContentList";

import "../../../styles/components/content/content-detail/ExperienceTemplate.css";

interface Props {
  content: ContentTemplateData;
}

export default function ExperienceTemplate({ content }: Props) {
  return (
    <div className="experience-template">

      <p className="experience-category">{content.category}</p>

      <img
        className="experience-cover"
        src={getImageUrl(content.coverImageUrl)}
        alt={content.title}
      />

      <div className="experience-intro">
        <h1 className="experience-title">{content.title}</h1>

        <p className="experience-description">{content.description}</p>

        {content.hyperlinkUrl && (
          <div className="experience-link">
            <h3 className="experience-link-heading">
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

      <div className="experience-sections">
        {content.sections.map((section) => (
          <section key={section.id} className="experience-section">
            <img
              className="experience-section-image"
              src={getImageUrl(section.imageUrl)}
              alt={section.title}
            />

            <div className="experience-section-content">
              <h2 className="experience-section-title">{section.title}</h2>

              <p className="experience-section-description">
                {section.description}
              </p>

              {section.hyperlinkUrl && (
                <div className="experience-section-link">
                  <h3 className="experience-link-heading">
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
          </section>
        ))}
      </div>

      <RelatedContentList relatedContents={content.relatedContents} />
    </div>
  );
}