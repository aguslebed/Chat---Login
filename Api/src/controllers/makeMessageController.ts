import { Request, Response } from "express";
import { MessageService } from "../services/messageService";

export const makeMessageController = ({ messageService }: { messageService: MessageService }) => {

    async function getGlobalMessages(req: Request, res: Response) {
        try {
            const messages = await messageService.getGlobalMessages();
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching global messages:", error);
            res.status(500).json({ message: "Failed to fetch messages" });
        }
    }

    async function getPrivateMessages(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const currentUserId = req.user?.id;

            if (!currentUserId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const messages = await messageService.getPrivateMessages(currentUserId, userId);
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching private messages:", error);
            res.status(500).json({ message: "Failed to fetch messages" });
        }
    }

    async function getConversations(req: Request, res: Response) {
        try {
            const currentUserId = req.user?.id;
            if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

            const conversations = await messageService.getConversations(currentUserId);
            res.status(200).json(conversations);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ message: "Failed to fetch conversations" });
        }
    }

    return {
        getGlobalMessages,
        getPrivateMessages,
        getConversations
    }
}
