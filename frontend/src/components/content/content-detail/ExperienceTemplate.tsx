import { ContentTemplateData  } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";

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
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}