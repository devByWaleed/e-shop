import { io } from "socket.io-client";

// Get socket URL from environment with fallback
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_ENDPOINT ||
    "http://localhost:4500";

console.log("🔌 Socket URL:", SOCKET_URL);

// Create socket instance with production-ready config
export const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"], // Polling fallback for reliability
    autoConnect: false, // Don't auto-connect - we'll control this
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    withCredentials: true, // For cookies/auth headers
    forceNew: false, // Reuse existing connection when possible
});

// ======================
// Connection Event Handlers
// ======================

// Successfully connected
socket.on("connect", () => {
    console.log(`✅ Socket connected: ${socket.id}`);
});

// Disconnected
socket.on("disconnect", (reason) => {
    console.log(`❌ Socket disconnected: ${reason}`);

    // Auto-reconnect for certain reasons
    if (reason === "io server disconnect") {
        // Server initiated disconnect - manually reconnect
        socket.connect();
    }
    // Other reasons (e.g., "transport error") will auto-reconnect
});

// Connection error
socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
});

// Reconnection attempts
socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Reconnection attempt #${attemptNumber}`);
});

// Reconnection successful
socket.on("reconnect_successful", () => {
    console.log("✅ Socket reconnected successfully");
});

// Reconnection failed
socket.on("reconnect_failed", () => {
    console.error("❌ Socket reconnection failed after all attempts");
    // You can show a notification to the user here
});

// ======================
// Helper Functions
// ======================

/**
 * Connect socket with user authentication
 * @param {string} userID - The user's ID
 */
export const connectSocket = (userID) => {
    if (!userID) {
        console.error("❌ Cannot connect socket: No userID provided");
        return;
    }

    // Add user ID to auth data
    socket.auth = { userID };

    // Connect if not already connected
    if (!socket.connected) {
        socket.connect();
    }

    // Join user room
    socket.emit("addUser", userID);
    console.log(`🔗 Socket connected for user: ${userID}`);
};

/**
 * Disconnect socket and cleanup
 */
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket disconnected");
    }
};

/**
 * Send a message through socket
 * @param {Object} data - Message data
 * @param {string} data.senderID - Sender's user ID
 * @param {string} data.receiverID - Receiver's user ID
 * @param {string} data.conversationID - Conversation ID
 * @param {string} data.text - Message text
 * @param {Array} data.images - Array of image URLs
 */
export const sendMessage = (data) => {
    if (!socket.connected) {
        console.warn("⚠️ Socket not connected. Message will be queued.");
        // You could implement a queue system here
        return;
    }

    const { senderID, receiverID, conversationID, text, images } = data;

    if (!senderID || !receiverID) {
        console.error("❌ Cannot send message: Missing sender or receiver ID");
        return;
    }

    socket.emit("sendMessage", {
        senderID,
        receiverID,
        conversationID,
        text: text || "",
        images: images || [],
        timestamp: new Date().toISOString()
    });

    console.log(`📨 Message sent to ${receiverID}`);
};

/**
 * Mark message as seen
 * @param {Object} data - Message seen data
 */
export const markMessageAsSeen = (data) => {
    if (!socket.connected) {
        console.warn("⚠️ Socket not connected. Cannot mark as seen.");
        return;
    }

    socket.emit("messageSeen", data);
};

/**
 * Send typing indicator
 * @param {Object} data - Typing data
 * @param {string} data.senderID - Typing user's ID
 * @param {string} data.receiverID - User who should see typing indicator
 * @param {boolean} data.isTyping - Whether user is typing
 */
export const sendTypingIndicator = (data) => {
    if (!socket.connected) return;
    socket.emit("typing", data);
};

/**
 * Update last message preview
 * @param {Object} data - Last message data
 */
export const updateLastMessage = (data) => {
    if (!socket.connected) return;
    socket.emit("updateLastMessage", data);
};

// ======================
// Custom Event Listeners
// ======================

/**
 * Register event listener with cleanup
 * @param {string} event - Event name
 * @param {Function} callback - Event handler
 * @returns {Function} Cleanup function
 */
export const onSocketEvent = (event, callback) => {
    socket.on(event, callback);

    // Return cleanup function
    return () => {
        socket.off(event, callback);
    };
};

// ======================
// Export socket instance
// ======================

export default socket;