import { Request, Response } from "express";
import { authService } from "../services/authService";
import { RegistrationValidator } from "../validators/userValidator";
import { LoginValidator } from "../validators/loginValidator";
import { userFormatter } from "../formatter/userFormatter";

export const makeAuthController = ({ authService }: { authService: authService }) => {

    async function register(req: Request, res: Response) {
        try {
            const { email, password, userName } = req.body;
            console.log(email, password, userName)
            RegistrationValidator(req, res, async () => {
                try {
                    const user = await authService.register(email, password, userName);
                    res.status(201).json(user);
                } catch (error: any) {
                    if (error.message === "Username already registered" || error.message === "Email already registered") {
                        res.status(409).json({ error: error.message });
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
            console.log(req.body)
            LoginValidator(req, res, async () => {
                try {
                    const user = await authService.login(email, password);
                    const formattedUser = userFormatter(user.user);
                    const token = user.token;
                    res.status(200).json({ user: formattedUser, token: token });
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
        res.send("logout");
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


    return {
        register,
        login,
        logout,
        me
    }
}