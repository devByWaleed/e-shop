import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMoneyCollect, AiOutlineShopping, AiOutlineProduct, AiOutlineCalendar } from 'react-icons/ai';
import { FiPackage, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';
import { getShopProducts } from '../../redux/actions/productAction';
import { getShopEvents } from '../../redux/actions/eventAction';
import { getShopOrder } from '../../redux/actions/orderAction';

const SellerProfileContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Assuming you have seller data in redux
    const { seller } = useSelector((state) => state.seller);
    const { shopProducts } = useSelector((state) => state.product);
    const { shopEvents } = useSelector((state) => state.event);
    const { shopOrders } = useSelector((state) => state.order);

    // You might want to fetch seller-specific data here
    useEffect(() => {
        // Fetch seller's products, orders, events etc.
        dispatch(getShopProducts(seller?._id));
        dispatch(getShopEvents(seller?._id));
        dispatch(getShopOrder(seller?._id));
    }, [dispatch, seller]);

    // Calculate total revenue from orders
    const totalRevenue = shopOrders?.reduce((total, order) => {
        // Only count completed/delivered orders
        if (order.status === 'delivered' || order.status === 'completed') {
            return total + (order.totalPrice || 0);
        }
        return total;
    }, 0) || 0;

    // Calculate service charge (10%)
    const serviceCharge = totalRevenue * 0.1;
    const netRevenue = totalRevenue - serviceCharge;

    const stats = [
        {
            id: 1,
            title: "Total Products",
            count: shopProducts?.length || 0,
            icon: <FiPackage size={24} />,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            id: 2,
            title: "Total Orders",
            count: shopOrders?.length || 0,
            icon: <FiShoppingBag size={24} />,
            color: "bg-orange-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
        {
            id: 3,
            title: "Total Events",
            count: shopEvents?.length || 0,
            icon: <FiCalendar size={24} />,
            color: "bg-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-600",
        },
    ];

    return (
        <section className='w-full p-8'>
            <div className="mb-6">
                <h3 className='text-2xl font-bold text-gray-800'>Overview</h3>
                <p className='text-sm text-gray-500 mt-1'>Welcome back, {seller?.name || 'Seller'}! Here's your store performance.</p>
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
                    </div>
                ))}
            </div>

            {/* Optional: Additional detailed stats section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* Quick Stats Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Products</span>
                            <span className="text-sm font-semibold text-purple-600">{shopProducts?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Orders</span>
                            <span className="text-sm font-semibold text-orange-600">{shopOrders?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Events</span>
                            <span className="text-sm font-semibold text-red-600">{shopEvents?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerProfileContent;