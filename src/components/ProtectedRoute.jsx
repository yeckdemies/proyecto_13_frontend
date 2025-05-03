import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword && location.pathname !== '/CambiarPassword') {
    return <Navigate to="/CambiarPassword" replace />;
  }

  return children;
};

export default ProtectedRoute;