import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import styles from "./App.module.css";

function AuthGate({ children }) {
  const { ready } = useAuth();
  if (!ready) {
    return (
      <div className={styles.loading}>
        <p>Loading…</p>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthGate>
  );
}
