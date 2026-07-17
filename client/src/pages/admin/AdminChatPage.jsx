import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Image as ImageIcon, X } from 'lucide-react';
import { socket } from '../../socket';

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

const AdminChatPage = () => {
    const { id: conversationId } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // FIX: Use admin reducer instead of user reducer
    const { admin } = useSelector((state) => state.admin);

    const currentUserId = admin?.id;

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [conversationData, setConversationData] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [receiverInfo, setReceiverInfo] = useState({ name: "", avatar: "", role: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // Socket Connection
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

    // Load logs and basic conversation structure
    useEffect(() => {
        const fetchChatDetailsAndMessages = async () => {
            setIsLoading(true);
            try {
                const resMessages = await axios.get(`/api/message/get-all-messages/${conversationId}`);
                if (resMessages.data.success) {
                    setMessages(resMessages.data.messages);
                }

                const resConversation = await axios.get(`/api/conversation/get-conversation/${conversationId}`);
                if (resConversation.data.success) {
                    const conv = resConversation.data.conversation;
                    setConversationData(conv);

                    const targetReceiver = conv.members.find(memberID => memberID !== currentUserId);
                    if (targetReceiver) {
                        setReceiverId(targetReceiver);
                    } else {
                        toast.error("Could not locate metadata participant");
                    }
                }
            } catch (error) {
                toast.error("Failed to load messages.");
            } finally {
                setIsLoading(false);
            }
        };

        if (conversationId && currentUserId) {
            fetchChatDetailsAndMessages();
        }
    }, [conversationId, currentUserId]);

    // Determine receiver type dynamically
    useEffect(() => {
        const fetchReceiverInfo = async () => {
            if (!receiverId) return;

            try {
                // Try Seller endpoint first
                const sellerRes = await axios.get(`/api/seller/get-seller/${receiverId}`);
                if (sellerRes.data.success && sellerRes.data.seller) {
                    const info = sellerRes.data.seller;
                    setReceiverInfo({
                        name: info.name,
                        avatar: info?.avatar?.url || info?.avatar || "",
                        role: "Seller"
                    });
                    return;
                }
            } catch { }

            try {
                // Fallback to User info
                const userRes = await axios.get(`/api/user/user-info/${receiverId}`);
                if (userRes.data.success && userRes.data.user) {
                    const info = userRes.data.user;
                    setReceiverInfo({
                        name: info.name,
                        avatar: info?.avatar?.url || info?.avatar || "",
                        role: "User"
                    });
                }
            } catch (err) {
                setReceiverInfo({ name: "Participant", avatar: "", role: "Unknown" });
            }
        };

        fetchReceiverInfo();
    }, [receiverId]);

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
        // FIX: Add receiver to message
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

                // Send through WebSockets instantly
                socket.emit("sendMessage", {
                    id: savedMessage._id,
                    senderID: currentUserId,
                    receiverID: receiverId,
                    conversationID: conversationId,
                    text: inputValue,
                    images: savedMessage.images || []
                });

                // Update database tracking for last message preview
                axios.put(`/api/conversation/update-last-message/${conversationId}`, {
                    lastMessage: inputValue || "Sent an attachment",
                    lastMessageID: savedMessage._id
                }).catch(() => { });

                setMessages((prev) => [...prev, savedMessage]);
                setInputValue("");
                setImages([]);
                setImagePreviews([]);
            }
        } catch (error) {
            toast.error("Message could not be sent.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto my-4 bg-white h-[85vh] flex items-center justify-center">
                <div className="text-gray-500">Loading admin terminal...</div>
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

                    {receiverInfo.avatar ? (
                        <img
                            src={receiverInfo.avatar}
                            alt={receiverInfo.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-300"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                            {receiverInfo.name ? receiverInfo.name.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-gray-800 leading-tight truncate">
                                {receiverInfo.name || "Loading..."}
                            </h3>
                            <span className="text-[9px] bg-gray-200 text-gray-700 font-bold px-1.5 rounded uppercase">
                                {receiverInfo.role}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-normal">Secure Support Chat</p>
                    </div>
                </div>
            </header>

            {/* MESSAGES VIEW */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        No logs recorded. Start the conversation!
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

            {/* FOOTER CONTROLS */}
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

export default AdminChatPage;