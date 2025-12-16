import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { RegistrationValidator, EmailValidator } from "../validators/userValidator";
import { LoginValidator } from "../validators/loginValidator";
import { userFormatter } from "../formatter/userFormatter";

export const makeAuthController = ({ authService }: { authService: AuthService }) => {

    async function register(req: Request, res: Response) {
        try {
            const { email, password, userName, verificationCode } = req.body;

            RegistrationValidator(req, res, async () => {
                try {
                    const user = await authService.register(email, password, userName, verificationCode);
                    res.status(201).json(user);
                } catch (error: any) {
                    if (error.message === "Username already registered" || error.message === "Email already registered") {
                        res.status(409).json({ error: error.message });
                    } else if (error.message === "Invalid or expired verification code") {
                        res.status(400).json({ error: error.message });
                    } else {
                        res.status(500).json({ error: "Error al registrar el usuario" });
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Error al registrar el usuario" });
        }
    }

    async function login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            LoginValidator(req, res, async () => {
                try {
                    const user = await authService.login(email, password);
                    const formattedUser = userFormatter(user.user);
                    const token = user.token;

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax', // or 'strict' if on same domain
                        maxAge: 24 * 60 * 60 * 1000 // 1 day
                    });

                    res.status(200).json({ user: formattedUser }); // Token is no longer in body
                } catch (error: any) {
                    if (error.message === "User not found" || error.message === "Invalid password") {
                        res.status(401).json({ error: "Invalid credentials" });
                    } else {
                        res.status(500).json({ error: "Error al iniciar sesión" });
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    }

    async function logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    }

    async function me(req: Request, res: Response) {
        try {
            const loggedUser = req.user;
            if (!loggedUser) {
                throw new Error("User not found");
            }
            const user = await authService.getMe(loggedUser.id);
            const formattedUser = userFormatter(user);
            res.status(200).json({ user: formattedUser });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }

    async function getUsers(req: Request, res: Response) {
        try {
            const users = await authService.getUsers();
            const formattedUsers = users.map(userFormatter);
            res.status(200).json({ users: formattedUsers });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    }

    async function guestLogin(req: Request, res: Response) {
        try {
            const user = await authService.getGuest();
            const formattedUser = userFormatter(user.user);
            res.status(200).json({ user: formattedUser, token: user.token });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }

    async function validateEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await authService.validateEmail(email);
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ error: "Error al validar el email" });
        }
    }

    async function sendCode(req: Request, res: Response) {
        try {
            const { email } = req.body;
            EmailValidator(req, res, async () => {
                try {
                    await authService.sendVerificationCode(email);
                    res.status(200).json({ message: "Verification code sent" });
                } catch (error: any) {
                    if (error.message === "Email already registered") {
                        res.status(409).json({ error: error.message });
                    } else {
                        console.error(error);
                        res.status(500).json({ error: "Failed to send code" });
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Error sending code" });
        }
    }

    async function forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);
            res.status(200).json({ message: "Password reset email sent" });
        } catch (error: any) {
            if (error.message === "User not found") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to process forgot password request" });
            }
        }
    }

    async function resetPassword(req: Request, res: Response) {
        try {
            const { token, password } = req.body;
            await authService.resetPassword(token, password);
            res.status(200).json({ message: "Password reset successfully" });
        } catch (error: any) {
            if (error.message === "Invalid or expired password reset token") {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to reset password" });
            }
        }
    }

    return {
        register,
        login,
        logout,
        me,
        getUsers,
        guestLogin,

        validateEmail,
        sendCode,
        forgotPassword,
        resetPassword
    }
}