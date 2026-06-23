import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        try {
            const response = await fetch(
                "http://localhost:5160/api/Auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
            console.log(response);
            if (!response.ok) {
                setError("Invalid username or password.");
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);

            navigate("/admin");
        }
        catch {
            setError("Unable to connect to server.");
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <br />
                    <input
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
            </form>

            {error && (
                <p>{error}</p>
            )}
        </div>
    );
}