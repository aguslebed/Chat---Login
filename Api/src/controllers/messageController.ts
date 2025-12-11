import { Request, Response } from "express";
import { messageModel } from "../models/messageModel";
import { userModel } from "../models/userModel";

export const getGlobalMessages = async (req: Request, res: Response) => {
    try {
        const messages = await messageModel.find({ recipient: 'global' })
            .sort({ createdAt: 1 }) // Oldest first
            .limit(100); // Limit locally, maybe reverse if we fetch latest
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching global messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const getPrivateMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user?.id; // From authMiddleware

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const messages = await messageModel.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching private messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const getConversations = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

        // Find all messages where I am sender or recipient
        const messages = await messageModel.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }]
        });

        // Extract unique partner IDs
        const partnerIds = new Set<string>();
        messages.forEach(msg => {
            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender.toString();
            const recipientId = typeof msg.recipient === 'string' ? msg.recipient : msg.recipient.toString();

            if (senderId !== currentUserId && senderId !== 'global') partnerIds.add(senderId);
            if (recipientId !== currentUserId && recipientId !== 'global') partnerIds.add(recipientId);
        });

        // Fetch User details
        // Note: Some partners might be guests who don't exist in DB (if we allowed saving guest chats before? 
        // No, we disable guest persistence. So all persisted partners MUST be registered users).
        const partners = await userModel.find({ _id: { $in: Array.from(partnerIds) } });

        const results = partners.map(u => ({
            id: u._id,
            name: u.userName,
            status: 'offline' // We don't track real-time status here easily, frontend can merge with online list
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};
