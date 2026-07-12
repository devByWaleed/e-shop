import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserOrder } from '../../redux/actions/orderAction';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

const Refunds = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { orders, orderLoading } = useSelector((state) => state.order);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch orders if they aren't loaded yet
    useEffect(() => {
        if (user?._id) {
            dispatch(getUserOrder(user._id));
        }
    }, [dispatch, user?._id]);

    // Filter orders currently requesting a refund
    const refundOrders = orders 
        ? orders.filter((order) => order.status && order.status.trim().toLowerCase() === "processing refund") 
        : [];

    // Main status update function interacting with your backend controller
    const handleAcceptRefund = async (orderId) => {
        try {
            setActionLoading(true);
            
            // Fires an update payload hitting your dynamic ID parameter endpoint
            const { data } = await axios.put(
                `/api/order/order-refund/${orderId}`,
                { status: "Refund Success" },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success("Refund approved successfully!");
                // Re-fetch orders from database to update store data arrays
                if (user?._id) {
                    dispatch(getUserOrder(user._id));
                }
            } else {
                toast.error(data.message || "Failed to update refund status");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
        } finally {
            setActionLoading(false);
        }
    };

    if (orderLoading) {
        return <div className="text-center py-20 text-gray-500 text-lg">Loading refund requests...</div>;
    }

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
            {/* Title Section */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                        <FiRefreshCw size={22} className={actionLoading ? "animate-spin" : ""} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Incoming Refund Requests</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Approve and settle customer return actions</p>
                    </div>
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">
                    Pending: {refundOrders.length}
                </span>
            </div>

            {refundOrders.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-gray-500 font-medium">No pending refund actions found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-4">Current Status</th>
                                <th className="py-4 px-4 text-right">Total Price</th>
                                <th className="py-4 px-6 text-center">Action Decision</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {refundOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-500 max-w-45 truncate">
                                        {order._id}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-md border bg-amber-50 text-amber-700 border-amber-200/60">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right font-bold text-gray-900">
                                        ${order.totalPrice}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleAcceptRefund(order._id)}
                                            disabled={actionLoading}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <FiCheckCircle size={14} />
                                            Accept Refund
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Refunds;