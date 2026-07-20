import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiSearch, FiPlusCircle } from 'react-icons/fi';

const AdminInbox = () => {
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.admin);

    const [activeTab, setActiveTab] = useState('users');
    const [userConversations, setUserConversations] = useState([]);
    const [sellerConversations, setSellerConversations] = useState([]);
    const [userMemberInfo, setUserMemberInfo] = useState({});
    const [sellerMemberInfo, setSellerMemberInfo] = useState({});
    const [activeUser, setActiveUser] = useState(null);
    const [activeSeller, setActiveSeller] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchNewUser, setSearchNewUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Get admin ID - try both id and _id
    const adminId = admin?.id || admin?._id;

    // Get all conversations for admin
    const getAdminConversations = async () => {
        if (!adminId) {
            console.error('No admin ID found');
            return;
        }

        try {
            setLoading(true);


            const { data } = await axios.get(`/api/conversation/get-admin-conversations/${adminId}`);


            if (data.success) {
                const allConversations = data.conversations || [];


                // Debug: Log each conversation's members and roles
                allConversations.forEach(conv => {
                    console.log('Conversation:', {
                        id: conv._id,
                        members: conv.members,
                        memberRoles: conv.memberRoles,
                        groupTitle: conv.groupTitle
                    });
                });

                // Filter conversations where the other member is a user
                const userConvs = allConversations.filter(conv => {
                    const otherMemberId = conv.members.find(m => m !== adminId);
                    // Check if the other member's role is 'user' from memberRoles Map
                    const role = conv.memberRoles?.get?.(otherMemberId) || conv.memberRoles?.[otherMemberId];

                    return role === 'user';
                });

                setUserConversations(userConvs);

                // Filter conversations where the other member is a seller
                const sellerConvs = allConversations.filter(conv => {
                    const otherMemberId = conv.members.find(m => m !== adminId);
                    const role = conv.memberRoles?.get?.(otherMemberId) || conv.memberRoles?.[otherMemberId];

                    return role === 'seller';
                });

                setSellerConversations(sellerConvs);
            } else {
                toast.error(data.message || 'Failed to load conversations');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error(error?.message || "Failed to load conversations!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminId) {
            getAdminConversations();
        }
    }, [adminId]);

    // Fetch user info for user conversations
    useEffect(() => {
        const fetchUserMemberInfo = async () => {
            const entries = await Promise.all(
                userConversations.map(async (conv) => {
                    const userId = conv.members.find((m) => m !== adminId);
                    if (!userId) return [conv._id, null];
                    try {
                        const { data } = await axios.get(`/api/user/user-info/${userId}`);
                        if (data.success) {
                            return [conv._id, {
                                name: data.user?.name || 'User',
                                avatar: data.user?.avatar?.url || data.user?.avatar,
                                id: userId,
                                role: 'User'
                            }];
                        }
                        return [conv._id, null];
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error);
                        return [conv._id, null];
                    }
                })
            );
            setUserMemberInfo(Object.fromEntries(entries));
        };

        if (userConversations.length > 0 && adminId) {
            fetchUserMemberInfo();
        }
    }, [userConversations, adminId]);

    // Fetch seller info for seller conversations
    useEffect(() => {
        const fetchSellerMemberInfo = async () => {
            const entries = await Promise.all(
                sellerConversations.map(async (conv) => {
                    const sellerId = conv.members.find((m) => m !== adminId);
                    if (!sellerId) return [conv._id, null];
                    try {
                        const { data } = await axios.get(`/api/seller/get-seller/${sellerId}`);
                        if (data.success) {
                            return [conv._id, {
                                name: data.seller?.name || 'Seller',
                                avatar: data.seller?.avatar?.url || data.seller?.avatar,
                                id: sellerId,
                                role: 'Seller'
                            }];
                        }
                        return [conv._id, null];
                    } catch (error) {
                        console.error(`Error fetching seller ${sellerId}:`, error);
                        return [conv._id, null];
                    }
                })
            );
            setSellerMemberInfo(Object.fromEntries(entries));
        };

        if (sellerConversations.length > 0 && adminId) {
            fetchSellerMemberInfo();
        }
    }, [sellerConversations, adminId]);

    // Search for users or sellers to start a new chat
    const handleSearchUsers = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchingUsers(true);
        try {
            let endpoint = activeTab === 'users'
                ? `/api/user/search-users?q=${query}`
                : `/api/seller/search-sellers?q=${query}`;

            const { data } = await axios.get(endpoint);
            if (data.success) {
                // Filter out users/sellers that already have conversations
                const existingConversations = activeTab === 'users' ? userConversations : sellerConversations;
                const existingIds = new Set();
                existingConversations.forEach(conv => {
                    const otherId = conv.members.find(m => m !== adminId);
                    if (otherId) existingIds.add(otherId);
                });

                const filtered = data.users || data.sellers || [];
                setSearchResults(filtered.filter(item => !existingIds.has(item._id)));
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearchingUsers(false);
        }
    };

    // Create a new conversation
    const createNewConversation = async (receiverId, receiverRole) => {
        if (!adminId) {
            toast.error('Admin ID not found');
            return;
        }

        try {
            const payload = {
                senderID: adminId,
                senderRole: 'admin',
                receiverID: receiverId,
                receiverRole: receiverRole
            };



            const { data } = await axios.post('/api/conversation/create-new-conversation', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });



            if (data.success) {
                toast.success('New conversation created!');
                setShowNewChatModal(false);
                setSearchResults([]);
                setSearchNewUser('');

                // Refresh conversations
                await getAdminConversations();

                // Navigate to the new conversation
                navigate(`/admin-conversation/${data.conversation._id}`);
            } else {
                toast.error(data.message || 'Failed to create conversation');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Failed to create conversation');
        }
    };

    const handleSelectChat = (id) => {
        navigate(`/admin-conversation/${id}`);
    };

    const getCurrentConversations = () => {
        return activeTab === 'users' ? userConversations : sellerConversations;
    };

    const getCurrentMemberInfo = () => {
        return activeTab === 'users' ? userMemberInfo : sellerMemberInfo;
    };

    const getCurrentActive = () => {
        return activeTab === 'users' ? activeUser : activeSeller;
    };

    const setCurrentActive = (index) => {
        if (activeTab === 'users') {
            setActiveUser(index);
        } else {
            setActiveSeller(index);
        }
    };

    const conversations = getCurrentConversations();
    const memberInfo = getCurrentMemberInfo();
    const currentActive = getCurrentActive();
    const setActive = setCurrentActive;

    // Filter conversations based on search
    const filteredConversations = conversations.filter((item) => {
        const info = memberInfo[item._id];
        const displayName = info?.name || item.groupTitle || (activeTab === 'users' ? 'User' : 'Seller');
        return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (showNewChatModal) {
                handleSearchUsers(searchNewUser);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchNewUser, showNewChatModal]);

    return (
        <>
            <section className='w-full bg-white rounded-lg shadow-md'>
                {/* Header */}
                <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>Admin Inbox</h1>
                        <p className='text-sm text-gray-500 mt-1'>Manage conversations with users and sellers</p>
                    </div>
                    <button
                        onClick={() => setShowNewChatModal(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                    >
                        <FiPlusCircle size={18} />
                        <span>New Chat</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className='flex border-b border-gray-200 px-6'>
                    <button
                        onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 cursor-pointer
                            ${activeTab === 'users'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <FiUsers size={18} />
                        <span>Users</span>
                        <span className='ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full'>
                            {userConversations.length}
                        </span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('sellers'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 cursor-pointer
                            ${activeTab === 'sellers'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <FiUserPlus size={18} />
                        <span>Sellers</span>
                        <span className='ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full'>
                            {sellerConversations.length}
                        </span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className='px-6 py-3 border-b border-gray-100'>
                    <div className='relative'>
                        <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                        <input
                            type='text'
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                    </div>
                )}

                {/* Conversation List */}
                {!loading && (
                    <div className='max-h-[calc(85vh-200px)] overflow-y-auto'>
                        {filteredConversations.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-500'>
                                    {searchTerm
                                        ? `No ${activeTab} found matching your search`
                                        : `No ${activeTab} conversations yet`}
                                </p>
                                <p className='text-sm text-gray-400 mt-1'>
                                    {searchTerm ? 'Try adjusting your search' : 'Click "New Chat" to start a conversation'}
                                </p>
                            </div>
                        ) : (
                            filteredConversations.map((item, index) => {
                                const info = memberInfo[item._id];
                                const displayName = info?.name || item.groupTitle || (activeTab === 'users' ? 'User' : 'Seller');

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => { setActive(index); handleSelectChat(item._id); }}
                                        className={`w-full flex p-4 px-6 border-b hover:bg-gray-50 transition-colors cursor-pointer
                                            ${currentActive === index ? "bg-gray-50 border-l-4 border-primary" : "bg-transparent"}`}
                                    >
                                        <div className="relative shrink-0">
                                            {info?.avatar ? (
                                                <img
                                                    src={info.avatar}
                                                    alt={displayName}
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm">
                                                    {displayName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className='w-3.5 h-3.5 bg-green-400 rounded-full absolute top-0.5 right-0.5 border-2 border-white'></div>
                                        </div>

                                        <div className='pl-4 flex-1 min-w-0 flex flex-col justify-center'>
                                            <div className='flex items-center justify-between'>
                                                <h1 className='font-semibold text-gray-800 text-[15px] truncate'>
                                                    {displayName}
                                                </h1>
                                                <span className='text-xs text-gray-400'>
                                                    {info?.role || ''}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                                {item.lastMessage ? item.lastMessage : "No messages yet"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </section>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-bold text-gray-800'>
                                Start New Chat with {activeTab === 'users' ? 'User' : 'Seller'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowNewChatModal(false);
                                    setSearchResults([]);
                                    setSearchNewUser('');
                                }}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                ✕
                            </button>
                        </div>

                        <div className='relative'>
                            <input
                                type='text'
                                placeholder={`Search ${activeTab} by name...`}
                                value={searchNewUser}
                                onChange={(e) => setSearchNewUser(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                            {searchingUsers && (
                                <div className='absolute right-3 top-2.5'>
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
                                </div>
                            )}
                        </div>

                        <div className='mt-4 max-h-60 overflow-y-auto'>
                            {searchResults.length === 0 && searchNewUser.length >= 2 && !searchingUsers && (
                                <p className='text-gray-500 text-center py-4'>
                                    No {activeTab} found
                                </p>
                            )}
                            {searchResults.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => createNewConversation(
                                        item._id,
                                        activeTab === 'users' ? 'user' : 'seller'
                                    )}
                                    className='flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
                                >
                                    {item.avatar?.url || item.avatar ? (
                                        <img
                                            src={item.avatar.url || item.avatar}
                                            alt={item.name}
                                            className='w-10 h-10 rounded-full object-cover'
                                        />
                                    ) : (
                                        <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold'>
                                            {item.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <div>
                                        <p className='font-medium text-gray-800'>{item.name}</p>
                                        <p className='text-sm text-gray-500'>{item.email || ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {searchNewUser.length < 2 && (
                            <p className='text-sm text-gray-400 mt-2 text-center'>
                                Type at least 2 characters to search
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminInbox;