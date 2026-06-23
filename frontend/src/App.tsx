import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import CreateContentPage from "./pages/CreateContentPage";

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

                <Route 
                    path="/content/create" 
                    element={<CreateContentPage />} 
                />
            </Routes>
        </BrowserRouter>
    );
}