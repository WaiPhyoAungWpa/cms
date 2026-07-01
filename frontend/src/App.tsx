import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import CreateContentPage from "./pages/CreateContentPage";
import ManageContentPage from "./pages/ManageContentPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
                    element={
                    <ProtectedRoute>
                      <AdminHomePage />
                    </ProtectedRoute>}
                />

                <Route 
                    path="/content/create" 
                    element={
                    <ProtectedRoute>
                      <CreateContentPage />
                    </ProtectedRoute>}
                />

                <Route
                    path="/content"
                    element={
                        <ProtectedRoute>
                        <ManageContentPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}