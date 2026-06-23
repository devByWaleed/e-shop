import React from 'react';
import { FiShoppingBag, FiArrowRight, FiEye } from 'react-icons/fi';

const UserOrders = () => {
    // Mock order data based exactly on your schema reference
    const orders = [
        {
            id: "7463hvbfbhfbrtr28820f83hfb3",
            status: "Processing",
            itemsQty: 1,
            total: 120
        },
        {
            id: "9284jdnfkrjfnvt64920k48fnd2",
            status: "Delivered",
            itemsQty: 3,
            total: 845
        },
        {
            id: "1048dhfuryfncpe84920m39dhb7",
            status: "Canceled",
            itemsQty: 2,
            total: 310
        }
    ];

    // Helper color scheme mapper for modern badge statuses
    const getStatusStyle = (status) => {
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
                    Total: {orders.length}
                </span>
            </div>

            {/* --- RESPONSIVE VIEWS COMPONENT --- */}

            {/* A. MOBILE VIEW: Layout turns into clean modern stacked cards (< md viewports) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col gap-3 relative hover:border-gray-200 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusStyle(order.status)}`}>
                                {order.status}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                                US$ {order.total}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
                            <span className="text-xs font-mono text-gray-700 break-all bg-white px-2 py-1 rounded border border-gray-100">
                                {order.id}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100/60 mt-1">
                            <span className="text-xs text-gray-500">
                                Items Quantity: <strong className="text-gray-800">{order.itemsQty}</strong>
                            </span>
                            <button className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline cursor-pointer">
                                Details <FiArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* B. DESKTOP VIEW: Displays standard elegant grid structured layout table (>= md viewports) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Order ID</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-center">Items Qty</th>
                            <th className="py-4 px-4 text-right">Total</th>
                            <th className="py-4 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/40 transition-colors group">
                                <td className="py-4 px-6 font-mono text-xs text-gray-500 max-w-45 truncate">
                                    {order.id}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-md border ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center font-medium text-gray-600">
                                    {order.itemsQty}
                                </td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900">
                                    US$ {order.total}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer">
                                        <FiEye size={18} />
                                    </button>
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