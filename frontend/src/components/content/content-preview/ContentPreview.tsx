import { ContentDetail } from "../../../types/content";
import ContentTemplateRenderer from "../content-detail/ContentTemplateRenderer";

import "../../../styles/components/content/content-preview/ContentPreview.css";

interface ContentPreviewProps {
  content: ContentDetail;
  onClose: () => void;
}

export default function ContentPreview({
  content,
  onClose,
}: ContentPreviewProps) {
  return (
    <main className="content-preview-page">
      <div className="content-preview-header">
        <button
          type="button"
          className="content-preview-close-button"
          onClick={onClose}
        >
          Close Preview
        </button>
      </div>

      <ContentTemplateRenderer content={content} />
    </main>
  );
}