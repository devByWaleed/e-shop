import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loading from '../Loading';

const AdminProtectedRoute = ({
    children,
    requiredRole = null,
    requireAuth = true
}) => {
    // Add fallback to prevent destructuring error
    const adminState = useSelector((state) => state.admin) || {};
    const { adminAuthenticated = false, adminLoading = false, admin = null, adminError = null } = adminState;
    const location = useLocation();

    // Returns a loading placeholder
    if (adminLoading) {
        return <Loading />;
    }

    // HYBRID MODE: If authentication not required, just render children
    if (!requireAuth) {
        return children;
    }

    // FULL PROTECTION: Redirect unauthenticated users
    if (!adminAuthenticated) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    // Role-based access control
    if (requiredRole && admin?.role !== requiredRole) {
        toast.error("Access denied. Admin privileges required.");
        return <Navigate to="/admin-profile" replace />;
    }

    return children;
};

export default AdminProtectedRoute;