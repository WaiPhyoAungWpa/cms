import { ContentDetail } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";
import AdminContentDetailHeader from "./admin/AdminContentDetailHeader";

import "./ExperienceTemplate.css";

interface Props {
  content: ContentDetail;
}

export default function ExperienceTemplate({ content }: Props) {

  return (
    <div className="experience-template">
      <AdminContentDetailHeader />

      <h1 className="experience-category">
        {content.category}
      </h1>

      <img
        className="experience-cover"
        src={getImageUrl(content.coverImageUrl)}
        alt={content.title}
      />

      <h2 className="experience-title">
        {content.title}
      </h2>

      <p className="experience-description">
        {content.description}
      </p>

      {content.sections.map((section) => (
        <section
          key={section.id}
          className="experience-section"
        >
          <img
            className="experience-section-image"
            src={getImageUrl(section.imageUrl)}
            alt={section.title}
          />

          <h3 className="experience-section-title">
            {section.title}
          </h3>

          <p className="experience-section-description">
            {section.description}
          </p>
        </section>
      ))}
    </div>
  );
}