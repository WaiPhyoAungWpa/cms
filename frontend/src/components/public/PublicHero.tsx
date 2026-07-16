import HeroImageGallery from "./HeroImageGallery";
import "../../styles/components/public/PublicHero.css";

export default function PublicHero() {
  const scrollToContent = () => {
    document
      .getElementById("published-content")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="public-hero">

      <div className="public-hero-content">

        <h1 className="public-hero-title">
          Welcome to My Personal CMS
        </h1>

        <p className="public-hero-description">
          Explore my experiences, learning journey
          and lifestyle articles.
        </p>

        <button
          className="public-hero-button"
          onClick={scrollToContent}
        >
          Browse Content
        </button>

      </div>

      <HeroImageGallery />
    </section>
  );
}