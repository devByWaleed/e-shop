import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

dotenv.config({
    path: "./.env"
})

const app = express()
const server = http.createServer(app)

const allowedOrigin = ["http://localhost:5173"]

// 1. MUST pass CORS settings directly to the Server constructor
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World From Socket")
})

// --- Global Connection & Message State ---
let users = []
const messages = {} // Declared globally so data persists between client reconnections

const addUser = (userID, socketID) => {
    const userExists = users.some((user) => user.userID === userID)
    if (!userExists) {
        users.push({ userID, socketID })
    } else {
        // If user is already active, update their current socket connection
        const index = users.findIndex((user) => user.userID === userID)
        users[index].socketID = socketID
    }
}

const removeUser = (socketID) => {
    users = users.filter((user) => user.socketID !== socketID)
}

const getUser = (receiverID) => {
    // FIXED: Must match on identity, not difference
    return users.find((user) => user.userID === receiverID)
}

const createMessage = ({ senderID, receiverID, conversationID, text, images }) => ({
    senderID,
    receiverID,
    conversationID,
    text,
    images,
    seen: false,
    id: Date.now().toString()
})

// --- Socket Communication Event Listeners ---
io.on("connection", (socket) => {
    console.log(`✅ A user is connected: ${socket.id}`)

    // 1. Add User to Registry
    socket.on("addUser", (userID) => {
        addUser(userID, socket.id)
        io.emit("getUser", users)
        console.log("Current active users:", users)
    })

    // 2. Real-time message dispatch
    socket.on("sendMessage", ({ senderID, receiverID, conversationID, text, images }) => {
        const message = createMessage({ senderID, receiverID, conversationID, text, images })
        const targetUser = getUser(receiverID)

        // Keep a copy in global memory
        if (!messages[receiverID]) {
            messages[receiverID] = [message]
        } else {
            messages[receiverID].push(message)
        }

        // Send the payload to the receiver if they are currently online
        if (targetUser) {
            // FIXED: Corrected spelling to "getMessage"
            io.to(targetUser.socketID).emit("getMessage", message)
        }
    })

    // 3. Mark message as seen
    socket.on("messageSeen", ({ senderID, receiverID, messageID }) => {
        const targetUser = getUser(senderID)

        if (messages[senderID]) {
            const message = messages[senderID].find(
                (msg) => msg.receiverID === receiverID && msg.id === messageID
            )

            if (message) {
                message.seen = true

                if (targetUser) {
                    io.to(targetUser.socketID).emit("messageSeen", {
                        senderID,
                        receiverID,
                        messageID
                    })
                }
            }
        }
    })

    // 4. Update last message previews globally
    socket.on("updateLastMessage", ({ lastMessage, lastMessageID }) => {
        io.emit("getLastMessage", { lastMessage, lastMessageID })
    })

    // 5. Handle user disconnect cleanup
    socket.on("disconnect", () => {
        console.log(`❌ A user disconnected: ${socket.id}`)
        removeUser(socket.id)
        io.emit("getUser", users)
    })
})

// 2. MUST call server.listen instead of app.listen so socket.io works!
const PORT = process.env.PORT || 4500
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Socket Server running on PORT ${PORT}`)
    })
}