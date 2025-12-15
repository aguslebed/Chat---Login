import { IAuthService } from "../interfaces/IAuthService";
import UserRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { EmailService } from "./emailService";
import { verificationCodeModel } from "../models/verificationCodeModel";
import crypto from "crypto";

export class AuthService implements IAuthService {
    private userRepository: UserRepository;
    private emailService: EmailService;

    constructor() {

        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async register(email: string, password: string, userName: string, code: string): Promise<IUserModel> {
        try {

            const findByUserName = await this.userRepository.findByUserName(userName);
            if (findByUserName) {
                throw new Error("Username already registered");
            }

            //Buscar si el usuario existe
            const findUserByEmail = await this.userRepository.findByEmail(email);
            if (findUserByEmail) {
                throw new Error("Email already registered");
            }

            // Verify code
            const validCode = await verificationCodeModel.findOne({ email, code });
            if (!validCode) {
                throw new Error("Invalid or expired verification code");
            }

            // Delete code used
            await verificationCodeModel.deleteOne({ _id: validCode._id });


            const hashPassword = await bcrypt.hash(password, 10);
            const user: Omit<IUser, "_id"> = {
                email: email.toLowerCase(),
                password: hashPassword,
                userName,
                isActive: true
            }
            const newUser = await this.userRepository.create(user);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, password: string): Promise<{ user: IUserModel, token: string }> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
            return { user, token };
        } catch (error) {
            throw error;
        }
    }

    async getMe(id: string): Promise<IUserModel> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUsers(): Promise<IUserModel[]> {
        try {
            const users = await this.userRepository.findAll();
            return users;
        } catch (error) {
            throw error;
        }
    }
    async getGuest(): Promise<{ user: IUserModel, token: string }> {
        const guestId = uuid();
        const guestName = "Invitado_" + Math.floor(Math.random() * 9000 + 1000);

        const token = jwt.sign(
            { id: guestId, userName: guestName, isGuest: true },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return {
            user: {
                userName: guestName,
                email: "",
                password: "",
                isActive: true,
                _id: guestId,
                isGuest: true
            } as unknown as IUserModel,
            token
        };
    };

    async validateEmail(email: string): Promise<IUserModel> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async sendVerificationCode(email: string): Promise<void> {
        try {
            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                throw new Error("Email already registered");
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Remove previous codes for this email
            await verificationCodeModel.deleteMany({ email });

            await verificationCodeModel.create({
                email,
                code
            });

            await this.emailService.sendVerificationCode(email, code);
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
        await this.emailService.sendPasswordResetEmail(email, resetLink);
    }

    async resetPassword(token: string, password: string): Promise<void> {
        // Find user with this token and check if valid
        // Since we don't have a direct method in repository to find by token, we can use findOne on the model directly 
        // OR extend repository. Since I cannot see repository implementation fully, but usually it wraps mongoose one.
        // I will assume I can access the model directly via the repository if it exposes it, or I should have added a method to repository.
        // Let's check repository. 
        // Wait, I can't check repository right now without another tool call.
        // But `userModel` is exported. I can use `userModel.findOne`.
        // But better to stick to repository pattern if possible.
        // I will use `userModel` directly here for simplicity as I can't modify repository easily without checking it first.
        // Actually, `AuthService` imports `userRepository`. Let's see what `UserRepository` has. 
        // It likely has `findByEmail`, `findById`, `create`.
        // I will import `userModel` which is already imported.

        const user = await import("../models/userModel").then(m => m.userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }));

        if (!user) {
            throw new Error("Invalid or expired password reset token");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    }
}