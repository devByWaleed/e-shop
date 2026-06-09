import { Outlet } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"


const ProtectedLayout = ({ requireAuth = true, requiredRole = null }) => {
    return (
        <ProtectedRoute requireAuth={requireAuth} requiredRole={requiredRole}>
            <Outlet />
        </ProtectedRoute>
    )
}

export default ProtectedLayout