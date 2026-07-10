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
import ContentDetailPage from "./pages/ContentDetailPage";
import EditContentPage from "./pages/EditContentPage";
import PublicHomePage from "./pages/PublicHomePage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
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

                <Route
                    path="/content/:id"
                    element={
                        <ProtectedRoute>
                            <ContentDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/content/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditContentPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<PublicHomePage />} />
            </Routes>
        </BrowserRouter>
    );
}