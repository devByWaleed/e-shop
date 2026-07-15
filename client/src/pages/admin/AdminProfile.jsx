import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Map routes to sidebar active IDs
    const routeToActiveMap = {
        '/admin-dashboard': 1,
        '/admin-orders': 2,
        '/admin-products': 3,
        '/admin-users': 4,
        '/admin-events': 5,
        '/admin-sellers': 6,
        '/admin-withdrawals': 7,
        '/admin-inbox': 8,
        '/admin-settings': 9,
    };

    // Get active ID based on current path
    const getActiveFromPath = () => {
        return routeToActiveMap[location.pathname] || 1;
    };

    const [active, setActive] = useState(getActiveFromPath());

    // Update active state when route changes
    useEffect(() => {
        const newActive = getActiveFromPath();
        setActive(newActive);
    }, [location.pathname]);

    // Handle sidebar navigation - navigates to the route
    const handleSidebarNavigation = (item) => {
        setActive(item.id);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <>
            {/* <AdminNavbar /> */}
            <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

                    {/* Left Sidebar Menu Component */}
                    <div className="w-full md:w-64 lg:w-72 shrink-0">
                        <AdminSidebar
                            active={active}
                            setActive={handleSidebarNavigation}
                        />
                    </div>

                    {/* Right Content Column - Renders child routes via Outlet */}
                    <div className="flex-1 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                        <Outlet />
                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminProfile;