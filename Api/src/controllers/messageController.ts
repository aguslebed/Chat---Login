import { Request, Response } from "express";
import { messageModel } from "../models/messageModel";

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
