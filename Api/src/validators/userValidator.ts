import { NextFunction, Request, Response } from "express";

export const RegistrationValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    if (userName.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }

    next();
}