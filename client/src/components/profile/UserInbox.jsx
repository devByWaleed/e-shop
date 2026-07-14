import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserInbox = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user);

    const [conversations, setConversations] = useState([])
    const [memberInfo, setMemberInfo] = useState({})
    const [active, setActive] = useState(null)

    const getUserConversations = async () => {
        try {
            const { data } = await axios.get(`/api/conversation/get-user-conversation/${user._id}`);
            if (data.success) {
                setConversations(data.conversations)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.message || "Failed to load inbox!");
        }
    }

    useEffect(() => {
        if (user?._id) {
            getUserConversations()
        }
    }, [user])

    useEffect(() => {
        const fetchAllMemberInfo = async () => {
            const entries = await Promise.all(
                conversations.map(async (conv) => {
                    const sellerId = conv.members.find((m) => m !== user._id);
                    if (!sellerId) return [conv._id, null];
                    try {
                        const { data } = await axios.get(`/api/seller/get-seller/${sellerId}`);
                        if (data.success) {
                            return [conv._id, {
                                name: data.seller?.name,
                                avatar: data.seller?.avatar?.url || data.seller?.avatar
                            }];
                        }
                        return [conv._id, null];
                    } catch {
                        return [conv._id, null];
                    }
                })
            );
            setMemberInfo(Object.fromEntries(entries));
        };

        if (conversations.length > 0 && user?._id) {
            fetchAllMemberInfo();
        }
    }, [conversations, user]);

    const handleSelectChat = (id) => {
        navigate(`/user-conversation/${id}`)
    }

    return (
        <section className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded shadow-md'>
            <h1 className='text-center text-[30px] py-4 font-semibold text-gray-700 border-b'>All messages</h1>

            {conversations.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No active conversations found.</p>
            ) : (
                conversations.map((item, index) => {
                    const info = memberInfo[item._id];
                    const displayName = info?.name || item.groupTitle || "Seller";

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
                                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {displayName[0].toUpperCase()}
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
    )
}

export default UserInbox;