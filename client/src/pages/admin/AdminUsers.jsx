import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { deleteUserAction, getUsersAction, setUserStatusAction } from '../../redux/actions/adminAction';
import StatusBadge from '../../components/admin/StatusBadge';
import AccountActionModal from '../../components/admin/AccountActionModal';

// What each modal says and shows
const MODAL_CONFIG = {
    suspend: {
        tone: 'warning',
        title: 'Suspend User',
        description: 'The user is logged out and cannot log in or place orders until you reactivate the account. Nothing is deleted.',
        confirmLabel: 'Suspend',
        showReason: true,
        checkboxes: [],
    },
    reactivate: {
        tone: 'success',
        title: 'Reactivate User',
        description: 'The user can log in and use the store again.',
        confirmLabel: 'Reactivate',
        showReason: false,
        checkboxes: [],
    },
    delete: {
        tone: 'danger',
        title: 'Delete User',
        description: 'Personal data is erased and the account can never be used again. Orders stay as history. Users with unfinished orders cannot be deleted.',
        confirmLabel: 'Delete user',
        showReason: true,
        checkboxes: [
            {
                name: 'removeReviews',
                label: "Also remove this user's reviews",
                hint: 'Leave it unchecked to keep the reviews as anonymous ratings. Check it for fake or abusive accounts.',
            },
        ],
    },
};

const EMPTY_FORM = { reason: '', removeReviews: false };

// Old accounts have no status field, and that counts as active
const getStatus = (user) => user.status || 'active';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper to safely truncate MongoDB ObjectIds for display UI
const truncateId = (id) => id && id.length > 10 ? `${id.substring(0, 10)}...` : id;

const BTN = 'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer';
const BTN_WARN = `${BTN} border-amber-200 text-amber-700 hover:bg-amber-50`;
const BTN_OK = `${BTN} border-green-200 text-green-700 hover:bg-green-50`;
const BTN_DANGER = `${BTN} border-red-200 text-red-600 hover:bg-red-50`;

const Avatar = ({ user }) =>
    user.avatar ? (
        <img
            className='w-8 h-8 rounded-full object-cover'
            src={user.avatar}
            alt="Profile Pic"
        />
    ) : (
        <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm'>
            {(user.name || '?').charAt(0)}
        </div>
    );

const AdminUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Grab users array from the Redux slice
    const { allUsers } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modal, setModal] = useState({ type: null, user: null });
    const [form, setForm] = useState(EMPTY_FORM);
    const [busy, setBusy] = useState(false);

    // Filter users based on search and status
    const filteredUsers = allUsers.filter((user) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (user.name || '').toLowerCase().includes(term) ||
            (user.email || '').toLowerCase().includes(term) ||
            (user.role || '').toLowerCase().includes(term);

        const matchesStatus = statusFilter === 'all' || getStatus(user) === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openModal = (type, user) => {
        setForm(EMPTY_FORM);
        setModal({ type, user });
    };

    const closeModal = () => {
        if (!busy) setModal({ type: null, user: null });
    };

    const handleFormChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Runs the chosen action. The modal closes only when the server accepts it.
    const handleConfirm = async () => {
        const { type, user } = modal;
        if (!type || !user) return;

        setBusy(true);

        let result;
        if (type === 'delete') {
            result = await dispatch(deleteUserAction(user._id, {
                removeReviews: form.removeReviews,
                reason: form.reason,
            }));
        } else {
            const nextStatus = type === 'suspend' ? 'suspended' : 'active';
            result = await dispatch(setUserStatusAction(user._id, nextStatus, form.reason));
        }

        setBusy(false);

        if (result?.success) {
            setModal({ type: null, user: null });
        }
    };

    const renderActions = (user) => {
        const status = getStatus(user);

        if (status === 'deleted') {
            return <span className="text-xs text-gray-400">No actions</span>;
        }

        return (
            <div className="flex items-center justify-center gap-2">
                {status === 'suspended' ? (
                    <button onClick={() => openModal('reactivate', user)} className={BTN_OK}>
                        Reactivate
                    </button>
                ) : (
                    <button onClick={() => openModal('suspend', user)} className={BTN_WARN}>
                        Suspend
                    </button>
                )}
                <button onClick={() => openModal('delete', user)} className={BTN_DANGER}>
                    Delete
                </button>
            </div>
        );
    };

    useEffect(() => {
        dispatch(getUsersAction());
    }, [dispatch]);

    const config = modal.type ? MODAL_CONFIG[modal.type] : null;

    return (
        <div className="relative p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Users: <span className="font-semibold text-gray-700">{allUsers.length}</span>
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
                        <option value="deleted">Deleted</option>
                    </select>

                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                User ID
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
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                className={`hover:bg-gray-50 transition-colors ${getStatus(user) === 'deleted' ? 'opacity-60' : ''}`}
                            >
                                <td title={user._id} className="px-6 py-4 text-sm font-mono text-gray-600 truncate">
                                    {truncateId(user._id)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar user={user} />
                                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                    </div>
                                </td>
                                <td title={user.email} className="truncate px-6 py-4 text-sm text-gray-600">
                                    {getStatus(user) === 'deleted' ? 'Removed' : user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4" title={user.statusReason || ''}>
                                    <StatusBadge status={getStatus(user)} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {renderActions(user)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card View - Mobile & Tablet */}
            <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${getStatus(user) === 'deleted' ? 'opacity-60' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar user={user} />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{truncateId(user._id)}</p>
                                </div>
                            </div>
                            <StatusBadge status={getStatus(user)} />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm text-gray-700 truncate">
                                    {getStatus(user) === 'deleted' ? 'Removed' : user.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm text-gray-700">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>

                        <div className="mt-4">{renderActions(user)}</div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FiUser className="mx-auto text-gray-300 text-5xl mb-4" />
                    <p className="text-gray-500">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                </div>
            )}

            {/* Action Modal */}
            <AccountActionModal
                open={Boolean(config)}
                tone={config?.tone}
                title={config?.title}
                description={config?.description}
                account={modal.user}
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

export default AdminUsers;