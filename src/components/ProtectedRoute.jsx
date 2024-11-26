import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}; 