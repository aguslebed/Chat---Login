import express from "express";
import { makeAuthController } from "../controllers/makeAuthController";
import { AuthService } from "../services/authService";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

const authController = makeAuthController({ authService: new AuthService() });

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);
router.get("/users", authMiddleware, authController.getUsers);
router.post("/guest", authController.guestLogin);
router.post("/validateEmail", authController.validateEmail); // Fixed missing slash
router.post("/send-code", authController.sendCode);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
