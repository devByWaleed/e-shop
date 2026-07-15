import { Outlet } from "react-router-dom"
import AdminProtectedRoute from "./AdminProtectedRoute"


const AdminProtectedLayout = ({ requireAuth = true, requiredRole = null }) => {
    return (
        <AdminProtectedRoute requireAuth={requireAuth} requiredRole={requiredRole}>
            <Outlet />
        </AdminProtectedRoute>
    )
}

export default AdminProtectedLayout