import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProtectedRoute = ({
    children,
    requiredRole = null,
    requireAuth = true

}) => {
    const { isAuthenticated, loading: userLoading, user } = useSelector((state) => state.user);
    const location = useLocation();

    if (userLoading) {
        return <div>Loading...</div>;
    }

    // HYBRID MODE: If authentication not required, just render children
    if (!requireAuth) {
        return children;
    }

    // FULL PROTECTION: Redirect unauthenticated users
    if (!isAuthenticated) {
        // Save the attempted URL for redirect after login
        return <Navigate to="/user-login" state={{ from: location }} replace />;
    }

    // Role-based access control
    if (requiredRole && user?.role !== requiredRole) {
        toast.error("Sellers only")
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;