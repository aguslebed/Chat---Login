import express from "express";
import { makeMessageController } from "../controllers/makeMessageController";
import { MessageService } from "../services/messageService";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

const messageController = makeMessageController({ messageService: new MessageService() });

router.get("/global", authMiddleware, messageController.getGlobalMessages);
router.get("/conversations", authMiddleware, messageController.getConversations);
router.get("/private/:userId", authMiddleware, messageController.getPrivateMessages);

export default router;
