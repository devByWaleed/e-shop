import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

const ChatPage = () => {
    const navigate = useNavigate();

    // Simple dummy data mimicking your image layout
    const [messages] = useState([
        { id: 1, senderId: "seller456", text: "Hello there!" },
        { id: 2, senderId: "user123", text: "Hi!" }
    ]);

    const currentUserId = "user123"; // You

    return (
        <div className="w-full max-w-6xl mx-auto my-4 bg-white h-[85vh] flex flex-col rounded shadow-sm overflow-hidden">

            {/* HEADER: Exactly like the image with an added Go Back arrow */}
            <header className="px-4 py-3 bg-[#eef2f7] flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {/* Go Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    {/* User Profile Info */}
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Shahriar Sajeeb"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-tight">Shahriar Sajeeb</h3>
                        <p className="text-xs text-gray-500 font-normal">Active now</p>
                    </div>
                </div>
            </header>

            {/* CHAT MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex items-start gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>

                            {/* Show avatar ONLY for the other sender (matching your image) */}
                            {!isMe && (
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover mt-0.5"
                                />
                            )}

                            {/* Simple Green Message Bubbles */}
                            <div className={`rounded p-2 px-3 text-sm font-medium text-white shadow-sm max-w-[70%] ${isMe ? 'bg-[#2ecc71]' : 'bg-[#2ecc71]'
                                }`}>
                                <p>{msg.text}</p>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* INPUT CHAT FOOTER */}
            <footer className="p-3 bg-gray-50 border-t border-gray-200">
                <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 bg-white border border-gray-300 rounded p-1.5 px-3 focus-within:border-emerald-500 transition-all">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="flex-1 bg-transparent text-sm border-none focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="text-emerald-600 hover:text-emerald-700 transition-colors p-1"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </footer>

        </div>
    );
};

export default ChatPage;