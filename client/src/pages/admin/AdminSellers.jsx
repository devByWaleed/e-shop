import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiUser, FiArrowLeft } from 'react-icons/fi';
import { IoMdEye } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import {
    getSellersAction,
    deleteSellerAction,
    setSellerStatusAction,
    purgeSellerAction,
} from '../../redux/actions/adminAction';
import StatusBadge from '../../components/admin/StatusBadge';
import AccountActionModal from '../../components/admin/AccountActionModal';

const EMPTY_FORM = { reason: '', force: false };

// Old accounts have no status field, and that counts as active
const getStatus = (seller) => seller.status || 'active';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper to safely truncate MongoDB ObjectIds for display UI
const truncateId = (id) => id && id.length > 10 ? `${id.substring(0, 10)}...` : id;

// What each modal says and shows
const getModalConfig = (type, seller) => {
    switch (type) {
        case 'suspend':
            return {
                tone: 'warning',
                title: 'Suspend Shop',
                description: 'The seller is logged out, and the shop, its products and its events are hidden from customers until you reactivate it. Nothing is deleted.',
                confirmLabel: 'Suspend',
                showReason: true,
                checkboxes: [],
            };
        case 'reactivate':
            return {
                tone: 'success',
                title: 'Reactivate Shop',
                description: 'The seller can log in again and the shop, its products and its events become visible.',
                confirmLabel: 'Reactivate',
                showReason: false,
                checkboxes: [],
            };
        case 'close':
            return {
                tone: 'danger',
                title: 'Close Shop',
                description: 'The shop is hidden and the seller can no longer log in. You can reopen it for 30 days, then remove it permanently. Shops with unfinished orders cannot be closed.',
                confirmLabel: 'Close shop',
                showReason: true,
                checkboxes: [],
            };
        case 'reopen':
            return {
                tone: 'success',
                title: 'Reopen Shop',
                description: 'The shop, its products and its events become visible again and the seller can log in.',
                confirmLabel: 'Reopen',
                showReason: false,
                checkboxes: [],
            };
        case 'purge': {
            const notReady = seller?.purgeAfter && new Date(seller.purgeAfter) > new Date();
            return {
                tone: 'danger',
                title: 'Remove Shop Permanently',
                description:
                    'All products, events and coupons are deleted and the personal data is erased. This cannot be undone. Finished orders stay as history.' +
                    (notReady ? ` The waiting period ends on ${formatDate(seller.purgeAfter)}.` : ''),
                confirmLabel: 'Remove permanently',
                showReason: false,
                checkboxes: notReady
                    ? [
                        {
                            name: 'force',
                            label: 'Skip the waiting period',
                            hint: 'Only for tests or urgent cases. The shop can no longer be reopened.',
                        },
                    ]
                    : [],
            };
        }
        default:
            return null;
    }
};

const BTN = 'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer';
const BTN_WARN = `${BTN} border-amber-200 text-amber-700 hover:bg-amber-50`;
const BTN_OK = `${BTN} border-green-200 text-green-700 hover:bg-green-50`;
const BTN_DANGER = `${BTN} border-red-200 text-red-600 hover:bg-red-50`;

const Avatar = ({ seller, onClick }) =>
    seller.avatar ? (
        <img
            onClick={onClick}
            className='w-8 h-8 rounded-full object-cover'
            src={seller.avatar}
            alt="Profile Pic"
        />
    ) : (
        <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm'>
            {(seller.name || '?').charAt(0)}
        </div>
    );

