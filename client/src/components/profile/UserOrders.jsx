import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingBag, FiArrowRight, FiEye, FiTruck } from 'react-icons/fi';
import { useEffect } from 'react';
import { getUserOrder } from '../../redux/actions/orderAction';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);

    const getStatusStyle = (status) => {
        if (!status) return 'bg-gray-50 text-gray-700 border-gray-200/60';
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            case 'canceled':
                return 'bg-rose-50 text-rose-700 border-rose-200/60';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200/60';
        }
    };

    useEffect(() => {
        if (user?._id) {
            dispatch(getUserOrder(user._id))
        }
    }, [user?._id, dispatch])

    // Total quantity helper safely parsing cart structures
    const getCartQuantity = (cart) => {
        if (!cart) return 0;
        if (Array.isArray(cart)) {
            return cart.reduce((total, item) => total + (item.quantity || 0), 0);
        }
        return cart.quantity || 0;
    };

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
            {/* Header Context Frame */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                        <FiShoppingBag size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">My Orders</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Manage and track your recent purchases</p>
                    </div>
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">
                    Total: {orders ? orders.length : 0}
                </span>
            </div>

            {/* A. MOBILE VIEW (< md viewports) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {orders && orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col gap-3 relative hover:border-gray-200 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusStyle(order.status)}`}>
                                {order.status}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                                US$ {order.totalPrice}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">Order ID</span>
                            <span className="text-xs font-mono text-gray-700 break-all bg-white px-2 py-1 rounded border border-gray-100">
                                {order._id}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100/60 mt-1">
                            <span className="text-xs text-gray-500">
                                Items: <strong className="text-gray-800">{getCartQuantity(order.cart)}</strong>
                            </span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/user/track-order/${order._id}`)}
                                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
                                >
                                    <FiTruck size={13} /> Track
                                </button>
                                <button
                                    onClick={() => navigate(`/user-order/${order._id}`)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline cursor-pointer"
                                >
                                    Details <FiArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* B. DESKTOP VIEW (>= md viewports) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Order ID</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-center">Items Qty</th>
                            <th className="py-4 px-4 text-right">Total</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {orders && orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50/40 transition-colors group">
                                <td className="py-4 px-6 font-mono text-xs text-gray-500 max-w-45 truncate">
                                    {order._id}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-md border ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center font-medium text-gray-600">
                                    {getCartQuantity(order.cart)}
                                </td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900">
                                    US$ {order.totalPrice}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            title="Track Order"
                                            onClick={() => navigate(`/track-order/${order._id}`)}
                                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                                        >
                                            <FiTruck size={18} />
                                        </button>
                                        <button
                                            title="View Details"
                                            onClick={() => navigate(`/user-order/${order._id}`)}
                                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer"
                                        >
                                            <FiEye size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserOrders;