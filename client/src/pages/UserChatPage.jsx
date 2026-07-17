import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Image as ImageIcon, X } from 'lucide-react';
import { socket } from '../socket';
import { MdManageAccounts } from 'react-icons/md';

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
    const fileInputRef = useRef(null);

    const { user } = useSelector((state) => state.user);
    const { seller } = useSelector((state) => state.seller);

    const currentUserId = user?._id;
    const isUserView = Boolean(user?._id);

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [conversationData, setConversationData] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [receiverInfo, setReceiverInfo] = useState({ name: "", avatar: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

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
                        name: info?.name || "ADMIN",
                        avatar: avatarUrl
                    });
                } else {
                    setReceiverInfo({ name: "ADMIN", avatar: "" });
                }
            } catch (error) {
                console.error("Error fetching receiver info:", error);
                setReceiverInfo({ name: "ADMIN", avatar: "" });
            }
        };

        fetchReceiverInfo();
    }, [receiverId, isUserView]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // File selection handler
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            return toast.error("You can upload a maximum of 5 images.");
        }

        setImages((prev) => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    // Remove selected file from state
    const removeSelectedImage = (index) => {
        setImages((prev) => prev.filter((_, idx) => idx !== index));
        setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() && images.length === 0) return;

        setIsSending(true);
        const formData = new FormData();
        formData.append("conversationID", conversationId);
        formData.append("sender", currentUserId);
        formData.append("receiver", receiverId);
        formData.append("text", inputValue);

        images.forEach((imgFile) => {
            formData.append("images", imgFile);
        });

        try {
            const { data } = await axios.post("/api/message/create-new-message", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                const savedMessage = data.userMessage;

                socket.emit("sendMessage", {
                    id: savedMessage._id,
                    senderID: currentUserId,
                    receiverID: receiverId,
                    conversationID: conversationId,
                    text: inputValue || "Sent an attachment",
                    images: savedMessage.images || []
                });

                axios.put(`/api/conversation/update-last-message/${conversationId}`, {
                    lastMessage: inputValue || "Sent an attachment",
                    lastMessageID: savedMessage._id
                }).catch(() => { });

                setMessages((prev) => [...prev, savedMessage]);
                setInputValue("");
                setImages([]);
                setImagePreviews([]);
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Send message error:", error);
            toast.error(error?.response?.data?.message || "Message could not be sent.");
        } finally {
            setIsSending(false);
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
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            <MdManageAccounts />
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
                                <div className={`rounded p-2.5 px-4 text-sm font-medium shadow-sm max-w-[75%] sm:max-w-[70%] ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    {/* Handle text display */}
                                    {msg.text && <p className="wrap-break-word">{msg.text}</p>}

                                    {/* Render optional attachment images */}
                                    {msg.images && msg.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-1.5 mt-2 max-w-75">
                                            {msg.images.map((imgUrl, i) => (
                                                <a key={i} href={imgUrl} target="_blank" rel="noreferrer">
                                                    <img src={imgUrl} alt="uploaded content" className="w-full h-24 object-cover rounded hover:opacity-90 transition-opacity cursor-zoom-in" />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    <span className={`block text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {formatMessageTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* PRE-UPLOAD IMAGES PREVIEW ZONE */}
            {imagePreviews.length > 0 && (
                <div className="px-4 py-2 bg-gray-100 border-t flex gap-2 flex-wrap">
                    {imagePreviews.map((url, i) => (
                        <div key={i} className="relative w-16 h-16">
                            <img src={url} className="w-full h-full object-cover rounded border" alt="preview" />
                            <button
                                type="button"
                                onClick={() => removeSelectedImage(i)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* INPUT FOOTER */}
            <footer className="p-3 bg-gray-50 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white border border-gray-300 rounded p-1.5 px-3 focus-within:border-blue-500 transition-all">
                    {/* Hidden Native File Input */}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {/* Image Selector Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        disabled={isSending}
                    >
                        <ImageIcon size={20} />
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write a message..."
                        disabled={isSending}
                        className="flex-1 min-w-0 bg-transparent text-sm border-none focus:outline-none text-gray-700 placeholder-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={isSending}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-1 shrink-0 disabled:text-gray-300"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default UserChatPage;