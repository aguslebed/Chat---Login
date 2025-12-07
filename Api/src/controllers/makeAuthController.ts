import { Request, Response } from "express";
import { authService } from "../services/authService";

export const makeAuthController = ({ authService }: { authService: authService }) => {

    async function register(req: Request, res: Response) {
        try {
            const { email, password, userName } = req.body;
            const user = await authService.register(email, password, userName);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: "Error al registrar el usuario" });
        }
    }

    async function login(req: Request, res: Response) {
        res.send("login");
    }

    async function logout(req: Request, res: Response) {
        res.send("logout");
    }

    async function me(req: Request, res: Response) {
        res.send("me");
    }


    return {
        register,
        login,
        logout,
        me
    }
}