import { useNavigate } from "react-router-dom";
import { DashboardRecentContent } from "../../types/dashboard";
import "../../styles/components/dashboard/RecentContent.css";

interface Props {
  contents: DashboardRecentContent[];
}

export default function RecentContent({ contents }: Props) {
  const navigate = useNavigate();

  const formatUpdatedAt = (updatedAt: string) => {
    return new Intl.DateTimeFormat("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(updatedAt));
  };

  return (
    <section className="recent-content">
      <div className="recent-content-header">
        <h2>Recent Content</h2>

        <button onClick={() => navigate("/content")}>
          View All
        </button>
      </div>

      {contents.length === 0 ? (
        <p className="recent-content-empty">No content available.</p>
      ) : (
        <>
          <div className="recent-content-columns">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Last Updated</span>
          </div>

          <div className="recent-content-list">
            {contents.map((content) => (
              <div
                className="recent-content-item"
                key={content.id}
                onClick={() => navigate(`/content/${content.id}`)}
              >
                <p className="recent-content-title">
                  {content.title}
                </p>

                <p>{content.category}</p>

                <p>
                  <span
                    className={`recent-content-status recent-content-status-${content.status.toLowerCase()}`}
                  >
                    {content.status}
                  </span>
                </p>

                <p>{formatUpdatedAt(content.updatedAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}