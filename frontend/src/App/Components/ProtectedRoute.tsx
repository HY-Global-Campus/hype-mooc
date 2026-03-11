import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const ProtectedRoute = (): React.JSX.Element => {
  const location = useLocation();

  if (DEMO_MODE) {
    if (!sessionStorage.getItem('id')) {
      sessionStorage.setItem('id', 'demo-user');
      sessionStorage.setItem('displayName', 'Demo User');
    }
    return <Outlet />;
  }

  const token = sessionStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
