import AuthPage from "./pages/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;
