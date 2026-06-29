import { Outlet } from "react-router-dom"
import SellerProtectedRoute from "./SellerProtectedRoute"


const SellerProtectedLayout = ({ requireAuth = true, requiredRole = null }) => {
    return (
        <SellerProtectedRoute requireAuth={requireAuth} requiredRole={requiredRole}>
            <Outlet />
        </SellerProtectedRoute>
    )
}

export default SellerProtectedLayout