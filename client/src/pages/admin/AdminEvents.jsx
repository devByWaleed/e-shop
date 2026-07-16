import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiSearch, FiUser, FiArrowLeft } from 'react-icons/fi';
import { IoMdEye } from "react-icons/io";
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getEventsAction } from '../../redux/actions/adminAction';

const AdminEvents = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Grab sellers array from the Redux slice
    const { allEvents, dataLoading } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Filter sellers based on search
    const filteredEvents = allEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to safely truncate MongoDB ObjectIds for display UI
    const truncateId = (id) => id && id.length > 10 ? `${id.substring(0, 10)}...` : id;

    useEffect(() => {
        dispatch(getEventsAction());
    }, [dispatch]);

    return (
        <div className="relative p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Events: <span className="font-semibold text-gray-700">{allEvents.length}</span>
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mt-2 px-4 py-2.5 cursor-pointer bg-primary hover:bg-primary-dull text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Loading State */}
            {dataLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {!dataLoading && (
                <>
                    {/* Table - Desktop View */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Event ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Seller
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Sold out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Preview
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEvents.map((event) => {
                                    const c = event.category;
                                    let categorySlug = c.toLowerCase().replace(/\s+/g, "-");

                                    return (
                                        <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                            <td title={event._id} className="px-6 py-4 text-sm font-mono text-gray-600 truncate">
                                                {truncateId(event._id)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                                        src={event.images[0]}
                                                        alt="Product Pic"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800 truncate">{event.name}</span>
                                                </div>
                                            </td>
                                            <td title={event.shop.name} className="truncate px-6 py-4 text-sm text-gray-600">
                                                <img
                                                    className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                                    src={event.shop.avatar}
                                                    alt="Seller Pic"
                                                    onClick={() => navigate(`/shop/${event.shop._id}`)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.discountPrice}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.stock}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.soldOut}
                                            </td>
                                            <td className="px-6 py-4 text-sm uppercase text-gray-600">
                                                {event.status}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <IoMdEye size={20} className='hover:text-primary cursor-pointer'
                                                    onClick={() => navigate(`/events/${categorySlug}/${event._id}`)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Card View - Mobile & Tablet */}
                    <div className="md:hidden space-y-4">
                        {filteredEvents.map((event) => {
                            const c = event.category;
                            let categorySlug = c.toLowerCase().replace(/\s+/g, "-");

                            return (
                                <div key={event._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                onClick={() => navigate(`/events/${categorySlug}/${event._id}`)}
                                                className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                                src={event.images[0]}
                                                alt="Event Product Pic"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{event.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono">{truncateId(event._id)}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Seller</p>
                                            <p className="text-sm text-gray-700 truncate">{event.shop.name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">Created</p>
                                            <p className="text-sm text-gray-700">{formatDate(event.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <FiUser className="mx-auto text-gray-300 text-5xl mb-4" />
                            <p className="text-gray-500">No event found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminEvents;