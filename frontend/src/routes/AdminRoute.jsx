import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { AuthLoading } from './ProtectedRoute.jsx';

function AdminRoute() {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}

export default AdminRoute;