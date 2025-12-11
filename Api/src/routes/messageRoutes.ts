import express from "express";
import { getGlobalMessages, getPrivateMessages, getConversations } from "../controllers/messageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Allow public access to global? Or only authenticated? 
// Requirement says "cargarse una vez que se inicia la sesion". Guest is a session too.
// authMiddleware should handle both guest and registered if token is present.
router.get("/global", authMiddleware, getGlobalMessages);
router.get("/conversations", authMiddleware, getConversations);
router.get("/private/:userId", authMiddleware, getPrivateMessages);

export default router;
