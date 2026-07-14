import socketIO from "socket.io-client";

// Vite requires the VITE_ prefix for environment variables
const ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:4500";

// Create and export a single, reusable socket instance
export const socket = socketIO(ENDPOINT, {
    transports: ["websocket"],
    autoConnect: true
});