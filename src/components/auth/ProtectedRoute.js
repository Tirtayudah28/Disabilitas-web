//fatir: UPDATE LOGIN/REGISTER

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { userData, tokenLoading } = useAuth();

  if (tokenLoading) {
    return "wait";
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  let hasAccess = true;
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      hasAccess = requiredRole.includes(userData.role);
    } else {
      hasAccess = userData.role === requiredRole;
    }
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
