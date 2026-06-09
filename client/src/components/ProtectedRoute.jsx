import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({
    children,
    requiredRole = null,  // 'user', 'seller', or null for any authenticated
    requireAuth = true     // If false, allows guests (hybrid mode) 

}) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.user);
    const location = useLocation();

    if (loading) {
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
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;