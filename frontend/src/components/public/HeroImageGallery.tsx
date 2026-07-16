import { getImageUrl } from "../../utils/image";
import "../../styles/components/public/PublicHero.css";

const heroImages = [
  "/images/defaults/experience-1.png",
  "/images/defaults/experience-2.png",
  "/images/defaults/experience-3.png",
  "/images/defaults/learning-1.png",
  "/images/defaults/learning-2.png",
  "/images/defaults/learning-3.png",
  "/images/defaults/lifestyle-1.png",
  "/images/defaults/lifestyle-2.png",
  "/images/defaults/lifestyle-3.png",
];

export default function HeroImageGallery() {
  return (
    <div className="public-hero-gallery">
      <div className="hero-image-gallery">
        {heroImages.map((image) => (
          <div
            key={image}
            className="hero-image-gallery-item"
            style={{
              backgroundImage: `url(${getImageUrl(image)})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}