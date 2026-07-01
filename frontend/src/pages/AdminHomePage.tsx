import { useNavigate } from "react-router-dom";

export default function AdminHomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Login Successful</p>
            <button onClick={() => navigate("/content")}>
            Manage Content
            </button>
        </div>
    );
}