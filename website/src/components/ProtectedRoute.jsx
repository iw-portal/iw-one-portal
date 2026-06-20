// components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/one-portal/login" replace />;
  }

  console.log("User Role:", user.role);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/one-portal/login" replace />;
  }

  return children;
}
