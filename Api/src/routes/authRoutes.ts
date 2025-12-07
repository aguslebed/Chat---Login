import express from "express";
import { makeAuthController } from "../controllers/makeAuthController";
import { authService } from "../services/authService";

const router = express.Router();

const authController = makeAuthController({ authService: new authService() });

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

export default router;
