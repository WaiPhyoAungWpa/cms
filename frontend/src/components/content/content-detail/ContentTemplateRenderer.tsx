import { ContentTemplateData  } from "../../../types/content";

import ExperienceTemplate from "./ExperienceTemplate";
import LearningTemplate from "./LearningTemplate";
import LifestyleTemplate from "./LifestyleTemplate";

interface Props {
  content: ContentTemplateData;
}

export default function ContentTemplateRenderer({ content }: Props) {
  switch (content.category) {
    case "Experience":
      return <ExperienceTemplate content={content} />;

    case "Learning":
      return <LearningTemplate content={content} />;

    case "Lifestyle":
      return <LifestyleTemplate content={content} />;

    default:
      return <p>Unknown category.</p>;
  }
}