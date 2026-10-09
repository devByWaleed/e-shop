import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
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
// ======================
// Redis Setup (for multi-instance support)
// ======================
const REDIS_MAX_RETRIES = 3;

let redisClient = null;
let pubClient = null;
let subClient = null;

if (process.env.REDIS_URL) {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    // Returning an Error stops the retrying and makes connect() fail
                    if (retries >= REDIS_MAX_RETRIES) {
                        return new Error("Redis is unreachable, giving up");
                    }
                    console.log(`🔄 Redis reconnecting... attempt ${retries + 1} of ${REDIS_MAX_RETRIES}`);
                    return (retries + 1) * 500;
                }
            }
        });

        pubClient = redisClient.duplicate();
        subClient = redisClient.duplicate();

        // Every client needs an error listener, or one error can crash the process
        [redisClient, pubClient, subClient].forEach((client) => {
            client.on("error", (err) => {
                console.error("❌ Redis error:", err.code || err.message);
            });
        });

        await redisClient.connect();
        console.log("✅ Redis Client Connected");

        await pubClient.connect();
        await subClient.connect();

        // Redis is used ONLY for the Socket.IO adapter (messages reach users on any server instance)
        io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Redis adapter configured for Socket.IO");
    } catch (error) {
        console.error("❌ Redis connection failed:", error.message);
        console.log("⚠️ Running without Redis (single instance mode)");

        // Close whatever opened, and reset so the health check tells the truth
        for (const client of [redisClient, pubClient, subClient]) {
            try { await client?.disconnect(); } catch { /* already closed */ }
        }
        redisClient = null;
        pubClient = null;
        subClient = null;
    }
} else {
    console.log("⚠️ No Redis URL provided, running in single instance mode");
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
        version: "1.1.0",
        timestamp: new Date().toISOString(),
        redis: redisClient ? "connected" : "not configured",
        connections: io.engine.clientsCount,
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount,
    });
});

// ======================
// Login check: only people with a valid socket token can connect
// (the token is issued by the API at GET /api/auth/socket-token)
// ======================
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.SOCKET_SECRET);
        const ids = (decoded.ids || []).map(String);

        if (ids.length === 0) {
            return next(new Error("unauthorized"));
        }

        // Every id this browser is logged in as (buyer id, seller id, admin id)
        socket.data.ids = ids;
        next();
    } catch (error) {
        next(new Error("unauthorized"));
    }
});

// ======================
// Helpers
// ======================

// Who is online right now, across ALL server instances (works with the Redis adapter)
const broadcastPresence = async () => {
    try {
        const sockets = await io.fetchSockets();
        const online = new Set();

        for (const s of sockets) {
            for (const id of s.data.ids || []) {
                online.add(id);
            }
        }

        // Only user ids are sent, never socket ids
        io.emit("getUser", [...online].map((userID) => ({ userID })));
    } catch (error) {
        console.error("Presence error:", error.message);
    }
};

const createMessage = ({ senderID, receiverID, conversationID, text, images }) => ({
    senderID,
    receiverID,
    conversationID,
    text,
    images: images || [],
    seen: false,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
});

// ======================
// Socket.IO Event Handlers
// ======================
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Every id of this person gets its own "room".
    // Sending to a room reaches ALL their tabs, on ANY server instance.
    socket.data.ids.forEach((id) => socket.join(id));

    // 1. Add User (kept so your frontend still works; the id must really be one of yours)
    socket.on("addUser", (userID) => {
        if (!userID || !socket.data.ids.includes(String(userID))) {
            return;
        }
        broadcastPresence();
    });

    // 2. Send Message (the message is saved by the REST API; the socket only delivers it live)
    socket.on("sendMessage", ({ senderID, receiverID, conversationID, text, images }) => {
        if (!senderID || !receiverID) {
            return;
        }
        // You can only send as yourself
        if (!socket.data.ids.includes(String(senderID))) {
            return;
        }
        // Basic size guard
        if (typeof text === "string" && text.length > 5000) {
            return;
        }

        const message = createMessage({ senderID, receiverID, conversationID, text, images });
        io.to(String(receiverID)).emit("getMessage", message);
    });

    // 3. Mark Message as Seen (the frontend also calls PUT /api/message/mark-seen/:conversationId)
    socket.on("messageSeen", ({ senderID, receiverID, messageID }) => {
        // Only the receiver can say "I saw it"
        if (!socket.data.ids.includes(String(receiverID))) {
            return;
        }
        io.to(String(senderID)).emit("messageSeen", { senderID, receiverID, messageID });
    });

    // 4. Typing Indicator
    socket.on("typing", ({ senderID, receiverID, isTyping }) => {
        if (!socket.data.ids.includes(String(senderID))) {
            return;
        }
        io.to(String(receiverID)).emit("typing", { senderID, isTyping });
    });

    // 5. Update Last Message Preview (only the two people in the chat get it)
    socket.on("updateLastMessage", ({ lastMessage, lastMessageID, senderID, receiverID }) => {
        if (!senderID || !receiverID || !socket.data.ids.includes(String(senderID))) {
            return;
        }
        [senderID, receiverID].forEach((id) => {
            io.to(String(id)).emit("getLastMessage", { lastMessage, lastMessageID });
        });
    });

    // 6. Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        broadcastPresence();
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
    console.log(`✅ Socket Server running!`);
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