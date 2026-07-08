import { useNavigate } from "react-router-dom";

import "../../../../styles/components/content/content-detail/admin/AdminContentDetailHeader.css"

export default function AdminContentDetailHeader() {
  const navigate = useNavigate();

  return (
    <div className="content-detail-header">
      <button type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}