const AdminSellers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Grab sellers array from the Redux slice
    const { allSellers, dataLoading } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modal, setModal] = useState({ type: null, seller: null });
    const [form, setForm] = useState(EMPTY_FORM);
    const [busy, setBusy] = useState(false);

    // Filter sellers based on search and status
    const filteredSellers = allSellers.filter((seller) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (seller.name || '').toLowerCase().includes(term) ||
            (seller.email || '').toLowerCase().includes(term);

        const matchesStatus = statusFilter === 'all' || getStatus(seller) === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openModal = (type, seller) => {
        setForm(EMPTY_FORM);
        setModal({ type, seller });
    };

    const closeModal = () => {
        if (!busy) setModal({ type: null, seller: null });
    };

    const handleFormChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Runs the chosen action. The modal closes only when the server accepts it.
    const handleConfirm = async () => {
        const { type, seller } = modal;
        if (!type || !seller) return;

        setBusy(true);

        let result;
        if (type === 'suspend') {
            result = await dispatch(setSellerStatusAction(seller._id, 'suspended', form.reason));
        } else if (type === 'reactivate' || type === 'reopen') {
            result = await dispatch(setSellerStatusAction(seller._id, 'active'));
        } else if (type === 'close') {
            result = await dispatch(deleteSellerAction(seller._id, form.reason));
        } else if (type === 'purge') {
            result = await dispatch(purgeSellerAction(seller._id, form.force));
        }

        setBusy(false);

        if (result?.success) {
            setModal({ type: null, seller: null });
        }
    };

    const renderActions = (seller) => {
        const status = getStatus(seller);

        if (status === 'deleted') {
            return <span className="text-xs text-gray-400">No actions</span>;
        }

        if (status === 'closed') {
            return (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal('reopen', seller)} className={BTN_OK}>
                        Reopen
                    </button>
                    <button onClick={() => openModal('purge', seller)} className={BTN_DANGER}>
                        Remove
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-2">
                {status === 'suspended' ? (
                    <button onClick={() => openModal('reactivate', seller)} className={BTN_OK}>
                        Reactivate
                    </button>
                ) : (
                    <button onClick={() => openModal('suspend', seller)} className={BTN_WARN}>
                        Suspend
                    </button>
                )}
                <button onClick={() => openModal('close', seller)} className={BTN_DANGER}>
                    Close
                </button>
            </div>
        );
    };

    const renderStatus = (seller) => (
        <div title={seller.statusReason || ''}>
            <StatusBadge status={getStatus(seller)} />
            {getStatus(seller) === 'closed' && seller.purgeAfter && (
                <p className="text-xs text-gray-400 mt-1">Removable on {formatDate(seller.purgeAfter)}</p>
            )}
        </div>
    );

    useEffect(() => {
        dispatch(getSellersAction());
    }, [dispatch]);

    const config = modal.type ? getModalConfig(modal.type, modal.seller) : null;

    return (
        <div className="relative p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">All Sellers</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Sellers: <span className="font-semibold text-gray-700">{allSellers.length}</span>
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mt-2 px-4 py-2.5 cursor-pointer bg-primary hover:bg-primary-dull text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Search + Status Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
                    >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="closed">Closed</option>
                        <option value="deleted">Deleted</option>
                    </select>

                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sellers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                        />
                    </div>
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
                                        Seller ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Joined At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Preview Shop
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSellers.map((seller) => (
                                    <tr
                                        key={seller._id}
                                        className={`hover:bg-gray-50 transition-colors ${getStatus(seller) === 'deleted' ? 'opacity-60' : ''}`}
                                    >
                                        <td title={seller._id} className="px-6 py-4 text-sm font-mono text-gray-600 truncate">
                                            {truncateId(seller._id)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar seller={seller} />
                                                <span className="text-sm font-medium text-gray-800">{seller.name}</span>
                                            </div>
                                        </td>
                                        <td title={seller.email} className="truncate px-6 py-4 text-sm text-gray-600">
                                            {getStatus(seller) === 'deleted' ? 'Removed' : seller.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(seller.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStatus(seller)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {getStatus(seller) !== 'deleted' && (
                                                <IoMdEye size={20} className='hover:text-primary cursor-pointer' onClick={() => navigate(`/shop/${seller._id}`)} />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {renderActions(seller)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card View - Mobile & Tablet */}
                    <div className="md:hidden space-y-4">
                        {filteredSellers.map((seller) => (
                            <div
                                key={seller._id}
                                className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${getStatus(seller) === 'deleted' ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            seller={seller}
                                            onClick={() => getStatus(seller) !== 'deleted' && navigate(`/shop/${seller._id}`)}
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{seller.name}</h3>
                                            <p className="text-xs text-gray-500 font-mono">{truncateId(seller._id)}</p>
                                        </div>
                                    </div>
                                    {renderStatus(seller)}
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm text-gray-700 truncate">
                                            {getStatus(seller) === 'deleted' ? 'Removed' : seller.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Joined</p>
                                        <p className="text-sm text-gray-700">{formatDate(seller.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="mt-4">{renderActions(seller)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredSellers.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <FiUser className="mx-auto text-gray-300 text-5xl mb-4" />
                            <p className="text-gray-500">No sellers found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}
                </>
            )}

            {/* Action Modal */}
            <AccountActionModal
                open={Boolean(config)}
                tone={config?.tone}
                title={config?.title}
                description={config?.description}
                account={modal.seller}
                form={form}
                onFormChange={handleFormChange}
                showReason={config?.showReason}
                checkboxes={config?.checkboxes}
                confirmLabel={config?.confirmLabel}
                busy={busy}
                onConfirm={handleConfirm}
                onCancel={closeModal}
            />
        </div>
    );
};

export default AdminSellers;