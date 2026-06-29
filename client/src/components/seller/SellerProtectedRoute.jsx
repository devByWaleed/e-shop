import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loading from '../Loading'

const SellerProtectedRoute = ({
    children,
    requiredRole = null,
    requireAuth = true

}) => {
    const { sellerAuthenticated, seller, sellerLoading } = useSelector((state) => state.seller)

    const location = useLocation();

    // Returns a loading placeholder
    if (sellerLoading) {
        return <Loading />;
    }

    // HYBRID MODE: If authentication not required, just render children
    if (!requireAuth) {
        return children;
    }

    // FULL PROTECTION: Redirect unauthenticated users
    if (!sellerAuthenticated) {
        // Save the attempted URL for redirect after login
        return <Navigate to="/seller-profile" state={{ from: location }} replace />;
    }

    // Role-based access control
    if (requiredRole && seller?.role !== requiredRole) {
        toast.error("Sellers only")
        return <Navigate to="/seller-profile" replace />;
    }

    return children;
};

export default SellerProtectedRoute;