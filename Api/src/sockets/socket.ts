import { Server, Socket } from "socket.io";

interface User {
    id: string;
    name: string;
    status: string;
}

let connectedUsers: Record<string, User> = {};

export const socketController = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("identify", (userData) => {
            connectedUsers[socket.id] = {
                id: userData._id || socket.id,
                name: userData.userName || 'Guest',
                status: 'online'
            };

            io.emit("usersList", Object.values(connectedUsers));
        });

        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
        });

        socket.on("sendMessage", (data) => {
            const { chatId, text, user } = data;

            // Get sender info from our store for reliability
            const senderInfo = connectedUsers[socket.id];
            const senderId = senderInfo ? senderInfo.id : 'unknown';
            const senderName = senderInfo ? senderInfo.name : user;

            const baseMessage = {
                id: Date.now(),
                user: senderName,
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                senderId: senderId
            };

            if (chatId === 'global') {
                const globalMessage = { ...baseMessage, chatId: 'global' };
                socket.broadcast.emit("receiveMessage", globalMessage);
            } else {
                // Private Message: Find recipients with matching User ID
                const entries = Object.entries(connectedUsers);
                const recipients = entries.filter(([_, u]) => u.id === chatId);

                if (recipients.length > 0) {
                    // For the recipient, the 'chat' is with the Sender.
                    const msgForRecipient = { ...baseMessage, chatId: senderId };

                    recipients.forEach(([sockId, _]) => {
                        // Prevent echoing back to the sender's current socket (fixes duplication with optimistic UI)
                        if (sockId !== socket.id) {
                            io.to(sockId).emit("receiveMessage", msgForRecipient);
                        }
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
            delete connectedUsers[socket.id];
            io.emit("usersList", Object.values(connectedUsers));
        });
    });
};
