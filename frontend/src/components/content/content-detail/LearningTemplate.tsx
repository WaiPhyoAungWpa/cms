import { ContentDetail } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";
import AdminContentDetailHeader from "./admin/AdminContentDetailHeader";

import "../../../styles/components/content/content-detail/LearningTemplate.css";

interface Props {
  content: ContentDetail;
}

export default function LearningTemplate({ content }: Props) {
  return (
    <div className="learning-template">
      <AdminContentDetailHeader />

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
          </section>
        ))}
      </div>
    </div>
  );
}