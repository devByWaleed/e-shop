import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import {
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiCalendar,
    FiLogOut
} from 'react-icons/fi';
import { MdOutlineStore } from 'react-icons/md'; // Replaced non-existent FiShop with MdOutlineStore
import { useDispatch } from 'react-redux';
import { adminLogoutAction } from '../../redux/actions/adminAction';

const AdminSidebar = ({ active, setActive }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Admin menu items with appropriate, verified icons
    const menuItems = [
        { id: 1, label: "Dashboard", icon: <RxDashboard size={20} />, path: "/admin-dashboard" },
        { id: 2, label: "All Orders", icon: <FiShoppingBag size={20} />, path: "/admin-orders" },
        { id: 3, label: "All Products", icon: <FiPackage size={20} />, path: "/admin-products" },
        { id: 4, label: "All Users", icon: <FiUsers size={20} />, path: "/admin-users" },
        { id: 5, label: "All Events", icon: <FiCalendar size={20} />, path: "/admin-events" },
        { id: 6, label: "All Sellers", icon: <MdOutlineStore size={20} />, path: "/admin-sellers" },
        { id: 7, label: "Logout", icon: <FiLogOut size={20} /> },
    ];

    const handleNavigation = (item) => {
        if (item.label === "Logout") {
            dispatch(adminLogoutAction());
            return;
        }
        setActive(item.id);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <div className="w-full bg-white shadow-sm rounded-xl p-3 md:p-4 md:pt-8 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar border border-gray-100">
            {menuItems.map((item) => {
                const isSelected = active === item.id;
                return (
                    <button
                        key={item.id}
                        title={item.label}
                        onClick={() => handleNavigation(item)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0
                            ${isSelected
                                ? "bg-primary/10 text-primary md:bg-primary/10"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                            }`}
                    >
                        <span className={isSelected ? "text-primary" : "text-gray-400"}>
                            {item.icon}
                        </span>
                        <span className="hidden md:inline">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default AdminSidebar;