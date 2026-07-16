import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminInbox = () => {
    const navigate = useNavigate();
    // Assuming you have an admin state in redux, or reuse user if admin is parsed under user state
    const { user: admin } = useSelector((state) => state.user);

    const [conversations, setConversations] = useState([]);
    const [memberInfo, setMemberInfo] = useState({});
    const [active, setActive] = useState(null);

    const getAdminConversations = async () => {
        try {
            const { data } = await axios.get(`/api/conversation/get-admin-conversation/${admin._id}`);
            if (data.success) {
                setConversations(data.conversations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.message || "Failed to load admin inbox!");
        }
    };

    useEffect(() => {
        if (admin?._id) {
            getAdminConversations();
        }
    }, [admin]);

    useEffect(() => {
        const fetchAllMemberInfo = async () => {
            const entries = await Promise.all(
                conversations.map(async (conv) => {
                    const otherMemberId = conv.members.find((m) => m !== admin._id);
                    if (!otherMemberId) return [conv._id, null];

                    // Since Admin can talk to both Users and Sellers, we attempt to find the metadata
                    try {
                        // Attempt 1: Fetch as Seller
                        const sellerRes = await axios.get(`/api/seller/get-seller/${otherMemberId}`);
                        if (sellerRes.data.success && sellerRes.data.seller) {
                            return [conv._id, {
                                name: sellerRes.data.seller.name,
                                avatar: sellerRes.data.seller?.avatar?.url || sellerRes.data.seller?.avatar,
                                role: "Seller"
                            }];
                        }
                    } catch {
                        // Fallback/Ignore to try user request next
                    }

                    try {
                        // Attempt 2: Fetch as Regular User
                        const userRes = await axios.get(`/api/user/user-info/${otherMemberId}`);
                        if (userRes.data.success && userRes.data.user) {
                            return [conv._id, {
                                name: userRes.data.user.name,
                                avatar: userRes.data.user?.avatar?.url || userRes.data.user?.avatar,
                                role: "User"
                            }];
                        }
                    } catch {
                        // Both failed
                    }

                    return [conv._id, null];
                })
            );
            setMemberInfo(Object.fromEntries(entries));
        };

        if (conversations.length > 0 && admin?._id) {
            fetchAllMemberInfo();
        }
    }, [conversations, admin]);

    const handleSelectChat = (id) => {
        navigate(`/admin-conversation/${id}`);
    };

    return (
        <section className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded shadow-md'>
            <h1 className='text-center text-[30px] py-4 font-semibold text-gray-700 border-b'>Admin System Inbox</h1>

            {conversations.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No active support conversations found.</p>
            ) : (
                conversations.map((item, index) => {
                    const info = memberInfo[item._id];
                    const displayName = info?.name || item.groupTitle || "Participant";
                    const roleBadge = info?.role ? info.role : "Client";

                    return (
                        <div key={item._id}
                            onClick={() => { setActive(index); handleSelectChat(item._id) }}
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
                                        {displayName[0].toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className='pl-4 flex-1 min-w-0 flex flex-col justify-center'>
                                <div className="flex items-center gap-2">
                                    <h1 className='font-semibold text-gray-800 text-[15px] truncate'>
                                        {displayName}
                                    </h1>
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono uppercase">
                                        {roleBadge}
                                    </span>
                                </div>
                                <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                    {item.lastMessage ? item.lastMessage : "Click to view logs"}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </section>
    );
};

export default AdminInbox;