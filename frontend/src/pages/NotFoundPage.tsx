import { useNavigate } from "react-router-dom";
import PageState from "../components/common/PageState";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageState
      title="Page not found"
      message="The page you requested does not exist."
      actionLabel="Back to Home"
      onAction={() => navigate("/")}
    />
  );
}