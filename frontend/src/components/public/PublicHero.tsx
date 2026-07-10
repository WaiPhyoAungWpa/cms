import { PublicContentStats } from "../../types/content";
import "../../styles/components/public/PublicHero.css";

interface Props {
  stats: PublicContentStats;
}

export default function PublicHero({ stats }: Props) {
  const scrollToContent = () => {
    document
      .getElementById("published-content")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="public-hero">
      <h1 className="public-hero-title">
        Welcome to My Personal CMS
      </h1>

      <p className="public-hero-description">
        A collection of my experiences, learning journey,
        and lifestyle.
      </p>

      <button
        className="public-hero-button"
        onClick={scrollToContent}
      >
        Browse Content
      </button>

      <div className="public-hero-stats">
        <div className="public-hero-stat">
          <span className="public-hero-stat-value">
            {stats.total}
          </span>
          <span className="public-hero-stat-label">
            Published Content
          </span>
        </div>

        <div className="public-hero-stat">
          <span className="public-hero-stat-value">
            {stats.experience}
          </span>
          <span className="public-hero-stat-label">
            Experience
          </span>
        </div>

        <div className="public-hero-stat">
          <span className="public-hero-stat-value">
            {stats.learning}
          </span>
          <span className="public-hero-stat-label">
            Learning
          </span>
        </div>

        <div className="public-hero-stat">
          <span className="public-hero-stat-value">
            {stats.lifestyle}
          </span>
          <span className="public-hero-stat-label">
            Lifestyle
          </span>
        </div>
      </div>
    </section>
  );
}