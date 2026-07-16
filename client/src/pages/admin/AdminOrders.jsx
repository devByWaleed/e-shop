import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiSearch, FiUser, FiArrowLeft } from 'react-icons/fi';
import { IoMdEye } from "react-icons/io";
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getOrdersAction } from '../../redux/actions/adminAction';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allOrders, dataLoading } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const filteredOrders = allOrders.filter(
        order => order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const truncateId = (id) => id && id.length > 10 ? `${id.substring(0, 10)}...` : id;

    useEffect(() => {
        dispatch(getOrdersAction());
    }, [dispatch]);

    return (
        <div className="relative p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Orders: <span className="font-semibold text-gray-700">{allOrders.length}</span>
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mt-2 px-4 py-2.5 cursor-pointer bg-primary hover:bg-primary-dull text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>
                </div>

                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders by status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                    />
                </div>
            </div>

            {dataLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {!dataLoading && (
                <>
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Order Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => {
                                    const product = order.cart[0]?.product || {};

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td title={order._id} className="px-6 py-4 text-sm font-mono text-gray-600 truncate">
                                                {truncateId(order._id)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                                        src={product.images?.[0] || ''}
                                                        alt="Product Pic"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800 truncate">{product.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td title={order.user} className="truncate px-6 py-4 text-sm text-gray-600">
                                                {truncateId(order.user)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ${order.totalPrice}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.cart[0]?.quantity || 0}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'Processing refund' ? 'bg-yellow-100 text-yellow-700' :
                                                                order.status === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-4">
                        {filteredOrders.map((order) => {
                            const product = order.cart[0]?.product || {};

                            return (
                                <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                                src={product.images?.[0] || ''}
                                                alt="Product Pic"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{product.name || 'N/A'}</h3>
                                                <p className="text-xs text-gray-500 font-mono">{truncateId(order._id)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Total Price</p>
                                            <p className="text-sm text-gray-700">${order.totalPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Quantity</p>
                                            <p className="text-sm text-gray-700">{order.cart[0]?.quantity || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'Processing refund' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">Order Date</p>
                                            <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <FiUser className="mx-auto text-gray-300 text-5xl mb-4" />
                            <p className="text-gray-500">No order found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminOrders;