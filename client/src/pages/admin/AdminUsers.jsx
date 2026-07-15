import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiSearch, FiUser, FiArrowLeft } from 'react-icons/fi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { deleteUser, getUsers } from '../../redux/actions/adminAction';
import { useEffect } from 'react';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Grab users array from the Redux slice
    const { allUsers } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Filter users based on search
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle delete click (opens local confirmation modal)
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Confirm delete (dispatches to slicer)
    const handleConfirmDelete = () => {
        if (selectedUser) {
            dispatch(deleteUser(selectedUser._id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        }
    };

    // Cancel delete
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    // Helper helper to safely truncate MongoDB ObjectIds for display UI
    const truncateId = (id) => id && id.length > 10 ? `${id.substring(0, 10)}...` : id;

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

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

                {/* Search Bar */}
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
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Delete User
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td title={user._id} className="px-6 py-4 text-sm font-mono text-gray-600 truncate">
                                    {truncateId(user._id)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'
                                            src={user.avatar}
                                            alt="Profile Pic"
                                        />
                                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                    </div>
                                </td>
                                <td title={user.email} className="truncate px-6 py-4 text-sm text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.joinedAt}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                        title="Delete User"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card View - Mobile & Tablet */}
            <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{truncateId(user._id)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(user)}
                                className="text-red-400 hover:text-red-600 transition-colors p-2"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm text-gray-700 truncate">{user.email}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm text-gray-700">{user.joinedAt}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FiUser className="mx-auto text-gray-300 text-5xl mb-4" />
                    <p className="text-gray-500">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancelDelete}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <MdOutlineDeleteOutline className="text-red-500 text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Delete User</h3>
                                <p className="text-sm text-gray-500">Are you sure you want to delete this user?</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{selectedUser.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{selectedUser._id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-gray-700 truncate">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Role</p>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;