import { useNavigate } from "react-router-dom";

import "./ContentDetailHeader.css";

export default function ContentDetailHeader() {
  const navigate = useNavigate();

  return (
    <div className="content-detail-header">
      <button onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}