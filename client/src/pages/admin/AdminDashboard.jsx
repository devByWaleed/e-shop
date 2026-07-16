import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingBag, FiCalendar, FiUser } from 'react-icons/fi';
import { MdOutlineStore } from 'react-icons/md';
import { getUsersAction, getSellersAction, getProductsAction, getOrdersAction, getEventsAction } from '../../redux/actions/adminAction';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsers, allSellers, allProducts, allOrders, allEvents } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getUsersAction());
        dispatch(getSellersAction());
        dispatch(getProductsAction());
        dispatch(getOrdersAction());
        dispatch(getEventsAction());
    }, [dispatch]);

    const stats = [
        {
            id: 1,
            title: "All Sellers",
            count: allSellers?.length || 0,
            icon: <MdOutlineStore size={24} />,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            path: "/admin-profile/sellers"
        },
        {
            id: 2,
            title: "All Users",
            count: allUsers?.length || 0,
            icon: <FiUsers size={24} />,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            path: "/admin-profile/users"
        },
        {
            id: 3,
            title: "All Products",
            count: allProducts?.length || 0,
            icon: <FiPackage size={24} />,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            path: "/admin-profile/products"
        },
        {
            id: 4,
            title: "All Orders",
            count: allOrders?.length || 0,
            icon: <FiShoppingBag size={24} />,
            color: "bg-orange-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            path: "/admin-profile/orders"
        },
        {
            id: 5,
            title: "All Events",
            count: allEvents?.length || 0,
            icon: <FiCalendar size={24} />,
            color: "bg-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-600",
            path: "/admin-profile/events"
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        onClick={() => navigate(stat.path)}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.count}</p>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                                <span className={stat.textColor}>{stat.icon}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-xs text-primary font-medium group-hover:underline">
                                View {stat.title} →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;