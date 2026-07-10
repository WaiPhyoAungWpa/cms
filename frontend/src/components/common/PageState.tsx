import "../../styles/components/common/PageState.css";

interface PageStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function PageState({
  title,
  message,
  actionLabel,
  onAction,
}: PageStateProps) {
  return (
    <main className="page-state">
      <div className="page-state-card">
        <h2>{title}</h2>
        <p>{message}</p>

        {actionLabel && onAction && (
          <button type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </main>
  );
}