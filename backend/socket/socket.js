import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

// Mapping of user IDs to socket IDs
const userSocketMap = {}; // {userId: socketId}

// Helper function to get the socket ID of a receiver
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Get userId from the connection query parameters
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    // Notify all clients of the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for messages sent by clients
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            // Send the message to the receiver
            io.to(receiverSocketId).emit("receiveMessage", {
                senderId,
                message,
            });
        } else {
            console.log("Receiver not connected");
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId]; // Remove user from the map
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
