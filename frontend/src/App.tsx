import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage />}
                />

                <Route
                    path="/admin"
                    element={<AdminHomePage />}
                />
            </Routes>
        </BrowserRouter>
    );
}