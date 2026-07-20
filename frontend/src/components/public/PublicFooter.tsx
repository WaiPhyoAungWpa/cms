import "../../styles/components/public/PublicFooter.css";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <p>
        © {new Date().getFullYear()} WAI ZXT. Personal CMS Project. All
        rights reserved.
      </p>
    </footer>
  );
}