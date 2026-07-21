import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// ======================
// CORS Configuration
// ======================
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
].filter(Boolean);

console.log("✅ Allowed Origins:", allowedOrigins);

// ======================
// Socket.IO with CORS
// ======================
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
});

// ======================
// Redis Setup (for multi-instance support)
// ======================
let redisClient = null;
let pubClient = null;
let subClient = null;

if (process.env.REDIS_URL) {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    console.log(`🔄 Redis reconnecting... attempt ${retries}`);
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis Client Connected');
        });

        await redisClient.connect();

        pubClient = redisClient.duplicate();
        subClient = redisClient.duplicate();

        await pubClient.connect();
        await subClient.connect();

        // Use Redis adapter for Socket.IO
        io.adapter(createAdapter(pubClient, subClient));
        console.log('✅ Redis adapter configured for Socket.IO');
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message);
        console.log('⚠️ Running without Redis (single instance mode)');
    }
} else {
    console.log('⚠️ No Redis URL provided, running in single instance mode');
}

// ======================
// Express Middleware
// ======================
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ======================
// Health Check Endpoints
// ======================
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "Socket.IO Server",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        redis: redisClient ? "connected" : "not configured",
        connections: users.length,
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        connections: users.length,
        memory: process.memoryUsage(),
    });
});

// ======================
// User Management
// ======================
let users = [];
const messages = {};

const addUser = (userID, socketID) => {
    const userExists = users.some((user) => user.userID === userID);
    if (!userExists) {
        users.push({ userID, socketID, joinedAt: new Date().toISOString() });
    } else {
        const index = users.findIndex((user) => user.userID === userID);
        users[index].socketID = socketID;
        users[index].joinedAt = new Date().toISOString();
    }
    // Store in Redis if available
    if (redisClient) {
        redisClient.set(`user:${userID}`, socketID, { EX: 3600 });
    }
};

const removeUser = (socketID) => {
    const user = users.find((u) => u.socketID === socketID);
    if (user && redisClient) {
        redisClient.del(`user:${user.userID}`);
    }
    users = users.filter((user) => user.socketID !== socketID);
};

const getUser = (receiverID) => {
    return users.find((user) => user.userID === receiverID);
};

const createMessage = ({ senderID, receiverID, conversationID, text, images }) => ({
    senderID,
    receiverID,
    conversationID,
    text,
    images: images || [],
    seen: false,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
});

// ======================
// Socket.IO Event Handlers
// ======================
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    console.log(`📊 Total connections: ${io.engine.clientsCount}`);

    // 1. Add User
    socket.on("addUser", (userID) => {
        if (!userID) {
            console.error("❌ addUser called without userID");
            return;
        }
        addUser(userID, socket.id);
        io.emit("getUser", users);
        console.log(`📊 Active users: ${users.length}`);
    });

    // 2. Send Message
    socket.on("sendMessage", ({ senderID, receiverID, conversationID, text, images }) => {
        if (!senderID || !receiverID) {
            console.error("❌ sendMessage missing required fields");
            return;
        }

        const message = createMessage({ senderID, receiverID, conversationID, text, images });
        const targetUser = getUser(receiverID);

        // Store message
        if (!messages[conversationID]) {
            messages[conversationID] = [];
        }
        messages[conversationID].push(message);

        // Store in Redis for persistence
        if (redisClient) {
            redisClient.lPush(`messages:${conversationID}`, JSON.stringify(message));
            redisClient.lTrim(`messages:${conversationID}`, 0, 99); // Keep last 100 messages
        }

        // Send to receiver if online
        if (targetUser) {
            io.to(targetUser.socketID).emit("getMessage", message);
            console.log(`📨 Message sent to ${receiverID}`);
        } else {
            console.log(`📨 User ${receiverID} is offline, message queued`);
            // Store offline message for later delivery
            if (redisClient) {
                redisClient.lPush(`offline:${receiverID}`, JSON.stringify(message));
            }
        }
    });

    // 3. Mark Message as Seen
    socket.on("messageSeen", ({ senderID, receiverID, messageID }) => {
        const targetUser = getUser(senderID);

        // Update in memory
        for (const [convId, convMessages] of Object.entries(messages)) {
            const message = convMessages.find(
                (msg) => msg.receiverID === receiverID && msg.id === messageID
            );
            if (message) {
                message.seen = true;
                message.seenAt = new Date().toISOString();
                break;
            }
        }

        // Update in Redis
        if (redisClient) {
            redisClient.set(`seen:${messageID}`, "true", { EX: 86400 });
        }

        if (targetUser) {
            io.to(targetUser.socketID).emit("messageSeen", {
                senderID,
                receiverID,
                messageID,
            });
        }
    });

    // 4. Typing Indicator
    socket.on("typing", ({ senderID, receiverID, isTyping }) => {
        const targetUser = getUser(receiverID);
        if (targetUser) {
            io.to(targetUser.socketID).emit("typing", {
                senderID,
                isTyping,
            });
        }
    });

    // 5. Update Last Message Preview
    socket.on("updateLastMessage", ({ lastMessage, lastMessageID }) => {
        io.emit("getLastMessage", { lastMessage, lastMessageID });
    });

    // 6. Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        removeUser(socket.id);
        io.emit("getUser", users);
        console.log(`📊 Active users: ${users.length}`);
    });

    // 7. Error Handling
    socket.on("error", (error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
    });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Socket Server running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Redis: ${redisClient ? 'Connected' : 'Not Configured'}`);
    console.log(`✅ Allowed Origins:`, allowedOrigins);
});

// ======================
// Graceful Shutdown
// ======================
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, closing connections...');
    if (redisClient) {
        await redisClient.quit();
        console.log('✅ Redis connection closed');
    }
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

export default server;