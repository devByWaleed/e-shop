import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { socket } from '../socket';

const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    const isSameYear = date.getFullYear() === now.getFullYear();
    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: isSameYear ? undefined : "numeric"
    });
};

const UserChatPage = () => {
    const { id: conversationId } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const { user } = useSelector((state) => state.user);
    const { seller } = useSelector((state) => state.seller);

    const currentUserId = user?._id;
    const isUserView = Boolean(user?._id);

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [conversationData, setConversationData] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [receiverInfo, setReceiverInfo] = useState({ name: "", avatar: "" });
    const [isLoading, setIsLoading] = useState(true);

    // 1. Establish socket registration and global receiver listener
    useEffect(() => {
        if (!currentUserId) return;

        socket.emit("addUser", currentUserId);

        socket.on("getMessage", (incomingMsg) => {
            if (incomingMsg.conversationID === conversationId) {
                setMessages((prev) => [...prev, {
                    _id: incomingMsg.id,
                    conversationID: incomingMsg.conversationID,
                    sender: incomingMsg.senderID,
                    text: incomingMsg.text,
                    images: incomingMsg.images,
                    createdAt: new Date().toISOString()
                }]);
            }
        });

        return () => {
            socket.off("getMessage");
        };
    }, [currentUserId, conversationId]);

    // 2. Load basic message logs and establish conversation structures
    useEffect(() => {
        const fetchChatDetailsAndMessages = async () => {
            setIsLoading(true);
            try {
                // Fetch messages
                const resMessages = await axios.get(`/api/message/get-all-messages/${conversationId}`);
                if (resMessages.data.success) {
                    setMessages(resMessages.data.messages);
                }

                // Get conversation by ID
                const resConversation = await axios.get(`/api/conversation/get-conversation/${conversationId}`);
                if (resConversation.data.success) {
                    const conv = resConversation.data.conversation;
                    setConversationData(conv);

                    // Find the other member
                    const targetReceiver = conv.members.find(memberID => memberID !== currentUserId);
                    if (targetReceiver) {
                        setReceiverId(targetReceiver);
                    } else {
                        toast.error("Could not find the other participant");
                    }
                }
            } catch (error) {
                toast.error("Failed to load messages.");
                console.error("Error fetching chat details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (conversationId && currentUserId) {
            fetchChatDetailsAndMessages();
        }
    }, [conversationId, currentUserId]);

    // 3. Obtain real names and profile avatars 
    useEffect(() => {
        const fetchReceiverInfo = async () => {
            if (!receiverId) return;

            try {
                let endpoint;
                if (isUserView) {
                    // If user is logged in, receiver is a seller
                    endpoint = `/api/seller/get-seller/${receiverId}`;
                } else {
                    // If seller is logged in, receiver is a user
                    endpoint = `/api/user/user-info/${receiverId}`;
                }

                const { data } = await axios.get(endpoint);
                if (data.success) {
                    const info = data.seller || data.user;
                    const avatarUrl = info?.avatar?.url || info?.avatar || "";
                    setReceiverInfo({
                        name: info?.name || "Participant",
                        avatar: avatarUrl
                    });
                } else {
                    setReceiverInfo({ name: "Participant", avatar: "" });
                }
            } catch (error) {
                console.error("Error fetching receiver info:", error);
                setReceiverInfo({ name: "Participant", avatar: "" });
            }
        };

        fetchReceiverInfo();
    }, [receiverId, isUserView]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const messagePayload = {
            conversationID: conversationId,
            sender: currentUserId,
            text: inputValue
        };

        try {
            const { data } = await axios.post("/api/message/create-new-message", messagePayload);

            if (data.success) {
                const savedMessage = data.userMessage;

                socket.emit("sendMessage", {
                    id: savedMessage._id,
                    senderID: currentUserId,
                    receiverID: receiverId,
                    conversationID: conversationId,
                    text: inputValue
                });

                axios.put(`/api/conversation/update-last-message/${conversationId}`, {
                    lastMessage: inputValue,
                    lastMessageID: savedMessage._id
                }).catch(() => { });

                setMessages((prev) => [...prev, savedMessage]);
                setInputValue("");
            }
        } catch (error) {
            toast.error("Message could not be sent.");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto my-4 bg-white h-[85vh] flex items-center justify-center">
                <div className="text-gray-500">Loading conversation...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto my-4 bg-white h-[85vh] flex flex-col rounded shadow-sm overflow-hidden">

            {/* HEADER */}
            <header className="px-4 py-3 bg-[#eef2f7] flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-600 shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {/* Proper avatar display logic */}
                    {receiverInfo.avatar ? (
                        <img
                            src={receiverInfo.avatar}
                            alt={receiverInfo.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-300"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                            {receiverInfo.name ? receiverInfo.name.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 leading-tight truncate">
                            {receiverInfo.name || "Loading..."}
                        </h3>
                        <p className="text-xs text-gray-500 font-normal">Active now</p>
                    </div>
                </div>
            </header>

            {/* CHAT MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender === currentUserId;
                        return (
                            <div key={msg._id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded p-2.5 px-4 text-sm font-medium shadow-sm max-w-[75%] sm:max-w-[70%] ${isMe ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p className="wrap-break-word">{msg.text}</p>
                                    <span className={`block text-[10px] mt-1 text-right ${isMe ? 'text-emerald-50' : 'text-gray-400'
                                        }`}>
                                        {formatMessageTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* INPUT FOOTER */}
            <footer className="p-3 bg-gray-50 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white border border-gray-300 rounded p-1.5 px-3 focus-within:border-emerald-500 transition-all">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 min-w-0 bg-transparent text-sm border-none focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button type="submit" className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 shrink-0">
                        <Send size={18} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default UserChatPage;