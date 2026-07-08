import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/pages/LoginPage.css";

import { getImageUrl } from "../utils/image";

const backgroundImages = [
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

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        try {
            const data = await login(username, password);

            localStorage.setItem("token", data.token);

            navigate("/admin");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unable to connect to server.");
            }
        }
    };

    return (
        <main className="login-page">
            <div className="login-background">
                {backgroundImages.map((image, index) => (
                    <div
                        key={image}
                        className="login-background-image"
                        style={{
                            backgroundImage: `url(${getImageUrl(image)})`,
                        }}
                    />
                ))}
            </div>

            <div className="login-overlay" />

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">CMS</div>

                    <h1>Admin Login</h1>
                    <p>Sign in to manage your content</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button className="login-button" type="submit">
                        Login
                    </button>
                </form>

                <p className="login-footer">
                    Content Management System
                </p>
            </div>
        </main>
    );
}