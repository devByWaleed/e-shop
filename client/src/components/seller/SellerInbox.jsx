import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdManageAccounts } from 'react-icons/md';
import { FiPlusCircle, FiSearch } from 'react-icons/fi';

const SellerInbox = () => {
    const navigate = useNavigate();
    const { seller } = useSelector((state) => state.seller);

    const [conversations, setConversations] = useState([]);
    const [memberInfo, setMemberInfo] = useState({});
    const [active, setActive] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchNewUser, setSearchNewUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const sellerId = seller?._id;

    const getSellerConversations = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/conversation/get-seller-conversation/${sellerId}`);
            if (data.success) {
                setConversations(data.conversations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.message || "Failed to load inbox!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sellerId) {
            getSellerConversations();
        }
    }, [sellerId]);

    useEffect(() => {
        const fetchAllMemberInfo = async () => {
            const entries = await Promise.all(
                conversations.map(async (conv) => {
                    const otherId = conv.members.find((m) => m !== sellerId);
                    if (!otherId) return [conv._id, null];

                    try {
                        // Get the role of the other member from the conversation's memberRoles
                        const otherRole = conv.memberRoles?.get?.(otherId) || conv.memberRoles?.[otherId];

                        let info = null;
                        let endpoint = '';

                        // Determine which endpoint to call based on the role
                        if (otherRole === 'admin') {
                            // For admin, we don't have a get-admin endpoint yet
                            // Use a default name or create an admin info endpoint
                            return [conv._id, {
                                name: "Admin",
                                avatar: null,
                                role: 'admin'
                            }];
                        } else if (otherRole === 'user') {
                            endpoint = `/api/user/user-info/${otherId}`;
                            try {
                                const { data } = await axios.get(endpoint);
                                if (data.success && data.user) {
                                    info = data.user;
                                }
                            } catch (e) {
                                console.log('User fetch failed:', e);
                            }
                        } else if (otherRole === 'seller') {
                            endpoint = `/api/seller/get-seller/${otherId}`;
                            try {
                                const { data } = await axios.get(endpoint);
                                if (data.success && data.seller) {
                                    info = data.seller;
                                }
                            } catch (e) {
                                console.log('Seller fetch failed:', e);
                            }
                        } else {
                            // If no role is found, try both endpoints as fallback
                            try {
                                const { data } = await axios.get(`/api/user/user-info/${otherId}`);
                                if (data.success && data.user) {
                                    info = data.user;
                                }
                            } catch (e) {
                                try {
                                    const { data } = await axios.get(`/api/seller/get-seller/${otherId}`);
                                    if (data.success && data.seller) {
                                        info = data.seller;
                                    }
                                } catch (e2) {
                                    console.log('Both endpoints failed');
                                }
                            }
                        }

                        // If we got info from API, use it
                        if (info) {
                            return [conv._id, {
                                name: info?.name || info?.shopName || "User",
                                avatar: info?.avatar?.url || info?.avatar,
                                role: otherRole || 'unknown'
                            }];
                        }

                        // If we couldn't fetch info, use fallback.
                        // A failed lookup on both User and Seller collections (with no role
                        // tagged on the conversation) means this participant isn't in either
                        // collection at all, which in this app only happens for admin.
                        return [conv._id, {
                            name: otherRole === 'admin' ? 'Admin' : (otherRole === 'seller' ? 'Seller' : (otherRole === 'user' ? 'User' : 'Admin')),
                            avatar: null,
                            role: otherRole || 'admin'
                        }];
                    } catch (error) {
                        console.error(`Error fetching info for ${otherId}:`, error);
                        return [conv._id, {
                            name: "User",
                            avatar: null,
                            role: 'unknown'
                        }];
                    }
                })
            );
            setMemberInfo(Object.fromEntries(entries));
        };

        if (conversations.length > 0 && sellerId) {
            fetchAllMemberInfo();
        }
    }, [conversations, sellerId]);

    // Search for users to start a new chat
    const handleSearchUsers = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchingUsers(true);
        try {
            const { data } = await axios.get(`/api/user/search-users?q=${query}`);
            if (data.success) {
                // Filter out users that already have conversations
                const existingIds = new Set();
                conversations.forEach(conv => {
                    const otherId = conv.members.find(m => m !== sellerId);
                    if (otherId) existingIds.add(otherId);
                });

                const filtered = data.users || [];
                setSearchResults(filtered.filter(item => !existingIds.has(item._id)));
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setSearchingUsers(false);
        }
    };

    // Create a new conversation
    const createNewConversation = async (receiverId, receiverRole) => {
        try {
            const payload = {
                senderID: sellerId,
                senderRole: 'seller',
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
                await getSellerConversations();

                // Navigate to the new conversation
                navigate(`/conversation/${data.conversation._id}`);
            } else {
                toast.error(data.message || 'Failed to create conversation');
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Failed to create conversation');
        }
    };

    const handleSelectChat = (id) => {
        navigate(`/conversation/${id}`);
    };

    // Filter conversations based on search
    const filteredConversations = conversations.filter((item) => {
        const info = memberInfo[item._id];
        const displayName = info?.name || item.groupTitle || "User";
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
            <section className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded shadow-md'>
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <h1 className='text-[30px] font-semibold text-gray-700'>All messages</h1>
                    <button
                        onClick={() => setShowNewChatModal(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        <FiPlusCircle size={18} />
                        <span>New Chat</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className='px-6 py-3 border-b border-gray-100'>
                    <div className='relative'>
                        <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                        <input
                            type='text'
                            placeholder='Search conversations...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        />
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">
                        {searchTerm ? 'No conversations matching your search' : 'No active conversations found.'}
                    </p>
                ) : (
                    filteredConversations.map((item, index) => {
                        const info = memberInfo[item._id];
                        const displayName = info?.name || item.groupTitle || "User";

                        return (
                            <div key={item._id}
                                onClick={() => { setActive(index); handleSelectChat(item._id); }}
                                className={`w-full flex p-4 px-5 border-b hover:bg-gray-50 transition-colors ${active === index ? "bg-gray-100" : "bg-transparent"
                                    } cursor-pointer`}>

                                <div className="relative shrink-0">
                                    {info?.avatar ? (
                                        <img
                                            src={info.avatar}
                                            alt={displayName}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                            <MdManageAccounts />
                                        </div>
                                    )}
                                    <div className='w-3.5 h-3.5 bg-green-400 rounded-full absolute top-0.5 right-0.5 border-2 border-white'></div>
                                </div>

                                <div className='pl-4 flex-1 min-w-0 flex flex-col justify-center'>
                                    <h1 className='font-semibold text-gray-800 text-[15px] truncate'>
                                        {displayName}
                                    </h1>
                                    <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                        {item.lastMessage ? item.lastMessage : "Click to view messages"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-bold text-gray-800'>
                                Start New Chat with User
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
                                placeholder='Search users by name...'
                                value={searchNewUser}
                                onChange={(e) => setSearchNewUser(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {searchingUsers && (
                                <div className='absolute right-3 top-2.5'>
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
                                </div>
                            )}
                        </div>

                        <div className='mt-4 max-h-60 overflow-y-auto'>
                            {searchResults.length === 0 && searchNewUser.length >= 2 && !searchingUsers && (
                                <p className='text-gray-500 text-center py-4'>
                                    No users found
                                </p>
                            )}
                            {searchResults.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => createNewConversation(item._id, 'user')}
                                    className='flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
                                >
                                    {item.avatar?.url || item.avatar ? (
                                        <img
                                            src={item.avatar.url || item.avatar}
                                            alt={item.name}
                                            className='w-10 h-10 rounded-full object-cover'
                                        />
                                    ) : (
                                        <div className='w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold'>
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

export default SellerInbox;