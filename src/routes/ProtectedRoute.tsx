import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--auth-bg)">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-(--auth-border) border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--auth-text)">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? element : <Navigate to="/login" replace />;
}
