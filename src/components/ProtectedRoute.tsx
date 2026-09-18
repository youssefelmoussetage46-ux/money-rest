import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return fallback ?? (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-700"></div>
          <p className="mt-2 text-sm text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  // If demo mode is active, allow access to protected routes
  const demoMode = localStorage.getItem('demo-mode') === 'true';
  if (demoMode) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;