import { Server, Socket } from "socket.io";
import { messageModel } from "../models/messageModel";

interface User {
    id: string;
    name: string;
    status: string;
    isGuest?: boolean;
}

let connectedUsers: Record<string, User> = {};

export const socketController = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("identify", (userData) => {
            connectedUsers[socket.id] = {
                id: userData._id || userData.id || socket.id,
                name: userData.userName || 'Guest',
                status: 'online',
                isGuest: userData.isGuest || false
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

            // Persistence Logic
            // Check if sender is Guest
            const isSenderGuest = senderInfo?.isGuest;

            // Check if recipient is Guest
            let isRecipientGuest = false;
            if (chatId !== 'global') {
                // Find recipient in connected users to check status
                // If not online, we assume they are registered (since guests are transient and usually online)
                // But typically we should look up DB. However, for now, we rely on connectedUsers check.
                // If ID is a valid ObjectId, they are likely registered.
                // Safest check: If sender is guest, NO SAVE.
                const recipientUser = Object.values(connectedUsers).find(u => u.id === chatId);
                if (recipientUser && recipientUser.isGuest) {
                    isRecipientGuest = true;
                }
            }

            // Save ONLY if NO guest is involved
            // Note: User requirement "Los chats en los que participa un invitado no quiero guardarlos."
            // This implies:
            // 1. Guest -> Global: Don't Save.
            // 2. Guest -> Registered: Don't Save. (Though block prevents this anyway)
            // 3. Registered -> Guest: Don't Save.
            // 4. Registered -> Global: Save? (If Guest is reading, does it count? Probably Save global messages from Registered users)
            // Wait, "chats in which a guest participates". Global chat includes guests.
            // But usually Global chat history is desirable.
            // Interpretation: "Private chats with guests not saved". "Global chat saved?".
            // Re-reading: "Se deberian guardar los chats del chat general y la de los chats individual... Los chats en los que participa un invitado no quiero guardarlos."
            // This creates a conflict for Global Chat if a Guest is present? No, Global is a "room".
            // Likely means: Messages SENT BY Guest or SENT TO Guest should not be saved.
            // Messages sent by Registered to Global SHOULD be saved.

            const shouldSave = !isSenderGuest && !isRecipientGuest;

            if (shouldSave) {
                try {
                    messageModel.create({
                        sender: senderId,
                        senderName: senderName,
                        recipient: chatId,
                        content: text
                    });
                } catch (e) {
                    console.error("Error saving message", e);
                }
            }

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
