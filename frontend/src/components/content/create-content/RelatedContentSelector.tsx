import "../../../styles/components/content/create-content/RelatedContentSelector.css";
import { RelatedContentResponse } from "../../../types/content";
import { getImageUrl } from "../../../utils/image";

interface CreateRelatedContentFieldProps {
  relatedOptions: RelatedContentResponse[];
  relatedSearch: string;
  relatedPage: number;
  totalRelatedPages: number;
  relatedContentIds: number[];

  onRelatedSearchChange: (value: string) => void;
  onRelatedPageChange: (page: number) => void;
  onRelatedContentChange: (ids: number[]) => void;
}

export default function CreateRelatedContentField({
  relatedOptions,
  relatedSearch,
  relatedPage,
  totalRelatedPages,
  relatedContentIds,
  onRelatedSearchChange,
  onRelatedPageChange,
  onRelatedContentChange,
}: CreateRelatedContentFieldProps) {
  return (
    <div className="create-related-content">
        <div className="create-content-field">

            <div className="related-content-container">
                <input
                    id="create-content-related-search"
                    type="text"
                    value={relatedSearch}
                    placeholder="Search by title or description..."
                    onChange={(event) =>
                    onRelatedSearchChange(event.target.value)
                    }
                />

                <div className="related-content-grid">
                    {relatedOptions.map((content) => {
                    const selected = relatedContentIds.includes(content.id);

                    return (
                        <button
                        key={content.id}
                        type="button"
                        className={`related-content-card ${
                            selected ? "selected" : ""
                        }`}
                        onClick={() => {
                            if (selected) {
                            onRelatedContentChange(
                                relatedContentIds.filter(
                                (id) => id !== content.id
                                )
                            );
                            } else {
                            onRelatedContentChange([
                                ...relatedContentIds,
                                content.id,
                            ]);
                            }
                        }}
                        >
                        <div className="related-content-image">
                            <img
                            src={getImageUrl(content.coverImageUrl)}
                            alt={content.title}
                            />

                            {selected && (
                            <span className="related-content-selected">
                                Selected
                            </span>
                            )}
                        </div>

                        <div className="related-content-info">
                            <span className="related-content-category">
                            {content.category}
                            </span>

                            <h4>{content.title}</h4>
                        </div>
                        </button>
                    );
                    })}
                </div>

                <div className="related-content-pagination">
                    <button
                    type="button"
                    disabled={relatedPage === 1}
                    onClick={() =>
                        onRelatedPageChange(relatedPage - 1)
                    }
                    >
                    Previous
                    </button>

                    <span>
                    Page {relatedPage} of {totalRelatedPages}
                    </span>

                    <button
                    type="button"
                    disabled={relatedPage === totalRelatedPages}
                    onClick={() =>
                        onRelatedPageChange(relatedPage + 1)
                    }
                    >
                    Next
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}