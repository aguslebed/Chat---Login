import express from "express";
import { makeAuthController } from "../controllers/makeAuthController";
import { authService } from "../services/authService";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

const authController = makeAuthController({ authService: new authService() });

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
