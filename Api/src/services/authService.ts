import { IAuthService } from "../interfaces/IAuthService";
import UserRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "../models/userModel";
import jwt from "jsonwebtoken";

export class authService extends IAuthService {
    private userRepository: UserRepository;
    constructor() {
        super();
        this.userRepository = new UserRepository();
    }

    async register(email: string, password: string, userName: string): Promise<IUserModel> {
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
}