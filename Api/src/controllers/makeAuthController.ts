import { Request, Response } from "express";
import { authService } from "../services/authService";

export const makeAuthController = ({ authService }: { authService: authService }) => {

    async function register(req: Request, res: Response) {
        res.send("register");
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